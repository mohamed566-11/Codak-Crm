# EXECUTIVE SUMMARY

**Subject:** `custom:views/analytics-dashboard/index` — EspoCRM 10.0.3 custom client-side BI view (~3,000 lines, single Backbone view module, 125 KB).

**Total findings: 68**

| Bucket | Count |
|---|---|
| CRITICAL | 4 |
| HIGH | 14 |
| MEDIUM | 26 |
| LOW | 17 |
| INFO | 7 |

**By category:** Security 7 · Logic/Correctness 21 · Data Integrity 9 · Reliability 12 · Performance 8 · API/Network 6 · Code Quality 5.

**Headline verdict:** the code is defensively written at the *string level* (`escapeHtml` is applied consistently, division-by-zero is guarded, `safeFetch` normalises responses) but is **fundamentally unsound at the data level**. Every number the dashboard displays is computed from at most **200 records per entity**, yet is labelled "Total Revenue", "Total Leads", "Win Rate". Opportunity amounts are summed across **mixed currencies** while the correct base-currency field (`amountConverted`) is fetched and then ignored. Failures — including expired sessions and permission denials — are swallowed and rendered as **$0** with no error indication.

This is not a rendering bug class. It is a **decision-integrity** bug class: management will act on figures that are silently and systematically wrong.

> **Reporting note:** CRITICAL and HIGH findings use the full template. MEDIUM/LOW/INFO findings use a condensed but complete entry format (problem → cause → impact → fix) to keep the document usable; no finding has been omitted. Line numbers are given where the indexed source exposed them and are marked approximate.

---

# FINDINGS

## [DAT-01] CRITICAL — All KPIs and totals are computed from a 200-record sample but presented as absolute totals

**Category:** Data Integrity / Business Logic
**Confidence:** CONFIRMED
**Location:** `ajaxGetRequest()`; consumed by `loadMetrics()` → `renderDashboard()` (~lines 700–760)

**Problem:**
Every request is hard-capped and hard-sorted:

```javascript
var url = 'api/v1/' + entity + '?maxSize=200&orderBy=createdAt&order=desc';
```

`renderDashboard` then computes `totalRevenue`, `totalLeads`, `totalAccounts`, `convRate`, `winRate`, `avgDeal`, `weightedPipeline` over these arrays and renders them under labels such as **"Total Revenue"** and **"Total Opportunities"**.

**Why it happens:**
The module treats a paginated list endpoint as an aggregation endpoint. Aggregation must happen in SQL (`SUM`, `COUNT`, `GROUP BY`) server-side; here it happens in the browser over page 1 of 1.

**Impact:**
"Total Revenue" actually means *"revenue of the 200 most recently created opportunities"*. In a CRM with 5,000 opportunities, the figure is not an approximation — it is an arbitrary slice whose composition changes as records are created. Two users looking at the same dashboard on different days get incomparable numbers. Year-over-year comparison is impossible. The Executive dashboard becomes an active misinformation surface.

**Trigger / Scenario:**
Any entity exceeding 200 records — i.e. any production database after a few weeks.

**Evidence:**
`maxSize=200` (hardcoded) + `var totalRevenue = opps.filter(...).reduce(...)`.

**Recommended Fix:**
Move aggregation server-side. Either (a) a custom PHP API endpoint returning pre-aggregated KPI rows via the ORM's aggregate functions, or (b) abandon client-side BI entirely and query the database from a BI tool. If the current design must survive short-term, read the `total` field already present in the API response and refuse to render any "Total" label when `total > list.length`, replacing the figure with an explicit "Not computable — N records exceed sample limit".

**Priority:** Immediate

---

## [DAT-02] CRITICAL — Opportunity amounts summed across mixed currencies; the base-currency field is fetched then discarded

**Category:** Data Integrity / Financial
**Confidence:** CONFIRMED
**Location:** `loadMetrics()` (`oppSelect`), `renderDashboard()` (~line 720)

**Problem:**
The select list explicitly requests both fields:

```javascript
var oppSelect = 'name,accountName,stage,amount,amountConverted,probability,...';
```

but every calculation uses the raw `amount`:

```javascript
var totalRevenue = opps.filter(function (o) { return o.stage === 'Closed Won'; })
                       .reduce(function (sum, o) { return sum + Number(o.amount || 0); }, 0);
```

`amountConverted` — Espo's base-currency-normalised value — is never referenced anywhere in the file.

**Why it happens:**
`amount` is stored in the *record's own* currency. Espo maintains `amountConverted` precisely so that cross-record aggregation is possible. The author fetched it (so was aware of it) and then summed the wrong column.

**Impact:**
1,000 EGP + 1,000 USD is rendered as "2,000" and formatted with a `$`. Since this instance is being configured with `currencyList = ['EGP','USD','EUR']` (per the surrounding project context), this is guaranteed to produce garbage the moment a second currency is used. Revenue, average deal size, weighted pipeline, gross margin, and the CSV export are all corrupted simultaneously, and the error is *invisible* — the number looks plausible.

**Trigger / Scenario:**
One opportunity in a non-base currency.

**Evidence:** `sum + Number(o.amount || 0)` with `amountConverted` unused.

**Recommended Fix:**
Use `amountConverted` for every aggregation, comparison, and chart. Reserve `amount` strictly for displaying a single record in its own currency alongside its own currency symbol. Additionally, never aggregate money in IEEE-754 floats (see PERF/DAT-09); accumulate in integer minor units.

**Priority:** Immediate

---

## [SEC-01] CRITICAL — CSV formula injection in the export path

**Category:** Security
**Confidence:** CONFIRMED
**Location:** `exportCSV()` → `escapeCsv()` (~lines 470–640)

**Problem:**
`escapeCsv` handles CSV *quoting* correctly but performs no **formula neutralisation**:

```javascript
function escapeCsv(val) {
    if (val === null || val === undefined) return '""';
    var str = String(val).replace(/"/g, '""');
    return '"' + str + '"';
}
```

A field value beginning with `=`, `+`, `-`, `@`, tab, or CR is interpreted by Excel, LibreOffice Calc, and Google Sheets as a formula, not text — quoting does not prevent this.

**Why it happens:**
CSV quoting solves *parsing* ambiguity; it does not solve *spreadsheet evaluation*. These are two separate escaping contexts, and only the first was addressed.

**Impact / Attack scenario:**
Lead records are the classic untrusted-input vector — web-to-lead forms, imports, and public sign-up pages let an **unauthenticated external party** write into `name`, `title`, `website`, or `addressCity`. That value flows: external form → CRM record → `api/v1/Lead` → `exportCSV` → analyst's Excel on a corporate workstation. On open, the formula evaluates in the analyst's security context. Realistic outcomes: data exfiltration to an attacker-controlled URL via a webquery/hyperlink function, coercing the user through the "enable content"/DDE trust prompt, or silent corruption of the exported figures. Severity is elevated because the payload crosses a trust boundary and lands *outside* the browser sandbox, on a machine belonging to someone with financial authority.

**Trigger / Scenario:**
Attacker submits a lead whose name begins with `=`. Any analyst clicks "Export CSV" and opens the file.

**Evidence:** `return '"' + str + '"';` with no leading-character inspection.

Note the code even injects its *own* formula-like cells: `makeTitleRow('=== LEADS DATA (...) ===', 14)` — a cell starting with `===` will itself render as an error in Excel.

**Recommended Fix:**
Before quoting, if the value's first character is one of `= + - @ \t \r`, prefix it with a single apostrophe or a space so the spreadsheet treats it as literal text. Apply this in one shared helper used by *all* CSV writers (`escapeCsv`, `formatPhone`, `formatMoney`, `makeTitleRow`). Strip embedded CR/LF. Prefer server-side export with a proper CSV/XLSX library over hand-rolled string building.

**Priority:** Immediate

---

## [REL-01] CRITICAL — All fetch failures, including 401 and 403, are swallowed and rendered as zero

**Category:** Reliability / Security (silent authorization failure)
**Confidence:** CONFIRMED
**Location:** `safeFetch()` inside `loadMetrics()`

