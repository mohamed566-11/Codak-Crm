# 06_FILE_BY_FILE_MIGRATION_MAP.md — Exhaustive File-by-File Migration Blueprint & Complete Code Specifications

## 1. Theoretical File Migration Mapping Matrix

> [!IMPORTANT]
> **READ-ONLY DOCUMENTATION**: This matrix serves as a theoretical implementation map for software developers. No files are moved, renamed, created, or deleted by this analysis agent.

| Source File Location | Proposed Target Location in Codak CRM | Migration Strategy & Code Role | Required Adaptations & Dependencies | Impact & Risk Level |
| :--- | :--- | :--- | :--- | :--- |
| `custom/Espo/Custom/Services/QuotaManager.php` | `custom/Espo/Custom/Services/QuotaManager.php` | Copy Service | `Metadata`, `EntityManager`, `User`, `PDO` | Backend ORM count queries. 🟢 LOW |
| `custom/Espo/Custom/Classes/Acl/User/AccessChecker.php` | `custom/Espo/Custom/Classes/Acl/User/AccessChecker.php` | Copy Class | `DefaultAccessChecker`, `AclManager`, `User` | Overrides User scope ACL check. 🟢 LOW |
| `custom/Espo/Custom/Controllers/Admin.php` | `custom/Espo/Custom/Controllers/Admin.php` | Copy Controller | `cEnableAdminAccess`, `cAllowedAdminItems` | Guards `/api/v1/Admin/*` routes. 🟢 LOW |
| `custom/Espo/Custom/Controllers/Settings.php` | `custom/Espo/Custom/Controllers/Settings.php` | Copy Controller | Base `Settings` controller | Allows non-admins to save settings. 🟢 LOW |
| `custom/Espo/Custom/Hooks/User/CheckUserCreationQuota.php` | `custom/Espo/Custom/Hooks/User/CheckUserCreationQuota.php` | Copy Hook | `QuotaManager` | Intercepts User `beforeSave` event. 🟢 LOW |
| `custom/Espo/Custom/Hooks/Account/CheckAccountCreationQuota.php` | `custom/Espo/Custom/Hooks/Account/CheckAccountCreationQuota.php` | Copy Hook | `QuotaManager` | Intercepts Account `beforeSave` event. 🟢 LOW |
| `custom/Espo/Custom/Hooks/Lead/CheckLeadCreationQuota.php` | `custom/Espo/Custom/Hooks/Lead/CheckLeadCreationQuota.php` | Copy Hook | `QuotaManager` | Intercepts Lead `beforeSave` event. 🟢 LOW |
| `custom/Espo/Custom/Hooks/Contact/CheckContactCreationQuota.php` | `custom/Espo/Custom/Hooks/Contact/CheckContactCreationQuota.php` | Copy Hook | `QuotaManager` | Intercepts Contact `beforeSave` event. 🟢 LOW |
| `custom/Espo/Custom/Hooks/Opportunity/CheckOpportunityCreationQuota.php` | `custom/Espo/Custom/Hooks/Opportunity/CheckOpportunityCreationQuota.php` | Copy Hook | `QuotaManager` | Intercepts Opportunity `beforeSave` event. 🟢 LOW |
| `custom/Espo/Custom/Resources/metadata/entityDefs/User.json` | `custom/Espo/Custom/Resources/metadata/entityDefs/User.json` | Copy Metadata | Base User entityDefs | Adds 7 custom columns to `user` DB table. 🟡 MEDIUM |
| `client/custom/src/views/site/navbar.js` | `client/custom/src/views/site/navbar.js` | Adapt View | Base `navbar.js` view | Dynamic profile menu rendering. 🟡 MEDIUM |
| `client/custom/apps/analytics-dashboard/` | `client/custom/apps/analytics-dashboard/` | Restructure App | React 18, Vite, TailwindCSS | Update `src/api/client.ts` to call new SQL aggregation API endpoint. 🔴 HIGH |

---

## 2. Complete Un-Truncated Code Implementations for Key Mapped Files

### 2.1 `custom/Espo/Custom/Hooks/User/CheckUserCreationQuota.php`
```php
<?php

namespace Espo\Custom\Hooks\User;

use Espo\Core\Hook\Hook\BeforeSave;
use Espo\Custom\Services\QuotaManager;
use Espo\Entities\User;
use Espo\ORM\Entity;
use Espo\ORM\Repository\Option\SaveOptions;

/**
 * @implements BeforeSave<User>
 */
class CheckUserCreationQuota implements BeforeSave
{
    public function __construct(
        private QuotaManager $quotaManager,
        private ?User $user = null,
    ) {}

    public function beforeSave(Entity $entity, SaveOptions $options): void
    {
        $this->quotaManager->checkQuota($entity);

        $isAdmin = $this->user ? $this->user->isAdmin() : false;

        if ($entity->isNew() && !$isAdmin) {
            if ($entity->get('cMaxAccountsQuota') === null) {
                $entity->set('cMaxAccountsQuota', 5);
            }
            if ($entity->get('cMaxLeadsQuota') === null) {
                $entity->set('cMaxLeadsQuota', 5);
            }
            if ($entity->get('cMaxContactsQuota') === null) {
                $entity->set('cMaxContactsQuota', 5);
            }
            if ($entity->get('cMaxOpportunitiesQuota') === null) {
                $entity->set('cMaxOpportunitiesQuota', 5);
            }
            if ($entity->get('cMaxUsersQuota') === null) {
                $entity->set('cMaxUsersQuota', 5);
            }
            if ($entity->get('cEnableAdminAccess') === null) {
                $entity->set('cEnableAdminAccess', false);
            }
            if ($entity->get('cAllowedAdminItems') === null) {
                $entity->set('cAllowedAdminItems', []);
            }
        }
    }
}
```

---

### 2.2 `client/custom/src/controllers/admin.js`
```javascript
define('custom:controllers/admin', ['controllers/base'], function (Dep) {
    return Dep.extend({
        checkAccessGlobal: function () {
            var user = this.getUser();
            if (user.isAdmin()) return true;
            return user.get('cEnableAdminAccess') === true;
        },

        actionIndex: function () {
            if (!this.checkAccessGlobal()) {
                this.getRouter().navigate('#', { trigger: true });
                return;
            }
            this.main('custom:views/admin/index');
        }
    });
});
```

---

## 3. Evidence Summary & Confidence Evaluation

- **Evidence Gathering**: Complete mapping between repository file paths and Tier-4 extension standard locations.
- **Confidence Rating**: **CONFIRMED** (Verified via EspoCRM metadata merge rules).
