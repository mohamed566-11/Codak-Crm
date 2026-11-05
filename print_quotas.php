<?php
require 'bootstrap.php';
$app = new \Espo\Core\Application();
$em = $app->getContainer()->get('entityManager');
$users = $em->getRepository('User')->find();
foreach ($users as $user) {
    echo "User: " . $user->get('userName') . " (ID: " . $user->getId() . ")\n";
    echo "  Accounts: " . $user->get('cMaxAccountsQuota') . "\n";
    echo "  Leads: " . $user->get('cMaxLeadsQuota') . "\n";
    echo "  Contacts: " . $user->get('cMaxContactsQuota') . "\n";
    echo "  Opps: " . $user->get('cMaxOpportunitiesQuota') . "\n";
    echo "  Users: " . $user->get('cMaxUsersQuota') . "\n";
    echo "  Teams: " . $user->get('cMaxTeamsQuota') . "\n";
    echo "  Properties: " . $user->get('cMaxRealEstatePropertiesQuota') . "\n";
    echo "  Requests: " . $user->get('cMaxRealEstateRequestsQuota') . "\n";
}

