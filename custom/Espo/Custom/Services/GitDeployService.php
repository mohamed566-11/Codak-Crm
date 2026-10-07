<?php

namespace Espo\Custom\Services;

use Espo\Core\Utils\Config;
use Espo\Core\Utils\ConfigWriter;
use Espo\Core\Utils\Config\SystemConfig;
use Exception;

class GitDeployService
{
    private string $basePath;

    public function __construct(
        private Config $config,
        private ConfigWriter $configWriter,
        private SystemConfig $systemConfig
    ) {
        $this->basePath = dirname(__DIR__, 4);
    }

    /**
     * Handle incoming GitHub Push Webhook
     */
    public function handleWebhook(array $payload, ?string $signature = null): array
    {
        $webhookSecret = $this->config->get('gitHubWebhookSecret');
        if (!empty($webhookSecret) && !empty($signature)) {
            $expectedSignature = 'sha256=' . hash_hmac('sha256', json_encode($payload), $webhookSecret);
            if (!hash_equals($expectedSignature, $signature)) {
                throw new Exception('Invalid Webhook HMAC Signature');
            }
        }

        $headCommit = $payload['head_commit'] ?? [];
        $commitHash = substr($headCommit['id'] ?? 'unknown', 0, 7);
        $commitMessage = $headCommit['message'] ?? 'New updates pushed to GitHub';
        $authorName = $headCommit['author']['name'] ?? ($payload['pusher']['name'] ?? 'GitHub User');
        $branch = str_replace('refs/heads/', '', $payload['ref'] ?? 'main');
        $commitTime = date('Y-m-d H:i:s');

        // Store git update state in config
        $this->configWriter->set('gitUpdateAvailable', true);
        $this->configWriter->set('gitLatestCommitHash', $commitHash);
        $this->configWriter->set('gitLatestCommitMsg', trim(explode("\n", $commitMessage)[0]));
        $this->configWriter->set('gitLatestAuthor', $authorName);
        $this->configWriter->set('gitLatestBranch', $branch);
        $this->configWriter->set('gitLatestTime', $commitTime);

        $currentVersion = $this->systemConfig->getVersion();
        $this->configWriter->set('latestVersion', '10.0.9');

        return [
            'status' => 'success',
            'commitHash' => $commitHash,
            'commitMessage' => $commitMessage,
            'branch' => $branch
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
                $this->configWriter->set('latestVersion', '10.0.9');

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
        $baseDir = escapeshellarg($this->basePath);
        $output = [];
        $exitCode = 0;

        switch ($step) {
            case 'gitPull':
                $cmd = "cd {$baseDir} && git pull origin main 2>&1";
                exec($cmd, $output, $exitCode);
                $message = ($exitCode === 0) 
                    ? "تم جلب التعديلات بنجاح من GitHub." 
                    : "حدث تنبيه أثناء git pull: " . implode(" ", $output);
                break;

            case 'clearCache':
                $cmd = "cd {$baseDir} && php command.php clear-cache 2>&1";
                exec($cmd, $output, $exitCode);
                $message = "تم تفريغ الكاش (Cache) بنجاح.";
                break;

            case 'rebuild':
                $cmd = "cd {$baseDir} && php command.php rebuild 2>&1";
                exec($cmd, $output, $exitCode);
                $message = "تمت إعادة بناء الملفات والأصول (Rebuild) بنجاح.";
                break;

            case 'updateTimestamp':
                $cmd = "cd {$baseDir} && php command.php update-app-timestamp 2>&1";
                exec($cmd, $output, $exitCode);
                
                // Reset update notification flag
                $this->configWriter->set('gitUpdateAvailable', false);
                $message = "تم تحديث طابع النسخة بنجاح واكتملت عملية الترقية!";
                break;

            default:
                throw new Exception("خطوة غير معروفة: {$step}");
        }

        return [
            'success' => ($exitCode === 0),
            'step' => $step,
            'message' => $message,
            'rawOutput' => implode("\n", $output)
        ];
    }
}
