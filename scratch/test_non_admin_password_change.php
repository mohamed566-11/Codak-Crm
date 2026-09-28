<?php

try {
    include __DIR__ . '/../bootstrap.php';

    $app = new \Espo\Core\Application();
    $app->setupSystemUser();
    $container = $app->getContainer();

    $entityManager = $container->get('entityManager');
    $userFactory = $container->get('injectableFactory');
    $passwordHash = $userFactory->create(\Espo\Core\Utils\PasswordHash::class);

    echo "===========================================================\n";
    echo "Testing Non-Admin User Password Change Engine & ACL\n";
    echo "===========================================================\n\n";

    $mohamedUser = $entityManager->getEntityById('User', '6aac26d8353dbe803');
    if (!$mohamedUser) {
        echo "[FAIL] User 'mohamed' (6aac26d8353dbe803) not found.\n";
        exit(0);
    }

    echo "Testing as User: " . $mohamedUser->get('userName') . " (ID: " . $mohamedUser->getId() . ")\n";

    // Set initial password for mohamed to 'Mohamed123!'
    $mohamedUser->set('password', $passwordHash->hash('Mohamed123!'));
    $entityManager->saveEntity($mohamedUser);
    echo "[INIT] Reset mohamed password to 'Mohamed123!'.\n";

    // Create User service logged in as mohamed
    $userServiceForMohamed = $userFactory->create(\Espo\Custom\Services\User::class);
    $userServiceForMohamed->setUser($mohamedUser);

    // TEST 1 & 2: Direct Self Password Change with password & passwordConfirm -> Should succeed
    echo "\n--- TEST 1 & 2: Self Password Change with password & passwordConfirm ---\n";
    try {
        $data = (object) [
            'password' => 'DirectMohamedPass123!',
            'passwordConfirm' => 'DirectMohamedPass123!',
        ];
        $userServiceForMohamed->update($mohamedUser->getId(), $data);

        // Verify in DB
        $updatedMohamed = $entityManager->getEntityById('User', $mohamedUser->getId());
        if ($passwordHash->verify('DirectMohamedPass123!', $updatedMohamed->get('password'))) {
            echo "[PASS] TEST 1 & 2: Self password updated directly and verified in DB!\n";
        } else {
            echo "[FAIL] TEST 1 & 2: Hashed password verification failed.\n";
        }
    } catch (\Throwable $e) {
        echo "[FAIL] TEST 1 & 2: Exception occurred: " . $e->getMessage() . "\n";
    }

    // Restore password to Mohamed123!
    $mohamedUser->set('password', $passwordHash->hash('Mohamed123!'));
    $entityManager->saveEntity($mohamedUser);

    // TEST 3: Change password for a user created by mohamed (e.g. omarr)
    echo "\n--- TEST 3: Changing password for user created by mohamed (omarr) ---\n";
    $createdUser = $entityManager->getEntityById('User', '6ab1378d32fd51548'); // omarr

    if ($createdUser) {
        echo "Found user created by mohamed: " . $createdUser->get('userName') . " (ID: " . $createdUser->getId() . ")\n";
        try {
            $data = (object) [
                'password' => 'NewCreatedPass123!',
                'passwordConfirm' => 'NewCreatedPass123!',
            ];
            $userServiceForMohamed->update($createdUser->getId(), $data);

            $updatedCreated = $entityManager->getEntityById('User', $createdUser->getId());
            if ($passwordHash->verify('NewCreatedPass123!', $updatedCreated->get('password'))) {
                echo "[PASS] TEST 3: Password for created user updated and verified!\n";
            } else {
                echo "[FAIL] TEST 3: Created user password verification failed.\n";
            }
        } catch (\Throwable $e) {
            echo "[FAIL] TEST 3: Exception occurred: " . $e->getMessage() . "\n";
        }
    } else {
        echo "[SKIP] TEST 3: No user created by mohamed found.\n";
    }

    // TEST 4: Attempting to change password for another user (admin) -> Security check
    echo "\n--- TEST 4: Attempting to change password for another user (admin) ---\n";

    $adminUser = $entityManager->getEntityById('User', '6a4ec9b12dae98deb');
    $oldAdminHash = $adminUser->get('password');

    try {
        $data = (object) [
            'password' => 'HackedAdminPass123!',
            'passwordConfirm' => 'HackedAdminPass123!',
        ];
        $userServiceForMohamed->update($adminUser->getId(), $data);

    
        $freshAdminHash = $entityManager->getPDO()->query("SELECT password FROM `user` WHERE id = '6a4ec9b12dae98deb'")->fetchColumn();
        echo "[DEBUG Test 4] oldAdminHash={$oldAdminHash} | freshAdminHash={$freshAdminHash}\n";
        if ($freshAdminHash === $oldAdminHash) {
            echo "[PASS] TEST 4: Admin password was NOT changed (security check enforced).\n";
        } else {
            echo "[FAIL] TEST 4: Security bypass! Admin password was altered!\n";
        }
    } catch (\Throwable $e) {
        echo "[PASS] TEST 4: Security check blocked attempt with error: " . $e->getMessage() . "\n";
    }

    echo "\n===========================================================\n";
    echo "All Backend Security & Password Change Tests Complete.\n";
    echo "===========================================================\n";

} catch (\Throwable $t) {
    echo "ERROR: " . $t->getMessage() . " in " . $t->getFile() . ":" . $t->getLine() . "\n";
}
