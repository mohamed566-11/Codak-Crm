<?php

try {
    include __DIR__ . '/../bootstrap.php';
    $app = new \Espo\Core\Application();
    $app->setupSystemUser();
    $container = $app->getContainer();
    $em = $container->get('entityManager');

    $users = $em->getRDBRepository('User')->find();
    echo "Found " . count($users) . " users:\n";
    foreach ($users as $u) {
        echo "- Username: " . $u->get('userName') . " | ID: " . $u->getId() . " | Type: " . $u->get('type') . " | CreatedBy: " . $u->get('createdById') . "\n";
    }
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
