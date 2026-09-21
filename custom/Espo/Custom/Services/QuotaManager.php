<?php

namespace Espo\Custom\Services;

use Espo\Core\Exceptions\BadRequest;
use Espo\Core\Utils\Metadata;
use Espo\Entities\User;
use Espo\ORM\Entity;
use Espo\ORM\EntityManager;

class QuotaManager
{
    private const FIELD_MAP = [
        'Account' => 'cMaxAccountsQuota',
        'Lead' => 'cMaxLeadsQuota',
        'Contact' => 'cMaxContactsQuota',
        'Opportunity' => 'cMaxOpportunitiesQuota',
        'User' => 'cMaxUsersQuota',
    ];

    public function __construct(
        private Metadata $metadata,
        private EntityManager $entityManager,
        private User $user,
    ) {}

    public function checkQuota(Entity $entity): void
    {
        if (!$entity->isNew()) {
            return;
        }

        if ($this->user->isAdmin() || $this->user->isSystem()) {
            return;
        }

        $entityType = $entity->getEntityType();
        $maxQuota = $this->getEffectiveQuota($entityType, $this->user);

        if ($maxQuota === null || $maxQuota < 0) {
            return;
        }

        $userId = $this->user->getId();

        // Concurrency Control: Acquire pessimistic FOR UPDATE row lock on creating user record to serialize concurrent checks
        if ($userId && $this->entityManager->getTransactionManager()->isStarted()) {
            try {
                $stmt = $this->entityManager->getPDO()->prepare("SELECT id FROM `user` WHERE id = :id FOR UPDATE");
                $stmt->execute(['id' => $userId]);
            } catch (\Throwable $e) {
                // Fallback gracefully if locking is unsupported in specific test mock environments
            }
        }

        $where = [
            'createdById' => $userId,
            'deleted' => 0,
        ];

        if ($this->metadata->get(['entityDefs', $entityType, 'fields', 'isActive'])) {
            $where['isActive'] = true;
        }

        $createdCount = $this->entityManager
            ->getRDBRepository($entityType)
            ->where($where)
            ->count();

        if ($createdCount >= $maxQuota) {
            throw new BadRequest(
                "Creation Limit Reached: You have reached your creation limit of {$maxQuota} active {$entityType} record(s) (currently created: {$createdCount}). Please contact your administrator."
            );
        }
    }

    public function getEffectiveQuota(string $entityType, User $user): ?int
    {
        // Level 1: Direct User Quota Override
        $fieldName = self::FIELD_MAP[$entityType] ?? ('cMax' . $entityType . 'sQuota');
        
        $userVal = $user->get($fieldName);
        if ($userVal !== null && $userVal !== '') {
            return (int) $userVal;
        }

        // Level 2: Role Quotas Matrix
        $roleIdList = $user->getLinkMultipleIdList('roles');
        if (!empty($roleIdList)) {
            $roleQuotas = $this->metadata->get(['app', 'creationQuotas', 'roles']) ?? [];
            $highestQuota = null;
            $unlimitedFound = false;

            foreach ($roleIdList as $roleId) {
                if (isset($roleQuotas[$roleId][$entityType])) {
                    $roleVal = (int) $roleQuotas[$roleId][$entityType];
                    if ($roleVal < 0) {
                        $unlimitedFound = true;
                        break;
                    }
                    if ($highestQuota === null || $roleVal > $highestQuota) {
                        $highestQuota = $roleVal;
                    }
                }
            }

            if ($unlimitedFound) {
                return -1;
            }

            if ($highestQuota !== null) {
                return $highestQuota;
            }
        }

        // Level 3: Global System Quota Default
        $defaultQuota = $this->metadata->get(['app', 'creationQuotas', 'default', $entityType]);
        if ($defaultQuota !== null && $defaultQuota !== '') {
            return (int) $defaultQuota;
        }

        return -1; // Fallback: unlimited
    }
}
