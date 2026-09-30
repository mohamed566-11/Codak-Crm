<?php
require_once 'bootstrap.php';

echo "Running PHP lint & cache clear check...\n";

$app = new \Espo\Core\Application();
$container = $app->getContainer();

$dataManager = $container->get('dataManager');
$dataManager->clearCache();
$dataManager->rebuild();

echo "Cache cleared & rebuild succeeded!\n";
