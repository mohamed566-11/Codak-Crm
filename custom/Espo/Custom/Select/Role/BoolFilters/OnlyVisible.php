<?php

namespace Espo\Custom\Select\Role\BoolFilters;

use Espo\Core\Select\Bool\Filter;
use Espo\ORM\Query\Part\Where\OrGroupBuilder;
use Espo\ORM\Query\Part\WhereClause;

use Espo\Entities\User;

class OnlyVisible implements Filter
{
    public function __construct(
        private User $user
    ) {}

    public function apply($queryBuilder, OrGroupBuilder $orGroupBuilder): void
    {
        // Admin users must see all roles even if onlyVisible filter is requested
        if ($this->user->isAdmin()) {
            return;
        }

        $orGroupBuilder->add(
            WhereClause::fromRaw(['cIsHidden!=' => true])
        );
    }
}
