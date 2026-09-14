# 🏢 CodakCRM — Enterprise Stock & Finance Modules Blueprint & Detailed Codebase Technical Manual

> **System Target:** EspoCRM 10.0.3 | MySQL 8.4.3 | Database: `espo`  
> **Development Environment:** Laragon on Windows (`d:\laragon\www\EspoCRM-10.0.3`)  
> **Architecture Level:** Tier-4 Isolation (`custom/Espo/Custom/` & `client/custom/src/`)  
> **Core Guarantee:** Zero Core Mutation (100% Native Architecture & Metadata Compliance)

---

## 📌 1. ENVIRONMENT & PRE-FLIGHT DISCOVERY SUMMARY

- **EspoCRM Core Version:** `10.0.3` (Native support for v10 cascading links, multiple pipelines, and RequireJS views).
- **PHP Version & Engine:** PHP 8.x running under Laragon Apache environment.
- **Database Engine & Schema:** MySQL 8.4.3 (`dbname: espo`). Clean installation baseline (0 Accounts, 1 Contact, 5 Leads, 2 Opportunities, 2 Users).
- **Installed Commercial Packs:** Advanced Pack: **NO** | Sales Pack: **NO**.
- **System Branding:** `CodakCRM` (`applicationName => 'CodakCRM'`, `logoSrc => 'client/custom/img/logo.png'`).
- **Ignored Configuration Files (`.gitignore`):** `data/config.php`, `data/state.php`, `data/cache/`, `data/logs/`.

---

## 🔍 2. DISCOVERED CODEBASE DETAILS & EXISTING CUSTOM ARCHITECTURE

The codebase was thoroughly audited across all custom directories (`custom/Espo/Custom/`, `client/custom/`). Below is the exact inventory of existing custom code, configurations, hooks, controllers, and design assets currently running in the system:

### 2.1 Custom App Metadata & Asset Registration (`custom/Espo/Custom/Resources/metadata/app/`)
- **`client.json` File Path:** `custom/Espo/Custom/Resources/metadata/app/client.json`
  - **Favicon Icons:** `client/custom/img/favicon.ico`, `client/custom/img/favicon-196.png`
  - **Logo Variants:** `logo33`, `logo37`, `logo39` (`client/custom/img/logo-*.png`)
  - **Injected CSS Stylesheets (`cssList`):**
    1. `client/custom/css/custom-logo.css`
    2. `client/custom/css/custom-brand.css`
    3. `client/custom/css/custom-ui-animations.css`
  - **Injected JavaScript Bundles (`scriptList`):**
    1. `client/custom/src/codak-footer.js`

- **`clientRoutes.json` File Path:** `custom/Espo/Custom/Resources/metadata/app/clientRoutes.json`
  - **Route 1 (`HtmlPreview`):** maps to controller `custom:controllers/html-preview`, action `index`.
  - **Route 2 (`AnalyticsDashboard`):** maps to controller `custom:controllers/analytics-dashboard`, action `index`.

### 2.2 Custom Scopes (`custom/Espo/Custom/Resources/metadata/scopes/`)
- **`AnalyticsDashboard.json`:**
  - `object`: `false` (Non-entity UI scope, no database table).
  - `tab`: `true` (Rendered in main CRM tab list at position 5).
  - `acl`: `"boolean"`, `aclFieldLevelDisabled`: `true`, `module`: `"Custom"`.
  - `iconClass`: `"fas fa-chart-line"`, `color`: `"#00a4c8"`.
  - **Rule:** PRESERVE AS-IS. Do not modify, extend, or delete.
- **`HtmlPreview.json`:**
  - `object`: `false` (Non-entity UI utility scope).
  - `tab`: `false` (Accessible via custom client route `#HtmlPreview`).

### 2.3 Frontend Client Code & Custom Views (`client/custom/src/`)
- **SPA Footer Injector (`client/custom/src/codak-footer.js`):**
  - Uses a `MutationObserver` on `document.body` with `requestAnimationFrame` frame throttling to handle single-page application navigation transitions seamlessly.
  - Automatically suppresses legacy EspoCRM copyright links (`.credit`, `a[href*="espocrm.com"]`).
  - Dynamically appends `.codak-unified-footer` rendering `client/custom/img/logo-39.png`, brand link `Codak` (`https://codak.net/`), and copyright `© 2026 All Rights Reserved`.
