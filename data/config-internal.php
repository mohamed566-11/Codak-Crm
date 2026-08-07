<?php
return [
  'database' => [
    'host' => 'localhost',
    'port' => '',
    'charset' => NULL,
    'dbname' => 'espo',
    'user' => 'root',
    'password' => '',
    'platform' => 'Mysql'
  ],
  'smtpPassword' => NULL,
  'logger' => [
    'path' => 'data/logs/espo.log',
    'level' => 'WARNING',
    'rotation' => true,
    'maxFileNumber' => 30,
    'printTrace' => false,
    'databaseHandler' => false,
    'sql' => false,
    'sqlFailed' => false
  ],
  'restrictedMode' => false,
  'cleanupAppLog' => true,
  'cleanupAppLogPeriod' => '30 days',
  'webSocketMessager' => 'ZeroMQ',
  'clientSecurityHeadersDisabled' => false,
  'clientCspDisabled' => false,
  'clientCspScriptSourceList' => [
    0 => 'https://maps.googleapis.com'
  ],
  'adminUpgradeDisabled' => false,
  'adminUpgrade' => false,
  'adminExtensionUpload' => true,
  'isInstalled' => true,
  'microtimeInternal' => 1784659783.216807,
  'cryptKey' => '46b4e166244e7848156e986a708267cc',
  'hashSecretKey' => 'f5fdeea083f18a12467b29826d78ca94',
  'actualDatabaseType' => 'mysql',
  'actualDatabaseVersion' => '8.4.3',
  'instanceId' => '6612e931-7fc2-4a37-a173-da46f6780530'
];