**Problem:**
```javascript
function safeFetch(entity, fields, dateField) {
    return self.ajaxGetRequest(entity, fields, dateField).then(function (res) {
        return (res && res.list) ? res.list : [];
    }).catch(function (err) {
        console.warn('[Analytics BI] Fetch warning for ' + entity + ':', err);
        return [];
    });
}
```

Every failure mode — network error, timeout, HTTP 500, **HTTP 403 (no ACL permission)**, **HTTP 401 (expired session)** — resolves to `[]`. The UI then renders a clean, confident, fully-styled dashboard reading **$0 / 0 / 0%** with no banner, no icon, no indication that anything failed. The only trace is a `console.warn` no user will ever read.

**Why it happens:**
The catch handler conflates "no data" with "could not obtain data". These are semantically opposite states for a reporting tool.

**Impact:**
Three concrete production scenarios:
1. **Session expiry** — the user leaves the tab open over lunch, returns, hits Refresh. All six calls 401. The dashboard reports zero revenue. Because the module uses raw `$.ajax` instead of Espo's Ajax layer (API-02), there is no 401 interception and no redirect to login.
2. **Permission boundary** — a Sales Rep without Opportunity read access sees "Total Revenue: $0" rather than "access denied", and may reasonably report upward that the pipeline is empty.
3. **Partial backend failure** — one entity's query times out; five KPIs are right, one is zero, and nothing distinguishes them.

A reporting system that displays a wrong number confidently is more dangerous than one that crashes.

**Trigger / Scenario:** Any non-2xx response. Guaranteed to occur.

**Evidence:** `.catch(... return []; )` with no state flag propagated to the view.

**Recommended Fix:**
Track per-entity fetch status (`ok` / `forbidden` / `error`). Render an explicit error state per affected widget and suppress any KPI derived from failed data — never substitute zero. Detect 401 and delegate to Espo's re-authentication flow. Reserve `[]` for a genuine HTTP 200 with an empty list.

**Priority:** Immediate

---

## [LOG-01] HIGH — Server filters Meetings by `createdAt` while the client filters the same records by `dateStart`

**Category:** Logic
**Confidence:** CONFIRMED
**Location:** `loadMetrics()` (`safeFetch('Meeting', meetingSelect, 'createdAt')`) vs `processAndRender()` (`filterByDate(meetings, 'dateStart')`)

**Problem:**
Two independent date filters are applied in sequence on *different columns*:

```javascript
safeFetch('Meeting', meetingSelect, 'createdAt')   // server: WHERE createdAt BETWEEN ...
...
meetings = filterByDate(meetings, 'dateStart');     // client: keep if dateStart in range
```

**Why it happens:**
Date filtering is implemented twice (see QUAL-01) and the two implementations disagree on the semantic date field for Meetings.

**Impact:**
The intersection is almost never what the user asked for:
- A meeting **created** three months ago and **scheduled for today** is *never fetched* — so "Today's Meetings" misses exactly the meetings that matter most.
- A meeting **created today** for **next quarter** is fetched, then discarded client-side — wasted payload.

Net effect: for any period filter, the Meetings tab is systematically under-reported, and "Upcoming Meetings" trends toward zero. Users will conclude the calendar is empty.

**Trigger / Scenario:** Select any period other than "All Time" on the Meetings or Overview tab.

**Recommended Fix:**
Pass `dateStart` as the server-side filter attribute for Meetings and remove the client-side pass entirely (single source of truth). Decide explicitly, per entity, whether the business question is "created in period" or "occurred in period" and document it in the UI label.

**Priority:** Immediate

---

## [LOG-02] HIGH — Draft emails are excluded by both filter layers, yet a "Draft Emails" KPI is still displayed

**Category:** Logic
**Confidence:** CONFIRMED
**Location:** `ajaxGetRequest` (`dateField = 'dateSent'` for Email); `filterByDate` (`if (!d) return false;`)

**Problem:**
Draft emails have `dateSent = NULL`. Two layers drop them:
- SQL: `WHERE dateSent AFTER '...'` — `NULL` never satisfies a comparison predicate, so drafts are excluded at the database.
- Client: `var d = item[dateProp] || item.createdAt; if (!d) return false;` — and independently, any record with an unparseable date is dropped.

Yet the Email tab renders a `Draft Emails` KPI card.

**Why it happens:**
NULL-handling was not considered when choosing `dateSent` as the filter column for an entity whose rows legitimately have no send date.

**Impact:**
`Draft Emails` reads **0** under every period filter except "All Time", regardless of how many drafts exist. `Total Emails` is correspondingly understated, which then corrupts `replyRate` and `readRate` denominators. The KPI is not merely wrong — it is structurally incapable of being non-zero, which is the hardest class of bug to notice.

**Trigger / Scenario:** Email tab + any period filter.

**Recommended Fix:**
Use `COALESCE(dateSent, createdAt)` semantics — or filter Emails by `createdAt` and label the KPI accordingly. Never silently drop rows on NULL in a reporting path; either include them in an explicit "Undated" bucket or surface the exclusion count to the user.

**Priority:** High

---

## [LOG-03] HIGH — Timezone boundary mismatch: server compares UTC, client compares local midnight

**Category:** Logic / Date handling
**Confidence:** HIGH CONFIDENCE
**Location:** `ajaxGetRequest()` (where-clause construction), `parseEspoDate()`, `getLocalDateStr()`, `filterByDate()`

**Problem:**
The server-side boundary is a naked datetime string with no timezone qualifier:

```javascript
'&where[0][value][]=' + encodeURIComponent(r.from + ' 00:00:00')
```

Espo stores and compares datetimes in **UTC**, so this is interpreted as UTC midnight. Meanwhile the client computes boundaries from `getLocalDateStr()`, which uses `getFullYear/getMonth/getDate` — i.e. **local** midnight. And `parseEspoDate` is internally inconsistent: date-only strings are parsed as *local* (`new Date(y, m-1, d)`) while datetime strings are parsed as *UTC* (`Date.UTC(...)`).

**Why it happens:**
Three different time reference frames (UTC storage, UTC-assumed query boundary, local display boundary) with no single conversion point.

**Impact:**
In UTC+2 (Egypt) the two windows are offset by two hours. Records created between 22:00 and 00:00 local time are fetched-but-discarded or discarded-but-should-be-included, depending on the branch. "Today" is a 22-hour window. Daily reports won't reconcile with the same query run in Espo's own list view. At DST transitions (for EUR/US users) the drift changes silently. Month-end and year-end figures are wrong by up to two hours' worth of records, which is exactly when reconciliation matters.

**Trigger / Scenario:** Any record timestamped near local midnight; any non-UTC user timezone.

**Recommended Fix:**
Establish one timezone authority. Use Espo's `getDateTime()` helpers to convert local period boundaries to UTC before building the query, send only that, and delete the client-side date filter. Make `parseEspoDate` unambiguous: treat all datetime values as UTC and all date-only values as timezone-naive, with the distinction explicit in the function name.

**Priority:** High

---

## [QUAL-01] HIGH — Date-range filtering is implemented twice, independently; this is the root cause of LOG-01/02/03

**Category:** Code Quality / Architecture
**Confidence:** CONFIRMED
**Location:** `periodToRange()` (server-side range) and `filterByDate()` inside `processAndRender()` (client-side range)

**Problem:**
Both functions implement the same preset vocabulary (`today`, `yesterday`, `week`, `month`, `thisyear`, `lastyear`, `lastN`, `custom`) with separate code paths and separate date arithmetic. They already disagree:

- `month`: server sets only `from` (no upper bound); client also has no upper bound → **"This Month" includes all future-dated records** (a meeting scheduled for December appears in January's "This Month").
- `thisyear`: server sets only `from`; client compares year equality (bounded). Divergent semantics for the same label.
- Meetings/Emails use different attributes at each layer (LOG-01, LOG-02).

**Why it happens:**
Redundant filtering was presumably added as a safety net. Duplicated logic without a shared definition always drifts.

**Impact:**
Every future change to a period preset must be made in two places or the dashboard silently develops filter asymmetry. All three HIGH logic bugs above are symptoms of this single design flaw. It also doubles payload: records are fetched and then thrown away.

**Recommended Fix:**
Single source of truth. Compute the range once, send it to the server, trust the server result, and delete `filterByDate`. If client-side re-filtering is genuinely needed (e.g. for instant tab switching without refetch), derive it from the *same* range object rather than re-deriving from `activeFilter`.

**Priority:** High

---

## [STA-01] HIGH — `categoryFilters` lives on the prototype and is mutated in place, leaking state across view instances

**Category:** State Management / Hidden bug
**Confidence:** CONFIRMED
**Location:** Prototype property declarations (`categoryFilters: {}`, `rawLeads: []`, …); `onBarItemClick()`

**Problem:**
```javascript
return Dep.extend({
    activeFilter: 'all',
    activeTab: 'all',
    categoryFilters: {},      // <-- shared object on the prototype
    ...
```

and in the click handler:

```javascript
if (!this.categoryFilters) this.categoryFilters = {};
if (!this.categoryFilters[filterKey]) this.categoryFilters[filterKey] = {};
this.categoryFilters[filterKey][val] = { excluded: true, ... };
```

Because the prototype's `{}` is truthy, the guard never fires, `this.categoryFilters` is never shadowed by an own property here, and the assignment **mutates the object stored on the prototype** — shared by every instance of this view ever created, for the lifetime of the page.

**Why it happens:**
Classic Backbone pitfall: object and array literals in an `extend({...})` block are prototype members, not per-instance state. Only `clearCategoryFilter()` (`this.categoryFilters = {}`) creates an own property, and only sometimes.

**Impact:**
A user excludes "Closed Lost", navigates away to Accounts, comes back to the dashboard. A *new* view instance is constructed — and inherits the stale exclusions from the prototype, with no filter chips rendered to explain why records are missing (the chip container is rebuilt from `categoryFilters`, so it *may* show them, but the ordering of `clearCategoryFilter` vs. render makes this inconsistent). Users see "missing" records and conclude data was deleted. This bug is invisible in normal first-load testing and appears only on the second visit — precisely the hidden-bug class requested in §16.

**Trigger / Scenario:** Apply a chart exclusion → navigate away → return to the dashboard.

**Recommended Fix:**
Initialise all mutable state in `setup()`/`initialize()`: `this.categoryFilters = {}; this.rawLeads = [];` etc. Leave only immutable primitives on the prototype. This applies equally to `rawLeads`…`rawMeetings`, `_currencyFormatter`, and `isSampled`.

**Priority:** High

---

## [REL-02] HIGH — No request sequencing: out-of-order responses overwrite state with stale data

**Category:** Reliability / Race condition
**Confidence:** CONFIRMED
**Location:** `loadMetrics()`

**Problem:**
Each invocation fires six independent requests and unconditionally assigns whatever arrives:

```javascript
]).then(function (results) {
    self.rawLeads = results[0];
    ...
    self.processAndRender();
```

There is no request generation counter, no abort of in-flight requests, and no check that this response still corresponds to the current filter state.

**Why it happens:**
TOCTOU on view state. The filter is read at request time; the result is written at response time; the two are not linked.

**Impact:**
User selects "This Year" (slow, large result set), then immediately selects "Today" (fast). The "Today" response lands first and renders; the "This Year" response lands second and overwrites it. The UI now shows a full year's data while the dropdown reads "Today" — and `processAndRender` will re-filter it client-side with `filterByDate` for "Today", producing a *third* state that matches neither. Combined with REL-03 (multiple fires per interaction), this is not an edge case; it is the normal path.

**Trigger / Scenario:** Two filter changes within one round-trip latency. Trivially reproducible on any real network.

**Recommended Fix:**
Maintain `this._loadSeq++`, capture it in the closure, and discard any response whose sequence is not current. Abort superseded XHRs. Disable the controls or show a blocking loader during load.

**Priority:** High

---

## [REL-03] HIGH — Both `input` and `change` are bound to the date fields, producing request storms

**Category:** Reliability / Performance
**Confidence:** CONFIRMED
**Location:** `events` hash; `onPeriodDateChange()`

**Problem:**
```javascript
'change #analytics-period-date-from': 'onPeriodDateChange',
'change #analytics-period-date-to':   'onPeriodDateChange',
'input  #analytics-period-date-from': 'onPeriodDateChange',
'input  #analytics-period-date-to':   'onPeriodDateChange',
```

`onPeriodDateChange` calls `loadMetrics()` directly, with **no debounce** and no de-duplication. `<input type="date">` fires `input` as each segment is typed, and then `change` on commit.

**Why it happens:**
Both event types were bound to cover browser inconsistencies, without recognising that they fire additively.

**Impact:**
Typing `2026-01-15` by keyboard can fire `onPeriodDateChange` five or more times, each dispatching **six** API calls — 30+ requests for one date entry, most of them immediately obsolete. Two date fields double it. With 20 concurrent analysts this is a self-inflicted denial of service against the CRM, and it maximally exposes the REL-02 race. Espo's own rate limiting (if enabled) may then start rejecting legitimate requests.

**Trigger / Scenario:** Manually type a custom date range.

**Recommended Fix:**
Bind `change` only. Add a 300–500 ms debounce. Require both bounds to be present and valid before dispatching. Combine with the sequence guard from REL-02.

**Priority:** High

---

## [LOG-04] HIGH — Revenue depends on the hardcoded literal `'Closed Won'`

**Category:** Logic / Configuration coupling
**Confidence:** CONFIRMED
**Location:** `renderDashboard()`, `renderSvgAreaChart()`, `processAndRender()` ('won' filter)

**Problem:**
```javascript
var totalRevenue = opps.filter(function (o) { return o.stage === 'Closed Won'; })...
opps.filter(function (o) { return o.stage === 'Closed Won'; }).forEach(...)
```

The same applies to the hardcoded option lists `oppStageOptions`, `leadStatusOptions`, `accountTypeOptions`, `emailStatusOptions`, `meetingStatusOptions` and the `getOppProbability` stage map.

**Why it happens:**
Enum values are read as literals instead of from metadata (`getMetadata().get(['entityDefs','Opportunity','fields','stage','options'])`).

**Impact:**
Renaming the stage — which is one of the first things any implementer does, and *certain* in an Arabic-localised deployment — makes `totalRevenue`, `avgDeal`, `winRate`, the "Closed Won Deals" filter, and the entire revenue trend chart silently evaluate to **zero**. No error, no warning, no empty state: a fully-rendered dashboard reporting no revenue. Adding a custom stage makes it invisible to the funnel chart while `getOppProbability` silently assigns it a fabricated **50%** probability in the weighted pipeline.

**Trigger / Scenario:** Any pipeline customisation or localisation.

**Recommended Fix:**
Read all enum options and the stage→probability map from metadata at `setup()`. Never hardcode a business enum in a reporting layer. If a stage cannot be resolved, surface it as "Unknown" rather than defaulting its probability.

**Priority:** High

---

## [LOG-05] HIGH — Weighted pipeline includes closed deals, double-counting won revenue

**Category:** Business Logic
**Confidence:** CONFIRMED
**Location:** `renderDashboard()` (~line 723)

**Problem:**
```javascript
var weightedPipeline = Math.round(opps.reduce(function (sum, o) {
    var prob = self.getOppProbability(o);
    return sum + (Number(o.amount || 0) * prob / 100);
}, 0));
```

The reduce runs over **all** opportunities. `Closed Won` maps to probability 100, so every won deal is added at full value.

**Why it happens:**
No filter to open stages. "Pipeline" was treated as "all deals".

**Impact:**
`Weighted Pipeline` and `Total Revenue` are displayed side by side on the same card row, and the former fully contains the latter. Forecasting is inflated by the entire historical won amount, growing without bound over time. Anyone using this for quota or cash-flow planning will over-forecast systematically. (`Closed Lost` at probability 0 is harmless but confirms the intent was not considered.)

**Recommended Fix:**
Restrict the reduce to open stages (`stage !== 'Closed Won' && stage !== 'Closed Lost'`, resolved from metadata per LOG-04). Label it "Weighted Open Pipeline". Consider showing Won, Open-Weighted, and Lost as three distinct, non-overlapping figures.

**Priority:** High

---

## [DAT-03] HIGH — Search only searches the 200 fetched rows, producing false "No Records Found"

**Category:** Data Integrity / UX
**Confidence:** CONFIRMED
**Location:** `onSearchInput()` → `processAndRender()` (`matchSearch`)

**Problem:**
Search is a client-side `Array.filter` over `this.rawLeads` etc. — the same 200-row sample from DAT-01. It does not trigger a refetch and does not send the term to the server.

**Impact:**
A user searches for a real customer that exists in the database but was created more than 200 records ago. The UI returns a confident, well-designed empty state: **"No Records Found — No records match your search term."** The user reasonably concludes the record does not exist and may re-create it, producing duplicates — a data-integrity failure caused by a reporting bug. The empty-state copy actively reinforces the wrong conclusion.

**Trigger / Scenario:** Search any record outside the newest 200 of its entity.

**Recommended Fix:**
Send the term server-side (Espo's `textFilter`) and refetch, debounced. Until then, change the empty-state message to state explicitly that only a recent subset is searched.

**Priority:** High

---

## [REL-04] HIGH — The error handler re-invokes the function that threw, producing an unhandled rejection and a permanently stuck loader

**Category:** Reliability / Error handling
**Confidence:** CONFIRMED
**Location:** `loadMetrics()` — `.then(...).catch(...)` chain

**Problem:**
```javascript
]).then(function (results) {
    ...
    self.processAndRender();          // if this throws...
    ...
}).catch(function (err) {
    console.error(...);
    self.rawLeads = []; ...
    self.processAndRender();          // ...it is called again here
    ...
});
```

Because `.catch` is chained *after* `.then`, any exception thrown inside `processAndRender` (or any of the render functions it calls) is caught here — and the handler's response is to call `processAndRender` a second time.

**Why it happens:**
The catch block was written to handle *fetch* failure, but its position in the chain also captures *render* failure. The recovery action is identical to the failing action.

**Impact:**
If a render path throws — e.g. an unexpected response shape, a null `list` element, a DOM node missing after a concurrent re-render — the second call throws again inside the catch handler. That rejection is **unhandled**: the `finally`-equivalent lines after it never execute, so `#analytics-loader` stays visible, `#analytics-content` stays hidden, and the refresh button keeps its `is-loading` spinner. The dashboard is permanently stuck loading and only a full page reload recovers. The console shows an uninformative secondary error, masking the original cause and making diagnosis considerably harder.

**Trigger / Scenario:** Any exception inside the render pipeline.

**Recommended Fix:**
Separate concerns: handle fetch failure in a `.catch` placed *before* the render `.then`; wrap rendering in its own try/catch that renders an explicit error panel; put loader/button teardown in a `finally` so it always runs regardless of path. Never call the failing operation from its own recovery handler.

**Priority:** High

---

## [DAT-04] HIGH — CSV export is silently truncated to 200 rows per entity with no warning inside the file

**Category:** Data Integrity
**Confidence:** CONFIRMED
**Location:** `exportCSV()`

**Problem:**
The export writes `activeFilteredLeads` etc. — the post-filter arrays, which inherit the 200-row cap. The on-screen sampling notice is *not* written into the CSV, and the title rows report the exported count as if it were the full count: `'=== LEADS DATA (' + leads.length + ' Records) ==='`.

**Impact:**
The export is the artefact that leaves the system: it gets emailed, attached to board packs, and reconciled against accounting. A 200-row file labelled with a confident header will be treated as complete. The discrepancy surfaces weeks later during reconciliation, and by then the dashboard's credibility — and any decision made on it — is already compromised. This is materially worse than the on-screen version of DAT-01 because there is no banner at all.

**Recommended Fix:**
Export server-side with proper pagination over the full result set. Minimum viable mitigation: write an explicit provenance block into the CSV (generated-at, user, active filters, rows exported, rows available from the API `total`) and refuse to export at all when `total > exported`.

**Priority:** High

---

## [LOG-06] HIGH — The revenue trend chart mixes two different date semantics and ignores the active filter

**Category:** Logic
**Confidence:** CONFIRMED
**Location:** `renderSvgAreaChart()`

**Problem:**
Three defects in one function:

```javascript
var dateStr = o.closeDate || o.createdAt;          // (1) mixed semantics
var mKey = String(dateStr).substring(0, 7);         // (2) raw UTC string, no timezone conversion
```
and (3) the six month buckets are always the last six *calendar* months, computed from `new Date()`, while `opps` has already been date-filtered by the active period.

**Why it happens:**
(1) A fallback was added for missing `closeDate` without considering that the two fields answer different questions. (2) This function bypasses `parseEspoDate`, which every other code path uses — so its timezone behaviour differs from the KPIs beside it. (3) The chart's x-axis is independent of the filter driving its data.

**Impact:**
Revenue is attributed to *close date* for some records and *creation date* for others, in the same series — the trend line is not a measurement of anything. Month bucketing by raw UTC substring misassigns any deal closing in the last hours of a month (in UTC+3, a 31 Jan 23:00 UTC close lands in January while the KPI cards count it as February). And selecting "Today" yields a six-month chart with five empty months, silently contradicting its own subtitle *"Actual Closed Won revenue aggregated across the last 6 calendar months"* — the data shown covers one day.

**Recommended Fix:**
Use `closeDate` exclusively and exclude records without one (reporting the exclusion count). Convert through the same timezone helper as the rest of the module. Either derive the axis from the active filter range or fetch an independent, unfiltered dataset for the trend and label it as such.

**Priority:** High

---

## [REL-05] HIGH — `isSampled` gives a false negative when the server's own list-size limit is below 200

**Category:** Reliability
**Confidence:** POSSIBLE (depends on instance configuration)
**Location:** `loadMetrics()`

**Problem:**
```javascript
self.isSampled = [...].some(function (list) { return list.length >= 200; });
```

Truncation is inferred from the returned array length matching the *client's* requested cap. EspoCRM enforces a server-side maximum list size (configurable, and commonly lowered by administrators). If that limit is, say, 100, every request returns at most 100 rows — `length >= 200` is never true — and **the sampling banner never appears at all**, while the data is truncated twice as severely.

**Why it happens:**
The truncation signal is derived from a client-side constant rather than from the server's own `total` field, which is present in the response and ignored.

**Impact:**
The single safeguard warning the user that the numbers are a sample becomes inert under a common configuration, converting DAT-01 from "wrong with a caveat" into "wrong with no caveat". It also fails in the opposite direction: exactly 200 records in total triggers a false warning.

**Trigger / Scenario:** `recordListMaxSizeLimit` (or equivalent) set below 200 — or an upgrade changing the default.

**Recommended Fix:**
Compare `res.total` against `res.list.length` per entity. That is the authoritative signal and it is already in the payload. Report the exact shortfall per entity, not a single global boolean.

**Priority:** High

---

# MEDIUM FINDINGS (26)

**[API-01] No request timeout.** `$.ajax` is called without a `timeout` option, so a stalled connection never settles the promise; `Promise.all` never resolves and the loader spins indefinitely with no recovery path. *Fix:* set an explicit timeout (15–30 s) and render a retry affordance.

**[API-02] Raw `$.ajax` bypasses Espo's Ajax layer.** Hand-built relative URL `'api/v1/' + entity` with a manual `X-Requested-With` header. Consequences: no centralised 401 handling or re-login redirect (compounds REL-01), no respect for a configured API base URL, no consistent error normalisation, and breakage under non-cookie auth (API key / token) setups. *Fix:* use Espo's `Espo.Ajax` / collection factory.

**[PERF-01] No debounce on the search input.** `onSearchInput` → `processAndRender` on every keystroke: six `Array.filter` passes over up to 1,200 records × up to 13 fields each, plus a full teardown and rebuild of KPIs, six charts, an SVG, and six tables. Roughly O(n·k) ≈ 15k string operations plus a complete DOM replacement per character. *Fix:* debounce 250–300 ms; separate data filtering from re-render.

**[PERF-02] Bar charts have no top-N limit and no "Other" bucket.** `renderBarChart` iterates all unique values; grouping Contacts by `accountName` can emit up to 200 DOM nodes, each with a gradient fill. *Fix:* top 10 + aggregated "Other".

**[LOG-07] Bar ordering is non-deterministic due to object-key coercion.** Counts are accumulated on a plain object and rendered via `Object.keys(counts).forEach`. JavaScript orders integer-like keys numerically *before* string keys, so an account or city named `"2020"` jumps to the front of the chart regardless of its count. Ordering is an emergent property of the data's resemblance to integers. *Fix:* build an array of `{key, count}` and sort explicitly by count descending.

**[LOG-08] The chart empty state is unreachable whenever `predefinedOptions` is supplied.** The options are pre-seeded at zero, so `Object.keys(counts).length` is always non-zero and the `'No breakdown data available.'` branch is dead code. With `sumCounts` forced to 1, the user sees a full set of bars all reading `0 (0%)` instead of a clear empty state. *Fix:* branch on `list.length`, not on key count.

**[LOG-09] "This Month" has no upper bound.** Both filter layers apply only `>= monthStart`, so future-dated records (scheduled meetings, future close dates) are counted in the current month. *Fix:* bound both ends.

**[LOG-10] `newLeadsToday` and `newAccountsMonth` operate on the already-filtered set.** These KPIs use absolute windows (today / month-start) but read arrays that the active period filter has already narrowed. Select "Last Year" and `newLeadsToday` is structurally always 0 while still displayed as a live metric. *Fix:* compute absolute-window KPIs from an unfiltered dataset, or hide them when a period filter is active.

**[STA-02] Selecting "Custom" with no dates leaves the view in an inconsistent state.** `onPeriodSelectChange` sets `this.activeFilter = 'custom'` and then `return`s before loading. The dropdown says Custom, the displayed data is from the previous filter, and a later `processAndRender` (via search) takes the `'custom'` branch with both bounds null — which returns `true` for everything, silently showing unfiltered data under a "Custom Range" label. *Fix:* don't mutate `activeFilter` until a valid range exists; render an explicit "awaiting date range" state.

**[REL-06] Invalid range (`from > to`) fails silently.** `onPeriodDateChange` returns with no message; the user sees stale data beside invalid inputs and no explanation. *Fix:* inline validation message.

**[SEC-02] Over-fetching, including `Account.description`.** The select lists request fields never rendered (`description`, `salutationName`, `addressState`, `shippingAddressCity`, `sicCode` in some views, `isAllDay`, `website`). `description` is unbounded text. This inflates payloads and pulls more personal data into the browser than the feature needs. *Fix:* request only rendered fields — data minimisation.

**[SEC-03] One-click bulk PII export with no audit trail.** `exportCSV` assembles names, emails, phone numbers, and addresses across up to six entities into a local file. Because the file is built client-side from ordinary GET reads, there is no application-level export record. *Fix:* move export server-side behind a dedicated, ACL-checked, logged endpoint; consider restricting it by role.

**[SEC-04] No ACL awareness in the UI.** All six entity tabs render unconditionally. A user without Opportunity access gets a 403, swallowed by REL-01, and sees a complete dashboard reading zero. Server-side ACL is correctly enforced (no authorization bypass here), but the UX actively misleads. *Fix:* gate tabs on `getAcl().checkScope(...)`.

**[LOG-11] Email `readRate` / `replyRate` denominators are unsound.** Both divide by `totalEmails`, which includes drafts, failed sends, and inbound messages. Separately, `isRead` in Espo is a per-user flag, so aggregating it across users is semantically questionable *(POSSIBLE — depends on schema specifics)*. *Fix:* restrict the denominator to sent outbound emails; verify `isRead` semantics before reporting on it.

**[DAT-05] Hardcoded USD with `maximumFractionDigits: 0`.** `formatCurrency` pins `'en-US'` / `'USD'` and rounds away all decimals; the CSV path independently hardcodes `'$'` in `formatMoney`. Given the instance is being set to an EGP base with USD/EUR enabled, every displayed figure is mislabelled by currency *and* silently rounded. *Fix:* read currency and decimal settings from Espo config; one shared formatter for screen and export.

**[QUAL-02] Money formatting is duplicated with divergent behaviour.** `formatCurrency` (0 decimals) vs `exportCSV.formatMoney` (up to 2 decimals) vs the `'$' + val.toLocaleString()` fallback. The same amount renders three different ways depending on path. *Fix:* single formatter.

**[DAT-06] Floating-point accumulation of monetary values.** All sums use `reduce` over IEEE-754 doubles. Rounding for display currently masks the drift, but the pattern is unsafe for financial reporting and will surface once decimals are shown or totals are reconciled. *Fix:* accumulate in integer minor units (piastres/cents).

**[PERF-03] All metrics for all six entities are computed on every render regardless of the active tab.** `renderDashboard` calculates ~50 metrics before selecting which handful to display. *Fix:* compute lazily per active tab.

**[PERF-04] Refresh is not debounced or disabled during load.** `is-loading` is cosmetic; repeated clicks each dispatch six requests. *Fix:* disable the control while a load is in flight (pairs with REL-02's sequence guard).

**[QUAL-03] Global CSS leakage from generic class names.** The injected `<style>` block defines `.btn`, `.btn-primary`, `.btn-secondary`, `.badge`, `.badge-success`, `.data-table`, `.search-input` — unscoped. While this view is mounted these override Bootstrap classes used by the rest of Espo, so modals and panels opened from this page render with the dashboard's styling. *Fix:* scope every rule under `.analytics-bi-wrapper` or use a unique prefix.

**[QUAL-04] `:root` custom-property pollution.** `--color-primary`, `--color-border`, `--font-family-base` etc. are declared at `:root`, i.e. document scope, from inside a view template — colliding with any other component using the same names. *Fix:* declare on `.analytics-bi-wrapper`.

**[STA-03] `afterRender` mutates global navigation DOM.** `$('#navbar .tabs > li, .navbar-nav > li').removeClass('active')` strips the active state from **every** navbar item, then attempts to restore it with a selector chain (`[data-name="AnalyticsDashboard"]`, `:has(a[href*=...])`) that depends on Espo's internal markup. If the selector misses after an upgrade, no tab appears active anywhere in the application. The whole block is wrapped in `try {} catch (e) {}` with an empty handler, so failure is invisible. *Fix:* let the router own tab state; remove the manipulation. Never write empty catch blocks.

**[REL-07] `afterRender` triggers a full six-request load on every render.** Backbone may re-render for reasons unrelated to data (resize handlers, parent re-render, `reRender()` calls), each time refetching everything. *POSSIBLE* depending on the host view's behaviour. *Fix:* load in `setup()`/`onLoad` guarded by a flag; re-render from cached data.

**[QUAL-05] No i18n and no RTL support.** Every user-facing string is a hardcoded English literal; `this.translate()` is never used. Layout relies on physical properties (`padding-left`, `text-align: left`, `margin-left`). For the Arabic-speaking users this is being built for, the module is effectively untranslatable without a rewrite. *Fix:* route all strings through the i18n layer; use logical CSS properties (`padding-inline-start`) or a `[dir="rtl"]` stylesheet.

**[QUAL-06] Ragged CSV: sections with differing column counts in one file.** Overview mode concatenates six blocks with 14, 10, 13, 11, 9, and 10 columns respectively. Most CSV parsers (pandas, R, Google Sheets import) reject or mangle this. *Fix:* one file per entity, or a normalised long format.

**[A11Y-01] Interactive filters are keyboard-inaccessible.** `.interactive-bar-item` is a `div` with a click handler, no `tabindex`, no `role="checkbox"`, no `aria-pressed`. The stylesheet defines `.interactive-bar-item:focus-visible` — a rule that can never match, confirming the gap was anticipated but not closed. *Fix:* use real `<button>` elements with ARIA state.

---

# LOW FINDINGS (17)

**[SEC-05]** Record `id` is the only field interpolated without `escapeHtml`: `href="#Lead/view/${l.id}"` and `data-id="${l.id}"`, across all six tables. Espo IDs are server-generated and not user-settable via the API, so exploitability is low — but this is the single gap in an otherwise consistent escaping discipline and should be closed on principle. *(Escaping omission: CONFIRMED. Exploitability: POSSIBLE.)*

**[LOG-12]** jQuery `.data()` performs automatic type coercion, breaking filters on numeric-looking values. `data-value="2020"` is read back as the number `2020`; `String(...)` may not reproduce the original key (`"1.0"` → `1` → `"1"`), and JSON-like values are parsed into objects yielding `"[object Object]"`. Affects `onBarItemClick` (`data('value')`, `data('field')`, `data('entity')`) and `onChipRemove` (`data('val')`). Real-world trigger: an account, city, or title that looks like a number — so exclusions silently fail to apply or fail to clear. *Fix:* use `.attr('data-value')`.

**[LOG-13]** `onViewRecordClick` calls `e.preventDefault()` unconditionally, breaking Ctrl/Cmd-click and middle-click "open in new tab" on every View link.

**[REL-08]** `URL.createObjectURL(blob)` is never paired with `revokeObjectURL` — the blob is retained for the page's lifetime; one leak per export.

**[REL-09]** The download anchor is never appended to the DOM before `.click()`; this works in Chrome but is unreliable in some Firefox versions. *POSSIBLE.*

**[LOG-14]** `$wonOption.prop('disabled', true).hide()` — hiding `<option>` elements is not supported in Safari; only the `disabled` half is reliable.

**[DAT-07]** `formatPhone` embeds a literal tab character inside the quoted CSV field. The Excel workaround leaks into the data for every other consumer (pandas, Sheets, ETL).

**[DAT-08]** `formatBool` maps `undefined` to `'No'`, conflating "false" with "unknown" — notably for `doNotCall`, where the distinction has compliance relevance.

**[LOG-15]** `lostLeads` counts `'Recycled'` as lost. In Espo semantics a recycled lead returns to the pool and is not a loss; this understates the active pipeline and overstates losses.

**[LOG-16]** All-day meetings may carry a date-only `dateStart`, which `parseEspoDate` parses as **local midnight**; `isMeetingUpcoming` then classifies today's all-day meeting as past from 00:00 onward.

**[PERF-05]** `Math.max.apply(null, amounts)` is safe at the current fixed length of 6 but will overflow the call stack if the series is ever made dynamic. *Fix:* `Math.max(...)` with a reduce fallback.

**[LOG-17]** `parseEspoDate`'s datetime regex matches only the leading `YYYY-MM-DD HH:MM` prefix and ignores a trailing `Z` or `±HH:MM` offset, forcing a UTC assumption. Correct for current Espo output; silently wrong if the API ever returns offsets. *POSSIBLE.*

**[LOG-18]** The final `new Date(s)` fallback in `parseEspoDate` relies on implementation-defined parsing for non-ISO strings — divergent behaviour across browsers.

**[LOG-19]** `getLocalDateStr` returns `''` for an unparseable date; `'' >= weekStartStr` is false, so the record is silently dropped from filtered views with no diagnostic.

**[REL-10]** `$btnRefresh` is captured before the async gap. If the view re-renders during the load, `removeClass('is-loading')` targets a detached node and the spinner remains on the live one.

**[QUAL-07]** `makeTitleRow(title, 14)` hardcodes column counts (14, 10, 13, 11, 9, 10) that must be kept in sync manually with the adjacent header arrays — magic numbers guaranteed to drift.

**[QUAL-08]** Invalid and dead CSS: `tracking: -0.02em` is not a CSS property (it is Tailwind naming; the intent was `letter-spacing`) and appears in `.header-title` and `.kpi-val`. Combined with the unreachable `:focus-visible` rule, this indicates un-reviewed copy-paste.

---

# INFO FINDINGS (7)

**[SEC-06]** KPI interpolation `${k.val}` / `${k.color}` is unescaped. Both are internally generated (numbers, formatted currency, hardcoded CSS variables), so there is no current attack path — but it breaks the file's own escaping convention and would become live if a KPI ever surfaced a record field.

**[LOG-20]** Overlapping lead buckets presented as parallel KPIs: `potentialLeads` (Assigned + In Process) and `qualifiedLeads` (In Process + Converted) share the "In Process" population, so the cards cannot be summed or reasoned about together.

**[LOG-21]** `sentEmails` counts `status === 'Sent'` while `totalEmails` includes inbound mail (typically `Archived`), mixing directions in one metric set.

**[LOG-22]** `Math.round` per-slice percentages in `renderBarChart` / `renderCustomRatioChart` need not sum to 100 %, which users routinely flag as a bug.

**[QUAL-09]** Partial dead code: the outer `.catch` in `loadMetrics` can never fire for *fetch* reasons (because `safeFetch` never rejects), so its stated purpose is unreachable — it only ever catches render exceptions, which is precisely what makes REL-04 possible.

**[QUAL-10]** God object: a single ~3,000-line view owns data access, date arithmetic, filtering, metric computation, six chart renderers, CSV serialisation, styling, and global navbar manipulation. No separation between data layer and presentation.

**[QUAL-11]** Untestable by construction: no pure functions exported, business logic embedded in render methods, hidden dependencies on global `$`, `window.Backbone`, and Espo's navbar DOM. None of the metric calculations can be unit-tested in isolation.

---

# RISK MATRIX

| ID | Severity | Category | Confidence | Issue | Impact | Priority |
|----|----------|----------|------------|-------|--------|----------|
| DAT-01 | CRITICAL | Data Integrity | Confirmed | 200-record cap presented as totals | All KPIs systematically wrong | Immediate |
| DAT-02 | CRITICAL | Data Integrity | Confirmed | Mixed-currency sums; `amountConverted` unused | Revenue figures meaningless multi-currency | Immediate |
| SEC-01 | CRITICAL | Security | Confirmed | CSV formula injection | Code execution in analyst's spreadsheet | Immediate |
| REL-01 | CRITICAL | Reliability/Sec | Confirmed | All errors (incl. 401/403) rendered as $0 | Confident display of false zeros | Immediate |
| LOG-01 | HIGH | Logic | Confirmed | Meetings filtered by `createdAt` vs `dateStart` | Today's meetings missing | Immediate |
| LOG-02 | HIGH | Logic | Confirmed | NULL `dateSent` drops drafts at both layers | "Draft Emails" structurally always 0 | High |
| LOG-03 | HIGH | Logic | High | UTC vs local midnight boundaries | "Today" is a 22-hour window | High |
| QUAL-01 | HIGH | Architecture | Confirmed | Date filtering implemented twice | Root cause of LOG-01/02/03 | High |
| STA-01 | HIGH | State | Confirmed | Prototype-shared `categoryFilters` mutated | Stale filters leak across visits | High |
| REL-02 | HIGH | Race | Confirmed | No request sequencing | Stale data overwrites fresh | High |
| REL-03 | HIGH | Reliability | Confirmed | `input`+`change` both bound, no debounce | 30+ requests per date entry | High |
| LOG-04 | HIGH | Logic | Confirmed | Hardcoded `'Closed Won'` and enums | Revenue silently becomes 0 | High |
| LOG-05 | HIGH | Business Logic | Confirmed | Weighted pipeline includes won deals | Forecast inflated indefinitely | High |
| DAT-03 | HIGH | Data Integrity | Confirmed | Search covers only 200 rows | False "not found" → duplicates | High |
| REL-04 | HIGH | Error Handling | Confirmed | Catch re-calls the failing function | Unhandled rejection, stuck loader | High |
| DAT-04 | HIGH | Data Integrity | Confirmed | CSV silently truncated, no in-file notice | Wrong data leaves the system | High |
| LOG-06 | HIGH | Logic | Confirmed | Trend mixes closeDate/createdAt, ignores filter | Trend line measures nothing | High |
| REL-05 | HIGH | Reliability | Possible | `isSampled` false negative if server cap < 200 | Sampling warning never shows | High |
| API-01 | MEDIUM | API | Confirmed | No request timeout | Infinite loader on stall | Medium |
| API-02 | MEDIUM | API | Confirmed | Raw `$.ajax` bypasses Espo layer | No 401 handling; auth fragility | Medium |
| PERF-01 | MEDIUM | Performance | Confirmed | No search debounce | Full re-render per keystroke | Medium |
| PERF-02 | MEDIUM | Performance | Confirmed | Unbounded chart categories | Up to 200 DOM bars | Medium |
| LOG-07 | MEDIUM | Logic | Confirmed | Object-key numeric coercion reorders bars | Non-deterministic chart order | Medium |
| LOG-08 | MEDIUM | Logic | Confirmed | Chart empty state unreachable | All-zero bars instead of empty state | Medium |
| LOG-09 | MEDIUM | Logic | Confirmed | "This Month" unbounded upward | Future records counted | Medium |
| LOG-10 | MEDIUM | Logic | Confirmed | Absolute-window KPIs read filtered data | KPIs structurally 0 | Medium |
| STA-02 | MEDIUM | State | Confirmed | "Custom" with no dates → inconsistent state | Unfiltered data under Custom label | Medium |
| REL-06 | MEDIUM | Reliability | Confirmed | Invalid range fails silently | Stale data, no feedback | Medium |
| SEC-02 | MEDIUM | Security | Confirmed | Over-fetching incl. `description` | Excess PII in browser | Medium |
| SEC-03 | MEDIUM | Security | Confirmed | Bulk PII export, no audit | Unlogged exfiltration path | Medium |
| SEC-04 | MEDIUM | Security/UX | Confirmed | No ACL-driven tab gating | Misleading zeros on denied scopes | Medium |
| LOG-11 | MEDIUM | Logic | High/Possible | Email rate denominators unsound | Meaningless engagement metrics | Medium |
| DAT-05 | MEDIUM | Data Integrity | Confirmed | Hardcoded USD, 0 decimals | Mislabelled, rounded currency | Medium |
| QUAL-02 | MEDIUM | Quality | Confirmed | Three divergent money formatters | Same amount renders 3 ways | Medium |
| DAT-06 | MEDIUM | Data Integrity | Confirmed | Float accumulation of money | Cent-level drift | Medium |
| PERF-03 | MEDIUM | Performance | Confirmed | All metrics computed for all tabs | Wasted computation | Medium |
| PERF-04 | MEDIUM | Performance | Confirmed | Refresh not disabled during load | Duplicate request bursts | Medium |
| QUAL-03 | MEDIUM | Quality | Confirmed | Global `.btn`/`.badge` overrides | Breaks Espo's own UI | Medium |
| QUAL-04 | MEDIUM | Quality | Confirmed | `:root` variable pollution | Cross-component collisions | Medium |
| STA-03 | MEDIUM | State | Confirmed | Global navbar mutation, empty catch | No active tab anywhere | Medium |
| REL-07 | MEDIUM | Reliability | Possible | `afterRender` refetches every render | Request amplification | Medium |
| QUAL-05 | MEDIUM | Quality | Confirmed | No i18n, no RTL | Untranslatable for target users | Medium |
| QUAL-06 | MEDIUM | Quality | Confirmed | Ragged CSV column counts | Parsers reject the file | Medium |
| A11Y-01 | MEDIUM | Accessibility | Confirmed | Filters keyboard-inaccessible | Unusable without a mouse | Medium |
| SEC-05 | LOW | Security | Confirmed / Possible | Record `id` unescaped | Escaping-discipline gap | Low |
| LOG-12 | LOW | Logic | Confirmed | `.data()` type coercion | Filters silently fail on numeric values | Low |
| LOG-13 | LOW | UX | Confirmed | `preventDefault` on all clicks | Ctrl-click broken | Low |
| REL-08 | LOW | Reliability | Confirmed | Blob URL never revoked | Memory leak per export | Low |
| REL-09 | LOW | Reliability | Possible | Anchor not appended before click | Download fails on some Firefox | Low |
| LOG-14 | LOW | UX | Confirmed | `option.hide()` unsupported in Safari | Filter still visible | Low |
| DAT-07 | LOW | Data | Confirmed | Literal tab in phone CSV cells | Dirty data downstream | Low |
| DAT-08 | LOW | Data | Confirmed | `formatBool` conflates false/undefined | DNC ambiguity | Low |
| LOG-15 | LOW | Business Logic | Confirmed | "Recycled" counted as lost | Losses overstated | Low |
| LOG-16 | LOW | Logic | Confirmed | All-day meetings parsed at local midnight | Today's meeting shows as past | Low |
| PERF-05 | LOW | Performance | Confirmed | `Math.max.apply` stack risk if refactored | Latent crash | Low |
| LOG-17 | LOW | Logic | Possible | Timezone offsets ignored in parsing | Wrong if API format changes | Low |
| LOG-18 | LOW | Logic | Confirmed | `new Date(s)` fallback | Browser-dependent parsing | Low |
| LOG-19 | LOW | Logic | Confirmed | Empty date string drops records | Silent data loss | Low |
| REL-10 | LOW | Reliability | Confirmed | Stale jQuery button reference | Spinner stuck | Low |
| QUAL-07 | LOW | Quality | Confirmed | Hardcoded CSV column counts | Drift on change | Low |
| QUAL-08 | LOW | Quality | Confirmed | Invalid `tracking` CSS, dead rules | Unreviewed code | Low |
| SEC-06 | INFO | Security | Confirmed | KPI values unescaped | Latent XSS surface | Low |
| LOG-20 | INFO | Logic | Confirmed | Overlapping lead KPI buckets | Non-additive metrics | Low |
| LOG-21 | INFO | Logic | Confirmed | Inbound/outbound email mixing | Ambiguous metrics | Low |
| LOG-22 | INFO | Logic | Confirmed | Percentages don't sum to 100 | Perceived as a bug | Low |
| QUAL-09 | INFO | Quality | Confirmed | Unreachable catch purpose | Enables REL-04 | Low |
| QUAL-10 | INFO | Architecture | Confirmed | God object, 3,000 lines | Unmaintainable | Low |
| QUAL-11 | INFO | Testability | Confirmed | No isolable pure functions | Cannot unit-test metrics | Low |

---

# TOP 10 PRIORITY FIXES

**1. DAT-01 — Stop presenting a 200-row sample as totals.**
*Why it matters:* this is not a bug in the dashboard, it is a bug in every decision made using the dashboard. Everything else on this list is secondary to it.
*Fix:* aggregate server-side (SQL `SUM`/`COUNT`/`GROUP BY`), or read `res.total` and refuse to render any "Total" when `total > list.length`.
*Benefit:* the numbers become true. Without this, fixing anything else just makes wrong numbers prettier.

**2. DAT-02 — Use `amountConverted` for every money aggregation.**
*Why:* a one-word change per call site converts meaningless cross-currency sums into correct base-currency figures. The field is already being fetched.
*Fix:* replace `o.amount` with `o.amountConverted` in all reduce/filter/chart/CSV paths; keep `amount` only for single-record display with its own currency.
*Benefit:* financially valid revenue, margin, and forecast figures under the EGP/USD/EUR configuration.

**3. SEC-01 — Neutralise CSV formulas.**
*Why:* the only finding here whose blast radius extends outside the browser, onto a finance user's workstation, via data an unauthenticated external party can write.
*Fix:* prefix values beginning with `= + - @ \t \r` with an apostrophe, in one shared helper used by all CSV writers.
*Benefit:* closes a genuine remote-input-to-local-execution chain for a few lines of code.

**4. REL-01 — Never render failure as zero.**
*Why:* an expired session currently produces a polished dashboard reporting no revenue. The failure mode is indistinguishable from real data.
*Fix:* per-entity status tracking, explicit error panels, suppress derived KPIs on failure, handle 401 by delegating to re-login.
*Benefit:* the system becomes honest about what it doesn't know — the single most important property of a reporting tool.

**5. QUAL-01 + LOG-01/02/03 — Collapse date filtering to one implementation.**
*Why:* one architectural flaw generating four HIGH bugs. Fixing the symptoms individually guarantees they return.
*Fix:* compute the range once, convert to UTC via Espo's datetime helpers, send it server-side with the correct per-entity attribute (`dateStart` for Meetings, `createdAt` for Emails), delete `filterByDate`.
*Benefit:* period filters mean what they say; payload halves; three bug classes close permanently.

**6. REL-02 + REL-03 — Add request sequencing and debouncing.**
*Why:* currently a single typed date can fire 30 requests whose responses race and overwrite each other. This actively corrupts displayed state under normal use.
*Fix:* bind `change` only, debounce 300 ms, increment a sequence counter and discard stale responses, abort superseded XHRs, disable controls while loading.
*Benefit:* deterministic state and roughly an order-of-magnitude reduction in server load.

**7. LOG-04 — Read enums from metadata instead of hardcoding them.**
*Why:* the instance is about to be localised into Arabic. The moment "Closed Won" is renamed, revenue reads zero with no error — indistinguishable from REL-01 and equally silent.
*Fix:* load stage/status/type options and the probability map from `getMetadata()` at setup; treat unresolved values as "Unknown" rather than defaulting to 50 %.
*Benefit:* the dashboard survives the customisation it was built to support.

**8. STA-01 — Move all mutable state into `setup()`.**
*Why:* a textbook Backbone prototype-sharing bug that is invisible in testing and appears on the user's second visit, presenting as missing records.
*Fix:* initialise `categoryFilters`, `rawLeads`…`rawMeetings`, `isSampled`, `_currencyFormatter` per instance.
*Benefit:* eliminates a whole class of "it works until it doesn't" reports.

**9. REL-04 + API-01 — Fix the error pipeline.**
*Why:* the current handler calls the function that just threw, converting a recoverable render error into a permanently stuck UI with a misleading console trace.
*Fix:* separate fetch-error from render-error handling, use `finally` for loader/button teardown, add an explicit `timeout`.
*Benefit:* failures become diagnosable and self-recovering instead of terminal.

**10. QUAL-03/04 + LOG-05/06 — Scope the CSS and correct the two headline metrics.**
*Why:* the unscoped `.btn`/`.badge`/`:root` rules visibly break Espo's own UI in any modal opened from this page, and `Weighted Pipeline` / the revenue trend are the two figures executives look at first — both currently wrong by construction.
*Fix:* scope all CSS under `.analytics-bi-wrapper`; restrict the weighted pipeline to open stages; use `closeDate` only and align the trend axis with the active filter.
*Benefit:* the application stops visually breaking itself, and the two most-viewed numbers become defensible.

---

# FINAL VERDICT

**Is this code production-ready?** No — and the reason is not code quality. The engineering craft on display is above average for a custom Espo view: escaping is applied with real discipline (the unescaped `id` is the only gap across hundreds of interpolations), division-by-zero is guarded in every ratio path, `safeFetch` normalises response shape, and accessibility and Excel encoding were at least considered. The problem is that a **correct renderer sitting on top of an incorrect data model** is more dangerous than a broken renderer, because nothing signals the error. This module can be shipped as an operational convenience view; it must not be shipped as a reporting or decision-support tool.

**Biggest risks, in order:**
1. Systematically wrong financial figures presented with total confidence (DAT-01, DAT-02, DAT-04) — leading to real decisions made on false data, discovered only at reconciliation.
2. Silent failure indistinguishable from real data (REL-01, LOG-04) — the dashboard cannot tell the user when it doesn't know something.
3. Cross-boundary security exposure via CSV formula injection (SEC-01).
4. State and race incoherence under ordinary interaction (REL-02, REL-03, STA-01).

**What will realistically break in production:** the loader hanging forever after a session timeout or a stalled request (REL-01/REL-04/API-01); "Today" showing no meetings (LOG-01); revenue dropping to $0 the day a stage is renamed or translated (LOG-04); Espo's own buttons and badges rendering wrong in modals opened from this page (QUAL-03); stale exclusion filters hiding records on a return visit (STA-01); and — the one that will do lasting damage — an exported CSV reconciled against accounting and found to be missing most of the data (DAT-04).

**Security issues requiring immediate attention:** SEC-01 (CSV formula injection) first. Then the silent-403/401 behaviour in REL-01, which is a security *usability* failure — permission denials must be visible, not rendered as zeros. Then data minimisation (SEC-02) and export auditing (SEC-03). Note explicitly: **no authentication or authorization bypass exists in this file.** All enforcement is server-side in EspoCRM's ACL layer and is not circumvented here; the `data-scope`/`data-id` attributes are user-editable but only affect client-side navigation, which the backend still gates.

**What to fix first:** items 1–4 of the priority list, in that order. Fixing presentation bugs before the data model would be actively counterproductive.

**Additional context required for a complete audit:**
- `custom/Espo/Custom/Resources/metadata/scopes/AnalyticsDashboard.json` and its `clientDefs` — to confirm ACL configuration, `object: false` implications, and which roles can reach this route at all.
- Espo's effective configuration: `recordListMaxSizeLimit` (determines whether REL-05 is live), `defaultCurrency` / `currencyList` / `currencyRates`, `timeZone`, and `thousandSeparator`/`decimalMark`.
- Server-side ACL definitions for the six queried scopes, plus field-level ACL — to verify that the `select=` parameter cannot be used to retrieve restricted fields (currently **UNVERIFIABLE** from this file alone).
- Whether an authentication method other than session cookies is in use (API key / token), which determines the severity of API-02.
- The host view/route that instantiates this module — to confirm how often `afterRender` fires (REL-07).
- Actual row counts and the customised enum option sets for Lead status, Opportunity stage, and Account type — to quantify DAT-01 and LOG-04 in this specific instance.
- Any reverse proxy, CSP, or rate-limiting configuration in front of the API.

---

These are all issues I could identify from the provided code and available context. Additional issues may exist in external dependencies, configuration, database schema, framework behaviour, infrastructure, or other files that were not provided.

No code has been modified. Tell me which findings you want addressed and I'll produce the fixes — I'd suggest starting with the four CRITICALs as one patch, since DAT-01 and REL-01 touch the same data-loading path and are cleaner to fix together than separately.

---

**ملاحظة سريعة بالعربي، وهي مهمة للمشروع الأصلي:** الملف ده يثبت بالدليل العملي ليه رفضت اقتراح الأجينت إنه يبني محرك تقارير مخصص جوه Espo. دى تقارير لخمس كيانات فقط، من غير أى منطق مالى، وفيها ٦٨ مشكلة — أربع منهم حرجة. تخيل نفس المعمارية دى مع `StockMove` و `FinTransaction` وقيود محاسبية.

وأخطر حاجة فى الملف مرتبطة مباشرة بخطة الـ ERP: مشكلة **DAT-02** — جمع مبالغ بعملات مختلفة مع تجاهل `amountConverted` الموجود فعلاً فى البيانات. دى بالظبط الغلطة اللى حذرتك منها فى بند R10 وفى قاعدة "`exchangeRate` يتخزن على كل سطر". ومشكلة **DAT-01** (حساب الإجماليات من ٢٠٠ صف) هى نفسها قاعدة R1 اللى كتبناها: **الرصيد حصيلة جمع، مش بيان معروض**. الملف ده كسر القاعدتين الاتنين، والنتيجة أرقام مالية غلط بشكل صامت.

الخلاصة العملية: خلّى الـ `AnalyticsDashboard` ده للعرض التشغيلى بس بعد إصلاح الأربع مشاكل الحرجة، وخلّى التقارير المالية والمخزنية الحقيقية فى Metabase أو Advanced Pack — على قاعدة بيانات مصممة صح.