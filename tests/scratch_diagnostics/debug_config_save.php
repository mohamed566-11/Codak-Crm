<?php
require_once 'bootstrap.php';

try {
    $app = new \Espo\Core\Application();
    $container = $app->getContainer();

    $systemConfig = $container->get('systemConfig');
    $systemConfig->set('cAllowedDashboardSections', [
        "overview", "leads", "opportunities", "accounts", "contacts", "emails", "meetings"
    ]);
    $systemConfig->save();

    $config = $container->get('config');
    echo "Saved cAllowedDashboardSections: " . json_encode($config->get('cAllowedDashboardSections')) . "\n";
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
}
