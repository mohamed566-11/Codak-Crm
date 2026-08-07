<?php
/************************************************************************
 * Original logicDefs rule:
 * "fields.number.visible": {
 *     "conditionGroup": [
 *         {"type": "isNotEmpty", "attribute": "id"}
 *     ]
 * }
 * Entity: Case
 * Affected Field(s): number, id
 * Migrated: 2026-07-31 (Rollout Batch)
 ************************************************************************/

namespace Espo\Custom\Hooks\Case;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Modules\Crm\Entities\CaseObj;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<CaseObj>
 */
class ValidateCaseNumberVisibility implements BeforeSave
{
    /**
     * @param CaseObj $entity
     */
    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
    }
}
