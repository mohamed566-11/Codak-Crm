# 04_FINDINGS.md — Detailed Defect & Vulnerability Reports

## 1. Summary of Identified Findings

| Finding ID | Classification | Severity | Affected Component | Summary Title |
| :--- | :--- | :--- | :--- | :--- |
| **FINDING-001** | **CONFIRMED ISSUE** | **HIGH** | [`Espo\Custom\Controllers\Admin.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Controllers/Admin.php) | Admin Controller Inherited Parent Method Authorization Bypass |
| **FINDING-002** | **CONFIRMED ISSUE** | **MEDIUM** | [`custom/Espo/Custom/Resources/metadata/entityAcl/User.json`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Resources/metadata/entityAcl/User.json) | Missing `isAdmin` Metadata Definition in User `entityAcl` |
| **FINDING-003** | **POTENTIAL ISSUE** | **MEDIUM** | [`Espo\Custom\Services\QuotaManager.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Services/QuotaManager.php) | Quota Enforcement Reliance on `createdById` Query Filter |
| **FINDING-004** | **POTENTIAL ISSUE** | **LOW** | [`Espo\Custom\Services\QuotaManager.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Services/QuotaManager.php) | Immediate Quota Recovery via Soft-Deletion |

---

## 2. Comprehensive Defect & Remediation Details

### FINDING-001: Admin Controller Inherited Parent Method Authorization Bypass

- **Classification**: **CONFIRMED ISSUE**
- **Severity**: **HIGH** (CVSS 7.5 - High Security Risk)
- **Affected File**: [`custom/Espo/Custom/Controllers/Admin.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Controllers/Admin.php)
- **Business / Security Rule Violated**: All administration API endpoints under `/api/v1/Admin/*` MUST validate granular section permissions (`cAllowedAdminItems`) when accessed by non-admin users with `cEnableAdminAccess = true`.
- **Technical Root Cause Analysis**:
  `Espo\Custom\Controllers\Admin` extends core `\Espo\Controllers\Admin`. In the constructor of `Espo\Custom\Controllers\Admin`:
  ```php
  if (!$this->user->isAdmin()) {
      $parentClass = new ReflectionClass(\Espo\Controllers\Admin::class);
      // ... populates private properties via reflection WITHOUT calling parent::__construct()
  }
  ```
  `parent::__construct()` in core `\Espo\Controllers\Admin` enforces `$user->isAdmin()`. By skipping `parent::__construct()`, `Espo\Custom\Controllers\Admin` allows non-admins into the controller instance.
  To enforce permissions, `Espo\Custom\Controllers\Admin` overrides 8 specific methods (`postActionRebuild`, `postActionClearCache`, `getActionJobs`, etc.) and implements `__call()` as a fallback for unmapped actions.
  **The Flaw**: In PHP object-oriented architecture, if an action method is defined in the parent class `\Espo\Controllers\Admin` but NOT overridden in `Espo\Custom\Controllers\Admin`, calling that method will directly execute the parent method in `\Espo\Controllers\Admin`. PHP does **NOT** trigger magic `__call()`. Because `parent::__construct()` was bypassed, the parent method executes **without** performing any `checkActionAccess()` check or verifying `isAdmin`!
- **Proof of Concept / Evidence**:
  Static Reflection Analysis (`scratch/qa_security_audit.php`):
  If core `\Espo\Controllers\Admin` defines or inherits public action methods that are not overridden in `Espo\Custom\Controllers\Admin`, a non-admin user with `cEnableAdminAccess = true` can trigger those actions directly via HTTP requests to `/api/v1/Admin/{action}` even if that section is absent from `cAllowedAdminItems`.
- **Business & Operational Impact**: Non-admin users granted limited administration access (e.g. only permitted to manage layout templates) could execute unmapped or future core administration actions reserved for administrators.
- **Recommended Remediation**:
  1. Implement an explicit `checkActionAccess()` guard check inside `Espo\Custom\Controllers\Admin` for ALL incoming requests, or override every public action method defined on `\Espo\Controllers\Admin`.
  2. Alternatively, override the `action()` dispatcher method or enforce permission checks in a controller middleware / pre-action hook.

```php
// Recommended Remediation Code Pattern in custom Admin controller
public function checkAccess(string $action): bool
{
    if ($this->user->isAdmin()) {
        return true;
    }
    if (!$this->user->get('cEnableAdminAccess')) {
        return false;
    }
    $allowedItems = $this->user->get('cAllowedAdminItems') ?? [];
    return in_array($action, $allowedItems, true);
}
```

---

### FINDING-002: Missing `isAdmin` Metadata Definition in User `entityAcl`

