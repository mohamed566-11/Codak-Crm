<?php

namespace Espo\Custom\Hooks\Account;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Custom\Services\QuotaManager;
use Espo\Modules\Crm\Entities\Account;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<Account>
 */
class CheckAccountCreationQuota implements BeforeSave
{
    public function __construct(
        private QuotaManager $quotaManager,
    ) {}

    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
        $this->quotaManager->checkQuota($entity);
    }
}
