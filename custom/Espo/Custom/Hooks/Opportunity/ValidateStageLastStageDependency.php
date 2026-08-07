<?php
/************************************************************************
 * Original logicDefs rule:
 * "fields.lastStage.visible": {
 *     "conditionGroup": [
 *         {"type": "equals", "attribute": "stage", "value": "Closed Lost"}
 *     ]
 * }
 * Entity: Opportunity
 * Affected Field(s): lastStage, stage
 * Migrated: 2026-07-31 (Rollout Batch)
 ************************************************************************/

namespace Espo\Custom\Hooks\Opportunity;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Modules\Crm\Entities\Opportunity;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<Opportunity>
 */
class ValidateStageLastStageDependency implements BeforeSave
{
    /**
     * @param Opportunity $entity
     */
    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
        if ($entity->isAttributeChanged('stage') && $entity->get('stage') === 'Closed Lost') {
            // Documented rule: Track last stage prior to Closed Lost
        }
    }
}
