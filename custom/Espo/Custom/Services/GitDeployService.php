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
     * Handle incoming GitHub Push & Ping Webhooks with mandatory HMAC verification and event validation
     */
    public function handleWebhook(string $rawBody, array $headers): array
    {
        $event = $headers['event'] ?? null;
        $this->validateWebhookEvent($event);
        $this->validateWebhookSignature($rawBody, $headers['signature'] ?? null);

        // Handle ping event (ack without modification or deployment)
        if ($event === 'ping') {
            $this->log->info("GitDeploy Webhook: Accepted GitHub ping event");
            return [
                'status' => 'success',
                'message' => 'GitHub ping acknowledged',
                'event' => 'ping'
            ];
        }

        $payload = json_decode($rawBody, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($payload)) {
            throw new BadRequest('Invalid JSON payload');
        }

        $this->validateRepository($payload);
        $this->validateBranch($payload['ref'] ?? null);

        $commitInfo = $this->extractCommitInformation($payload);

        $currentVer = $this->getCurrentVersion();
        $nextVer = $this->extractVersionFromCommit($commitInfo['commitMessage']) 
            ?? $this->calculateNextVersion($currentVer);

        // Store git update state safely in config
        $this->configWriter->set('gitUpdateAvailable', true);
        $this->configWriter->set('codakVersion', $currentVer);
        $this->configWriter->set('latestVersion', $nextVer);
        $this->configWriter->set('gitLatestCommitHash', $commitInfo['commitHash']);
        $this->configWriter->set('gitLatestCommitMsg', $commitInfo['commitMessage']);
        $this->configWriter->set('gitLatestAuthor', $commitInfo['authorName']);
        $this->configWriter->set('gitLatestBranch', $commitInfo['branch']);
        $this->configWriter->set('gitLatestTime', $commitInfo['commitTime']);
        $this->configWriter->save();

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

        if (!in_array($event, ['push', 'ping'], true)) {
            $this->log->warning("GitDeploy Webhook: Rejected event '{$event}'");
            throw new BadRequest("Unsupported GitHub event '{$event}'. Only 'push' and 'ping' events are accepted.");
        }
    }

    private function validateRepository(array $payload): void
    {
        $expectedRepo = $this->config->get('gitHubRepository');
        if (!empty($expectedRepo) && isset($payload['repository']['full_name'])) {
            $incomingRepo = $payload['repository']['full_name'];
            if (strcasecmp($expectedRepo, $incomingRepo) !== 0) {
                $this->log->warning("GitDeploy Webhook: Rejected event from repository '{$incomingRepo}', expected '{$expectedRepo}'");
                throw new BadRequest("Repository mismatch: Expected '{$expectedRepo}'");
            }
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

                $currentVer = $this->getCurrentVersion();
                $nextVer = $this->calculateNextVersion($currentVer);

                $this->configWriter->set('gitUpdateAvailable', true);
                $this->configWriter->set('codakVersion', $currentVer);
                $this->configWriter->set('latestVersion', $nextVer);
                $this->configWriter->set('gitLatestCommitHash', $commitHash);
                $this->configWriter->set('gitLatestCommitMsg', $commitMsg);
                $this->configWriter->set('gitLatestTime', date('Y-m-d H:i:s'));
                $this->configWriter->save();

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
                    $currentVer = $this->getCurrentVersion();
                    $targetVer = $this->config->get('latestVersion');
                    if (empty($targetVer) || $targetVer === $currentVer) {
                        $targetVer = $this->calculateNextVersion($currentVer);
                    }

                    // Update client.json in git repo
                    $clientJsonFile = $this->basePath . '/custom/Espo/Custom/Resources/metadata/app/client.json';
                    if (file_exists($clientJsonFile)) {
                        $clientData = json_decode(file_get_contents($clientJsonFile), true) ?: [];
                        $clientData['version'] = $targetVer;
                        file_put_contents($clientJsonFile, json_encode($clientData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
                    }

                    // Reset update notification flag and sync version on complete success
                    $this->configWriter->set('gitUpdateAvailable', false);
                    $this->configWriter->set('codakVersion', $targetVer);
                    $this->configWriter->set('latestVersion', $targetVer);
                    $this->configWriter->save();
                    $message = "تم تحديث طابع النسخة بنجاح وترقية النظام إلى الإصدار v{$targetVer}!";
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

    public function getCurrentVersion(): string
    {
        $clientJsonFile = $this->basePath . '/custom/Espo/Custom/Resources/metadata/app/client.json';
        if (file_exists($clientJsonFile)) {
            $data = json_decode(file_get_contents($clientJsonFile), true);
            if (!empty($data['version'])) {
                return (string) $data['version'];
            }
        }

        return (string) ($this->config->get('version') ?? '10.0.5');
    }

    public function calculateNextVersion(?string $current = null): string
    {
        $version = $current ?? $this->getCurrentVersion();
        $parts = explode('.', $version);
        if (count($parts) >= 3 && is_numeric(end($parts))) {
            $parts[count($parts) - 1] = (int)end($parts) + 1;
            return implode('.', $parts);
        }
        return $version . '.1';
    }

    private function extractVersionFromCommit(string $message): ?string
    {
        if (preg_match('/v?([0-9]+\.[0-9]+\.[0-9]+)/i', $message, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
