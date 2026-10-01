<?php
include "bootstrap.php";

use Espo\Core\Application;

$app = new Application();
$container = $app->getContainer();

$entityManager = $container->get('entityManager');

$targetUser = $entityManager->getEntity('User', '6aac26d8353dbe803');
if ($targetUser) {
    echo "Target User 6aac26d8353dbe803:\n";
    echo "  Name: " . $targetUser->get('name') . "\n";
    echo "  UserName: " . $targetUser->get('userName') . "\n";
    echo "  Type: " . $targetUser->get('type') . "\n";
    echo "  CreatedById: " . $targetUser->get('createdById') . "\n";
    echo "  CreatedByName: " . $targetUser->get('createdByName') . "\n";
} else {
    echo "Target User 6aac26d8353dbe803 NOT FOUND!\n";
}

echo "\nAll Users in DB:\n";
$users = $entityManager->getRDBRepository('User')->find();
foreach ($users as $u) {
    echo "  ID: " . $u->getId() . " | Username: " . $u->get('userName') . " | Type: " . $u->get('type') . " | CreatedBy: " . $u->get('createdById') . "\n";
}
