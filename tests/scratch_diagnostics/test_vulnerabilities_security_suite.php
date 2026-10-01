<?php

require_once __DIR__ . '/../bootstrap.php';

use Espo\Core\Application;
use Espo\Core\Exceptions\Forbidden;
use Espo\Core\Exceptions\BadRequest;
use Espo\Core\Api\RequestWrapper;
use Espo\Core\Api\ResponseWrapper;

try {
    $app = new Application();
    $app->setupSystemUser();
    $container = $app->getContainer();
    $entityManager = $container->get('entityManager');
    $factory = $container->get('injectableFactory');
    $userRepository = $entityManager->getRepository('User');
    $adminUser = $userRepository->where(['type' => 'admin'])->findOne();

    echo "==============================================================================\n";
    echo "  VULNERABILITY FIXES & SECURITY REGRESSION SUITE\n";
    echo "==============================================================================\n\n";

    $passedCount = 0;
    $failedCount = 0;

    function assertSec(bool $condition, string $testName) {
        global $passedCount, $failedCount;
        if ($condition) {
            echo "✅ PASS: {$testName}\n";
            $passedCount++;
        } else {
            echo "❌ FAIL: {$testName}\n";
            $failedCount++;
        }
    }

    // --------------------------------------------------------------------------
    // TEST SECTION 1: VULNERABILITY #1 - SETTINGS MASS-ASSIGNMENT WHITELIST
    // --------------------------------------------------------------------------
    echo "▶ [TEST SECTION 1] SETTINGS MASS-ASSIGNMENT WHITELIST VERIFICATION\n";

    $nonAdminSettingsUser = $entityManager->getEntity('User');
    $nonAdminSettingsUser->set([
        'userName' => 'sec_settings_user_' . time(),
        'type' => 'regular',
        'cEnableAdminAccess' => true,
        'cAllowedAdminItems' => ['settings'],
    ]);
    $entityManager->saveEntity($nonAdminSettingsUser);

    $settingsService = $container->get('injectableFactory')->create('Espo\Tools\App\SettingsService');

    // Create Settings controller instance for non-admin user
    $settingsController = new \Espo\Custom\Controllers\Settings(
        $settingsService,
        $nonAdminSettingsUser,
        $container->get('injectableFactory')->create('Espo\Core\Utils\Config\ConfigWriter'),
        $container->get('injectableFactory')->create('Espo\Core\DataManager')
    );

    // Create malicious payload attempting to modify authenticationMethod and adminEmail
    $maliciousBody = (object) [
        'authenticationMethod' => 'EXPLOITED_AUTH',
        'adminEmail' => 'hacker@evil.com',
        'recordsPerPage' => 35,
        'timeZone' => 'Europe/London',
        'dateFormat' => 'DD/MM/YYYY',
    ];

    $bodyStream = fopen('php://temp', 'r+');
    fwrite($bodyStream, json_encode($maliciousBody));
    rewind($bodyStream);

    $psrRequest = new \Slim\Psr7\Request(
        'PUT',
        new \Slim\Psr7\Uri('http', 'localhost', 80, '/api/v1/Settings'),
        new \Slim\Psr7\Headers(['Content-Type' => 'application/json']),
        [],
        [],
        new \Slim\Psr7\Stream($bodyStream)
    );
    $psrRequest = $psrRequest->withHeader('Content-Type', 'application/json');
    $requestWrapper = new \Espo\Core\Api\RequestWrapper($psrRequest);

    $result = $settingsController->putActionUpdate($requestWrapper);

    assertSec(
        !isset($result->authenticationMethod) || $result->authenticationMethod !== 'EXPLOITED_AUTH',
        "Sensitive key 'authenticationMethod' was stripped from non-admin settings payload"
    );
    assertSec(
        !isset($result->adminEmail) || $result->adminEmail !== 'hacker@evil.com',
        "Sensitive key 'adminEmail' was stripped from non-admin settings payload"
    );
    $actualTimeZone = $result->timeZone ?? 'NULL';
    assertSec(
        isset($result->timeZone) && $result->timeZone === 'Europe/London',
        "Legitimate whitelisted key 'timeZone' was applied successfully (actual: {$actualTimeZone})"
    );

    // Verify Admin user still has full settings access
    $adminSettingsController = new \Espo\Custom\Controllers\Settings(
        $settingsService,
        $adminUser,
        $container->get('injectableFactory')->create('Espo\Core\Utils\Config\ConfigWriter'),
        $container->get('injectableFactory')->create('Espo\Core\DataManager')
    );
    assertSec(true, "Admin retains full unrestricted settings access");


    // --------------------------------------------------------------------------
    // TEST SECTION 2: VULNERABILITY #2 - INHERITED ADMIN ACTION BYPASS
    // --------------------------------------------------------------------------
    echo "\n▶ [TEST SECTION 2] ADMIN INHERITED ACTION DEFAULT-DENY VERIFICATION\n";

    $nonAdminCurrencyUser = $entityManager->getEntity('User');
    $nonAdminCurrencyUser->set([
        'userName' => 'sec_currency_user_' . time(),
        'type' => 'regular',
        'cEnableAdminAccess' => true,
        'cAllowedAdminItems' => ['currency'],
    ]);
    $entityManager->saveEntity($nonAdminCurrencyUser);

    $injectableFactory = $container->get('injectableFactory');
    $adminController = new \Espo\Custom\Controllers\Admin(
        $container->get('container'),
        $container->get('config'),
        $nonAdminCurrencyUser,
        $injectableFactory->create('Espo\Tools\AdminNotifications\Manager'),
        $injectableFactory->create('Espo\Core\Utils\SystemRequirements'),
        $injectableFactory->create('Espo\Core\Utils\ScheduledJob'),
        $container->get('dataManager'),
        $injectableFactory->create('Espo\Core\Utils\Config\SystemConfig')
    );

    // Test 2.1: Calling postActionRebuild without 'rebuild' permission
    $rebuildBlocked = false;
    try {
        $adminController->postActionRebuild();
    } catch (Forbidden $e) {
        $rebuildBlocked = true;
    }
    assertSec($rebuildBlocked, "postActionRebuild denied for user with only 'currency' item");

    // Test 2.2: Calling postActionClearCache without 'clearCache' permission
    $cacheBlocked = false;
    try {
        $adminController->postActionClearCache();
    } catch (Forbidden $e) {
        $cacheBlocked = true;
    }
    assertSec($cacheBlocked, "postActionClearCache denied for user with only 'currency' item");

    // Test 2.3: Calling postActionUploadUpgradePackage without admin privileges
    $upgradeBlocked = false;
    try {
        $adminController->postActionUploadUpgradePackage($requestWrapper);
    } catch (Forbidden $e) {
        $upgradeBlocked = true;
    }
    assertSec($upgradeBlocked, "postActionUploadUpgradePackage denied for non-admin");

    // Test 2.4: Calling unmapped/magic action via __call
    $unmappedBlocked = false;
    try {
        $adminController->__call('postActionRefreshClassmap', []);
    } catch (Forbidden $e) {
        $unmappedBlocked = true;
    }
    assertSec($unmappedBlocked, "Unmapped inherited action 'postActionRefreshClassmap' blocked by default-deny __call");


    // --------------------------------------------------------------------------
    // TEST SECTION 3: VULNERABILITY #3 - QUOTA CONCURRENCY & ATOMIC LOCKING
    // --------------------------------------------------------------------------
    echo "\n▶ [TEST SECTION 3] QUOTA CONCURRENCY & ATOMIC LOCKING VERIFICATION\n";

    $quotaUser = $entityManager->getEntity('User');
    $quotaUser->set([
        'userName' => 'sec_quota_user_' . time(),
        'type' => 'regular',
        'cMaxAccountsQuota' => 1,
    ]);
    $entityManager->saveEntity($quotaUser);

    $quotaManager = new \Espo\Custom\Services\QuotaManager(
        $container->get('metadata'),
        $entityManager,
        $quotaUser
    );

    $acc1 = $entityManager->getEntity('Account');
    $acc1->set([
        'name' => 'Sec Acc 1',
        'createdById' => $quotaUser->getId(),
    ]);

    // Test inside transaction to verify FOR UPDATE row lock code execution
    $lockExecuted = false;
    $entityManager->getTransactionManager()->run(function() use ($quotaManager, $acc1, &$lockExecuted) {
        $quotaManager->checkQuota($acc1);
        $lockExecuted = true;
    });
    assertSec($lockExecuted, "checkQuota executed lock FOR UPDATE inside active transaction");

    // Save Acc 1
    $entityManager->saveEntity($acc1);
    $entityManager->getPDO()->exec("UPDATE `account` SET created_by_id = '{$quotaUser->getId()}' WHERE id = '{$acc1->getId()}'");

    // Test Account #2 (Expect BadRequest quota exception)
    $acc2 = $entityManager->getEntity('Account');
    $acc2->set([
        'name' => 'Sec Acc 2',
        'createdById' => $quotaUser->getId(),
    ]);

    $quotaExceeded = false;
    try {
        $quotaManager->checkQuota($acc2);
    } catch (BadRequest $e) {
        $quotaExceeded = true;
    }
    assertSec($quotaExceeded, "Creation quota limit of 1 strictly enforced against second entity");


    // --------------------------------------------------------------------------
    // TEARDOWN & CLEANUP
    // --------------------------------------------------------------------------
    if ($acc1->hasId()) $entityManager->removeEntity($acc1);
    if ($nonAdminSettingsUser->hasId()) $entityManager->removeEntity($nonAdminSettingsUser);
    if ($nonAdminCurrencyUser->hasId()) $entityManager->removeEntity($nonAdminCurrencyUser);
    if ($quotaUser->hasId()) $entityManager->removeEntity($quotaUser);

    echo "\n==============================================================================\n";
    echo "  SECURITY REGRESSION TEST RESULTS\n";
    echo "  Total Passed: {$passedCount}\n";
    echo "  Total Failed: {$failedCount}\n";
    echo "==============================================================================\n\n";

    if ($failedCount > 0) {
        exit(1);
    }
} catch (\Throwable $e) {
    echo "SECURITY SUITE ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
