<?php
require_once 'bootstrap.php';

$app = new \Espo\Core\Application();
$container = $app->getContainer();

$config = $container->get('config');
echo "Current cAllowedDashboardSections: " . json_encode($config->get('cAllowedDashboardSections')) . "\n";

$systemConfig = $container->get('systemConfig');
echo "SystemConfig class: " . get_class($systemConfig) . "\n";
