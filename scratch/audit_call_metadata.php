<?php
require_once 'bootstrap.php';

$app = new \Espo\Core\Application();
$app->setupSystemUser();
$container = $app->getContainer();
$metadata = $container->get('metadata');

echo "=== 1. LIVE MERGED LOGICDEFS FOR CALL ===\n";
$logicDefsMerged = $metadata->get(['logicDefs', 'Call']);
var_export($logicDefsMerged);

echo "\n\n=== 2. LIVE MERGED CLIENTDEFS RECORDVIEWS FOR CALL ===\n";
$recordViewsMerged = $metadata->get(['clientDefs', 'Call', 'recordViews']);
var_export($recordViewsMerged);

echo "\n\n=== 3. PHYSICAL FILE ABSENCE CHECK ===\n";
$coreLogic = 'application/Espo/Resources/metadata/logicDefs/Call.json';
$crmLogic = 'application/Espo/Modules/Crm/Resources/metadata/logicDefs/Call.json';
echo "Core logicDefs ($coreLogic): " . (file_exists($coreLogic) ? 'EXISTS' : 'ABSENT') . "\n";
echo "Crm module logicDefs ($crmLogic): " . (file_exists($crmLogic) ? 'EXISTS' : 'ABSENT') . "\n";
