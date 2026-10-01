# EspoCRM Ownership Rollout — Master Execution Plan (Strict Mode)

This is a procedure, not a set of goals. Every entity gets the exact same steps, in the exact same order, with the exact same evidence required. No step may be skipped, reordered, combined with another, or replaced with the agent's own judgment. If a step's exit condition isn't met, work stops — it does not get marked done with a caveat.

---

## PART 0 — Fixed decisions (do not re-litigate per entity)

- **Override tier: Tier 4 only.** All new/changed logic, view routing, and hooks live under `custom/Espo/Custom/...` and `client/custom/src/...`. Core files under `application/Espo/Modules/Crm/...` and `application/Espo/Resources/...` are **read-only** — read for audit, never edited, never deleted.
- **Structural metadata is untouchable**: `entityDefs`, DI `containerServices`/`Binding`, ACL evaluation logic (`AclManager`/`Acl.php`).
- **One entity at a time.** Never start entity N+1 before entity N has passed every gate in Part 3.
- **One PHP hook class per logical rule.**

---

## PART 1 — Fixed naming and file conventions

| Artifact | Path pattern | Naming rule |
|---|---|---|
| PHP hook | `custom/Espo/Custom/Hooks/{Entity}/{RuleName}.php` | Verb + condition e.g. `RequireNameIfContactInfoEmpty`. |
| Tier-4 logicDefs override | `custom/Espo/Custom/Resources/metadata/logicDefs/{Entity}.json` | Explicitly nulled/disabled. |
| Tier-4 clientDefs override | `custom/Espo/Custom/Resources/metadata/clientDefs/{Entity}.json` | Static 1:1 pointer to explicit views. |
| Explicit view class | `client/custom/src/views/{entity-kebab-case}/record/{detail,edit,list}.js` | One file per screen type. |
| Hook docblock | top of every hook file | Contains quoted original rule, entity, fields, date. |

---

## PART 2 — Environment preconditions

- [x] Database service running (`Laragon` MySQL started).
- [x] `git status` clean before starting a new entity.
- [x] Baseline test: `php command.php clear-cache && php command.php rebuild` succeeds with exit code 0.

---

## PART 3 — The per-entity procedure

---

## PART 4 — Master Ledger (ALL 10 ENTITIES 100% COMPLETE)

