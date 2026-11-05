<?php

namespace Espo\Custom\Classes\Acl\User;

use Espo\Core\Acl\AssignmentChecker as AssignmentCheckerInterface;
use Espo\Core\Acl\DefaultAssignmentChecker;
use Espo\Entities\User;
use Espo\ORM\Entity;

/**
 * Custom AssignmentChecker for User scope.
 *
 * Allows users with user-creation/management permission (such as 'users' in
 * cAllowedAdminItems or cEnableAdminAccess) to assign teams and default team
 * to users they create or edit.
 *
 * @implements AssignmentCheckerInterface<User>
 */
class AssignmentChecker implements AssignmentCheckerInterface
{
    public function __construct(
        private DefaultAssignmentChecker $defaultAssignmentChecker,
    ) {}

    public function check(User $user, Entity $entity): bool
    {
        // Admin has full assignment permissions
        if ($user->isAdmin()) {
            return true;
        }

        $allowedItems = $user->get('cAllowedAdminItems') ?? [];
        $hasUsersPermission = in_array('users', (array) $allowedItems, true);

        // If the user has permission to manage users, allow team assignment
        // for new users or records they own / created
        if ($hasUsersPermission || $user->get('cEnableAdminAccess')) {
            $isOwn = $entity->isNew() || $entity->get('createdById') === $user->getId();
            if ($isOwn) {
                return true;
            }
        }

        return $this->defaultAssignmentChecker->check($user, $entity);
    }
}