- **HTML Live Preview View (`client/custom/src/views/html-preview/index.js`):**
  - RequireJS module `custom:views/html-preview/index` extending `view`.
  - Features a split-column layout: left column HTML code editor (`#html-code-input`) with interactive insertion buttons (Add Card, Add Button, Add Table, Clear), and right column real-time live preview canvas (`#html-live-output`).
- **Analytics Dashboard Controller & View:**
  - Controller `custom:controllers/analytics-dashboard` launching `custom:views/analytics-dashboard/index`.
- **Entity Specific View Overrides:** Custom view modules created under `client/custom/src/views/` for `Account`, `Opportunity`, `Case`, `Contact`, `Lead`, `Meeting`, `Call`, `Task`, `TargetList`, and `Campaign`.

### 2.4 CSS Design System & Theme Customizations (`client/custom/css/`)
- **`custom-ui-animations.css` Tokens & Utility Rules:**
  - Primary Theme Colors: `--codak-primary: #005a70`, `--codak-accent: #00a4c8`, `--codak-primary-hover: #004557`.
  - Gradient System: `--codak-primary-gradient: linear-gradient(135deg, #005a70 0%, #007c9b 100%)`.
  - Modern Typography: `--codak-font-sans: 'Inter', sans-serif`, `--codak-font-heading: 'Outfit', sans-serif`.
  - Navigation Animations: `#navbar .tabs>li>a` hover shimmer effects, active left border pulse animation (`sidebarPulse`), and icon bounce micro-animations (`iconBounce`).
  - Animated Typography: Shimmer gradient text (`textShimmer`), typewriter effect (`animate-typewriter`), and staggered entrance animation (`fadeUpEntrance`).
  - Security Display Guarantee: `.sticky-header-scope.hidden, .sticky-header-field.hidden, div.hidden.sticky-head { display: none !important; visibility: hidden !important; }`.

### 2.5 Custom Backend PHP Hooks (`custom/Espo/Custom/Hooks/`)
The following PHP `BeforeSave` hooks exist in the custom namespace `Espo\Custom\Hooks`:
1. **`Lead\RequireNameIfContactInfoEmpty` (`custom/Espo/Custom/Hooks/Lead/RequireNameIfContactInfoEmpty.php`):**
   - Implements `Espo\Core\Hook\Hook\BeforeSave`.
   - **Validation Logic:** Checks if `name`, `firstName`, and `lastName` are all empty while `accountName`, `emailAddress`, and `phoneNumber` are also all empty. Throws `Espo\Core\Exceptions\BadRequest` ("Name is required if Account Name, Email Address, and Phone Number are all empty.").
2. **`Opportunity\ValidateStageLastStageDependency` (`custom/Espo/Custom/Hooks/Opportunity/ValidateStageLastStageDependency.php`):**
   - Implements `BeforeSave`. Tracks stage changes to `Closed Lost`.
3. **`Contact\ValidateTitleAccountDependency` (`custom/Espo/Custom/Hooks/Contact/ValidateTitleAccountDependency.php`):**
   - Implements `BeforeSave`. Validates title and account relation dependencies.
4. **`Task\ValidateTaskDateCompletedVisibility` (`custom/Espo/Custom/Hooks/Task/ValidateTaskDateCompletedVisibility.php`):**
   - Implements `BeforeSave`. Validates `dateCompleted` visibility when status equals `Completed`.
5. **`Meeting\ValidateMeetingAllDayDuration` (`custom/Espo/Custom/Hooks/Meeting/ValidateMeetingAllDayDuration.php`):**
   - Implements `BeforeSave`. Validates `duration` read-only status when `isAllDay` is true.
6. **`TargetList\ValidateTargetListCountVisibility` (`custom/Espo/Custom/Hooks/TargetList/ValidateTargetListCountVisibility.php`):**
   - Implements `BeforeSave`. Controls visibility of `entryCount` and `optedOutCount`.
7. **`Case\ValidateCaseNumberVisibility` (`custom/Espo/Custom/Hooks/Case/ValidateCaseNumberVisibility.php`):**
   - Implements `BeforeSave`. Controls `number` field visibility.
8. **`Campaign\ValidateCampaignTypeDependencies` (`custom/Espo/Custom/Hooks/Campaign/ValidateCampaignTypeDependencies.php`):**
   - Implements `BeforeSave`. Controls type-dependent visibility for target lists and email templates.

