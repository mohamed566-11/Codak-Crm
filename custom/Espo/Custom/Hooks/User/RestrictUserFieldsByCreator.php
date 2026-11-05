<?php

namespace Espo\Custom\Hooks\User;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Entities\User;
use Espo\ORM\Entity;
use Espo\ORM\EntityManager;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * Restricts which fields a non-admin user with 'users' in cAllowedAdminItems
 * can set when creating or editing users they own.
 *
 * Rules:
 * - Users with 'users' in cAllowedAdminItems (or cEnableAdminAccess) may set:
 *   - isActive
 *   - teams
 *   - defaultTeam
 *   - roles (limited to visible roles, matching Team behavior: cIsHidden != true)
 * - Non-authorized actors have these controlled fields reverted to original/safe values.
 *
 * @implements BeforeSave<User>
 */
class RestrictUserFieldsByCreator implements BeforeSave
{
    public const PRIORITY = 9;

    public function __construct(
        private EntityManager $entityManager,
        private ?User $user = null,
    ) {}

    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
        // Skip entirely for admins — they have full control.
        if (!$this->user || $this->user->isAdmin()) {
            return;
        }

        $actor = $this->user;

        $allowedItems = $actor->get('cAllowedAdminItems') ?? [];
        $hasUsersPermission = in_array('users', (array) $allowedItems, true)
            || (bool) $actor->get('cEnableAdminAccess');

        $isOwnRecord = $entity->isNew()
            || $entity->get('createdById') === $actor->getId();

        // ── Case 1: actor has user management permission AND it's their own record ──
        if ($hasUsersPermission && $isOwnRecord) {
            $this->enforceRolesRestriction($entity);
            return;
        }

        // ── Case 2: actor does NOT have permission to manage users ──
        $this->revertControlledFields($entity);
    }

    /**
     * Ensure non-admin creator cannot assign hidden roles (cIsHidden == true),
     * matching the behavior inside the Team module.
     */
    private function enforceRolesRestriction(Entity $entity): void
    {
        $rolesIds = $entity->get('rolesIds');

        if (empty($rolesIds) || !is_array($rolesIds)) {
            return;
        }

        // Query hidden roles among the selected role IDs
        $hiddenRoles = $this->entityManager
            ->getRDBRepository('Role')
            ->where([
                'id' => $rolesIds,
                'cIsHidden' => true,
            ])
            ->find();

        $hiddenRoleIds = [];
        foreach ($hiddenRoles as $role) {
            $hiddenRoleIds[] = $role->getId();
        }

        if (!empty($hiddenRoleIds)) {
            $filteredRoleIds = array_values(
                array_filter($rolesIds, fn($id) => !in_array($id, $hiddenRoleIds, true))
            );

            $entity->set('rolesIds', $filteredRoleIds);

            $rolesNames = $entity->get('rolesNames') ?? (object) [];
            $filteredNames = (object) [];
            foreach ($filteredRoleIds as $id) {
                if (isset($rolesNames->$id)) {
                    $filteredNames->$id = $rolesNames->$id;
                }
            }
            $entity->set('rolesNames', $filteredNames);
        }
    }

    /**
     * Revert isActive, teams, defaultTeam, roles to their stored (original) values
     * so an unauthorized user cannot tamper with them.
     */
    private function revertControlledFields(Entity $entity): void
    {
        if ($entity->isNew()) {
            $entity->set('isActive', true);
            $entity->set('teamsIds', []);
            $entity->set('teamsNames', (object) []);
            $entity->set('defaultTeamId', null);
            $entity->set('defaultTeamName', null);
            $entity->set('rolesIds', []);
            $entity->set('rolesNames', (object) []);
            return;
        }

        /** @var User|null $original */
        $original = $this->entityManager->getEntityById('User', $entity->getId());

        if (!$original) {
            return;
        }

        $entity->set('isActive', $original->get('isActive'));
        $entity->set('teamsIds', $original->get('teamsIds') ?? []);
        $entity->set('teamsNames', $original->get('teamsNames') ?? (object) []);
        $entity->set('defaultTeamId', $original->get('defaultTeamId'));
        $entity->set('defaultTeamName', $original->get('defaultTeamName'));
        $entity->set('rolesIds', $original->get('rolesIds') ?? []);
        $entity->set('rolesNames', $original->get('rolesNames') ?? (object) []);
    }
}
