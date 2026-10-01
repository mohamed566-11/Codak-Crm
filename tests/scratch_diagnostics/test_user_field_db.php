<?php
require_once 'bootstrap.php';

try {
    $app = new \Espo\Core\Application();
    $container = $app->getContainer();
    $entityManager = $container->get('entityManager');

    $user = $entityManager->getRDBRepository('User')->findOne();
    if ($user) {
        $container->set('user', $user);
        $userId = $user->get('id');
        echo "Found user ID: " . $userId . ", Name: " . $user->get('name') . "\n";

        $user->set('cAllowedDashboardSections', [
            'overview', 'leads', 'opportunities'
        ]);
        $entityManager->saveEntity($user);
        echo "Saved User Allowed Sections: " . json_encode($user->get('cAllowedDashboardSections')) . "\n";

        // Re-fetch from DB to verify persistence
        $userRefetched = $entityManager->getEntity('User', $userId);
        echo "Refetched from DB: " . json_encode($userRefetched->get('cAllowedDashboardSections')) . "\n";

        // Restore default all 7
        $user->set('cAllowedDashboardSections', [
            'overview', 'leads', 'opportunities', 'accounts', 'contacts', 'emails', 'meetings'
        ]);
        $entityManager->saveEntity($user);
        echo "Restored User Allowed Sections: " . json_encode($user->get('cAllowedDashboardSections')) . "\n";
    }
} catch (\Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
}