---

## 🛠️ 3. STEP 1 — PRE-FLIGHT SPECIFICATIONS & ACTIONS

### S1.1 Base Currency Configuration & Exchange Rate Direction Rule
- **Base & Default Currency:** Set to **`EGP`** (Egyptian Pound).
- **Enabled Currencies:** `['EGP', 'USD', 'EUR']`.
- **Exchange Rate Direction Rule (Critical Fix):**
  In EspoCRM, when base currency = `EGP`, an exchange rate expresses **the value of ONE unit of foreign currency measured in EGP**.
  - `USD Rate`: Number of EGP per 1 USD (e.g. `48.50`).
  - `EUR Rate`: Number of EGP per 1 EUR (e.g. `53.00`).
  - *Inversion Safeguard:* Rate MUST be a two-digit number (e.g. `48.50`), NEVER a decimal fraction (e.g. `0.0206`). Small decimal fractions divide amounts by ~2300 instead of multiplying them.
- **Empirical Direction Test Protocol:**
  Create a throwaway test record with `100 USD`. Converted base value MUST output in the thousands of EGP (e.g. `4,850.00 EGP`). If it outputs ~2.06 EGP, the rate is inverted and must be corrected immediately.
- **Currency Field Defaults:** Every `currency` type field created in all modules explicitly defaults to `EGP`.
- **Ledger Base Amount:** `FinTransaction.amountBase` is ALWAYS stored in `EGP`. `exchangeRate` is stored PER ROW at posting time and NEVER re-read live during reporting.

### S1.2 Windows Task Scheduler Cron Configuration
- **Entry Point:** `php cron.php` (Working Directory: `d:\laragon\www\EspoCRM-10.0.3`).
- **Windows Task Scheduler Setup:**
  - Task Name: `EspoCRM_Cron`
  - Schedule: Every 1 minute (`/sc minute /mo 1`)
  - Execution User: `SYSTEM` (Select **"Run whether user is logged on or not"**)
  - Start-in Directory (Explicit): `d:\laragon\www\EspoCRM-10.0.3`
- **Verification Proof:** `adminNotificationsCronIsNotConfigured` notification cleared, test scheduled job executed, log entry verified in `data/logs/espo-YYYY-MM-DD.log`.

### S1.3 Reporting Layer Architecture (B4 Decision)
- **Bespoke In-App Engine Status:** REJECTED under all circumstances to prevent maintenance overhead.
- **Adopted Implementation:** **Option B (External BI via Metabase / PowerBI)** combined with **Option C (Native Static KPI Tiles)**.
  - Dedicated Read-Only MySQL User: `metabase_ro` (`GRANT SELECT ON espo.* TO 'metabase_ro'@'%'`).
  - Semantic Layer: All 22 reports map directly to `StockMove`, `StockBalance`, `FinTransaction`, `Invoice`, `Bill`, `Payment` tables via `GROUP BY` queries on denormalized dimensions.
- **Mandatory Denormalized Fields:** `categoryType`, `productCategoryName`, `accountName`, `salesRep`, `agingBucket`, `daysOverdue`, `daysToPay` MUST be stamped on transaction rows at save time.

---

## 🔒 4. NON-NEGOTIABLE ARCHITECTURAL RULES (R1 – R12)

1. **R1 (Un-editable Balances):** Balances (`StockBalance`, `BankAccount.currentBalance`, `CreditUsed`) are derived sums of signed movement rows. No direct user editing.
2. **R2 (Immutable Ledgers):** `StockMove` and `FinTransaction` are 100% immutable. No edit, no delete, ever, by any user.
3. **R3 (Document Lifecycle & Reversals):** Lifecycle: `Draft` -> `Confirmed` -> `Cancelled`. Movements generated ONLY on transition to `Confirmed`. Cancellation creates reversing moves; never deletes rows.
4. **R4 (Absolute Sign Convention):**  
   - `POSITIVE (+)` = Inbound / Revenue / Receipt / Stock Increase.  
   - `NEGATIVE (-)` = Outbound / Cost / Expense / Issue / Stock Decrease.
