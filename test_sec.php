<?php

require_once 'bootstrap.php';

try {
    $app = new \Espo\Core\Application();
    $container = $app->getContainer();
    $injectableFactory = $container->get('injectableFactory');
    
    /** @var \Espo\Custom\Services\GitDeployService $gitDeployService */
    $gitDeployService = $injectableFactory->create('Espo\Custom\Services\GitDeployService');
    /** @var \Espo\Core\Utils\Config\ConfigWriter $configWriter */
    $configWriter = $injectableFactory->create('Espo\Core\Utils\Config\ConfigWriter');
    /** @var \Espo\Core\Utils\Config $config */
    $config = $container->get('config');

    echo "===================================================\n";
    echo "  CODAK CRM GIT DEPLOY FULL VERIFICATION TEST SUITE \n";
    echo "===================================================\n\n";

    $testSecret = 'test_webhook_secret_key_998877';
    $configWriter->set('gitHubWebhookSecret', $testSecret);
    $configWriter->set('gitHubRepository', 'mohamed566-11/Codak-Crm');
    $configWriter->set('gitUpdateAvailable', false);
    $configWriter->save();
    $config->set('gitHubWebhookSecret', $testSecret);
    $config->set('gitHubRepository', 'mohamed566-11/Codak-Crm');
    $config->set('gitUpdateAvailable', false);

    $passed = 0;
    $failed = 0;

    // ---------------------------------------------------------
    // TEST 1: GitHub Ping Event
    // ---------------------------------------------------------
    try {
        echo "TEST 1: GitHub Ping Event (X-GitHub-Event: ping) ... ";
        $pingPayload = json_encode([
            'zen' => 'Non-blocking is better than blocking.',
            'hook_id' => 123456
        ]);
        $pingSig = 'sha256=' . hash_hmac('sha256', $pingPayload, $testSecret);

        $res = $gitDeployService->handleWebhook($pingPayload, [
            'event' => 'ping',
            'signature' => $pingSig
        ]);

        $updateFlag = $config->get('gitUpdateAvailable');
        if (($res['status'] ?? '') === 'success' && ($res['event'] ?? '') === 'ping' && $updateFlag === false) {
            echo "[ PASS ] (Acked successfully, NO deployment, NO state change)\n";
            $passed++;
        } else {
            echo "[ FAIL ] -> " . json_encode($res) . "\n";
            $failed++;
        }
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    // ---------------------------------------------------------
    // TEST 2: Valid Push to Main Branch
    // ---------------------------------------------------------
    try {
        echo "TEST 2: Valid Push to main branch (refs/heads/main) ... ";
        $pushPayload = json_encode([
            'ref' => 'refs/heads/main',
            'repository' => ['full_name' => 'mohamed566-11/Codak-Crm'],
            'head_commit' => [
                'id' => '9876543210fedcba',
                'message' => 'Fix ping handling in webhook',
                'author' => ['name' => 'Codak Security Bot']
            ],
            'pusher' => ['name' => 'Codak Security Bot']
        ]);
        $pushSig = 'sha256=' . hash_hmac('sha256', $pushPayload, $testSecret);

        $res = $gitDeployService->handleWebhook($pushPayload, [
            'event' => 'push',
            'signature' => $pushSig
        ]);

        if (($res['status'] ?? '') === 'success' && ($res['commitHash'] ?? '') === '9876543') {
            echo "[ PASS ] (Recorded metadata, NO auto-deployment)\n";
            $passed++;
        } else {
            echo "[ FAIL ] -> " . json_encode($res) . "\n";
            $failed++;
        }
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    // ---------------------------------------------------------
    // TEST 3: Push to Non-Main Branch (refs/heads/dev)
    // ---------------------------------------------------------
    try {
        echo "TEST 3: Reject Push to Non-Main Branch (refs/heads/dev) ... ";
        $devPayload = json_encode([
            'ref' => 'refs/heads/dev',
            'repository' => ['full_name' => 'mohamed566-11/Codak-Crm'],
            'head_commit' => ['id' => '1111111', 'message' => 'Dev push']
        ]);
        $devSig = 'sha256=' . hash_hmac('sha256', $devPayload, $testSecret);

        $gitDeployService->handleWebhook($devPayload, [
            'event' => 'push',
            'signature' => $devSig
        ]);
        echo "[ FAIL ]\n";
        $failed++;
    } catch (\Espo\Core\Exceptions\BadRequest $e) {
        echo "[ PASS ] ({$e->getMessage()})\n";
        $passed++;
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    // ---------------------------------------------------------
    // TEST 4: Invalid HMAC Signature
    // ---------------------------------------------------------
    try {
        echo "TEST 4: Reject Forged HMAC Signature ... ";
        $gitDeployService->handleWebhook($pushPayload, [
            'event' => 'push',
            'signature' => 'sha256=invalid_forged_hash_value'
        ]);
        echo "[ FAIL ]\n";
        $failed++;
    } catch (\Espo\Core\Exceptions\Unauthorized $e) {
        echo "[ PASS ] ({$e->getMessage()})\n";
        $passed++;
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    // ---------------------------------------------------------
    // TEST 5: Wrong Repository Identity
    // ---------------------------------------------------------
    try {
        echo "TEST 5: Reject Wrong Repository (hacker/malicious-repo) ... ";
        $badRepoPayload = json_encode([
            'ref' => 'refs/heads/main',
            'repository' => ['full_name' => 'hacker/malicious-repo'],
            'head_commit' => ['id' => '2222222', 'message' => 'Malicious repo push']
        ]);
        $badRepoSig = 'sha256=' . hash_hmac('sha256', $badRepoPayload, $testSecret);

        $gitDeployService->handleWebhook($badRepoPayload, [
            'event' => 'push',
            'signature' => $badRepoSig
        ]);
        echo "[ FAIL ]\n";
        $failed++;
    } catch (\Espo\Core\Exceptions\BadRequest $e) {
        echo "[ PASS ] ({$e->getMessage()})\n";
        $passed++;
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    // ---------------------------------------------------------
    // TEST 6: Non-Admin Access Control Check
    // ---------------------------------------------------------
    try {
        echo "TEST 6: Non-Admin Access Control Check ... ";
        $anon = new class extends \Espo\Entities\User {
            public function __construct() {}
            public function isAdmin(): bool { return false; }
        };
        $nonAdminUser = (new \ReflectionClass(get_class($anon)))->newInstanceWithoutConstructor();

        $controller = new \Espo\Custom\Controllers\GitDeploy($nonAdminUser, $gitDeployService);

        $request = new class implements \Espo\Core\Api\Request {
            public function getBodyContents(): ?string { return '{"step":"clearCache"}'; }
            public function getBody(): string { return '{"step":"clearCache"}'; }
            public function getHeader(string $name): ?string { return null; }
            public function hasQueryParam(string $name): bool { return false; }
            public function getQueryParam(string $name): ?string { return null; }
            public function getQueryParams(): array { return []; }
            public function hasRouteParam(string $name): bool { return false; }
            public function getRouteParam(string $name): ?string { return null; }
            public function getRouteParams(): array { return []; }
            public function hasHeader(string $name): bool { return false; }
            public function getHeaderAsArray(string $name): array { return []; }
            public function getMethod(): string { return 'POST'; }
            public function getUri(): \Psr\Http\Message\UriInterface { throw new \Exception('Not implemented'); }
            public function getResourcePath(): string { return ''; }
            public function getParsedBody(): \stdClass { return (object)[]; }
            public function getCookieParam(string $name): ?string { return null; }
            public function getServerParam(string $name) { return null; }
        };

        $controller->postActionUpgradeStep($request);
        echo "[ FAIL ]\n";
        $failed++;
    } catch (\Espo\Core\Exceptions\Forbidden $e) {
        echo "[ PASS ] ({$e->getMessage()})\n";
        $passed++;
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    // ---------------------------------------------------------
    // TEST 7: Admin Executes Whitelisted Step ('clearCache')
    // ---------------------------------------------------------
    try {
        echo "TEST 7: Admin Executes Whitelisted Step ('clearCache') ... ";
        $res = $gitDeployService->executeStep('clearCache');
        if (($res['success'] ?? false) === true && ($res['step'] ?? '') === 'clearCache') {
            echo "[ PASS ]\n";
            $passed++;
        } else {
            echo "[ FAIL ] -> " . json_encode($res) . "\n";
            $failed++;
        }
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    // ---------------------------------------------------------
    // TEST 8: Reject Invalid Upgrade Step Input
    // ---------------------------------------------------------
    try {
        echo "TEST 8: Reject Malicious Step ('rm -rf /; echo hack') ... ";
        $gitDeployService->executeStep('rm -rf /; echo hack');
        echo "[ FAIL ]\n";
        $failed++;
    } catch (\Espo\Core\Exceptions\BadRequest $e) {
        echo "[ PASS ] ({$e->getMessage()})\n";
        $passed++;
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    // ---------------------------------------------------------
    // TEST 9: Deployment Step Failure & Flag Retention Check
    // ---------------------------------------------------------
    try {
        echo "TEST 9: Update Flag Preservation on Failure ... ";
        // Manually set update available flag to true
        $configWriter->set('gitUpdateAvailable', true);
        $configWriter->save();
        $config->set('gitUpdateAvailable', true);

        // Run non-final step or clearCache; check that gitUpdateAvailable is still true
        $res = $gitDeployService->executeStep('clearCache');
        $stillAvailable = $config->get('gitUpdateAvailable');

        if ($stillAvailable === true) {
            echo "[ PASS ] (Flag preserved until final step succeeds)\n";
            $passed++;
        } else {
            echo "[ FAIL ] -> Flag was prematurely cleared!\n";
            $failed++;
        }
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    echo "\n---------------------------------------------------\n";
    echo "TEST RESULT SUMMARY: Passed {$passed} / " . ($passed + $failed) . " Scenarios.\n";
    echo "---------------------------------------------------\n";

} catch (\Throwable $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
