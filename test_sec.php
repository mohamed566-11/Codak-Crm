<?php

require_once 'bootstrap.php';

try {
    $app = new \Espo\Core\Application();
    $container = $app->getContainer();
    $injectableFactory = $container->get('injectableFactory');
    $gitDeployService = $injectableFactory->create('Espo\Custom\Services\GitDeployService');
    $configWriter = $injectableFactory->create('Espo\Core\Utils\Config\ConfigWriter');

    echo "===================================================\n";
    echo "  CODAK CRM GIT DEPLOY SECURITY & RELIABILITY TEST \n";
    echo "===================================================\n\n";

    $testSecret = 'test_webhook_secret_key_12345';
    $configWriter->set('gitHubWebhookSecret', $testSecret);
    $configWriter->save();
    $container->get('config')->set('gitHubWebhookSecret', $testSecret);

    $validPayload = json_encode([
        'ref' => 'refs/heads/main',
        'head_commit' => [
            'id' => 'a1b2c3d4e5f67890',
            'message' => 'Security hardening test commit',
            'author' => ['name' => 'Security Audit Bot']
        ],
        'pusher' => ['name' => 'Security Audit Bot']
    ]);

    $validSignature = 'sha256=' . hash_hmac('sha256', $validPayload, $testSecret);

    $passed = 0;
    $failed = 0;

    // Test 1: Valid Webhook
    try {
        echo "TEST 1: Valid Webhook Request ... ";
        $res = $gitDeployService->handleWebhook($validPayload, [
            'event' => 'push',
            'signature' => $validSignature
        ]);
        if (($res['status'] ?? '') === 'success') {
            echo "[ PASS ]\n";
            $passed++;
        } else {
            echo "[ FAIL ]\n";
            $failed++;
        }
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    // Test 2: Missing Signature
    try {
        echo "TEST 2: Reject Missing Signature Header ... ";
        $gitDeployService->handleWebhook($validPayload, ['event' => 'push']);
        echo "[ FAIL ]\n";
        $failed++;
    } catch (\Espo\Core\Exceptions\Unauthorized $e) {
        echo "[ PASS ] ({$e->getMessage()})\n";
        $passed++;
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    // Test 3: Forged Signature
    try {
        echo "TEST 3: Reject Forged HMAC Signature ... ";
        $gitDeployService->handleWebhook($validPayload, [
            'event' => 'push',
            'signature' => 'sha256=invalid_forged_hash_12345'
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

    // Test 4: Unsupported Event (e.g. pull_request)
    try {
        echo "TEST 4: Reject Non-Push Event (pull_request) ... ";
        $gitDeployService->handleWebhook($validPayload, [
            'event' => 'pull_request',
            'signature' => $validSignature
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

    // Test 5: Reject Non-Main Branch
    try {
        echo "TEST 5: Reject Push to Non-Main Branch (refs/heads/dev) ... ";
        $devPayload = json_encode([
            'ref' => 'refs/heads/dev',
            'head_commit' => ['id' => '1234567', 'message' => 'Dev push']
        ]);
        $sig = 'sha256=' . hash_hmac('sha256', $devPayload, $testSecret);
        $gitDeployService->handleWebhook($devPayload, [
            'event' => 'push',
            'signature' => $sig
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

    // Test 6: Command Injection Prevention in Step Input
    try {
        echo "TEST 6: Reject Malicious Step ('rm -rf /; echo hack') ... ";
        $gitDeployService->executeStep("rm -rf /; echo hack");
        echo "[ FAIL ]\n";
        $failed++;
    } catch (\Espo\Core\Exceptions\BadRequest $e) {
        echo "[ PASS ] ({$e->getMessage()})\n";
        $passed++;
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    // Test 7: Valid Whitelisted Step Execution ('clearCache')
    try {
        echo "TEST 7: Whitelisted Step Execution ('clearCache') ... ";
        $res = $gitDeployService->executeStep('clearCache');
        if (isset($res['success']) && $res['success'] === true) {
            echo "[ PASS ]\n";
            $passed++;
        } else {
            echo "[ FAIL ]\n";
            $failed++;
        }
    } catch (\Throwable $e) {
        echo "[ FAIL ] -> " . $e->getMessage() . "\n";
        $failed++;
    }

    echo "\n---------------------------------------------------\n";
    echo "RESULT: Passed {$passed} / " . ($passed + $failed) . " Security Tests.\n";
    echo "---------------------------------------------------\n";

} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString();
}
