<?php

namespace Espo\Custom\Classes\Acl\Team;

use Espo\Core\Acl\OwnershipOwnChecker;
use Espo\Core\Name\Field;
use Espo\Entities\Team;
use Espo\Entities\User;
use Espo\ORM\Entity;

/**
 * Custom OwnershipChecker for Team scope to allow team creators and team members to edit/delete teams.
 * @implements OwnershipOwnChecker<Team>
 */
class OwnershipChecker implements OwnershipOwnChecker
{
    public function checkOwn(User $user, Entity $entity): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($entity->get('createdById') && $entity->get('createdById') === $user->getId()) {
            return true;
        }

        $userTeamIdList = $user->getLinkMultipleIdList(Field::TEAMS);

        return in_array($entity->getId(), $userTeamIdList);
    }
}
