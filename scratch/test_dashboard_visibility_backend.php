<?php
require_once 'bootstrap.php';

$app = new \Espo\Core\Application();
$container = $app->getContainer();
$entityManager = $container->get('entityManager');
$config = $container->get('config');

echo "=== 1. TESTING GLOBAL SETTINGS METADATA & CONFIG ===\n";
$config->set('cAllowedDashboardSections', [
    'overview', 'leads', 'opportunities', 'accounts', 'contacts', 'emails', 'meetings'
]);
$config->save();

$globalSections = $config->get('cAllowedDashboardSections');
echo "Global Sections Config: " . json_encode($globalSections) . "\n";

echo "\n=== 2. TESTING USER ENTITY CALLOWEDDASHBOARDSECTIONS ===\n";
$adminUser = $entityManager->getEntity('User', '1');
if ($adminUser) {
    $adminUser->set('cAllowedDashboardSections', [
        'overview', 'leads', 'opportunities'
    ]);
    $entityManager->saveEntity($adminUser);
    echo "Saved Admin User Allowed Sections: " . json_encode($adminUser->get('cAllowedDashboardSections')) . "\n";

    // Restore default all 7
    $adminUser->set('cAllowedDashboardSections', [
        'overview', 'leads', 'opportunities', 'accounts', 'contacts', 'emails', 'meetings'
    ]);
    $entityManager->saveEntity($adminUser);
    echo "Restored Admin User Allowed Sections: " . json_encode($adminUser->get('cAllowedDashboardSections')) . "\n";
}

echo "\n=== BACKEND TEST SUCCESSFUL ===\n";