5. **R5 (Single Shared Dimensions):** `CostCenter`, `Warehouse`, `Product`, `Account`, `FiscalPeriod`, `FinCategory`, `Project` are single shared entities used across BOTH Stock and Finance modules.
6. **R6 (Mandatory Denormalization):** Copy grouping dimensions (`categoryType`, `productCategoryName`, `accountName`, `salesRep`, etc.) onto movement rows at save time.
7. **R7 (Zero Core Mutation):** All custom PHP under `custom/Espo/Custom/`. All metadata JSON under `custom/Espo/Custom/Resources/metadata/`.
8. **R8 (Transactional Consistency):** All multi-record operations executed inside `TransactionManager` (start/commit/rollback).
9. **R9 (Immutability Enforcement Order):**
   - **Primary Defense:** PHP `beforeSave` hook (if `!$entity->isNew()` -> throw `Forbidden`) and `beforeRemove` hook (always throw `Forbidden`). Applies to ALL users including Admins.
   - **Secondary Defense:** Roles ACL (create=yes, read=all, edit=NO, delete=NO).
   - Strip edit/delete from detail & list layouts and row-action menus.
10. **R10 (Precision & Rounding Policy):**
    - Cost Fields (`avgCost`, `unitCost`, `finalUnitCost`, `standardCost`, `lastPurchaseCost`): **Minimum 4 decimal places (4dp)**.
    - Document & Ledger Amounts (`grandTotal`, `amountBase`, `subtotal`, `lineTotal`): **2 decimal places (2dp)**.
    - Round ONCE at posting time. Carry rounding remainder onto the LAST item line in landed cost/proportional allocations.
11. **R11 (Espo v10.0 Native Features):**
    - Native cascading links (`cascade` removal) on header->items relationships for `Draft` document cleanup.
    - Status removal guard via PHP `beforeRemove` hook to block deletion of `Confirmed` documents.
    - Multiple pipelines for procurement stage tracking (`PurchaseRequisition` -> `PurchaseOrder` -> `GoodsReceipt`).
12. **R12 (Centralized State Machine):** Status transitions validated in a single state-machine map inside `StateTransitionService.php` called from `beforeSave` hooks.

---

## 🏗️ 5. PHASED MODULE SPECIFICATION

### PHASE 1 — SHARED DIMENSIONS
- **`CostCenter`**: name, code(varchar, unique), type(enum: Department/Branch/Project/Other), parent(link self), manager(link User), isActive(bool, default true).
- **`Warehouse`**: name, code(varchar, unique), type(enum: Main/Branch/Damaged/Transit/Virtual), address, manager(link User), isActive(bool), allowNegativeStock(bool, default false).
- **`BinLocation`**: name, warehouse(link, required), aisle, rack, level, isActive(bool).
- **`FiscalPeriod`**: name, dateStart(date), dateEnd(date), status(enum: Open/Closed, default Open), fiscalYear(varchar).
- **`FinCategory`** (CategoryTree): name, code(varchar, unique), type(enum: Revenue/COGS/OpEx/OtherIncome/OtherExpense/Transfer/Opening), parent, isActive(bool).
- **`BankAccount`**: name, type(enum: Bank/CashBox/EWallet/CreditCard), accountNumber, iban, bankName, currency(default EGP), openingBalance(currency), openingDate(date), currentBalance(currency, read-only cache), isActive(bool), responsibleUser(link User).

---

### PHASE 2 — STOCK CORE & POSTING ENGINE

#### 2.1 Entities
- **`Product`** (BasePlus): name, code(unique, required), barcode, productCategory(link CategoryTree), unit(enum: Piece/Box/Carton/Kg/Liter/Meter/Hour), trackingType(enum: None/Batch/Serial), costMethod(enum: Average/Standard), avgCost(currency, 4dp, read-only), standardCost(currency, 4dp), lastPurchaseCost(currency, 4dp, read-only), salesPrice(currency), reorderPoint(float), maxLevel(float), shelfLifeDays(int), weight(float), isActive(bool), defaultWarehouse(link Warehouse), defaultSupplier(link Account).
- **`InventoryNumber`**: name(batch/serial number), product(link, required), type(enum: Batch/Serial), manufacturingDate(date), expirationDate(date), status(enum: Active/Quarantine/Expired/Consumed). Composite uniqueness on `product + name`.
- **`StockMove`** (Immutable Ledger): number(auto), product(link, required), warehouse(link, required), binLocation(link), inventoryNumber(link), quantity(float, signed), unitCost(currency, 4dp), totalCost(currency), moveDate(date), moveDateTime(datetime), type(enum: Receipt/Issue/TransferIn/TransferOut/AdjustmentIn/AdjustmentOut/Opening/Reversal), parent(linkParent -> GoodsReceipt, GoodsIssue, StockTransfer, StockAdjustment, StockCount, Invoice), account(link Account), costCenter(link), project(link), productCategoryName(varchar, denormalized), reversedMove(link self), isReversed(bool).
- **`StockBalance`** (Rebuildable Cache): product(link), warehouse(link), binLocation(link), quantityOnHand(float), quantityReserved(float), quantityAvailable(float, computed), avgCost(currency, 4dp), stockValue(currency), lastMoveDate(date), key(varchar, unique, hidden: `productId_warehouseId_binLocationId`).

