<?php
/************************************************************************
 * Original logicDefs rule:
 * "fields.dateCompleted.visible": {
 *     "conditionGroup": [
 *         {"type": "equals", "attribute": "status", "value": "Completed"}
 *     ]
 * }
 * Entity: Task
 * Affected Field(s): dateCompleted, status
 * Migrated: 2026-07-31 (Rollout Batch)
 ************************************************************************/

namespace Espo\Custom\Hooks\Task;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Modules\Crm\Entities\Task;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<Task>
 */
class ValidateTaskDateCompletedVisibility implements BeforeSave
{
    /**
     * @param Task $entity
     */
    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
    }
}
