<?php
include __DIR__ . '/../bootstrap.php';

use Espo\Core\Application;
use Espo\Entities\User;
use Espo\Core\Record\ServiceContainer;
use Espo\Core\Record\UpdateParams;

$app = new Application();
$app->setupSystemUser();
$container = $app->getContainer();
$entityManager = $container->get('entityManager');
$serviceContainer = $container->getByClass(ServiceContainer::class);
$userService = $serviceContainer->get('User');

echo "==============================================================================\n";
echo "   PRIVILEGE ESCALATION TEST: Non-Admin Updating Self 'isAdmin' Attribute\n";
echo "==============================================================================\n\n";

// Create a test non-admin user
$testUser = $entityManager->getRDBRepository('User')->where(['userName' => 'test_escalation_user'])->findOne();
if ($testUser) {
    $entityManager->removeEntity($testUser);
}

$testUser = $entityManager->getEntity('User');
$testUser->set([
    'userName' => 'test_escalation_user',
    'type' => 'regular',
    'isAdmin' => false,
    'cEnableAdminAccess' => false,
]);
$entityManager->saveEntity($testUser);

echo "Initial State: User ID={$testUser->getId()}, userName={$testUser->getUserName()}, isAdmin=" . ($testUser->isAdmin() ? 'TRUE' : 'FALSE') . "\n";

// Set container user context to testUser
$container->set('user', $testUser);

$payload = (object) [
    'isAdmin' => true,
    'lastName' => 'EscalationTest',
];

try {
    $updatedEntity = $userService->update($testUser->getId(), $payload, UpdateParams::create());
    
    // Refresh entity from database to verify persistent DB state
    $dbEntity = $entityManager->getEntity('User', $testUser->getId());
    
    echo "Post-Update DB State: isAdmin=" . ($dbEntity->isAdmin() ? 'TRUE' : 'FALSE') . "\n";
    if ($dbEntity->isAdmin()) {
        echo "🚨 PRIVILEGE ESCALATION VULNERABILITY CONFIRMED! Non-admin successfully escalated privileges to Admin by updating self 'isAdmin' field!\n";
    } else {
        echo "✅ SAFE: EspoCRM core or service layer ignored 'isAdmin' field update.\n";
    }
} catch (\Throwable $e) {
    echo "Exception during update attempt: " . $e->getMessage() . "\n";
}

// Teardown
$app->setupSystemUser();
$entityManager->removeEntity($testUser);
echo "\nTest cleanup complete.\n";