#### 2.2 Documents
- **`GoodsReceipt` / `GoodsReceiptItem`**: Header (number, date, warehouse, account, reference, status, currency, exchangeRate, subtotal, freightCost, customsCost, insuranceCost, otherCost, landedCostTotal, landedAllocationMethod, grandTotal, costCenter, project, isOpening, notes, postedAt, postedBy). Item (goodsReceipt, product, inventoryNumber, binLocation, quantity, unitPrice, lineTotal, allocatedLandedCost, finalUnitCost 4dp read-only, expirationDate).
- **`GoodsIssue` / `GoodsIssueItem`**: Header (number, date, warehouse, account, reason, status, costCenter, project, relatedInvoice, notes). Item (product, inventoryNumber, binLocation, quantity, unitCost 4dp read-only, lineCost).
- **`StockTransfer` / `StockTransferItem`**: Header (number, date, warehouseFrom, warehouseTo, status: Draft/InTransit/Received/Cancelled, shippedDate, receivedDate, notes). Two-step mandatory (Confirm -> TransferOut; Receive -> TransferIn).
- **`StockAdjustment` / `StockAdjustmentItem`**: Header (number, date, warehouse, reason, status, costCenter, approvedBy, totalValueImpact). Item (product, inventoryNumber, binLocation, quantity signed, unitCost, lineValue).
- **`StockCount` / `StockCountItem`**: Header (number, date, warehouse, countType, status, countedBy, resultingAdjustment). Item (product, binLocation, systemQuantity, countedQuantity, variance, varianceValue). Auto-creates `StockAdjustment` on Adjusted status.

#### 2.3 Costing & Reversal Policy
- **Moving Weighted Average Cost Formula:**  
  $$\text{newAvg} = \frac{(\text{onHandQty} \times \text{oldAvg}) + (\text{inQty} \times \text{finalUnitCost})}{\text{onHandQty} + \text{inQty}}$$  
  *Guard:* If $(\text{onHandQty} + \text{inQty}) \le 0$, retain `oldAvg` and log a warning.
- **Landed Cost Allocation:** Allocated ByValue / ByQuantity / ByWeight. Remainder carried to the last item line.
- **Touchless Reversal Policy:** Reversal of a `GoodsReceipt` is REJECTED if any part of the received stock has already been issued, transferred, or adjusted (direct user to `StockAdjustment`). Reversal is ALLOWED only if received stock is untouched.

#### 2.4 Stock Automation Jobs
- `StockReorderCheck` (Daily): `quantityAvailable < reorderPoint` -> create `PurchaseRequisition` & notify purchasing team.
- `StockExpiryAlert` (Daily): Inventory numbers expiring in 30/60/90 days -> notify & set status `Expired`.
- `StockBalanceIntegrityCheck` (Weekly): Compare `StockBalance` cache against `SUM(StockMove)` and report drift.

---

### PHASE 3 — FINANCE CORE & POSTING ENGINE

