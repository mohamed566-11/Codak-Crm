<?php
include __DIR__ . '/../bootstrap.php';

use Espo\Core\Application;
use Espo\Entities\User;
use Espo\Core\Record\ServiceContainer;
use Espo\Core\Record\UpdateParams;
use Espo\Core\Record\CreateParams;

$app = new Application();
$app->setupSystemUser();
$container = $app->getContainer();
$entityManager = $container->get('entityManager');
$metadata = $container->get('metadata');
$userAclManager = $container->get('aclManager');

echo "==============================================================================\n";
echo "   VERIFYING FINDING-002: isAdmin Field Protection in User Record Service\n";
echo "==============================================================================\n\n";

// 1. Create a regular non-admin user
$testUser = $entityManager->getRDBRepository('User')->where(['userName' => 'test_f002_user'])->findOne();
if ($testUser) {
    $entityManager->removeEntity($testUser);
}

$testUser = $entityManager->getEntity('User');
$testUser->set([
    'userName' => 'test_f002_user',
    'type' => 'regular',
    'isAdmin' => false,
    'cEnableAdminAccess' => false,
]);
$entityManager->saveEntity($testUser);

echo "Created test non-admin user ID: {$testUser->getId()}, isAdmin=" . ($testUser->isAdmin() ? 'TRUE' : 'FALSE') . "\n";

// Inspect metadata
$entityAcl = $metadata->get(['entityAcl', 'User', 'fields']) ?? [];
echo "\nMetadata entityAcl User fields current state:\n";
foreach (['isAdmin', 'type', 'isPortalUser', 'isActive', 'roles', 'teams', 'defaultTeam', 'cEnableAdminAccess', 'cAllowedAdminItems', 'cMaxAccountsQuota'] as $f) {
    $def = $entityAcl[$f] ?? 'NOT_SET';
    echo "  - {$f}: " . json_encode($def) . "\n";
}

// Check AclManager checkEntityValue
$canEditIsAdmin = $userAclManager->checkEntityValue($testUser, $testUser, 'isAdmin');
echo "\nCan non-admin edit self 'isAdmin' field via AclManager checkEntityValue? " . ($canEditIsAdmin ? 'YES (VULNERABLE)' : 'NO (PROTECTED)') . "\n";

$canEditCEnableAdminAccess = $userAclManager->checkEntityValue($testUser, $testUser, 'cEnableAdminAccess');
echo "Can non-admin edit self 'cEnableAdminAccess' field via AclManager checkEntityValue? " . ($canEditCEnableAdminAccess ? 'YES (VULNERABLE)' : 'NO (PROTECTED)') . "\n";

$canEditType = $userAclManager->checkEntityValue($testUser, $testUser, 'type');
echo "Can non-admin edit self 'type' field via AclManager checkEntityValue? " . ($canEditType ? 'YES (VULNERABLE)' : 'NO (PROTECTED)') . "\n";

$canEditRoles = $userAclManager->checkEntityValue($testUser, $testUser, 'roles');
echo "Can non-admin edit self 'roles' field via AclManager checkEntityValue? " . ($canEditRoles ? 'YES (VULNERABLE)' : 'NO (PROTECTED)') . "\n";

// Clean up
$entityManager->removeEntity($testUser);
echo "\nCleaned up test user.\n";
