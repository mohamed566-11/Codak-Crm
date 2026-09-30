<?php

namespace Espo\Custom\Classes\Acl\LayoutSet;

use Espo\Core\Acl\AccessChecker as AccessCheckerInterface;
use Espo\Core\Acl\AccessCreateChecker;
use Espo\Core\Acl\AccessDeleteChecker;
use Espo\Core\Acl\AccessEditChecker;
use Espo\Core\Acl\AccessEntityCreateChecker;
use Espo\Core\Acl\AccessEntityDeleteChecker;
use Espo\Core\Acl\AccessEntityEditChecker;
use Espo\Core\Acl\AccessEntityReadChecker;
use Espo\Core\Acl\AccessEntityStreamChecker;
use Espo\Core\Acl\AccessReadChecker;
use Espo\Core\Acl\AccessStreamChecker;
use Espo\Core\Acl\DefaultAccessChecker;
use Espo\Core\Acl\ScopeData;
use Espo\Core\Acl\Traits\DefaultAccessCheckerDependency;
use Espo\Entities\User;
use Espo\ORM\Entity;

class AccessChecker implements
    AccessCheckerInterface,
    AccessCreateChecker,
    AccessReadChecker,
    AccessEditChecker,
    AccessDeleteChecker,
    AccessStreamChecker,
    AccessEntityCreateChecker,
    AccessEntityReadChecker,
    AccessEntityEditChecker,
    AccessEntityDeleteChecker,
    AccessEntityStreamChecker
{
    use DefaultAccessCheckerDependency;

    public function __construct(
        private DefaultAccessChecker $defaultAccessChecker,
    ) {}

    public function check(User $user, ScopeData $data): bool
    {
        return true;
    }

    public function checkCreate(User $user, ScopeData $data): bool
    {
        return $user->isAdmin();
    }

    public function checkRead(User $user, ScopeData $data): bool
    {
        return true;
    }

    public function checkEdit(User $user, ScopeData $data): bool
    {
        return $user->isAdmin();
    }

    public function checkDelete(User $user, ScopeData $data): bool
    {
        return $user->isAdmin();
    }

    public function checkStream(User $user, ScopeData $data): bool
    {
        return $user->isAdmin();
    }

    public function checkEntityCreate(User $user, Entity $entity, ScopeData $data): bool
    {
        return $user->isAdmin();
    }

    public function checkEntityRead(User $user, Entity $entity, ScopeData $data): bool
    {
        return true;
    }

    public function checkEntityEdit(User $user, Entity $entity, ScopeData $data): bool
    {
        return $user->isAdmin();
    }

    public function checkEntityDelete(User $user, Entity $entity, ScopeData $data): bool
    {
        return $user->isAdmin();
    }

    public function checkEntityStream(User $user, Entity $entity, ScopeData $data): bool
    {
        return $user->isAdmin();
    }
}
