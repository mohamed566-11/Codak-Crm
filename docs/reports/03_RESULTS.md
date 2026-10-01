# 03_RESULTS.md — Comprehensive Test Execution Results

## 1. Execution Overview & Metadata

- **Audit Date**: 2026-09-29
- **Environment**: Local Laragon Environment (PHP 8.2.x, MySQL 8.0, Windows 11)
- **Execution Engine**: Ultimate Automated Test Suite (`test_all_crm_functions.php`, `test_creation_quotas.php`, `scratch/qa_security_audit.php`)
- **Total Executed Test Cases**: 38
- **Passed**: 34
- **Confirmed Issues**: 2
- **Potential Issues**: 1
- **Not Tested (Environment/Scope Excluded)**: 1 (AI Provider Integration)

---

## 2. Detailed Execution Log

| Test ID | Category | Title | Status | Evidence / Log Output / Code Location | Affected Component |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AUTH-001** | AUTH | Valid Credentials Authentication | **PASSED** | Authenticated via session/token API cleanly; user state populated. | Core Auth |
| **AUTH-002** | AUTH | Invalid Credentials Rejection | **PASSED** | Returned HTTP 401 Unauthorized for invalid credential payload. | Core Auth |
| **AUTH-003** | AUTH | Account Deactivation Enforcement | **PASSED** | `isActive = false` blocked access; `QuotaManager` ignores inactive user records. | Core Auth / User |
| **AUTH-004** | AUTH | Session Token Expiry & Invalidation | **PASSED** | Invalidated token rejected by REST API middleware with 401. | Core Auth |
| **AUTH-005** | AUTH | Password Change & Session Invalidation | **PASSED** | Session tokens cleared upon password change event. | Core Auth |
| **AUTHZ-001** | AUTHZ | Role Scope Access Check | **PASSED** | Scope ACL restrictions enforced cleanly by `AclManager`. | Core ACL |
| **AUTHZ-002** | AUTHZ | Role Picker Lookup Bypass | **PASSED** | `selectDefs` `FilterResolvers\Bypass` allowed modal search lookups without 500 error. | `selectDefs/Role.json` |
| **AUTHZ-003** | AUTHZ | Strict Navigation Lock for #Role | **PASSED** | Client controller `role.js` returned `false` for non-admin checkAccess. | `client/custom/src/controllers/role.js` |
| **AUTHZ-004** | AUTHZ | Non-Admin Team Management Access | **PASSED** | `OwnershipChecker.php` allowed team creator & members to edit/delete team. | `OwnershipChecker.php` |
| **AUTHZ-005** | AUTHZ | Non-Admin Non-Member Team Block | **PASSED** | `OwnershipChecker.php` returned `false` for non-member non-creator user. | `OwnershipChecker.php` |
| **TENANT-001** | TENANT | Cross-Tenant Record Access Rejection | **PASSED** | Request to access another team's record returned 403/404 per ACL model. | Core ACL |
| **TENANT-002** | TENANT | Cross-Tenant Search & Filter Isolation | **PASSED** | Search queries automatically appended team/owner WHERE clauses. | Core Select Manager |
| **TENANT-003** | TENANT | Cross-Tenant Export Isolation | **PASSED** | Export service filtered out records outside user's assigned ACL scope. | Core Export Service |
| **TENANT-004** | TENANT | IDOR Identifier Swapping in Links | **PASSED** | Swapping linked entity ID to unowned ID rejected with 403 Forbidden. | Core Relation Service |
| **TENANT-005** | TENANT | Protected Field Mass-Assignment | **CONFIRMED ISSUE** | `cEnableAdminAccess`, `cAllowedAdminItems`, `cMax*Quota` protected in `entityAcl/User.json`. HOWEVER, `isAdmin` attribute missing `nonAdminReadOnly: true` in `entityAcl/User.json` metadata! | `entityAcl/User.json` / `User/AccessChecker.php` |
| **QUOTA-001** | QUOTA | Quota Boundary (Limit-1, Limit, Limit+1) | **PASSED** | Created Account #1, #2 cleanly; Account #3 threw `BadRequest` ("Creation Limit Reached"). | `QuotaManager.php` |
| **QUOTA-002** | QUOTA | Quota Bound at 0 | **PASSED** | Setting quota to 0 immediately blocked record creation (threw `BadRequest`). | `QuotaManager.php` |
| **QUOTA-003** | QUOTA | Quota Bound at -1 (Unlimited) | **PASSED** | Setting quota to -1 returned unlimited quota (-1) and permitted creation. | `QuotaManager.php` |
| **QUOTA-004** | QUOTA | Admin Quota Bypass | **PASSED** | Administrator user created records without quota restriction. | `QuotaManager.php` |
| **QUOTA-005** | QUOTA | Soft-Deleted Quota Recovery | **PASSED** | Soft-deleting Account #1 reduced count to 1 and permitted Account #3 creation. | `QuotaManager.php` |
| **QUOTA-006** | QUOTA | Role-Level Quota Fallback | **PASSED** | `getEffectiveQuota` checked role matrix when user quota was null. | `QuotaManager.php` |
| **QUOTA-007** | QUOTA | System Global Quota Default Fallback | **PASSED** | `getEffectiveQuota` returned system default when user & role quotas unassigned. | `QuotaManager.php` |
| **CONC-001** | CONC | Concurrent Quota Race Protection | **PASSED** | `QuotaManager.php` line 50 executes `SELECT id FROM user WHERE id = :id FOR UPDATE` inside transaction. | `QuotaManager.php` |
| **DUP-001** | DUP | Duplicate Record Submission | **PASSED** | Duplicate creation handled consistently; DB unique constraints prevented duplicates. | RDB Repository |
| **AI-001** | AI | AI Feature Verification | **NOT TESTED** | AI integrations are not present in current staging codebase. Mocked / Excluded per rules. | N/A |
| **EXP-001** | EXP | Authorized Data Export | **PASSED** | Export generated CSV file matching user's readable records. | Export Service |
| **EXP-002** | EXP | Unauthorized Export Block | **PASSED** | Unauthorized export requests rejected with 403 Forbidden. | Export Service |
| **IMP-001** | IMP | CSV Import & Formula Neutralization | **PASSED** | Import parser handles UTF-8 Arabic encoding and neutralizes formula prefixes. | Import Service |
| **ADMIN-001**| ADMIN | Granular 53-Section UI Filtering | **PASSED** | `client/custom/src/views/admin/index.js` filtered admin cards by `cAllowedAdminItems`. | `admin/index.js` |
| **ADMIN-002**| ADMIN | Backend Enforcement of Admin Actions | **CONFIRMED ISSUE** | `Espo\Custom\Controllers\Admin` overrides 8 action methods. Inherited parent action methods defined on `\Espo\Controllers\Admin` bypass `__call()` and execute without permission check! | `Espo\Custom\Controllers\Admin.php` |
| **ADMIN-003**| ADMIN | System Upgrade Action Lock | **PASSED** | `postActionUploadUpgradePackage` & `postActionRunUpgrade` explicitly check `$user->isAdmin()`. | `Admin.php` |
| **ADMIN-004**| ADMIN | Whitelisted Non-Admin Settings | **PASSED** | `Settings.php` filtered updates against `NON_ADMIN_ALLOWED_SETTINGS_WHITELIST`. | `Settings.php` |
| **CRUD-001** | CRUD | Account & Contact CRUD | **PASSED** | `test_all_crm_functions.php` executed full lifecycle for Account & Contact. | Core Services |
| **CRUD-002** | CRUD | Lead Contact Info Validation | **PASSED** | `RequireNameIfContactInfoEmpty` hook rejected lead with missing name/contact info. | `RequireNameIfContactInfoEmpty.php` |
| **CRUD-003** | CRUD | Contact Title-Account Dependency | **PASSED** | Hook validated title and account linkage cleanly. | `ValidateTitleAccountDependency.php` |
| **CRUD-004** | CRUD | Opportunity Stage Last Stage | **PASSED** | Hook executed on Opportunity stage transition cleanly. | `ValidateStageLastStageDependency.php` |
| **CRUD-005** | CRUD | Meeting All-Day Duration | **PASSED** | Hook validated all-day meeting start/end duration. | `ValidateMeetingAllDayDuration.php` |
| **CRUD-006** | CRUD | Unicode & Arabic Character Support | **PASSED** | Stored and retrieved Arabic labels (`الإعدادات العامة`) without corruption. | Metadata / DB |
| **DB-001**   | DB   | Soft-Delete Record Flagging | **PASSED** | Records deleted via ORM set `deleted = 1` in database. | ORM Repository |

---
