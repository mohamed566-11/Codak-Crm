<?php
include __DIR__ . '/../bootstrap.php';

use Espo\Core\Application;
use Espo\Entities\User;
use Espo\Core\Acl\GlobalRestriction;

$app = new Application();
$app->setupSystemUser();
$injectableFactory = $app->getInjectableFactory();
$globalRestriction = $injectableFactory->create(GlobalRestriction::class);

echo "==============================================================================\n";
echo "   VERIFYING FINDING-002: GlobalRestriction Non-Admin Read-Only Attributes for User\n";
echo "==============================================================================\n\n";

$nonAdminReadOnlyFields = $globalRestriction->getScopeRestrictedFieldList('User', GlobalRestriction::TYPE_NON_ADMIN_READ_ONLY);
$nonAdminReadOnlyAttributes = $globalRestriction->getScopeRestrictedAttributeList('User', GlobalRestriction::TYPE_NON_ADMIN_READ_ONLY);

echo "Non-Admin Read-Only Fields for User entity:\n";
print_r($nonAdminReadOnlyFields);

echo "\nNon-Admin Read-Only Attributes for User entity:\n";
print_r($nonAdminReadOnlyAttributes);

echo "\nIs 'isAdmin' in nonAdminReadOnly fields? " . (in_array('isAdmin', $nonAdminReadOnlyFields, true) ? 'YES' : 'NO') . "\n";
