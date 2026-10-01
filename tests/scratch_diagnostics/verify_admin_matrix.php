<?php
include __DIR__ . '/../bootstrap.php';

use Espo\Core\Application;
use Espo\Entities\User;

$app = new Application();
$app->setupSystemUser();
$container = $app->getContainer();
$injectableFactory = $app->getInjectableFactory();
$entityManager = $container->get('entityManager');

echo "==============================================================================\n";
echo "   FULL MATRIX VERIFICATION: Admin Controller Public Action Methods Access\n";
echo "==============================================================================\n\n";

// Parent Admin reflection
$parentReflection = new ReflectionClass(\Espo\Controllers\Admin::class);
$publicMethods = $parentReflection->getMethods(ReflectionMethod::IS_PUBLIC);

$actionMethods = [];
foreach ($publicMethods as $m) {
    $name = $m->getName();
    if (str_starts_with($name, 'getAction') || str_starts_with($name, 'postAction') || str_starts_with($name, 'putAction') || str_starts_with($name, 'deleteAction')) {
        $actionMethods[] = $name;
    }
}

echo "Detected Parent Admin Action Methods (" . count($actionMethods) . "):\n";
foreach ($actionMethods as $am) {
    echo "  - {$am}\n";
}

// Prepare test users
// 1. Full Admin
$adminUser = $entityManager->getRDBRepository('User')->where(['userName' => 'admin'])->findOne();

// 2. Partial Admin with 'rebuild' only
$partialAdminRebuild = $entityManager->getRDBRepository('User')->where(['userName' => 'test_partial_rebuild'])->findOne();
if (!$partialAdminRebuild) {
    $partialAdminRebuild = $entityManager->getEntity('User');
    $partialAdminRebuild->set([
        'userName' => 'test_partial_rebuild',
        'type' => 'regular',
        'cEnableAdminAccess' => true,
        'cAllowedAdminItems' => ['rebuild'],
    ]);
    $entityManager->saveEntity($partialAdminRebuild);
}

// 3. Partial Admin WITHOUT 'rebuild' (has 'clearCache' only)
$partialAdminNoRebuild = $entityManager->getRDBRepository('User')->where(['userName' => 'test_partial_noclear'])->findOne();
if (!$partialAdminNoRebuild) {
    $partialAdminNoRebuild = $entityManager->getEntity('User');
    $partialAdminNoRebuild->set([
        'userName' => 'test_partial_noclear',
        'type' => 'regular',
        'cEnableAdminAccess' => true,
        'cAllowedAdminItems' => ['clearCache'],
    ]);
    $entityManager->saveEntity($partialAdminNoRebuild);
}

// 4. Regular User
$regularUser = $entityManager->getRDBRepository('User')->where(['userName' => 'test_regular_user_f001'])->findOne();
if (!$regularUser) {
    $regularUser = $entityManager->getEntity('User');
    $regularUser->set([
        'userName' => 'test_regular_user_f001',
        'type' => 'regular',
        'cEnableAdminAccess' => false,
    ]);
    $entityManager->saveEntity($regularUser);
}

echo "\n--- RUNNING MATRIX VERIFICATION ---\n";
printf("%-32s | %-12s | %-16s | %-16s | %-12s\n", "Action Method", "Full Admin", "Partial (Match)", "Partial (NoMatch)", "Regular User");
echo str_repeat("-", 100) . "\n";

$usersToTest = [
    'Full Admin' => $adminUser,
    'Partial (Match)' => $partialAdminRebuild,
    'Partial (NoMatch)' => $partialAdminNoRebuild,
    'Regular User' => $regularUser,
];

foreach ($actionMethods as $am) {
    // Action name for beforeAction (e.g. postActionRebuild -> rebuild)
    $actionName = lcfirst(preg_replace('/^(get|post|put|delete)Action/', '', $am));
    
    $results = [];
    foreach ($usersToTest as $label => $u) {
        try {
            $controller = $injectableFactory->createWith(\Espo\Custom\Controllers\Admin::class, [
                'user' => $u,
            ]);
            $controller->beforeAction($actionName);
            $results[$label] = "200 (ALLOW)";
        } catch (\Espo\Core\Exceptions\Forbidden $e) {
            $results[$label] = "403 (DENY)";
        } catch (\Throwable $e) {
            $results[$label] = "ERR (" . get_class($e) . ")";
        }
    }

    printf("%-32s | %-12s | %-16s | %-16s | %-12s\n", $am, $results['Full Admin'], $results['Partial (Match)'], $results['Partial (NoMatch)'], $results['Regular User']);
}

// Cleanup
$entityManager->removeEntity($partialAdminRebuild);
$entityManager->removeEntity($partialAdminNoRebuild);
$entityManager->removeEntity($regularUser);
echo "\nMatrix verification complete.\n";
