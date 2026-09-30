<?php
include __DIR__ . '/../bootstrap.php';

use Espo\Core\Application;
use Espo\Entities\User;
use Espo\Custom\Services\QuotaManager;

$app = new Application();
$app->setupSystemUser();
$container = $app->getContainer();
$injectableFactory = $app->getInjectableFactory();
$entityManager = $container->get('entityManager');
$metadata = $container->get('metadata');

echo "==============================================================================\n";
echo "   CODAK CRM DEEP QA & ACCESS CONTROL TESTING SCRIPT\n";
echo "==============================================================================\n\n";

// 1. Check Non-Admin Mass Assignment on User entity
echo "[TEST 1] Mass-Assignment Protection on Protected Fields\n";
$testUser = $entityManager->getRDBRepository('User')->where(['userName' => 'test_nonadmin_qa'])->findOne();
if (!$testUser) {
    $testUser = $entityManager->getEntity('User');
    $testUser->set([
        'userName' => 'test_nonadmin_qa',
        'type' => 'regular',
        'cEnableAdminAccess' => false,
        'cAllowedAdminItems' => [],
        'cMaxAccountsQuota' => 2,
    ]);
    $entityManager->saveEntity($testUser);
}

echo "Created test non-admin user ID: {$testUser->getId()}, cEnableAdminAccess: " . ($testUser->get('cEnableAdminAccess') ? 'true' : 'false') . "\n";

// Test modifying protected fields via non-admin user context
$userAclManager = $container->get('aclManager');
$canEditSelf = $userAclManager->checkEntity($testUser, $testUser, 'edit');
echo "Can non-admin edit self record via aclManager? " . ($canEditSelf ? 'YES' : 'NO') . "\n";

// Check entityAcl metadata for User entity
$userEntityAcl = $metadata->get(['entityAcl', 'User', 'fields']) ?? [];
echo "Protected fields in User entityAcl:\n";
foreach (['cMaxAccountsQuota', 'cEnableAdminAccess', 'cAllowedAdminItems', 'isAdmin', 'type', 'roles'] as $f) {
    $readOnly = $userEntityAcl[$f]['nonAdminReadOnly'] ?? 'NOT_SET';
    echo "  - {$f}: nonAdminReadOnly = " . (is_bool($readOnly) ? ($readOnly ? 'true' : 'false') : $readOnly) . "\n";
}

// 2. Check Admin Controller Granular Access
echo "\n[TEST 2] Admin Controller Granular Action Access Check\n";
$adminControllerReflection = new ReflectionClass(\Espo\Custom\Controllers\Admin::class);
$parentAdminReflection = new ReflectionClass(\Espo\Controllers\Admin::class);

$customMethods = array_map(fn($m) => $m->getName(), $adminControllerReflection->getMethods(ReflectionMethod::IS_PUBLIC));
$parentMethods = array_map(fn($m) => $m->getName(), $parentAdminReflection->getMethods(ReflectionMethod::IS_PUBLIC));

$actionMethodsInParent = array_filter($parentMethods, fn($m) => str_starts_with($m, 'get') || str_starts_with($m, 'post') || str_starts_with($m, 'put') || str_starts_with($m, 'delete'));
echo "Action methods defined in core Espo\\Controllers\\Admin:\n";
foreach ($actionMethodsInParent as $m) {
    $isOverridden = in_array($m, $customMethods, true);
    echo "  - {$m}: " . ($isOverridden ? "OVERRIDDEN (Protected by checkActionAccess)" : "NOT OVERRIDDEN in custom Admin controller!") . "\n";
}

// 3. Test Quota Boundary Conditions (0, 1, LIMIT-1, LIMIT, LIMIT+1, negative)
echo "\n[TEST 3] Quota Bound & Negative Quota Checks\n";
$quotaManager = new QuotaManager($metadata, $entityManager, $testUser);
$effectiveQuotaAccount = $quotaManager->getEffectiveQuota('Account', $testUser);
echo "Effective Account Quota for test user: {$effectiveQuotaAccount}\n";

// Test setting quota to -1 (unlimited)
$testUser->set('cMaxAccountsQuota', -1);
$unlimitedQuota = $quotaManager->getEffectiveQuota('Account', $testUser);
echo "Effective Account Quota with -1: {$unlimitedQuota} (Expected -1 / Unlimited)\n";

// Test setting quota to 0 (zero quota = blocked)
$testUser->set('cMaxAccountsQuota', 0);
$zeroQuota = $quotaManager->getEffectiveQuota('Account', $testUser);
echo "Effective Account Quota with 0: {$zeroQuota} (Expected 0)\n";

$accountDummy = $entityManager->getEntity('Account');
$accountDummy->set('name', 'Quota Bound Check Account');

try {
    $quotaManager->checkQuota($accountDummy);
    echo "Check 0 Quota: DID NOT THROW (Current count >= 0 issue if user has 0 records and limit is 0!)\n";
} catch (\Espo\Core\Exceptions\BadRequest $e) {
    echo "Check 0 Quota: THREW EXPECTED EXCEPTION - " . $e->getMessage() . "\n";
}

// Clean up test user
$testUser->set('cMaxAccountsQuota', 2);
$entityManager->saveEntity($testUser);
$entityManager->removeEntity($testUser);
echo "\nTest non-admin user cleaned up cleanly.\n";
