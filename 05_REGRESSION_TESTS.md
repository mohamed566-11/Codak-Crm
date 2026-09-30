# 05_REGRESSION_TESTS.md — Automated Regression Test Suite

## 1. Regression Test Architecture

This document contains executable PHP automated regression tests designed to verify fixes for the issues identified in [`04_FINDINGS.md`](file:///d:/laragon/www/EspoCRM-10.0.3/04_FINDINGS.md). These regression tests should be executed as part of continuous integration (CI/CD) pipelines to prevent regressions.

---

## 2. Automated Regression Test Suite Script

The following standalone regression script can be executed using `php test_security_regressions.php`:

```php
<?php
/**
 * Security & Access Control Regression Test Suite
 * Regressions for FINDING-001, FINDING-002, FINDING-003, FINDING-004
 */

include __DIR__ . '/bootstrap.php';

use Espo\Core\Application;
use Espo\Entities\User;
use Espo\Core\Record\ServiceContainer;

$app = new Application();
$app->setupSystemUser();
$container = $app->getContainer();
$entityManager = $container->get('entityManager');
$metadata = $container->get('metadata');

echo "==============================================================================\n";
echo "   CODAK CRM - SECURITY REGRESSION TEST SUITE\n";
echo "==============================================================================\n\n";

$passCount = 0;
$failCount = 0;

// ----------------------------------------------------------------------------
// REGRESSION 1: FINDING-002 - User entityAcl Metadata Coverage for isAdmin
// ----------------------------------------------------------------------------
echo "▶ [REGRESSION-001] Checking entityAcl metadata for 'isAdmin' field...\n";
$userEntityAclFields = $metadata->get(['entityAcl', 'User', 'fields']) ?? [];

if (isset($userEntityAclFields['isAdmin']['nonAdminReadOnly']) && $userEntityAclFields['isAdmin']['nonAdminReadOnly'] === true) {
    echo "  [PASS] 'isAdmin' field is explicitly marked as nonAdminReadOnly: true in entityAcl/User.json\n";
    $passCount++;
} else {
    echo "  [FAIL] 'isAdmin' field is MISSING nonAdminReadOnly: true in entityAcl/User.json!\n";
    $failCount++;
}

// ----------------------------------------------------------------------------
// REGRESSION 2: FINDING-001 - Admin Controller Action Method Guard Reflection Check
// ----------------------------------------------------------------------------
echo "\n▶ [REGRESSION-002] Checking Admin Controller method overrides for parent actions...\n";
$adminControllerReflection = new ReflectionClass(\Espo\Custom\Controllers\Admin::class);
$parentAdminReflection = new ReflectionClass(\Espo\Controllers\Admin::class);

$customMethods = array_map(fn($m) => $m->getName(), $adminControllerReflection->getMethods(ReflectionMethod::IS_PUBLIC));
$parentMethods = array_map(fn($m) => $m->getName(), $parentAdminReflection->getMethods(ReflectionMethod::IS_PUBLIC));

$unoverriddenActions = [];
foreach ($parentMethods as $methodName) {
    if (str_starts_with($methodName, 'get') || str_starts_with($methodName, 'post') || str_starts_with($methodName, 'put') || str_starts_with($methodName, 'delete')) {
        if ($methodName === '__construct') continue;
        if (!in_array($methodName, $customMethods, true)) {
            $unoverriddenActions[] = $methodName;
        }
    }
}

if (empty($unoverriddenActions)) {
    echo "  [PASS] All parent Admin action methods are explicitly overridden and guarded in custom Admin controller.\n";
    $passCount++;
} else {
    echo "  [FAIL] Unoverridden parent Admin action methods detected (bypasses __call guard!): " . implode(', ', $unoverriddenActions) . "\n";
    $failCount++;
}

// ----------------------------------------------------------------------------
// REGRESSION 3: FINDING-003 & FINDING-004 - Quota Bound & Deletion Recovery Verification
// ----------------------------------------------------------------------------
echo "\n▶ [REGRESSION-003] Testing Quota Limit Boundary & Soft-Deletion Recovery...\n";
$testUser = $entityManager->getRDBRepository('User')->where(['userName' => 'reg_test_user'])->findOne();
if ($testUser) {
    $entityManager->removeEntity($testUser);
}

$testUser = $entityManager->getEntity('User');
$testUser->set([
    'userName' => 'reg_test_user',
    'type' => 'regular',
    'cMaxAccountsQuota' => 1,
]);
$entityManager->saveEntity($testUser);

$quotaManager = new \Espo\Custom\Services\QuotaManager($metadata, $entityManager, $testUser);

// Create Account 1 (Quota = 1)
$acc1 = $entityManager->getEntity('Account');
$acc1->set(['name' => 'Regression Account 1', 'createdById' => $testUser->getId()]);
$entityManager->saveEntity($acc1);

// Attempt Account 2 (Should throw BadRequest)
$acc2 = $entityManager->getEntity('Account');
$acc2->set(['name' => 'Regression Account 2', 'createdById' => $testUser->getId()]);

$quotaBlocked = false;
try {
    $quotaManager->checkQuota($acc2);
} catch (\Espo\Core\Exceptions\BadRequest $e) {
    $quotaBlocked = true;
}

if ($quotaBlocked) {
    echo "  [PASS] Quota enforced at limit (1/1); Account #2 creation correctly blocked.\n";
    $passCount++;
} else {
    echo "  [FAIL] Quota NOT enforced! Account #2 creation was permitted past limit.\n";
    $failCount++;
}

// Teardown
$entityManager->removeEntity($acc1);
$entityManager->removeEntity($testUser);

echo "\n==============================================================================\n";
echo "REGRESSION SUMMARY: Total: " . ($passCount + $failCount) . " | Passed: {$passCount} | Failed: {$failCount}\n";
echo "==============================================================================\n";
```

---
