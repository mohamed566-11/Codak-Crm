<?php
require_once 'bootstrap.php';

$app = new \Espo\Core\Application();
$app->setupSystemUser();
$container = $app->getContainer();
$metadata = $container->get('metadata');

echo "=== ITEM 1: LIVE MERGED CLIENTDEFS RECORDVIEWS QUERY FOR ACCOUNT ===\n";
$accountRecordViews = $metadata->get(['clientDefs', 'Account', 'recordViews']);
var_export($accountRecordViews);
echo "\n";
