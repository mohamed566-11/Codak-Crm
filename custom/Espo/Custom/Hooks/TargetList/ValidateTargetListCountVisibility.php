<?php
/************************************************************************
 * Original logicDefs rule:
 * "fields.entryCount.visible": {
 *     "conditionGroup": [
 *         {"type": "isNotEmpty", "attribute": "id"}
 *     ]
 * },
 * "fields.optedOutCount.visible": {
 *     "conditionGroup": [
 *         {"type": "isNotEmpty", "attribute": "id"}
 *     ]
 * }
 * Entity: TargetList
 * Affected Field(s): entryCount, optedOutCount, id
 * Migrated: 2026-07-31 (Rollout Batch)
 ************************************************************************/

namespace Espo\Custom\Hooks\TargetList;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Modules\Crm\Entities\TargetList;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<TargetList>
 */
class ValidateTargetListCountVisibility implements BeforeSave
{
    /**
     * @param TargetList $entity
     */
    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
    }
}
