<?php

namespace Espo\Custom\Classes\Acl\User;

use Espo\Core\Acl\AccessEntityCREDSChecker;
use Espo\Core\Acl\DefaultAccessChecker;
use Espo\Core\Acl\Permission;
use Espo\Core\Acl\ScopeData;
use Espo\Core\Acl\Table;
use Espo\Core\Acl\Traits\DefaultAccessCheckerDependency;
use Espo\Core\AclManager;
use Espo\Entities\User;
use Espo\ORM\Entity;

/**
 * Custom AccessChecker for User scope to enable non-admin User creation & editing governed by Role ACL and Quotas.
 * @implements AccessEntityCREDSChecker<User>
 */
class AccessChecker implements AccessEntityCREDSChecker
{
    use DefaultAccessCheckerDependency;

    public function __construct(
        private DefaultAccessChecker $defaultAccessChecker,
        private AclManager $aclManager,
    ) {}

    public function checkEntityCreate(User $user, Entity $entity, ScopeData $data): bool
    {
        if ($user->isAdmin()) {
            return $this->defaultAccessChecker->checkEntityCreate($user, $entity, $data);
        }

        if ($entity instanceof User && $entity->isSuperAdmin() && !$user->isSuperAdmin()) {
            return false;
        }

        return $this->defaultAccessChecker->checkEntityCreate($user, $entity, $data);
    }

    public function checkEntityRead(User $user, Entity $entity, ScopeData $data): bool
    {
        if (!$user->isAdmin() && !$entity->isActive()) {
            return false;
        }

        if ($entity instanceof User && $entity->isSuperAdmin() && !$user->isSuperAdmin()) {
            return false;
        }

        if ($entity instanceof User && $entity->isSystem()) {
            return false;
        }

        if ($entity instanceof User && $entity->isPortal()) {
            return $this->aclManager->getPermissionLevel($user, Permission::PORTAL) === Table::LEVEL_YES;
        }

        return $this->defaultAccessChecker->checkEntityRead($user, $entity, $data);
    }

    public function checkEntityEdit(User $user, Entity $entity, ScopeData $data): bool
    {
        if ($entity instanceof User && $entity->isSystem()) {
            return false;
        }

        if ($entity instanceof User && $entity->isSuperAdmin() && !$user->isSuperAdmin()) {
            return false;
        }

        return $this->defaultAccessChecker->checkEntityEdit($user, $entity, $data);
    }

    public function checkEntityDelete(User $user, Entity $entity, ScopeData $data): bool
    {
        if ($entity instanceof User && $entity->isSystem()) {
            return false;
        }

        if ($entity instanceof User && $entity->isSuperAdmin() && !$user->isSuperAdmin()) {
            return false;
        }

        return $this->defaultAccessChecker->checkEntityDelete($user, $entity, $data);
    }

    public function checkEntityStream(User $user, Entity $entity, ScopeData $data): bool
    {
        return $this->aclManager->checkUserPermission($user, $entity, Permission::USER);
    }
}
