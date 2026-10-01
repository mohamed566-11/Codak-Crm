# 02_TEST_PLAN.md — Comprehensive QA & Security Verification Test Plan

## 1. Test Suite Architecture & Identification

This test plan defines all formal verification scenarios for Codak CRM (EspoCRM v10.0.3), covering backend API enforcement, server-side ACL, tenant isolation, quota management, administrative action guards, database integrity, and input handling.

---

## 2. Exhaustive Test Case Catalog

### Category 1: Authentication & Account Lifecycle (AUTH)
- **AUTH-001**: Valid Credentials Authentication — Verify system authenticates valid user credentials and returns session token.
- **AUTH-002**: Invalid Credentials Rejection — Verify HTTP 401 Unauthorized returned for wrong password or non-existent username.
- **AUTH-003**: Account Deactivation Enforcement — Verify deactivated user (`isActive = false`) is denied login and active session invalidation occurs.
- **AUTH-004**: Session Token Expiry & Invalidation — Verify expired or invalidated session tokens return HTTP 401 on protected endpoints.
- **AUTH-005**: Password Change & Session Invalidation — Verify changing password revokes existing active sessions across devices.

### Category 2: Authorization & Scope ACL (AUTHZ)
- **AUTHZ-001**: Role Scope Access Check — Verify standard user cannot perform actions forbidden by assigned ACL Role.
- **AUTHZ-002**: Role Picker Lookup Bypass — Verify non-admin user can search and select roles in modal pickers via `selectDefs` bypass without full read access to `#Role` detail routes.
- **AUTHZ-003**: Strict Navigation Lock for #Role — Verify non-admin user attempting to navigate to `#Role` UI routes is strictly blocked by `role.js`.
- **AUTHZ-004**: Non-Admin Team Management Access — Verify non-admin team creator or member can edit/delete assigned team via `OwnershipChecker.php`.
- **AUTHZ-005**: Non-Admin Non-Member Team Access Block — Verify non-admin non-member cannot edit or delete teams created by other users.

### Category 3: Tenant Isolation & IDOR Protection (TENANT)
- **TENANT-001**: Cross-Tenant Record Access Rejection — Verify Tenant A user cannot read, update, or delete Tenant B records via direct ID access (`/api/v1/Account/{tenantB_id}`).
- **TENANT-002**: Cross-Tenant Search & Filter Isolation — Verify Tenant A search and list queries return only Tenant A data.
- **TENANT-003**: Cross-Tenant Export Isolation — Verify export operations triggered by Tenant A omit Tenant B records.
- **TENANT-004**: IDOR Identifier Swapping in Links — Verify replacing `accountId` or `contactId` in REST payload with target tenant ID returns HTTP 403 Forbidden.
- **TENANT-005**: Protected Field Mass-Assignment Protection — Verify non-admin user submitting parameter updates for `cEnableAdminAccess`, `cAllowedAdminItems`, `cMaxAccountsQuota`, or `isAdmin` via PUT `/api/v1/User/{id}` has changes stripped or rejected server-side.

### Category 4: Multi-Tier Quotas & Usage Limits (QUOTA)
- **QUOTA-001**: Quota Boundary Verification (Limit-1, Limit, Limit+1) — Verify entity creation succeeds up to `cMax*Quota` limit and rejects creation #Limit+1 with HTTP 400 BadRequest ("Creation Limit Reached").
- **QUOTA-002**: Quota Bound at 0 — Verify user with quota set to `0` is immediately blocked from creating any records.
- **QUOTA-003**: Quota Bound at -1 (Unlimited) — Verify user with quota set to `-1` can create unlimited records without restriction.
- **QUOTA-004**: Admin Quota Bypass — Verify system administrator bypasses creation quotas for all entity types.
- **QUOTA-005**: Soft-Deleted Quota Recovery — Verify soft-deleting an active record reduces active count and restores creation quota slot.
- **QUOTA-006**: Role-Level Quota Fallback — Verify user with no direct quota defined inherits highest quota from assigned ACL Roles.
- **QUOTA-007**: System Global Quota Default Fallback — Verify user with no direct or role quota inherits global system default quota.

