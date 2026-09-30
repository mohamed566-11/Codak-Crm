<?php
require_once 'bootstrap.php';

$app = new \Espo\Core\Application();
$container = $app->getContainer();
$config = $container->get('config');

$config->set('cAllowedDashboardSections', [
    "overview", "leads", "opportunities", "accounts", "contacts", "emails", "meetings"
]);
$config->save();

echo "Saved: " . json_encode($config->get('cAllowedDashboardSections')) . "\n";