#### 3.1 Entities
- **`FinTransaction`** (Immutable Ledger): number(auto), transactionDate(date), transactionDateTime(datetime), amount(currency, signed), amountBase(currency, EGP), currency, exchangeRate, category(link FinCategory), categoryType(enum, denormalized), bankAccount(link), account(link Account), accountName(varchar, denormalized), contact(link), costCenter(link), project(link), product(link), warehouse(link), paymentMethod(enum: Cash/BankTransfer/Cheque/Card/EWallet/Other), parent(linkParent -> Invoice, Bill, Payment, Expense, GoodsIssue, StockAdjustment, JournalAdjustment), salesRep(link User), fiscalPeriod(link), description, reversedTransaction(link self), isReversed(bool).
- **`Invoice` / `InvoiceItem`**: Header (number, date, dueDate, account, contact, billingAddress, opportunity, status: Draft/Sent/PartiallyPaid/Paid/Overdue/Cancelled/Void, currency, exchangeRate, subtotal, discountAmount, discountPercent, taxRate, taxAmount, shippingAmount, grandTotal, amountPaid read-only, balance, agingBucket, daysOverdue, daysToPay, salesRep, costCenter, project, paymentTerms, relatedGoodsIssue, notes, terms). Item (invoice, product, description, quantity, unitPrice, discount, taxRate, lineTotal, unitCostSnapshot 4dp, lineCost).
- **`Bill` / `BillItem`**: Supplier mirror of Invoice, plus `purchaseOrder`, `supplierInvoiceNumber`, `relatedGoodsReceipt`.
- **`Payment`**: number, date, type(Receipt/Disbursement), amount(currency), currency, exchangeRate, bankAccount, account, contact, paymentMethod, reference, chequeNumber, chequeDate, status(Draft/Posted/Cancelled/Bounced), allocatedAmount(read-only), unallocatedAmount(computed), notes.
- **`PaymentAllocation`**: payment, invoice, bill, amountAllocated, allocationDate. Aggregate validation in PHP (`SUM(allocations) <= payment.amount` & `SUM(allocations) <= invoice.grandTotal`). Updates `Payment.allocatedAmount`, `Invoice.amountPaid`, `Invoice.status` (Paid when balance <= 0.01 EGP), and sets `daysToPay`.
- **`Expense`**: number, date, amount, category, costCenter, project, bankAccount, account, paymentMethod, status(Draft/Submitted/Approved/Rejected/Paid), requestedBy, approvedBy, approvedAt, attachments, taxAmount, isBillable, notes.
- **`Budget` / `BudgetLine`**: Budget (name, fiscalPeriod, costCenter, status, totalPlanned). BudgetLine (budget, category, plannedAmount, actualAmount read-only, variance, variancePercent).
- **`JournalAdjustment`**: Manual correction entries (number, date, amount signed, category, costCenter, bankAccount, reason, status: Draft/Posted, approvedBy). Produces exactly one `FinTransaction`.

#### 3.2 Finance Posting Rules
- **Invoice Confirmed:** `FinTransaction` (+grandTotal in EGP, `categoryType=Revenue`, parent=Invoice).
- **Bill Confirmed:** `FinTransaction` (-grandTotal in EGP, `categoryType=COGS` or `OpEx`, parent=Bill).
- **Payment Posted:** `FinTransaction` (±amount in EGP, **`categoryType=Transfer`**, bankAccount set). *CategoryType MUST be Transfer to avoid double-counting revenue in P&L.*
- **GoodsIssue (Sale) Confirmed (Cross-Module Bridge):** `FinTransaction` (-SUM(lineCost) in EGP, `categoryType=COGS`, parent=GoodsIssue). *Bridges Stock and Finance for Gross Margin reporting.*
- **Expense Approved/Paid:** `FinTransaction` (-amount in EGP, categoryType per expense category).
- **StockAdjustment:** Negative value -> `OtherExpense`; Positive value -> `OtherIncome`.

#### 3.3 Finance Jobs
- `InvoiceAgingRefresh` (Daily): Computes `daysOverdue = today - dueDate`, updates `agingBucket` & sets `status=Overdue`.
- `BankBalanceRefresh` (Hourly): `BankAccount.currentBalance = openingBalance + SUM(FinTransaction.amountBase)`.
- `BudgetActualRefresh` (Daily): Refreshes `BudgetLine.actualAmount` from `FinTransaction`.
- `FinIntegrityCheck` (Weekly): Detects unallocated payment drifts and bank balance variances.

---

### PHASE 4 — CRM INTEGRATION & PROCUREMENT

- **`Account` Enhancements:**
  - Relationships: `invoices`, `bills`, `payments`, `finTransactions`, `goodsIssues`, `goodsReceipts`, `purchaseOrders`.
  - Fields: `creditLimit`, `creditUsed` (read-only), `creditAvailable` (computed), `paymentTermsDefault`, `accountFinStatus` (Good/Watch/OnHold/Blocked), `totalRevenue` (read-only), `outstandingBalance` (read-only), `lastPaymentDate`.
  - Credit Limit Guard Hook: Blocks Invoice confirmation if `(outstandingBalance + grandTotal) > creditLimit`.
