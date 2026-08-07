<?php
require_once 'bootstrap.php';

$app = new \Espo\Core\Application();
$app->setupSystemUser();
$container = $app->getContainer();
$em = $container->get('entityManager');
$aclManager = $container->get('aclManager');

echo "=== TASK ACL LINK CHECKERS LIVE EXPLICIT TEST ===\n";

try {
    $userRepo = $em->getRepositoryByClass(\Espo\Entities\User::class);
    $systemUser = $userRepo->get('system');

    $task = $em->getNewEntity('Task');
    $task->set('name', 'Client Onboarding Meeting Prep');

    $foreignAccount = $em->getNewEntity('Account');
    $foreignAccount->set('name', 'Unlinked Test Account');

    $parentChecker = new \Espo\Modules\Crm\Classes\Acl\Task\LinkCheckers\ParentLinkChecker($aclManager, $em);
    $accountChecker = new \Espo\Modules\Crm\Classes\Acl\Task\LinkCheckers\AccountLinkChecker($aclManager, $em);

    $parentResult = $parentChecker->check($systemUser, $task, $foreignAccount);
    echo "  ParentLinkChecker->check(systemUser, task, foreignAccount) RETURNED: " . (var_export($parentResult, true)) . "\n";

    $accountResult = $accountChecker->check($systemUser, $task, $foreignAccount);
    echo "  AccountLinkChecker->check(systemUser, task, foreignAccount) RETURNED: " . (var_export($accountResult, true)) . "\n";
} catch (\Throwable $e) {
    echo "  ACL TEST EXCEPTION: " . get_class($e) . ": " . $e->getMessage() . "\n";
}

echo "=== TASK ACL LIVE TEST COMPLETED ===\n";
