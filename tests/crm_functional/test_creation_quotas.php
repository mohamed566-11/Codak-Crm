<?php

require_once __DIR__ . '/bootstrap.php';

use Espo\Core\Application;
use Espo\Core\Exceptions\BadRequest;
use Espo\Core\ORM\Repository\Option\SaveOption;
use Espo\Custom\Services\QuotaManager;

try {
    $app = new Application();
    $app->setupSystemUser();
    $container = $app->getContainer();
    $entityManager = $container->get('entityManager');
    $userRepository = $entityManager->getRepository('User');

    echo "=== STARTING CREATION QUOTAS AUTOMATED TEST SUITE ===\n\n";

    $passCount = 0;
    $failCount = 0;

    function assertTest(bool $condition, string $testName) {
        global $passCount, $failCount;
        if ($condition) {
            echo "✅ PASS: {$testName}\n";
            $passCount++;
        } else {
            echo "❌ FAIL: {$testName}\n";
            $failCount++;
        }
    }

    // 1. Setup Test User (Non-Admin)
    $testUserName = 'quota_test_user_' . time();
    $testUser = $entityManager->getEntity('User');
    $testUser->set([
        'userName' => $testUserName,
        'firstName' => 'Quota',
        'lastName' => 'Tester',
        'type' => 'regular',
        'cMaxAccountsQuota' => 2, // Explicit 2 Accounts quota
        'cMaxLeadsQuota' => 1,    // Explicit 1 Lead quota
    ]);
    $entityManager->saveEntity($testUser);

    assertTest($testUser->getId() !== null, "Created test user {$testUserName} with cMaxAccountsQuota=2, cMaxLeadsQuota=1");

    // Inject test user into QuotaManager service
    $quotaManager = new QuotaManager(
        $container->get('metadata'),
        $entityManager,
        $testUser
    );

    // 2. Test Quota Resolution
    $effectiveAccountsQuota = $quotaManager->getEffectiveQuota('Account', $testUser);
    assertTest($effectiveAccountsQuota === 2, "getEffectiveQuota('Account') returns 2");

    $effectiveLeadsQuota = $quotaManager->getEffectiveQuota('Lead', $testUser);
    assertTest($effectiveLeadsQuota === 1, "getEffectiveQuota('Lead') returns 1");

    // 3. Create Account #1 for Test User
    $acc1 = $entityManager->getEntity('Account');
    $acc1->set([
        'name' => 'Quota Test Acc 1',
        'createdById' => $testUser->getId(),
    ]);
    $quotaManager->checkQuota($acc1); // Should pass
    $entityManager->saveEntity($acc1, [SaveOption::CREATED_BY_ID => $testUser->getId()]);
    $entityManager->getPDO()->exec("UPDATE `account` SET created_by_id = '{$testUser->getId()}' WHERE id = '{$acc1->getId()}'");

    // 4. Create Account #2 for Test User
    $acc2 = $entityManager->getEntity('Account');
    $acc2->set([
        'name' => 'Quota Test Acc 2',
        'createdById' => $testUser->getId(),
    ]);
    $quotaManager->checkQuota($acc2); // Should pass
    $entityManager->saveEntity($acc2, [SaveOption::CREATED_BY_ID => $testUser->getId()]);
    $entityManager->getPDO()->exec("UPDATE `account` SET created_by_id = '{$testUser->getId()}' WHERE id = '{$acc2->getId()}'");

    // 5. Attempt Account #3 (Expect BadRequest Exception)
    $acc3 = $entityManager->getEntity('Account');
    $acc3->set([
        'name' => 'Quota Test Acc 3',
        'createdById' => $testUser->getId(),
    ]);

    $exceptionCaught = false;
    $errorMessage = '';
    try {
        $quotaManager->checkQuota($acc3);
    } catch (BadRequest $e) {
        $exceptionCaught = true;
        $errorMessage = $e->getMessage();
    } catch (\Throwable $e) {
        $errorMessage = 'Unexpected exception: ' . $e->getMessage();
    }

    assertTest($exceptionCaught, "Creating Account #3 threw BadRequest exception. Msg: '{$errorMessage}'");
    assertTest(str_contains($errorMessage, "Creation Limit Reached"), "Exception message contains 'Creation Limit Reached'");

    // 6. Test Soft-Delete Slot Recycling
    $entityManager->removeEntity($acc1); // Soft delete Account #1
    $quotaManager->checkQuota($acc3); // Should now pass!
    $entityManager->saveEntity($acc3, [SaveOption::CREATED_BY_ID => $testUser->getId()]);
    $entityManager->getPDO()->exec("UPDATE `account` SET created_by_id = '{$testUser->getId()}' WHERE id = '{$acc3->getId()}'");
    assertTest($acc3->getId() !== null, "Successfully created Account #3 after soft-deleting Account #1");

    // 7. Test Admin Bypass
    $adminUser = $userRepository->where(['type' => 'admin'])->findOne();
    $adminQuotaManager = new QuotaManager(
        $container->get('metadata'),
        $entityManager,
        $adminUser
    );

    $accAdmin = $entityManager->getEntity('Account');
    $accAdmin->set('name', 'Admin Quota Test Acc');
    $adminQuotaManager->checkQuota($accAdmin);
    assertTest(true, "Admin user bypassed quota check without exception");

    // Cleanup Test Entities
    if ($acc2->hasId()) {
        $entityManager->removeEntity($acc2);
    }
    if ($acc3->hasId()) {
        $entityManager->removeEntity($acc3);
    }
    if ($accAdmin->hasId()) {
        $entityManager->removeEntity($accAdmin);
    }
    if ($testUser->hasId()) {
        $entityManager->removeEntity($testUser);
    }

    echo "\n=== SUMMARY ===";
    echo "\nTotal Passed: {$passCount}";
    echo "\nTotal Failed: {$failCount}\n";

    if ($failCount > 0) {
        exit(1);
    }
} catch (\Throwable $e) {
    echo "FATAL ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
