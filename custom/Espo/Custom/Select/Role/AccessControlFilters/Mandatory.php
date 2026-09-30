<?php

namespace Espo\Custom\Select\Role\AccessControlFilters;

use Espo\Core\Select\AccessControl\Filter;
use Espo\Entities\User;
use Espo\ORM\Query\SelectBuilder;

class Mandatory implements Filter
{
    public function __construct(
        private User $user
    ) {}

    public function apply(SelectBuilder $queryBuilder): void
    {
        // Admin users must ALWAYS be able to see and select all roles (hidden or visible)
        if ($this->user->isAdmin()) {
            return;
        }

        // Non-admin users must NEVER see hidden roles
        $queryBuilder->where([
            'cIsHidden!=' => true
        ]);
    }
}
