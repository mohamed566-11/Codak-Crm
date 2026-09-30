# 01_INVENTORY.md — Architecture, Feature Inventory & Role Matrix

## 1. System Architecture Overview

- **Application Identifier**: Codak CRM (Customized EspoCRM Enterprise Core v10.0.3)
- **Primary Namespace**: `Espo\Custom\` (Tier-4 Custom Extension Standard)
- **Backend Stack**: PHP 8.2+, MySQL 8.0 / MariaDB 10.6, Apache 2.4 / Laragon Stack
- **Frontend Stack**: Backbone.js SPA Core + Custom Views (`client/custom/src/`), CSS3 (Codak Dark/Vibrant Theme), React 18 BI Analytics App (`client/custom/apps/analytics-dashboard/`)
- **Security & Access Architecture**:
  - **ORM & Data Isolation**: EspoORM RDB Repository pattern with soft-delete filtering (`deleted = 0`).
  - **Multi-Tier Quota Manager**: [`QuotaManager.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Services/QuotaManager.php) enforcing creation limits on 6 core entities (`Account`, `Lead`, `Contact`, `Opportunity`, `User`, `Team`).
  - **Granular 53-Section Administration Guard**: Custom [`Admin.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Controllers/Admin.php) controller enforcing action-level authorization for non-admin users with `cEnableAdminAccess = true`.
  - **Role Navigation Lock & Picker Bypass**: Client-side route lock in [`role.js`](file:///d:/laragon/www/EspoCRM-10.0.3/client/custom/src/controllers/role.js) paired with backend `selectDefs` `FilterResolvers\Bypass` for `Role`, `LayoutSet`, and `WorkingTimeCalendar`.

---

## 2. Exhaustive Feature Inventory

| Feature Name | UI Entry Point | REST Endpoint & Method | Backend Controller / Service | DB Tables Affected | Required Role / Entitlement | Quota Consumed | External Dependencies | Expected Behavior | Potential Misuse Scenarios |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Account Management** | `#Account` | `GET/POST/PUT/DELETE /api/v1/Account` | `Espo\Controllers\Account` / `QuotaManager` | `account` | Scope ACL: `Account` (Create/Read/Edit/Delete) | `cMaxAccountsQuota` | None | Standard CRUD; validates creation quota prior to insert. | Quota bypass via duplicate rapid creation or soft-delete recycling. |
| **Lead Management** | `#Lead` | `GET/POST/PUT/DELETE /api/v1/Lead` | `Espo\Controllers\Lead` / `RequireNameIfContactInfoEmpty` | `lead` | Scope ACL: `Lead` | `cMaxLeadsQuota` | None | Validates mandatory name if contact info is empty; checks quota. | Creating leads with missing required contact info via raw API requests. |
| **Contact Management** | `#Contact` | `GET/POST/PUT/DELETE /api/v1/Contact` | `Espo\Controllers\Contact` / `QuotaManager` | `contact` | Scope ACL: `Contact` | `cMaxContactsQuota` | None | Validates title-account dependency; enforces contact quota. | Creating contacts without linking required parent Account. |
| **Opportunity Management** | `#Opportunity` | `GET/POST/PUT/DELETE /api/v1/Opportunity` | `Espo\Controllers\Opportunity` / `ValidateStageLastStageDependency` | `opportunity` | Scope ACL: `Opportunity` | `cMaxOpportunitiesQuota` | None | Stage transition validation (Closed Lost stage tracking); quota check. | Arbitrary stage skipping or bypassing stage transition rules. |
| **User Management** | `#User` | `GET/POST/PUT/DELETE /api/v1/User` | `Espo\Controllers\User` / `CheckUserCreationQuota` / `User\AccessChecker` | `user`, `user_team`, `user_role` | Admin OR `cEnableAdminAccess` + `users` section | `cMaxUsersQuota` | None | Non-admin users can create/edit assigned users within quota and ACL bounds. Defaults non-admin quotas. | Mass-assignment attack to set `isAdmin=true` or alter quota limits on self/target user. |
| **Team Management** | `#Team` | `GET/POST/PUT/DELETE /api/v1/Team` | `Espo\Custom\Controllers\Team` / `CheckTeamCreationQuota` / `OwnershipChecker` | `team`, `team_user` | Scope ACL: `Team` (All users can create) | `cMaxTeamsQuota` | None | Auto-links team creator; allows team creator & members to edit/delete team. | Non-admin team creator deleting critical shared corporate team. |
| **Granular Admin Panel** | `#Admin` | `GET/POST /api/v1/Admin/*` | `Espo\Custom\Controllers\Admin` | `config`, system state | Admin OR `cEnableAdminAccess = true` | None | System Engine | Filters UI cards by `cAllowedAdminItems`; validates action permissions backend-side. | Direct API invocation of inherited parent methods (e.g. unmapped admin actions) bypassing permission checks. |
| **Settings Management** | `#Admin/settings` | `GET/PUT /api/v1/Settings` | `Espo\Custom\Controllers\Settings` | System `config.php` | Admin OR `cEnableAdminAccess` + `settings` section | None | Config File | Non-admins restricted to explicit setting key whitelist (`recordsPerPage`, `theme`, etc.). | Attempting to overwrite sensitive security configs (`authenticationMethod`, `adminPassword`). |
| **Role & Security Rules** | `#Role` | `GET/POST/PUT/DELETE /api/v1/Role` | `Espo\Controllers\Role` / `Role\AccessChecker` | `role` | Admin only (Non-admin read allowed for pickers) | None | None | Frontend locks `#Role` navigation for non-admins; backend allows read query for modal lookups. | Direct API request to create or modify role definitions by non-admin. |
| **LayoutSet Management** | `#Admin/layoutSets` | `GET/POST/PUT/DELETE /api/v1/LayoutSet` | `Espo\Custom\Controllers\LayoutSet` / `LayoutSet\AccessChecker` | `layout_set` | Admin only (Read allowed for selectDefs picker) | None | None | Controls layout assignments; non-admins read via picker bypass. | Non-admin attempting PUT/DELETE to alter global layout sets. |
| **BI Analytics Feeds** | `#Analytics` | `GET /api/v1/Analytics/*` | Custom BI REST Controllers | `account`, `lead`, `contact`, `opportunity`, `email`, `meeting` | Scope ACL matching target entity | None | React BI App | Returns aggregated metrics for BI dashboard. | Data leakage across tenant boundaries if BI queries lack team/owner filter. |
| **Meetings & Calendar** | `#Meeting` | `GET/POST/PUT/DELETE /api/v1/Meeting` | `Espo\Controllers\Meeting` / `ValidateMeetingAllDayDuration` | `meeting` | Scope ACL: `Meeting` | None | None | Validates all-day meeting start/end time alignment. | Scheduling invalid date/time durations or overlapping records. |
| **Tasks & Cases** | `#Task`, `#Case` | `GET/POST/PUT/DELETE /api/v1/Task`, `/api/v1/Case` | `Espo\Controllers\Task`, `Case` | `task`, `case` | Scope ACL: `Task`, `Case` | None | None | Validates task date completed visibility & case number constraints. | Modifying closed case status or unauthorized ownership reassignment. |

---

## 3. Exhaustive Role x Feature Permission Matrix

| Feature / Subsystem | Admin (Superuser) | Granular Admin (`cEnableAdminAccess=true`) | Standard User (`cEnableAdminAccess=false`) | Portal User |
| :--- | :--- | :--- | :--- | :--- |
| **Account (CRUD)** | FULL (Create, Read, Edit, Delete, Export) | Quota-Limited (Max `cMaxAccountsQuota`), ACL-Scoped | Quota-Limited (Max `cMaxAccountsQuota`), ACL-Scoped | Restricted to assigned Portal Scope |
| **Lead (CRUD)** | FULL | Quota-Limited (Max `cMaxLeadsQuota`), ACL-Scoped | Quota-Limited (Max `cMaxLeadsQuota`), ACL-Scoped | NO ACCESS |
| **Contact (CRUD)** | FULL | Quota-Limited (Max `cMaxContactsQuota`), ACL-Scoped | Quota-Limited (Max `cMaxContactsQuota`), ACL-Scoped | Read/Edit Self Contact Record |
| **Opportunity (CRUD)** | FULL | Quota-Limited (Max `cMaxOpportunitiesQuota`), ACL-Scoped | Quota-Limited (Max `cMaxOpportunitiesQuota`), ACL-Scoped | NO ACCESS |
| **User (CRUD)** | FULL | Quota-Limited (Max `cMaxUsersQuota`), If `users` in `cAllowedAdminItems` | Quota-Limited (If Scope ACL permits) | NO ACCESS |
| **Team (CRUD)** | FULL | Quota-Limited (Max `cMaxTeamsQuota`), Edit/Delete Created or Member Teams | Quota-Limited (Max `cMaxTeamsQuota`), Edit/Delete Created or Member Teams | NO ACCESS |
| **#Admin UI Navigation** | ALLOWED | ALLOWED (Filtered by `cAllowedAdminItems`) | BLOCKED (UI Menu & Route Guard) | BLOCKED |
| **Rebuild / Clear Cache** | ALLOWED | Allowed ONLY IF `rebuild`/`clearCache` in `cAllowedAdminItems` | FORBIDDEN (403) | FORBIDDEN (403) |
| **System Settings Modification** | FULL (All config parameters) | Restricted to Whitelist (`theme`, `recordsPerPage`, etc.) IF `settings` allowed | FORBIDDEN (403) | FORBIDDEN (403) |
| **System Upgrades** | ALLOWED | FORBIDDEN (Restricted to Admins only in `Admin.php`) | FORBIDDEN (403) | FORBIDDEN (403) |
| **#Role UI Navigation** | ALLOWED | BLOCKED (Strict Route Lock in `role.js`) | BLOCKED (Strict Route Lock in `role.js`) | BLOCKED |
| **Role Metadata Lookup (Picker)** | ALLOWED | ALLOWED (Via `selectDefs` `FilterResolvers\Bypass`) | ALLOWED (Via `selectDefs` `FilterResolvers\Bypass`) | FORBIDDEN |
| **BI Analytics Feeds** | FULL | ACL-Filtered Feeds | ACL-Filtered Feeds | NO ACCESS |

---
