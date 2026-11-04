<?php

namespace Espo\Custom\Hooks\RealEstateProperty;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Custom\Services\QuotaManager;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<Entity>
 */
class CheckRealEstatePropertyCreationQuota implements BeforeSave
{
    public function __construct(
        private QuotaManager $quotaManager,
    ) {}

    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
        $this->quotaManager->checkQuota($entity);
    }
}