- **`Opportunity` Integration:** `Closed Won` status automatically generates a `Draft` Invoice pre-filled from Opportunity.
- **`Case` Integration:** Links to `Invoice` & `Product` for warranty and return tracking.
- **`User` Integration:** `salesRep` links & `commissionPercent`.
- **Procurement Entities:**
  - `PurchaseRequisition` / Item (Draft/Submitted/Approved/Rejected/Ordered). Uses v10 Multiple Pipelines for stage tracking.
  - `PurchaseOrder` / Item (Draft/Sent/PartiallyReceived/Received/Cancelled). Enables 3-way quantity matching (Ordered vs Received vs Billed).
- **Navigation Menu:** Adds `Finance` and `Inventory` Tab Groups.

---

### PHASE 5 — REPORTING & BI DASHBOARDS (Per B4 Decision)

- **Supported BI Engine:** Option B (Metabase / PowerBI via read-only MySQL user `metabase_ro`) + Option C (4 Static KPI Tiles in Espo).
- **22 Standard BI Reports Mapped:**
  1. P&L by Month (`FinTransaction` grouped by month x `categoryType`).
  2. P&L by Cost Center (`FinTransaction` grouped by `costCenter` x `categoryType`).
  3. Gross Margin by Product (`FinTransaction` Revenue vs COGS by `product`).
  4. Gross Margin by Customer (`FinTransaction` Revenue vs COGS by `account`).
  5. Budget vs Actual (`BudgetLine` planned vs actual).
  6. Revenue & Margin per Customer (`account` x `categoryType`).
  7. AR Aging by Bucket (`Invoice` grouped by `agingBucket` x `account`).
  8. Top 20 Customers (Ordered by revenue).
  9. Customer Payment Behavior (`daysToPay` average).
  10. Dormant Customers (No invoice in 90 days).
  11. Stock on Hand by Warehouse (`StockBalance` grouped by `warehouse` x `product`).
  12. Stock Movement Log (`StockMove` grouped by `product` x `type`).
  13. Slow-Moving / Dead Stock (`StockBalance > 0` with no Issue in N days).
  14. Inventory Turnover (COGS / avg stock value).
  15. Expiring Batches (`InventoryNumber` expiring in 90 days).
  16. Stock Variance (`StockCountItem` varianceValue).
  17. Reorder Alert List (`StockBalance.quantityAvailable < reorderPoint`).
  18. Cash Position by Bank Account (`BankAccount.currentBalance`).
  19. Cash In/Out by Month (`FinTransaction` by month x `paymentMethod`).
  20. Expected Inflows (`Invoice` balance grouped by `dueDate` month).
  21. Expected Outflows (`Bill` balance grouped by `dueDate` month).
  22. Net 90-Day Cash Forecast (Combined inflows & outflows).

---

### PHASE 6 — HARDENING, SECURITY, LOCALIZATION & CLI COMMANDS

#### Security Roles Matrix
1. **Sales Rep:** Own/Team Accounts & Invoices (Draft edit only). NO access to cost fields (`avgCost`, `unitCost`), NO access to `FinTransaction`.
2. **Warehouse Keeper:** Own Warehouse documents only. Read Products WITHOUT cost fields. Create Receipts/Issues/Counts.
3. **Warehouse Manager:** All Warehouses. Approve Stock Adjustments. No Finance access.
4. **Accountant:** Full Finance read/create. No delete anywhere. No HR or Stock cost edits.
5. **Finance Manager:** All Finance + Approvals, Period Closing, Credit Limit Overrides.
6. **Executive:** Read-only access to all entities & reports.

#### Field-Level ACL Restrictions
Cost fields restricted from Sales Reps & Warehouse Keepers at the API level:
`Product.avgCost`, `Product.standardCost`, `Product.lastPurchaseCost`, `InvoiceItem.unitCostSnapshot`, `GoodsIssueItem.unitCost`, `StockMove.unitCost`, `StockMove.totalCost`, `StockBalance.avgCost`, `StockBalance.stockValue`, `Account.creditLimit`.

