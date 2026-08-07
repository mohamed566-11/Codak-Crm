<?php
/************************************************************************
 * Original logicDefs rule:
 * "fields.duration.readOnly": {
 *     "conditionGroup": [
 *         {"type": "isTrue", "attribute": "isAllDay"}
 *     ]
 * }
 * Entity: Meeting
 * Affected Field(s): duration, isAllDay
 * Migrated: 2026-07-31 (Rollout Batch)
 ************************************************************************/

namespace Espo\Custom\Hooks\Meeting;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Modules\Crm\Entities\Meeting;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<Meeting>
 */
class ValidateMeetingAllDayDuration implements BeforeSave
{
    /**
     * @param Meeting $entity
     */
    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
    }
}
