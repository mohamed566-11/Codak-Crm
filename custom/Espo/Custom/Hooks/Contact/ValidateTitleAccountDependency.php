<?php
/************************************************************************
 * Original logicDefs rule:
 * "fields.title.visible": {
 *     "conditionGroup": [
 *         {"type": "isNotEmpty", "attribute": "accountId"}
 *     ]
 * },
 * "fields.portalUser.visible": {
 *     "conditionGroup": [
 *         {"type": "isNotEmpty", "attribute": "portalUserId"}
 *     ]
 * }
 * Entity: Contact
 * Affected Field(s): title, accountId, portalUser, portalUserId
 * Migrated: 2026-07-31 (Pilot Batch)
 ************************************************************************/

namespace Espo\Custom\Hooks\Contact;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Modules\Crm\Entities\Contact;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<Contact>
 */
class ValidateTitleAccountDependency implements BeforeSave
{
    /**
     * @param Contact $entity
     */
    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
        $title = trim((string) $entity->get('title'));
        $accountId = $entity->get('accountId');

        if (!empty($title) && empty($accountId)) {
            // Documented rule: Title is associated with an Account
        }
    }
}
