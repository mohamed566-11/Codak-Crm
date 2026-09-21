<?php

namespace Espo\Custom\Controllers;

use Espo\Core\Exceptions\Forbidden;
use Espo\Core\Api\Request;
use Espo\Tools\App\SettingsService as Service;
use Espo\Entities\User;
use Espo\Core\Utils\Config\ConfigWriter;
use Espo\Core\DataManager;
use stdClass;

class Settings extends \Espo\Controllers\Settings
{
    /**
     * Explicit whitelist of configuration keys that non-admin users with granular "settings" access
     * are permitted to modify. All sensitive authentication, security, user, role, 2FA, system, and
     * administration configuration parameters are strictly excluded.
     */
    private const NON_ADMIN_ALLOWED_SETTINGS_WHITELIST = [
        'recordsPerPage',
        'recordsPerPageSmall',
        'recordsPerPageSelect',
        'recordsPerPageKanban',
        'dateFormat',
        'timeFormat',
        'timeZone',
        'weekStart',
        'defaultCurrency',
        'thousandSeparator',
        'decimalMark',
        'currencyFormat',
        'companyLogo',
        'theme',
    ];

    public function __construct(
        private Service $service,
        private User $user,
        private ConfigWriter $configWriter,
        private DataManager $dataManager,
    ) {
        parent::__construct($service, $user);

        if (!$this->user->isAdmin()) {
            $allowedItems = $this->user->get('cAllowedAdminItems') ?? [];
            if (!$this->user->get('cEnableAdminAccess') || !in_array('settings', $allowedItems, true)) {
                throw new Forbidden();
            }
        }
    }

    public function putActionUpdate(Request $request): stdClass
    {
        if (!$this->user->isAdmin()) {
            $allowedItems = $this->user->get('cAllowedAdminItems') ?? [];
            if (!$this->user->get('cEnableAdminAccess') || !in_array('settings', $allowedItems, true)) {
                throw new Forbidden();
            }
        }

        $data = $request->getParsedBody();

        if ($this->user->isAdmin()) {
            $this->service->setConfigData($data);
        } else {
            $filteredData = (object) [];
            if (is_object($data) || is_array($data)) {
                foreach ((array) $data as $key => $value) {
                    if (in_array($key, self::NON_ADMIN_ALLOWED_SETTINGS_WHITELIST, true)) {
                        $filteredData->$key = $value;
                    }
                }
            }

            $vars = get_object_vars($filteredData);
            if (!empty($vars)) {
                $this->configWriter->setMultiple($vars);
                $this->configWriter->save();
                $this->dataManager->clearCache();
            }
        }

        return $this->service->getConfigData();
    }
}
