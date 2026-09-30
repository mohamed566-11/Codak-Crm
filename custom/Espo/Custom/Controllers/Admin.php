<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Exceptions\Forbidden;
use Espo\Core\Container;
use Espo\Core\DataManager;
use Espo\Core\Utils\Config;
use Espo\Tools\AdminNotifications\Manager;
use Espo\Core\Utils\SystemRequirements;
use Espo\Core\Utils\ScheduledJob;
use Espo\Core\Api\Request;
use Espo\Entities\User;
use ReflectionClass;
use stdClass;

class Admin extends \Espo\Controllers\Admin
{
    public function __construct(
        private Container $container,
        private Config $config,
        private User $user,
        private Manager $adminNotificationManager,
        private SystemRequirements $systemRequirements,
        private ScheduledJob $scheduledJob,
        private DataManager $dataManager,
        private Config\SystemConfig $systemConfig,
    ) {
        if (!$this->user->isAdmin() && !$this->user->get('cEnableAdminAccess')) {
            throw new Forbidden();
        }

        if ($this->user->isAdmin()) {
            parent::__construct(
                $container,
                $config,
                $user,
                $adminNotificationManager,
                $systemRequirements,
                $scheduledJob,
                $dataManager,
                $systemConfig
            );
        } else {
            $parentClass = new ReflectionClass(\Espo\Controllers\Admin::class);
            $properties = [
                'container' => $container,
                'config' => $config,
                'user' => $user,
                'adminNotificationManager' => $adminNotificationManager,
                'systemRequirements' => $systemRequirements,
                'scheduledJob' => $scheduledJob,
                'dataManager' => $dataManager,
                'systemConfig' => $systemConfig,
            ];
            foreach ($properties as $name => $value) {
                if ($parentClass->hasProperty($name)) {
                    $prop = $parentClass->getProperty($name);
                    $prop->setValue($this, $value);
                }
            }
        }
    }

    /**
     * Choke-point guard executed by ControllerActionProcessor before any action method.
     * Enforces granular section permissions across ALL action methods (including inherited parent actions).
     */
    public function beforeAction(string $actionName): void
    {
        if ($this->user->isAdmin()) {
            return;
        }

        if (!$this->user->get('cEnableAdminAccess')) {
            throw new Forbidden("Access denied to Administration.");
        }

        // Map of action methods to required cAllowedAdminItems section keys
        $actionSectionMap = [
            'rebuild' => 'rebuild',
            'clearCache' => 'clearCache',
            'jobs' => 'scheduledJob',
            'cronMessage' => 'scheduledJob',
            'systemRequirementList' => 'systemRequirements',
            'adminNotificationList' => 'notifications',
            'analyticsDashboardSettings' => 'analyticsDashboardSettings',
        ];

        // Actions strictly restricted to full super-admins
        $adminOnlyActions = [
            'uploadUpgradePackage',
            'runUpgrade',
        ];

        if (in_array($actionName, $adminOnlyActions, true)) {
            throw new Forbidden("Access denied: Action '{$actionName}' is restricted to full administrators.");
        }

        $requiredSection = $actionSectionMap[$actionName] ?? null;

        if (!$requiredSection) {
            // Default Deny for unmapped or unknown administration actions
            throw new Forbidden("Access denied: Action '{$actionName}' is not authorized for partial administrators.");
        }

        $allowedItems = $this->user->get('cAllowedAdminItems') ?? [];
        if (!in_array($requiredSection, $allowedItems, true)) {
            throw new Forbidden("Access denied: You do not have permission for administration section '{$requiredSection}'.");
        }
    }

    public function getActionAdminNotificationList(): array
    {
        if ($this->user->isAdmin()) {
            return parent::getActionAdminNotificationList();
        }
        return [];
    }

    public function postActionRebuild(): bool
    {
        $this->checkActionAccess('rebuild');
        return parent::postActionRebuild();
    }

    public function postActionClearCache(): bool
    {
        $this->checkActionAccess('clearCache');
        return parent::postActionClearCache();
    }

    public function getActionJobs(): array
    {
        $this->checkActionAccess('scheduledJob');
        return parent::getActionJobs();
    }

    public function getActionCronMessage(): object
    {
        $this->checkActionAccess('scheduledJob');
        return parent::getActionCronMessage();
    }

    public function getActionSystemRequirementList(): object
    {
        $this->checkActionAccess('systemRequirements');
        return parent::getActionSystemRequirementList();
    }

    public function postActionUploadUpgradePackage(Request $request): object
    {
        if (!$this->user->isAdmin()) {
            throw new Forbidden("Upgrade package upload is restricted to administrators.");
        }
        return parent::postActionUploadUpgradePackage($request);
    }

    public function postActionRunUpgrade(Request $request): bool
    {
        if (!$this->user->isAdmin()) {
            throw new Forbidden("Upgrade installation is restricted to administrators.");
        }
        return parent::postActionRunUpgrade($request);
    }

    /**
     * Default-deny catch-all for any unmapped or inherited action methods invoked on Admin controller.
     */
    public function __call(string $name, array $arguments)
    {
        if ($this->user->isAdmin()) {
            if (method_exists(parent::class, $name)) {
                return parent::$name(...$arguments);
            }
        }

        throw new Forbidden("Access denied: Unrecognized or unauthorized administration action ('{$name}').");
    }

    private function checkActionAccess(string $itemKey): void
    {
        if ($this->user->isAdmin()) {
            return;
        }

        $allowedItems = $this->user->get('cAllowedAdminItems') ?? [];
        if (!in_array($itemKey, $allowedItems, true)) {
            throw new Forbidden("Access denied: You do not have permission to perform this administration action ({$itemKey}).");
        }
    }
}