### Category 5: Concurrency & Duplicate Processing (CONC / DUP)
- **CONC-001**: Concurrent Quota Race Condition Protection — Verify simultaneous parallel entity creation requests at `Limit-1` are serialized via `FOR UPDATE` row lock in `QuotaManager.php`, preventing over-quota creation.
- **DUP-001**: Duplicate Record Submission Prevention — Verify rapid duplicate POST requests create single record or return duplicate error.

### Category 6: AI Integration Verification (AI)
- **AI-001**: AI Provider Authentication & API Key Shielding — Verify client applications never receive raw AI provider credentials or keys (Mock / N/A).
- **AI-002**: AI Quota & Rate Limiting Enforcement — Verify AI feature requests enforce per-user prompt limits and quota tracking (Mock / N/A).

### Category 7: Export / Import & Admin Control (EXP / IMP / ADMIN)
- **EXP-001**: Authorized Data Export — Verify authorized user can export permitted scope records to CSV/XLSX.
- **EXP-002**: Unauthorized & Cross-Tenant Export Block — Verify non-admin user cannot export data outside assigned ACL scope.
- **IMP-001**: CSV Import Validation & Formula Neutralization — Verify imported CSV files are sanitized and spreadsheet formula characters (`=`, `+`, `-`, `@`) are neutralized.
- **ADMIN-001**: Granular 53-Section UI Filtering — Verify Admin panel cards filter dynamically based on `cAllowedAdminItems`.
- **ADMIN-002**: Backend Enforcement of Granular Admin Actions — Verify calling `/api/v1/Admin/*` endpoints checks `cAllowedAdminItems` for non-admins with `cEnableAdminAccess = true`.
- **ADMIN-003**: System Upgrade Action Lock — Verify non-admin users (even with `cEnableAdminAccess = true`) are strictly forbidden from uploading or running system upgrades.
- **ADMIN-004**: Whitelisted Non-Admin Settings Update — Verify non-admin user with `settings` section access can update whitelisted setting parameters but is blocked from modifying security/auth parameters.

### Category 8: CRUD & Input Validation (CRUD)
- **CRUD-001**: Account & Contact CRUD Verification — Verify complete creation, reading, updating, and soft-deletion for Account & Contact entities.
- **CRUD-002**: Lead Contact Info Validation — Verify `RequireNameIfContactInfoEmpty` hook rejects lead creation when name, email, and phone are all blank.
- **CRUD-003**: Contact Title-Account Dependency — Verify `ValidateTitleAccountDependency` validates title and account link rules.
- **CRUD-004**: Opportunity Stage Last Stage Dependency — Verify `ValidateStageLastStageDependency` tracks pre-loss stage when transitioning to `Closed Lost`.
- **CRUD-005**: Meeting All-Day Duration Validation — Verify `ValidateMeetingAllDayDuration` enforces valid start/end timestamps for all-day meetings.
- **CRUD-006**: Unicode, Arabic, & Special Character Handling — Verify UTF-8, Arabic text (`الإعدادات`), and emoji characters persist cleanly and sanitize against XSS.

### Category 9: Database Integrity & Error Handling (DB / API / LOG)
- **DB-001**: Soft-Delete Record Flagging — Verify deleting records sets `deleted = 1` in MySQL database without cascading orphaned records.
- **DB-002**: Foreign Key & Relational Link Cleanup — Verify unlinking M:N relations (e.g. Contact to TargetList) cleans relationship pivot tables cleanly.
- **API-001**: Standardized HTTP Status Codes — Verify API returns proper HTTP status codes (200, 201, 400, 401, 403, 404, 500).
- **LOG-001**: Sensitive Data Redaction in Logs — Verify system logs do not record plain-text passwords, session tokens, or API secrets.

---
