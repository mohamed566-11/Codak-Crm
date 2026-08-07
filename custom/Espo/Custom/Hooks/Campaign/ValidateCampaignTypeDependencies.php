<?php
/************************************************************************
 * Original logicDefs rules:
 * "fields.targetLists.visible", "fields.excludingTargetLists.visible",
 * "fields.contactsTemplate.visible", "fields.leadsTemplate.visible",
 * "fields.accountsTemplate.visible", "fields.usersTemplate.visible",
 * "fields.mailMergeOnlyWithAddress.visible", "panels.massEmails.visible",
 * "panels.trackingUrls.visible", "panels.mailMerge.visible"
 * Entity: Campaign
 * Affected Field(s): type, targetLists, excludingTargetLists, templates, panels
 * Migrated: 2026-07-31 (Rollout Batch)
 ************************************************************************/

namespace Espo\Custom\Hooks\Campaign;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Modules\Crm\Entities\Campaign;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<Campaign>
 */
class ValidateCampaignTypeDependencies implements BeforeSave
{
    /**
     * @param Campaign $entity
     */
    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
    }
}
