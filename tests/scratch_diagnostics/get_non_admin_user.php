<?php
require_once 'bootstrap.php';
$app = new \Espo\Core\Application();
$container = $app->getContainer();
$em = $container->get('entityManager');

/** @var \Espo\Entities\User[] $users */
$users = $em->getRDBRepository('User')->where(['isPortal' => false])->find();

foreach ($users as $u) {
    echo "ID: " . $u->getId() . " | Username: " . $u->get('userName') . " | IsAdmin: " . ($u->isAdmin() ? 'YES' : 'NO') . " | CreatedBy: " . $u->get('createdById') . "\n";
}
