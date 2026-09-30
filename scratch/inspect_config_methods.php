<?php
require_once 'bootstrap.php';

$app = new \Espo\Core\Application();
$container = $app->getContainer();
$config = $container->get('config');

$ref = new ReflectionClass($config);
foreach ($ref->getMethods() as $m) {
    echo $m->getName() . "\n";
}
