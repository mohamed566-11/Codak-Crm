# 07_CODE_FLOW_AND_DEPENDENCY_ANALYSIS.md — End-to-End Code Flows & Deep Call Stack Analysis

## 1. End-to-End Code Call Stacks

### 1.1 Quota Enforcement Record Creation Execution Stack

```
[ Client: Record Edit View Save ]
  │
  ▼
[ HTTP POST /api/v1/Lead ]
  │
  ▼
[ Espo\Controllers\Lead::postActionCreate() ]
  │
  ▼
[ Espo\Services\Lead::createEntity() ]
  │
  ▼
[ Espo\ORM\Repositories\RDB::save() ]
  │
  ▼ (Triggers Lifecycle Hook)
[ Espo\Custom\Hooks\Lead\CheckLeadCreationQuota::beforeSave($entity, $options) ]
  │
  ▼ (Delegates to QuotaManager Service)
[ Espo\Custom\Services\QuotaManager::checkQuota($entity) ]
  │
  ├─► Check Admin/System Bypass:
  │   `if ($this->user->isAdmin() || $this->user->isSystem()) return;`
  │
  ├─► Acquire Pessimistic Row Lock:
  │   `$stmt = $pdo->prepare("SELECT id FROM user WHERE id = :id FOR UPDATE");`
  │
  ├─► Resolve Quota Limit:
  │   `$maxQuota = $this->getEffectiveQuota('Lead', $this->user);`
  │
  ├─► Query Active Records Count:
  │   `$createdCount = $this->entityManager->getRDBRepository('Lead')->where([...])->count();`
  │
  └─► Evaluate Limit Breach:
      `if ($createdCount >= $maxQuota) throw new BadRequest("Creation Limit Reached...");`
```

---

### 1.2 Non-Admin Administration Access Authorization Stack

```
[ HTTP POST /api/v1/Admin/clearCache ]
  │
  ▼
[ Espo\Custom\Controllers\Admin::postActionClearCache() ]
  │
  ▼
[ Espo\Custom\Controllers\Admin::checkActionAccess('clearCache') ]
  │
  ├─► Check Admin Bypass:
  │   `if ($user->isAdmin()) return;`
  │
  ├─► Check Master Toggle:
  │   `if (!$user->get('cEnableAdminAccess')) throw new Forbidden("Admin access disabled.");`
  │
  └─► Check Section Whitelist:
      `$allowedItems = $user->get('cAllowedAdminItems') ?? [];`
      `if (!in_array('clearCache', $allowedItems)) throw new Forbidden("Access denied.");`
```

---

## 2. Prototype Mutation Bug Code Analysis (`[STA-01]`)

### Problematic JavaScript Code (`client/custom/src/views/analytics-dashboard/index.js`):
```javascript
// BUG: Declaring mutable object literals directly on Backbone extend prototype
define('custom:views/analytics-dashboard/index', ['view'], function (Dep) {
    return Dep.extend({
        categoryFilters: {}, // Shared prototype property!

        onBarItemClick: function (e) {
            var val = $(e.currentTarget).data('value');
            // Mutates shared prototype object!
            if (!this.categoryFilters[filterKey]) this.categoryFilters[filterKey] = {};
            this.categoryFilters[filterKey][val] = { excluded: true };
        }
    });
});
```

### Remediated Per-Instance Constructor Code:
```javascript
define('custom:views/analytics-dashboard/index', ['view'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            // Per-instance object initialization prevents cross-session prototype pollution
            this.categoryFilters = {};
            this.rawLeads = [];
        }
    });
});
```

---

## 3. Evidence Summary & Confidence Evaluation

- **Evidence Gathering**: Code tracing across `QuotaManager.php`, `Controllers/Admin.php`, and `refactordashboard.md`.
- **Confidence Rating**: **CONFIRMED** (Verified via code call stack analysis).
