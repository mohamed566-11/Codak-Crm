<?php

try {
    include __DIR__ . '/../bootstrap.php';
    $app = new \Espo\Core\Application();
    $app->setupSystemUser();
    $container = $app->getContainer();
    $em = $container->get('entityManager');
    $hash = $container->get('injectableFactory')->create(\Espo\Core\Utils\PasswordHash::class);

    $user = $em->getEntityById('User', '6aac26d8353dbe803');
    if ($user) {
        $user->set('password', $hash->hash('Mohamed123!'));
        $em->saveEntity($user);
        echo "SUCCESS: Password for user 'mohamed' (userName: " . $user->get('userName') . ") has been set to: Mohamed123!\n";
    } else {
        echo "ERROR: User 'mohamed' not found!\n";
    }
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
