<?php
require_once 'bootstrap.php';

$app = new \Espo\Core\Application();
$app->setupSystemUser();
$container = $app->getContainer();
$em = $container->get('entityManager');

echo "=== MEETING ACL ACCESSCHECKER LIVE EXPLICIT TEST ===\n";

try {
    $meeting = $em->getNewEntity('Meeting');
    $meeting->set('name', 'Strategy Briefing');

    $user = $em->getNewEntity('User');
    $user->set('id', 'regular_attendee_456');

    $accessCheckerClass = 'Espo\\Modules\\Crm\\Classes\\Acl\\Meeting\\AccessChecker';

    $defaultAccessChecker = new class extends \Espo\Core\Acl\DefaultAccessChecker {
        public function __construct() {}
        public function checkEntityRead(\Espo\Entities\User $user, \Espo\ORM\Entity $entity, \Espo\Core\Acl\ScopeData $data): bool {
            return false;
        }
    };

    $raw = (object) ['read' => 'own'];
    $scopeData = \Espo\Core\Acl\ScopeData::fromRaw($raw);

    $checker = new $accessCheckerClass($defaultAccessChecker);

    $canReadA = $checker->checkEntityRead($user, $meeting, $scopeData);
    echo "  Scenario A (User NOT in attendees linkMultiple): checkEntityRead() RETURNED: " . (var_export($canReadA, true)) . " (DENIED)\n";

    $meeting->set('usersIds', ['regular_attendee_456']);
    $canReadB = $checker->checkEntityRead($user, $meeting, $scopeData);
    echo "  Scenario B (User IS added to attendees linkMultiple): checkEntityRead() RETURNED: " . (var_export($canReadB, true)) . " (ALLOWED)\n";
} catch (\Throwable $e) {
    echo "  EXCEPT: " . get_class($e) . ": " . $e->getMessage() . "\n";
}

echo "=== MEETING ACL LIVE TEST COMPLETED ===\n";
