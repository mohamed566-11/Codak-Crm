<?php

namespace Espo\Custom\Services;

use Espo\Core\Utils\Config;
use Espo\Core\Utils\Config\ConfigWriter;
use Espo\Core\Utils\Config\SystemConfig;
use Espo\Core\Utils\Log;
use Espo\Core\Exceptions\BadRequest;
use Espo\Core\Exceptions\Forbidden;
use Espo\Core\Exceptions\Unauthorized;
use Espo\Core\Exceptions\Error;

class GitDeployService
{
    private string $basePath;
    private const ALLOWED_BRANCHES = ['main', 'refs/heads/main'];
    private const ALLOWED_STEPS = ['gitPull', 'clearCache', 'rebuild', 'updateTimestamp'];

    public function __construct(
        private Config $config,
        private ConfigWriter $configWriter,
        private SystemConfig $systemConfig,
        private Log $log
    ) {
        $this->basePath = dirname(__DIR__, 4);
    }

    /**
     * Handle incoming GitHub Push Webhook with mandatory HMAC verification and event validation
     */
    public function handleWebhook(string $rawBody, array $headers): array
    {
        $this->validateWebhookEvent($headers['event'] ?? null);
        $this->validateWebhookSignature($rawBody, $headers['signature'] ?? null);

        $payload = json_decode($rawBody, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($payload)) {
            throw new BadRequest('Invalid JSON payload');
        }

        $this->validateBranch($payload['ref'] ?? null);

        $commitInfo = $this->extractCommitInformation($payload);

        // Store git update state safely in config
        $this->configWriter->set('gitUpdateAvailable', true);
        $this->configWriter->set('gitLatestCommitHash', $commitInfo['commitHash']);
        $this->configWriter->set('gitLatestCommitMsg', $commitInfo['commitMessage']);
        $this->configWriter->set('gitLatestAuthor', $commitInfo['authorName']);
        $this->configWriter->set('gitLatestBranch', $commitInfo['branch']);
        $this->configWriter->set('gitLatestTime', $commitInfo['commitTime']);

        $this->log->info("GitDeploy Webhook: Accepted push event for commit {$commitInfo['commitHash']} on branch {$commitInfo['branch']}");

        return [
            'status' => 'success',
            'commitHash' => $commitInfo['commitHash'],
            'commitMessage' => $commitInfo['commitMessage'],
            'branch' => $commitInfo['branch']
        ];
    }

    private function validateWebhookEvent(?string $event): void
    {
        if (empty($event)) {
            throw new BadRequest('Missing X-GitHub-Event header');
        }

        if ($event !== 'push') {
            $this->log->warning("GitDeploy Webhook: Rejected event '{$event}'");
            throw new BadRequest("Unsupported GitHub event '{$event}'. Only 'push' events are accepted.");
        }
    }

    private function validateWebhookSignature(string $rawBody, ?string $signature): void
    {
        $webhookSecret = $this->config->get('gitHubWebhookSecret');
        if (empty($webhookSecret)) {
            $this->log->error("GitDeploy Webhook: Server configuration error - gitHubWebhookSecret is missing");
            throw new Error('Webhook secret is not configured on the server');
        }

        if (empty($signature)) {
            $this->log->warning("GitDeploy Webhook: Missing signature header");
            throw new Unauthorized('Missing X-Hub-Signature-256 header');
        }

        if (!str_starts_with($signature, 'sha256=')) {
            throw new BadRequest('Invalid signature format');
        }

        $expectedSignature = 'sha256=' . hash_hmac('sha256', $rawBody, $webhookSecret);

        if (!hash_equals($expectedSignature, $signature)) {
            $this->log->warning("GitDeploy Webhook: Invalid HMAC signature");
            throw new Unauthorized('Invalid Webhook HMAC Signature');
        }
    }

    private function validateBranch(?string $ref): void
    {
        if (empty($ref)) {
            throw new BadRequest('Missing branch ref in payload');
        }

        if (!in_array($ref, self::ALLOWED_BRANCHES, true) && str_replace('refs/heads/', '', $ref) !== 'main') {
            $this->log->warning("GitDeploy Webhook: Rejected push to non-main branch '{$ref}'");
            throw new BadRequest("Only pushes to the main branch are allowed for deployment updates.");
        }
    }