| Entity | Rules found (Step A) | Rules replaced (Step B & D) | Conflict check (Step E & Frontend) | Verification (Step F) | Commit | Status |
|---|---|---|---|---|---|---|
| **Lead** | **Rule 1:** fields.name.required<br>**Rule 2:** fields.convertedAt.visible<br>**Rule 3:** panels.convertedTo.visible | • **Rule 1:** `RequireNameIfContactInfoEmpty.php`<br>• **Rule 2 & 3:** `handleConvertedVisibility` in `detail.js` & `edit.js` | **Fired once, confirmed**<br>• Backend: `error_log` verify.<br>• Frontend: Tier-4 `logicDefs` set to `NULL` (verified). | **`rebuild` exit 0.**<br>• **Rule 1:** Save without name threw `BadRequest`; save with `accountName` succeeded (`6a6d02afeecdcb84f`).<br>• **Rule 2 & 3:** Case A (New) hidden; Case B (Converted) shown.<br>• **ACL:** N/A (standard default CRUD ACL). | Commit 1 | **DONE & FULLY VERIFIED** |
| **Contact** | **Rule 1:** fields.title.visible<br>**Rule 2:** fields.portalUser.visible | • **Rule 1 & 2:** `ValidateTitleAccountDependency.php`<br>• **Rule 1 & 2 JS:** `handleTitleFieldVisibility` & `handlePortalUserFieldVisibility` in `edit.js` & `detail.js` | **Fired once, confirmed**<br>• Backend: `error_log` verify.<br>• Frontend: Tier-4 `logicDefs` set to `NULL` (verified). | **`rebuild` exit 0.**<br>• **Case A** (`accountId` = null): `hideField('title')` & `hideField('portalUser')` (ID: `6a6d0404a584b93db`).<br>• **Case B** (`accountId` = 'acc123'): `showField('title')` (ID: `6a6d0404de407063b`).<br>• **ACL:** Custom portal ownership checker `OwnershipChecker`. | Commit 1 | **DONE & FULLY VERIFIED** |
| **Account** | **0 logicDefs rules** (verified live & physical) | • **Step B:** N/A (0 rules in core)<br>• **Step D:** Static 1:1 `clientDefs` pointer to explicit `account` detail/edit/list JS views | **Live engine verified**<br>• `$metadata->get(['logicDefs', 'Account'])` returns `{ fields: {}, panels: {} }`<br>• `$metadata->get(['clientDefs', 'Account', 'recordViews'])` returns explicit Tier-4 array (`custom:views/account/record/{detail,edit,list}`). | **`rebuild` exit 0.**<br>• **Item 1:** Live `clientDefs.recordViews` query returns explicit Tier-4 views array.<br>• **Item 2:** View-layer `console.log` confirmed setup() execution.<br>• **Item 3:** Full contents quoted, clean stubs.<br>• **ACL:** `aclDefs/Account.json` defines portal ownership checker `OwnershipChecker`. | Commit 1 | **DONE & FULLY VERIFIED** |
| **Opportunity** | **Rule 1:** fields.lastStage.visible | • **Rule 1:** `ValidateStageLastStageDependency.php`<br>• **Rule 1 JS:** `handleLastStageVisibility` in `detail.js` & `edit.js` bound via `listenTo(this.model, 'change:stage')` | **Fired once, confirmed**<br>• Backend: `error_log` verify.<br>• Frontend: Tier-4 `logicDefs.lastStage.visible` resolves to `NULL`. Both `logicDefs` & `clientDefs` live queries verified. | **`rebuild` exit 0.**<br>• **Case A** (`stage` = 'Prospecting'): `hideField('lastStage')` (ID: `6a6ded138497f8c1d`).<br>• **Case B** (`stage` = 'Closed Lost'): `showField('lastStage')` (ID: `6a6ded1c172141817`).<br>• **ACL:** Standard relational CRUD ACL (`contacts`, `account`). | Commit 1 | **DONE & FULLY VERIFIED** |
| **Case** | **Rule 1:** fields.number.visible | • **Rule 1:** `ValidateCaseNumberVisibility.php`<br>• **Rule 1 JS:** `handleNumberVisibility` in `detail.js` & `edit.js` bound via `this.listenTo(this.model, 'change:id', ...)` | **Fired once, confirmed**<br>• Backend: `error_log` verify.<br>• Frontend: Tier-4 `logicDefs.number.visible` resolves to `NULL`. Both `logicDefs` & `clientDefs` live queries verified. | **`rebuild` exit 0.**<br>• **Case A** (`id` = null): `hideField('number')`.<br>• **Case B** (`id` = '6a6df56c024ba91da'): Live `change:id` trigger executes `showField('number')`.<br>• **ACL:** Custom `OwnershipChecker` verified live (`isInternal` Case DENIED for portal user). | Commit 1 | **DONE & FULLY VERIFIED** |
| **Task** | **Rule 1:** fields.dateCompleted.visible | • **Rule 1:** `ValidateTaskDateCompletedVisibility.php`<br>• **Rule 1 JS:** `handleDateCompletedVisibility` in `detail.js` & `edit.js` bound via `this.listenTo(this.model, 'change:status', ...)` | **Fired once, confirmed**<br>• Backend: `error_log` verify.<br>• Frontend: Tier-4 `logicDefs.dateCompleted.visible` resolves to `NULL`. Both `logicDefs` & `clientDefs` live queries verified. | **`rebuild` exit 0.**<br>• **Case A** (`status` = 'Started'): `hideField('dateCompleted')` (ID: `6a6df70d6a93af8de`).<br>• **Case B** (`status` = 'Completed'): Live `change:status` trigger executes `showField('dateCompleted')` (ID: `6a6df70db51885e88`).<br>• **ACL:** Custom link checkers (`ParentLinkChecker`, `AccountLinkChecker`) verified live (returned `true` for system user / `false` for unreadable parent). | Commit 1 | **DONE & FULLY VERIFIED** |
| **Meeting** | **Rule 1:** fields.duration.readOnly | • **Rule 1:** `ValidateMeetingAllDayDuration.php`<br>• **Rule 1 JS:** `handleDurationReadOnly` in `detail.js` & `edit.js` bound via `this.listenTo(this.model, 'change:isAllDay', ...)` | **Fired once, confirmed**<br>• Backend: `error_log` verify.<br>• Frontend: Tier-4 `logicDefs.duration.readOnly` resolves to `NULL`. Both `logicDefs` & `clientDefs` live queries verified. | **`rebuild` exit 0.**<br>• **Case A** (`isAllDay` = false): `setFieldNotReadOnly('duration')` (ID: `6a6df9252dca18f72`).<br>• **Case B** (`isAllDay` = true): Live `change:isAllDay` trigger executes `setFieldReadOnly('duration')` (ID: `6a6df9253ffdaa07e`).<br>• **ACL:** Custom `AccessChecker` (`Espo\Modules\Crm\Classes\Acl\Meeting\AccessChecker`) verified live: Scenario A (User NOT in `users` linkMultiple): `checkEntityRead()` RETURNED: `false` (DENIED); Scenario B (User IS in `users` linkMultiple): `checkEntityRead()` RETURNED: `true` (ALLOWED). | Commit 1 | **DONE & FULLY VERIFIED** |
| **Call** | **0 logicDefs rules** (verified live & physical) | • **Step B:** N/A (0 rules in core)<br>• **Step D:** Static 1:1 `clientDefs` pointer to explicit `call` detail/edit/list JS views | **Live engine verified**<br>• `$metadata->get(['logicDefs', 'Call'])` returns `{ fields: {}, panels: {} }`<br>• `$metadata->get(['clientDefs', 'Call', 'recordViews'])` returns explicit Tier-4 array (`custom:views/call/record/{detail,edit,list}`). | **`rebuild` exit 0.**<br>• Saved record successfully (`6a6dfa4a676ab6264`), cleaned up.<br>• **Item (a):** Live `clientDefs.recordViews` query returns explicit Tier-4 views array.<br>• **Item (b):** View-layer `console.log` confirmed setup() execution.<br>• **Item (c):** Full contents quoted, clean stubs.<br>• **Item (d):** Custom `AccessChecker` (`Espo\Modules\Crm\Classes\Acl\Call\AccessChecker`) verified live: Scenario A (User NOT in `users` linkMultiple): `checkEntityRead()` RETURNED: `false` (DENIED); Scenario B (User IS in `users` linkMultiple): `checkEntityRead()` RETURNED: `true` (ALLOWED). | Commit 1 | **DONE & FULLY VERIFIED** |
| **Campaign** | **10 rules across fields & panels** (7 fields, 3 panels) | • **Step B:** `ValidateCampaignTypeDependencies.php`<br>• **Step D JS:** `handleTypeVisibility` in `detail.js` & `edit.js` bound via `this.listenTo(this.model, 'change:type', ...)` | **Fired once, confirmed**<br>• Backend: `error_log` verify.<br>• Frontend: All 10 Tier-4 `logicDefs` keys resolve to `NULL`. Both `logicDefs` & `clientDefs` live queries verified. | **`rebuild` exit 0.**<br>• **Email:** `targetLists`, `excludingTargetLists`, `massEmails`, `trackingUrls` SHOW (ID: `6a6dfb1bbedf36fcc`).<br>• **Newsletter:** `targetLists`, `excludingTargetLists`, `massEmails`, `trackingUrls` SHOW (ID: `6a6dfb1be83c65e75`).<br>• **Informational Email:** `targetLists`, `excludingTargetLists`, `massEmails` SHOW (ID: `6a6dfb1be9dcdc486`).<br>• **Mail:** `targetLists`, `excludingTargetLists`, `contactsTemplate`, `leadsTemplate`, `accountsTemplate`, `usersTemplate`, `mailMergeOnlyWithAddress`, `mailMerge` SHOW (ID: `6a6dfb1beb6f4bea9`).<br>• **Web:** ALL HIDE (ID: `6a6dfb1bed206e46c`).<br>• **ACL:** Standard default CRUD ACL (N/A). | Commit 1 | **DONE & FULLY VERIFIED** |
| **TargetList** | **Rule 1:** fields.entryCount.visible<br>**Rule 2:** fields.optedOutCount.visible | • **Rule 1 & 2:** `ValidateTargetListCountVisibility.php`<br>• **Rule 1 & 2 JS:** `handleCountsVisibility` in `detail.js` & `edit.js` bound via `this.listenTo(this.model, 'change:id', ...)` | **Fired once, confirmed**<br>• Backend: `error_log` verify.<br>• Frontend: Tier-4 `logicDefs.entryCount.visible` & `optedOutCount.visible` resolve to `NULL`. Both `logicDefs` & `clientDefs` live queries verified. | **`rebuild` exit 0.**<br>• **Case A** (`id` = null): `hideField('entryCount')` & `hideField('optedOutCount')`.<br>• **Case B** (`id` = '6a6dfc2fdb7f68b7f'): Live `change:id` trigger executes `showField('entryCount')` & `showField('optedOutCount')`.<br>• **ACL:** Standard Default Entity CRUD ACL (N/A). | Commit 1 | **DONE & FULLY VERIFIED** |

---

## PART 5 — Hard STOP gates (binary, no judgment calls)

All gates satisfied. No core files under `application/Espo/Modules/Crm/...` modified or deleted. All overrides reside cleanly in Tier 4 (`custom/Espo/Custom/...` and `client/custom/src/...`).