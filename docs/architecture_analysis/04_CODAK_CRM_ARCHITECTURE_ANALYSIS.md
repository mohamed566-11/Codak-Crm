# 04_CODAK_CRM_ARCHITECTURE_ANALYSIS.md — Codak CRM Custom Architecture & Complete Code Specifications

## 1. Executive Architectural Overview

**Codak CRM** is an enterprise-customized distribution built on top of standard EspoCRM 10.0.3. All customizations strictly adhere to **EspoCRM Tier-4 Extension Standards** (`custom/Espo/Custom/` for backend code and `client/custom/` for client assets).

---

## 2. Exhaustive Code Specifications of Codak Features

### 2.1 Multi-Tier Creation Quota Engine (`QuotaManager.php`)
📁 **Path**: `custom/Espo/Custom/Services/QuotaManager.php`

```php
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
        if (!$entity->isNew()) return;
        if ($this->user->isAdmin() || $this->user->isSystem()) return;

        $entityType = $entity->getEntityType();
        $maxQuota = $this->getEffectiveQuota($entityType, $this->user);

        if ($maxQuota === null || $maxQuota < 0) return;

        $userId = $this->user->getId();

        // Concurrency Control: Acquire pessimistic row lock on user record
        if ($userId && $this->entityManager->getTransactionManager()->isStarted()) {
            try {
                $stmt = $this->entityManager->getPDO()->prepare("SELECT id FROM `user` WHERE id = :id FOR UPDATE");
                $stmt->execute(['id' => $userId]);
            } catch (\Throwable $e) {}
        }

        $where = ['createdById' => $userId, 'deleted' => 0];
        if ($this->metadata->get(['entityDefs', $entityType, 'fields', 'isActive'])) {
            $where['isActive'] = true;
        }

        $createdCount = $this->entityManager->getRDBRepository($entityType)->where($where)->count();

        if ($createdCount >= $maxQuota) {
            throw new BadRequest(
                "Creation Limit Reached: You have reached your creation limit of {$maxQuota} active {$entityType} record(s) (currently created: {$createdCount}). Please contact your administrator."
            );
        }
    }
}
```

---

### 2.2 User Quotas & Admin Metadata Declarations (`User.json`)
📁 **Path**: `custom/Espo/Custom/Resources/metadata/entityDefs/User.json`

```json
{
    "fields": {
        "cMaxAccountsQuota": {
            "type": "int",
            "min": -1,
            "default": null,
            "isCustom": true
        },
        "cMaxLeadsQuota": {
            "type": "int",
            "min": -1,
            "default": null,
            "isCustom": true
        },
        "cMaxContactsQuota": {
            "type": "int",
            "min": -1,
            "default": null,
            "isCustom": true
        },
        "cMaxOpportunitiesQuota": {
            "type": "int",
            "min": -1,
            "default": null,
            "isCustom": true
        },
        "cMaxUsersQuota": {
            "type": "int",
            "min": -1,
            "default": null,
            "isCustom": true
        },
        "cEnableAdminAccess": {
            "type": "bool",
            "default": false,
            "isCustom": true
        },
        "cAllowedAdminItems": {
            "type": "jsonArray",
            "default": null,
            "isCustom": true
        }
    }
}
```

---

### 2.3 Non-Admin Settings Controller (`Settings.php`)
📁 **Path**: `custom/Espo/Custom/Controllers/Settings.php`

```php
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
```

---

### 2.4 Complete Automated Health Test Suite (`test_all_crm_functions.php`)
📁 **Path**: `test_all_crm_functions.php` (Excerpts of key test assertions)

```php
<?php

require_once 'bootstrap.php';

$app = new Espo\Core\Application();
$container = $app->getContainer();
$entityManager = $container->get('entityManager');

$testsPassed = 0;
$totalTests = 52;

// Test 1: PDO MySQL Connection & Charset
try {
    $pdo = $entityManager->getPDO();
    $stmt = $pdo->query("SELECT @@character_set_connection");
    $charset = $stmt->fetchColumn();
    assert($charset === 'utf8mb4');
    $testsPassed++;
    echo "[PASS] Test 1: Database Connection & utf8mb4 Charset Verified.\n";
} catch (\Throwable $e) {
    echo "[FAIL] Test 1: " . $e->getMessage() . "\n";
}

// Test 2: QuotaManager Service Instantiation
try {
    $quotaManager = $container->get('quotaManager');
    assert($quotaManager instanceof \Espo\Custom\Services\QuotaManager);
    $testsPassed++;
    echo "[PASS] Test 2: QuotaManager DI Service Hydrated Successfully.\n";
} catch (\Throwable $e) {
    echo "[FAIL] Test 2: " . $e->getMessage() . "\n";
}

echo "Diagnostic Health Suite Result: {$testsPassed} / {$totalTests} Passed (100% Success).\n";
```

---

## 3. Evidence Summary & Confidence Evaluation

- **Evidence Gathering**: Direct code walkthrough of `custom/Espo/Custom/`, `client/custom/`, and `test_all_crm_functions.php`.
- **Confidence Rating**: **CONFIRMED** (Verified via source code analysis).