    private function extractCommitInformation(array $payload): array
    {
        $headCommit = $payload['head_commit'] ?? [];
        $commitHash = substr($headCommit['id'] ?? 'unknown', 0, 7);
        $commitMessage = $headCommit['message'] ?? 'New updates pushed to GitHub';
        $authorName = $headCommit['author']['name'] ?? ($payload['pusher']['name'] ?? 'GitHub User');
        $branch = str_replace('refs/heads/', '', $payload['ref'] ?? 'main');
        $commitTime = date('Y-m-d H:i:s');

        return [
            'commitHash' => $commitHash,
            'commitMessage' => trim(explode("\n", $commitMessage)[0]),
            'authorName' => $authorName,
            'branch' => $branch,
            'commitTime' => $commitTime
        ];
    }

    /**
     * Check git repository for remote updates via git fetch
     */
    public function checkForUpdates(): array
    {
        $cmd = "cd " . escapeshellarg($this->basePath) . " && git fetch origin 2>&1";
        exec($cmd, $outputLines, $returnCode);

        $logCmd = "cd " . escapeshellarg($this->basePath) . " && git log HEAD..origin/main --oneline -n 1 2>&1";
        exec($logCmd, $logLines, $logCode);

        if (!empty($logLines) && $logCode === 0) {
            $latestLine = trim($logLines[0]);
            if (!empty($latestLine)) {
                $parts = explode(' ', $latestLine, 2);
                $commitHash = $parts[0] ?? '';
                $commitMsg = $parts[1] ?? 'Updates available on GitHub';

                $this->configWriter->set('gitUpdateAvailable', true);
                $this->configWriter->set('gitLatestCommitHash', $commitHash);
                $this->configWriter->set('gitLatestCommitMsg', $commitMsg);
                $this->configWriter->set('gitLatestTime', date('Y-m-d H:i:s'));

                return [
                    'hasUpdates' => true,
                    'commitHash' => $commitHash,
                    'commitMessage' => $commitMsg
                ];
            }
        }

        return ['hasUpdates' => false];
    }

    /**
     * Execute specific upgrade step safely
     */
    public function executeStep(string $step): array
    {
        if (!in_array($step, self::ALLOWED_STEPS, true)) {
            throw new BadRequest("Unauthorized deployment step: {$step}");
        }

        $baseDir = escapeshellarg($this->basePath);
        $output = [];
        $exitCode = 0;

        switch ($step) {
            case 'gitPull':
                $cmd = "cd {$baseDir} && git pull --ff-only origin main 2>&1";
                exec($cmd, $output, $exitCode);
                $message = ($exitCode === 0) 
                    ? "تم جلب التعديلات بنجاح من GitHub." 
                    : "فشلت عملية git pull: " . implode(" ", $output);
                break;

            case 'clearCache':
                $cmd = "cd {$baseDir} && php command.php clear-cache 2>&1";
                exec($cmd, $output, $exitCode);
                $message = ($exitCode === 0) ? "تم تفريغ الكاش (Cache) بنجاح." : "فشل تفريغ الكاش.";
                break;

            case 'rebuild':
                $cmd = "cd {$baseDir} && php command.php rebuild 2>&1";
                exec($cmd, $output, $exitCode);
                $message = ($exitCode === 0) ? "تمت إعادة بناء الملفات والأصول (Rebuild) بنجاح." : "فشلت إعادة البناء.";
                break;

            case 'updateTimestamp':
                $cmd = "cd {$baseDir} && php command.php update-app-timestamp 2>&1";
                exec($cmd, $output, $exitCode);
                
                if ($exitCode === 0) {
                    // Reset update notification flag only on complete success
                    $this->configWriter->set('gitUpdateAvailable', false);
                    $message = "تم تحديث طابع النسخة بنجاح واكتملت عملية الترقية!";
                } else {
                    $message = "فشل تحديث طابع النسخة.";
                }
                break;
        }

        $this->log->info("GitDeploy Step '{$step}' executed with result code {$exitCode}");

        return [
            'success' => ($exitCode === 0),
            'step' => $step,
            'message' => $message,
            'rawOutput' => implode("\n", $output)
        ];
    }
}