#### Deliverables & Operational Requirements (D1 – D6)
- **D1. 9 RTL Arabic-Safe PDF Templates:** Invoice, Bill, Payment Receipt, Goods Receipt Note, Delivery/Issue Note, Stock Transfer Note, Stock Count Sheet, Purchase Order, Customer Statement.
- **D2. Full Incremental Localization:** Complete `ar_EG` and `en_US` label translations created incrementally alongside each entity.
- **D3. Field-Level ACL Verification:** API-level verification for restricted cost fields.
- **D4. DB Indexes Declared in `entityDefs`:**
  - `StockMove(product, warehouse, moveDate)`
  - `StockMove(parentType, parentId)`
  - `FinTransaction(transactionDate, categoryType)`
  - `FinTransaction(bankAccount)`
  - `FinTransaction(account)`
  - `FinTransaction(parentType, parentId)`
  - `Invoice(status, dueDate)`
  - `Invoice(account)`
  - `StockBalance(key)` UNIQUE
- **D5. Opening Balances CSV Import Templates:** CSV templates for opening stock (`GoodsReceipt` reason=Opening) and opening cash (`FinTransaction` categoryType=Opening).
- **D6. Performance Seeding Verification:** Seeding 100,000 `StockMove` and 100,000 `FinTransaction` rows and reporting query timings before Phase 4.
- **CLI Commands Created:**
  - `bin/command stock-balance-rebuild`
  - `bin/command avg-cost-rebuild`
  - `bin/command fin-cache-rebuild`
- **Linux Production Migration Plan:** Documented runbook covering file permissions, Linux crontab, filesystem case-sensitivity, PHP extensions, and MySQL collation.

---

## 🧪 6. ARITHMETIC ACCEPTANCE SCENARIOS

### Checkpoint 2 — Stock Arithmetic Acceptance
1. **Receipt A:** 10 units @ 100 EGP -> `onHand` = 10, `avgCost` = 100.00 EGP, `stockValue` = 1000.00 EGP.
2. **Receipt B:** 10 units @ 120 EGP -> `onHand` = 20, `avgCost` = **110.00 EGP** (exact), `stockValue` = 2200.00 EGP.
3. **Issue:** 5 units -> `onHand` = 15, `stockValue` = 1650.00 EGP, COGS `FinTransaction` = -550.00 EGP.
4. **Receipt C:** 10 units @ 100 EGP + 200 EGP freight (ByValue allocation) -> `finalUnitCost` = 120.00 EGP -> `onHand` = 25, `avgCost` = **114.00 EGP** exactly ($[(15 \times 110) + (10 \times 120)] / 25 = 2850 / 25 = 114.00$), `stockValue` = 2850.00 EGP.
5. **Transfer:** 5 units to WH2 -> `avgCost` UNCHANGED at 114.00 EGP. WH1: 20 units (2280.00 EGP), WH2: 5 units (570.00 EGP), Total = 2850.00 EGP.
6. **Count in WH1:** Counted = 18 (onHand - 2) -> Variance = -2, adjustment posted, value impact = **-228.00 EGP**, `OtherExpense` `FinTransaction` = -228.00 EGP, Total = 23 units (2622.00 EGP).
7. **Attempt to Cancel Receipt B:** MUST BE REJECTED (received goods have been issued/transferred). Test successful reversal on untouched receipt.
8. **Run `stock-balance-rebuild`:** Cache matches `SUM(StockMove)` to the piastre.

### Checkpoint 3 — Finance Arithmetic Acceptance
1. **Invoice 1000 EGP confirmed:** Revenue = +1000.00 EGP (Exactly ONE row).
2. **GoodsIssue linked:** COGS = -550.00 EGP (Exactly ONE row).
3. **Payment 400 EGP posted:** `categoryType` = **Transfer**.
4. **Allocate 400 EGP:** `amountPaid` = 400, `balance` = 600, status = `PartiallyPaid`.
5. **Re-run P&L aggregation:** Revenue is STILL **1000.00 EGP** (NOT 1400.00 EGP). Gross Margin = Revenue 1000 - COGS 550 = **450.00 EGP**.
6. **Second Payment 600 EGP:** status = `Paid`, `balance` = 0, `daysToPay` set.
7. **Over-allocate by 1 EGP:** REJECTED by PHP validation.
8. **Post into Closed FiscalPeriod:** REJECTED by PHP validation.
9. **Aging Job with backdated dueDate:** `agingBucket` & `daysOverdue` populate.
10. **`BankAccount.currentBalance`:** Matches `openingBalance + SUM(ledger)` exactly.
