<?php
try {
    include "bootstrap.php";

    use Espo\Core\Application;

    $app = new Application();
    $app->setupSystem();
    $container = $app->getContainer();

    $entityManager = $container->get('entityManager');
    $passwordHash = $container->get(\Espo\Core\Utils\PasswordHash::class);
    $passwordService = $container->get(\Espo\Tools\UserSecurity\Password\Service::class);

    echo "Checking UserSecurity Password Service...\n";

    $user = $entityManager->getRDBRepository('User')->findOne(['where' => ['userName' => 'admin']]);
    if (!$user) {
        echo "User admin not found!\n";
        exit(0);
    }

    echo "Found user: " . $user->get('userName') . " (ID: " . $user->getId() . ")\n";

    // Test 1: Verify current password check with wrong password
    try {
        $passwordService->changePasswordWithCheck($user->getId(), 'NewPass123!', 'WrongPass123!');
        echo "ERROR: Should have rejected wrong password!\n";
    } catch (\Espo\Core\Exceptions\Forbidden $e) {
        echo "SUCCESS: Rejected wrong password with message: " . $e->getMessage() . "\n";
    }
} catch (\Throwable $t) {
    echo "FATAL: " . $t->getMessage() . " in " . $t->getFile() . ":" . $t->getLine() . "\n";
}
