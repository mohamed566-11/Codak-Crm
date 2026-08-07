<?php
/************************************************************************
 * Original logicDefs rule:
 * "fields.name.required": {
 *     "conditionGroup": [
 *         {"type": "isEmpty", "attribute": "accountName"},
 *         {"type": "isEmpty", "attribute": "emailAddress"},
 *         {"type": "isEmpty", "attribute": "phoneNumber"}
 *     ]
 * }
 * Entity: Lead
 * Affected Field(s): name, firstName, lastName, accountName, emailAddress, phoneNumber
 * Migrated: 2026-07-31 (Pilot Batch)
 ************************************************************************/

namespace Espo\Custom\Hooks\Lead;

use Espo\Core\Exceptions\BadRequest;
use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Modules\Crm\Entities\Lead;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<Lead>
 */
class RequireNameIfContactInfoEmpty implements BeforeSave
{
    /**
     * @param Lead $entity
     */
    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
        $name = trim((string) $entity->get('name'));
        $firstName = trim((string) $entity->get('firstName'));
        $lastName = trim((string) $entity->get('lastName'));
        $accountName = trim((string) $entity->get('accountName'));
        $emailAddress = trim((string) $entity->get('emailAddress'));
        $phoneNumber = trim((string) $entity->get('phoneNumber'));

        $isNameEmpty = empty($name) && empty($firstName) && empty($lastName);
        $isAccountEmpty = empty($accountName);
        $isEmailEmpty = empty($emailAddress);
        $isPhoneEmpty = empty($phoneNumber);

        if ($isNameEmpty && $isAccountEmpty && $isEmailEmpty && $isPhoneEmpty) {
            throw new BadRequest('Name is required if Account Name, Email Address, and Phone Number are all empty.');
        }
    }
}
