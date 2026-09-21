<?php

namespace Espo\Custom\Hooks\User;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Custom\Services\QuotaManager;
use Espo\Entities\User;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<User>
 */
class CheckUserCreationQuota implements BeforeSave
{
    public function __construct(
        private QuotaManager $quotaManager,
        private ?User $user = null,
    ) {}

    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
        $this->quotaManager->checkQuota($entity);

        $isAdmin = $this->user ? $this->user->isAdmin() : false;

        if ($entity->isNew() && !$isAdmin) {
            if ($entity->get('cMaxAccountsQuota') === null) {
                $entity->set('cMaxAccountsQuota', 5);
            }
            if ($entity->get('cMaxLeadsQuota') === null) {
                $entity->set('cMaxLeadsQuota', 5);
            }
            if ($entity->get('cMaxContactsQuota') === null) {
                $entity->set('cMaxContactsQuota', 5);
            }
            if ($entity->get('cMaxOpportunitiesQuota') === null) {
                $entity->set('cMaxOpportunitiesQuota', 5);
            }
            if ($entity->get('cMaxUsersQuota') === null) {
                $entity->set('cMaxUsersQuota', 5);
            }
            if ($entity->get('cEnableAdminAccess') === null) {
                $entity->set('cEnableAdminAccess', false);
            }
            if ($entity->get('cAllowedAdminItems') === null) {
                $entity->set('cAllowedAdminItems', []);
            }
        }
    }
}


