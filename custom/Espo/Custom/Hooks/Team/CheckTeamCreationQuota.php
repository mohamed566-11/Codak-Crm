<?php

namespace Espo\Custom\Hooks\Team;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Custom\Services\QuotaManager;
use Espo\Entities\Team;
use Espo\Entities\User;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<Team>
 */
class CheckTeamCreationQuota implements BeforeSave
{
    public function __construct(
        private QuotaManager $quotaManager,
        private ?User $user = null,
    ) {}

    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
        $this->quotaManager->checkQuota($entity);

        if ($entity->isNew() && $this->user && $this->user->getId()) {
            if (!$entity->get('createdById')) {
                $entity->set('createdById', $this->user->getId());
            }

            $currentUsers = $entity->getLinkMultipleIdList('users') ?? [];
            if (!in_array($this->user->getId(), $currentUsers, true)) {
                $entity->addLinkMultipleId('users', $this->user->getId());
            }
        }
    }
}
