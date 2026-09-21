<?php

namespace Espo\Custom\Hooks\Lead;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Custom\Services\QuotaManager;
use Espo\Modules\Crm\Entities\Lead;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<Lead>
 */
class CheckLeadCreationQuota implements BeforeSave
{
    public function __construct(
        private QuotaManager $quotaManager,
    ) {}

    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
        $this->quotaManager->checkQuota($entity);
    }
}