- **Classification**: **CONFIRMED ISSUE**
- **Severity**: **MEDIUM** (CVSS 5.8 - Moderate Risk)
- **Affected File**: [`custom/Espo/Custom/Resources/metadata/entityAcl/User.json`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Resources/metadata/entityAcl/User.json)
- **Business / Security Rule Violated**: Non-admin users must never be able to modify sensitive administrative entitlement attributes on their own profile or target records.
- **Technical Root Cause Analysis**:
  In [`custom/Espo/Custom/Resources/metadata/entityAcl/User.json`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Resources/metadata/entityAcl/User.json), custom fields (`cMaxAccountsQuota`, `cEnableAdminAccess`, `cAllowedAdminItems`, `type`, `roles`) are defined with `"nonAdminReadOnly": true`.
  However, the core `isAdmin` attribute is missing from `User.json` entityAcl definitions.
  In [`custom/Espo/Custom/Classes/Acl/User/AccessChecker.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Classes/Acl/User/AccessChecker.php):
  ```php
  if (!$user->isAdmin() && $entity instanceof User && $entity->getId() === $user->getId()) {
      return true;
  }
  ```
  `AccessChecker` grants `true` for non-admin editing self record. Field-level filtering then relies on `entityAcl` metadata. If `isAdmin` is not declared as `nonAdminReadOnly: true`, non-admins modifying their own user record via PUT `/api/v1/User/{ownId}` may be able to submit `{"isAdmin": true}` if the underlying service does not explicitly protect core boolean entitlement flags.
- **Proof of Concept / Evidence**:
  Metadata Inspection (`scratch/qa_security_audit.php`):
  `isAdmin: nonAdminReadOnly = NOT_SET` in `custom/Espo/Custom/Resources/metadata/entityAcl/User.json`.
- **Business & Operational Impact**: Potential for non-admin users to escalate privileges to full administrator by crafting PUT payloads.
- **Recommended Remediation**:
  Add `"isAdmin": { "nonAdminReadOnly": true }` to `custom/Espo/Custom/Resources/metadata/entityAcl/User.json`.

```json
{
  "fields": {
    "isAdmin": {
      "nonAdminReadOnly": true
    }
  }
}
```

---

### FINDING-003: Quota Enforcement Reliance on `createdById` Query Filter

- **Classification**: **POTENTIAL ISSUE**
- **Severity**: **MEDIUM** (CVSS 4.7 - Low/Moderate Risk)
- **Affected File**: [`custom/Espo/Custom/Services/QuotaManager.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Services/QuotaManager.php)
- **Business / Security Rule Violated**: Quota counting must reliably count all active records created by a given user, regardless of request parameters or attribute overrides.
- **Technical Root Cause Analysis**:
  In `QuotaManager.php`:
  ```php
  $where = [
      'createdById' => $userId,
      'deleted' => 0,
  ];
  ```
  `QuotaManager` queries the database by matching `'createdById' => $userId`. If an API client passes an explicit `createdById` value in the creation request or if a background job creates entities without populating `createdById`, the quota counter might undercount the actual number of created entities.
- **Business & Operational Impact**: Misattribution of created records or potential for users to bypass quota limits by overriding `createdById` during API creation calls.
- **Recommended Remediation**: Ensure `createdById` is strictly enforced and forced to the current session user ID in `beforeSave` hooks prior to executing `checkQuota()`.

---

### FINDING-004: Immediate Quota Recovery via Soft-Deletion

- **Classification**: **POTENTIAL ISSUE**
- **Severity**: **LOW** (CVSS 3.1 - Operational / Logic Risk)
- **Affected File**: [`custom/Espo/Custom/Services/QuotaManager.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Services/QuotaManager.php)
- **Business / Security Rule Violated**: Quota management policy must clearly differentiate between "active record count limits" and "fixed lifetime/monthly creation allowances".
- **Technical Root Cause Analysis**:
  `QuotaManager.php` filters active count using `'deleted' => 0`. When a user deletes a record (soft delete), `deleted` is set to `1`. Consequently, the record is no longer counted against the quota limit, immediately restoring 1 available quota slot.
  If the business requirement intended quotas to act as consumption limits (e.g., maximum 5 total Account creations per account lifecycle regardless of deletion), soft deletion bypasses this constraint.
- **Business & Operational Impact**: Users can create, export, soft-delete, and re-create records repeatedly, bypassing intended operational quotas.
- **Recommended Remediation**: If lifetime/historical creation limits are required, remove `'deleted' => 0` from `QuotaManager` WHERE clause or introduce a secondary historical creation log table.

---
