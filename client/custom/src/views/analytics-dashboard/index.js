define('custom:views/analytics-dashboard/index', ['view'], function (Dep) {
    return Dep.extend({
        activeFilter: 'all',
        activeTab: 'all',
        categoryFilters: null,
        searchTerm: '',

        initialize: function () {
            Dep.prototype.initialize.call(this);
            // Fresh, instance-owned state — never share objects/arrays via prototype defaults.
            this.categoryFilters = {};
            this.rawLeads = [];
            this.rawOpps = [];
            this.rawAccounts = [];
            this.rawContacts = [];
            this.rawEmails = [];
            this.rawMeetings = [];
            this.totalLeadsCount = 0;
            this.totalOppsCount = 0;
            this.totalAccountsCount = 0;
            this.totalContactsCount = 0;
            this.totalEmailsCount = 0;
            this.totalMeetingsCount = 0;
            this.isSampled = false;
            this.fetchErrorEntities = [];
            this._currencyFormatter = null;
            this._loadSeq = 0;
            this._missingReportingAmountCount = 0;

            this.onSearchInput = this._debounce(this.onSearchInput.bind(this), 250);
            this.onPeriodDateChange = this._debounce(this.onPeriodDateChange.bind(this), 400);
        },

        _debounce: function (fn, delay) {
            var timer = null;
            return function () {
                var args = arguments;
                var ctx = this;
                clearTimeout(timer);
                timer = setTimeout(function () { fn.apply(ctx, args); }, delay);
            };
        },

        // --- CENTRALIZED SAFE UTILITY HELPERS ---

        /**
         * Safely converts any input into a valid finite number.
         */
        toSafeNumber: function (val, defaultVal) {
            if (val === null || val === undefined || val === '') return defaultVal !== undefined ? defaultVal : 0;
            var num = Number(val);
            return (isNaN(num) || !isFinite(num)) ? (defaultVal !== undefined ? defaultVal : 0) : num;
        },

        /**
         * Normalizes boolean values (handles boolean, 1/0, string 'true'/'false', 'Yes'/'No').
         */
        toSafeBoolean: function (val) {
            if (val === true || val === 1 || val === '1' || val === 'true' || val === 'Yes' || val === 'yes') return true;
            if (val === false || val === 0 || val === '0' || val === 'false' || val === 'No' || val === 'no') return false;
            return !!val;
        },

        /**
         * Calculates percentage safely, preventing NaN, Infinity, and negative values.
         */
        toSafePercentage: function (num, denom, decimals) {
            var n = this.toSafeNumber(num, 0);
            var d = this.toSafeNumber(denom, 0);
            if (d <= 0) return (0).toFixed(decimals !== undefined ? decimals : 1);
            var pct = (n / d) * 100;
            if (isNaN(pct) || !isFinite(pct) || pct < 0) return (0).toFixed(decimals !== undefined ? decimals : 1);
            return pct.toFixed(decimals !== undefined ? decimals : 1);
        },

        /**
         * Normalizes monetary amount using EspoCRM converted amount if available, preventing mixed raw currency sums.
         */
        getReportingAmount: function (item) {
            if (!item) return 0;
            if (item.amountConverted !== undefined && item.amountConverted !== null && item.amountConverted !== '') {
                return this.toSafeNumber(item.amountConverted, 0);
            }
            if (item.opportunityAmountConverted !== undefined && item.opportunityAmountConverted !== null && item.opportunityAmountConverted !== '') {
                return this.toSafeNumber(item.opportunityAmountConverted, 0);
            }
            // Track diagnostic counter when converted reporting amount is missing
            if (this._missingReportingAmountCount === undefined) this._missingReportingAmountCount = 0;
            this._missingReportingAmountCount++;

            if (item.opportunityAmount !== undefined && item.opportunityAmount !== null && item.opportunityAmount !== '') {
                return this.toSafeNumber(item.opportunityAmount, 0);
            }
            return this.toSafeNumber(item.amount, 0);
        },

        /**
         * Dynamic Opportunity Stage Inspection using EspoCRM Metadata
         */
        isStageWon: function (stage) {
            if (!stage) return false;
            if (stage === 'Closed Won') return true;
            try {
                var stageDefs = (this.getMetadata && typeof this.getMetadata === 'function' && this.getMetadata())
                    ? this.getMetadata().get('entityDefs.Opportunity.fields.stage') : null;
                if (stageDefs && stageDefs.probabilityMap && stageDefs.probabilityMap[stage] === 100) return true;
                if (stageDefs && stageDefs.styleMap && stageDefs.styleMap[stage] === 'success') return true;
            } catch (e) {}
            return false;
        },

        isStageLost: function (stage) {
            if (!stage) return false;
            if (stage === 'Closed Lost') return true;
            try {
                var stageDefs = (this.getMetadata && typeof this.getMetadata === 'function' && this.getMetadata())
                    ? this.getMetadata().get('entityDefs.Opportunity.fields.stage') : null;
                if (stageDefs && stageDefs.probabilityMap && stageDefs.probabilityMap[stage] === 0) return true;
                if (stageDefs && stageDefs.styleMap && stageDefs.styleMap[stage] === 'danger') return true;
            } catch (e) {}
            return false;
        },

        isStageOpen: function (stage) {
            return !this.isStageWon(stage) && !this.isStageLost(stage);
        },

        calculateLeadMetrics: function (leads, hasErr) {
            if (hasErr) {
                return { totalLeads: 'N/A', potentialLeads: 'N/A', qualifiedLeads: 'N/A', convertedLeads: 'N/A', lostLeads: 'N/A', convRate: 'N/A', totalLeadOppAmount: 'N/A' };
            }
            var total = leads.length;
            var pot = 0, qual = 0, conv = 0, lost = 0, oppAmt = 0;
            var self = this;
            for (var i = 0; i < total; i++) {
                var l = leads[i];
                var st = l.status;
                if (st === 'Assigned' || st === 'In Process') pot++;
                if (st === 'In Process' || st === 'Converted') qual++;
                if (st === 'Converted') conv++;
                if (st === 'Dead' || st === 'Recycled') lost++;
                oppAmt += self.getReportingAmount(l);
            }
            return {
                totalLeads: total,
                potentialLeads: pot,
                qualifiedLeads: qual,
                convertedLeads: conv,
                lostLeads: lost,
                convRate: this.toSafePercentage(conv, total, 1),
                totalLeadOppAmount: oppAmt
            };
        },

        calculateOpportunityMetrics: function (opps, hasErr) {
            if (hasErr) {
                return { totalOpps: 'N/A', wonOpps: 'N/A', openOpps: 'N/A', lostOpps: 'N/A', totalRevenue: 'N/A', avgDeal: 'N/A', weightedPipeline: 'N/A', winRate: 'N/A' };
            }
            var total = opps.length;
            var won = 0, open = 0, lost = 0, revenue = 0, pipeline = 0;
            var self = this;
            for (var i = 0; i < total; i++) {
                var o = opps[i];
                var st = o.stage;
                var amt = self.getReportingAmount(o);
                if (self.isStageWon(st)) {
                    won++;
                    revenue += amt;
                } else if (self.isStageLost(st)) {
                    lost++;
                } else {
                    open++;
                    var prob = self.getOppProbability(o);
                    pipeline += (amt * prob / 100);
                }
            }
            var avgDeal = won > 0 ? Math.round(revenue / won) : 0;
            return {
                totalOpps: total,
                wonOpps: won,
                openOpps: open,
                lostOpps: lost,
                totalRevenue: revenue,
                avgDeal: avgDeal,
                weightedPipeline: Math.round(pipeline),
                winRate: this.toSafePercentage(won, total, 1)
            };
        },

        calculateAccountMetrics: function (accounts, hasErr) {
            if (hasErr) {
                return { totalAccounts: 'N/A', customerAccounts: 'N/A', partnerAccounts: 'N/A', investorAccounts: 'N/A', accWithEmail: 'N/A', accWithPhone: 'N/A', accWithWebsite: 'N/A' };
            }
            var total = accounts.length;
            var cust = 0, part = 0, inv = 0, email = 0, phone = 0, web = 0;
            for (var i = 0; i < total; i++) {
                var a = accounts[i];
                var t = a.type;
                if (t === 'Customer') cust++;
                else if (t === 'Partner') part++;
                else if (t === 'Investor' || t === 'Reseller') inv++;
                if (String(a.emailAddress || '').trim().length > 0) email++;
                if (String(a.phoneNumber || '').trim().length > 0) phone++;
                if (String(a.website || '').trim().length > 0) web++;
            }
            return {
                totalAccounts: total,
                customerAccounts: cust,
                partnerAccounts: part,
                investorAccounts: inv,
                accWithEmail: email,
                accWithPhone: phone,
                accWithWebsite: web
            };
        },

        calculateContactMetrics: function (contacts, hasErr) {
            if (hasErr) {
                return { totalContacts: 'N/A', withEmailCount: 'N/A', withPhoneCount: 'N/A', dncContacts: 'N/A', emailPct: 'N/A', phonePct: 'N/A', dncPct: 'N/A', withAccountCount: 'N/A', completeProfilesCount: 'N/A' };
            }
            var total = contacts.length;
            var email = 0, phone = 0, dnc = 0, acc = 0, complete = 0;
            var self = this;
            for (var i = 0; i < total; i++) {
                var c = contacts[i];
                var hasE = String(c.emailAddress || '').trim().length > 0;
                var hasP = String(c.phoneNumber || '').trim().length > 0;
                if (hasE) email++;
                if (hasP) phone++;
                if (self.toSafeBoolean(c.doNotCall)) dnc++;
                if (String(c.accountName || '').trim().length > 0) acc++;
                if (hasE && hasP) complete++;
            }
            return {
                totalContacts: total,
                withEmailCount: email,
                withPhoneCount: phone,
                dncContacts: dnc,
                emailPct: this.toSafePercentage(email, total, 0),
                phonePct: this.toSafePercentage(phone, total, 0),
                dncPct: this.toSafePercentage(dnc, total, 0),
                withAccountCount: acc,
                completeProfilesCount: complete
            };
        },

        calculateEmailMetrics: function (emails, hasErr) {
            if (hasErr) {
                return { totalEmails: 'N/A', sentEmails: 'N/A', draftEmails: 'N/A', failedEmails: 'N/A', repliedEmails: 'N/A', readEmails: 'N/A', replyRate: 'N/A', readRate: 'N/A' };
            }
            var total = emails.length;
            var sent = 0, draft = 0, failed = 0, replied = 0, read = 0;
            var self = this;
            for (var i = 0; i < total; i++) {
                var e = emails[i];
                var st = e.status;
                if (st === 'Sent') sent++;
                else if (st === 'Draft') draft++;
                else if (st === 'Failed') failed++;
                if (self.toSafeBoolean(e.isReplied)) replied++;
                if (self.toSafeBoolean(e.isRead)) read++;
            }
            return {
                totalEmails: total,
                sentEmails: sent,
                draftEmails: draft,
                failedEmails: failed,
                repliedEmails: replied,
                readEmails: read,
                replyRate: this.toSafePercentage(replied, sent, 1),
                readRate: this.toSafePercentage(read, total, 1)
            };
        },

        calculateMeetingMetrics: function (meetings, hasErr) {
            if (hasErr) {
                return { totalMeetings: 'N/A', heldMeetings: 'N/A', upcomingMeetings: 'N/A', noShowMeetings: 'N/A', allDayMeetings: 'N/A', avgDurationMins: 'N/A' };
            }
            var total = meetings.length;
            var held = 0, upcoming = 0, noShow = 0, allDay = 0, durationSum = 0;
            var self = this;
            for (var i = 0; i < total; i++) {
                var m = meetings[i];
                var st = m.status;
                if (st === 'Held') held++;
                else if (st === 'Not Held') noShow++;
                if (self.isMeetingUpcoming(m)) upcoming++;
                if (self.toSafeBoolean(m.isAllDay)) allDay++;
                durationSum += self.toSafeNumber(m.duration, 0);
            }
            var avgSec = total > 0 ? Math.round(durationSum / total) : 0;
            var avgMin = Math.round(avgSec / 60);
            return {
                totalMeetings: total,
                heldMeetings: held,
                upcomingMeetings: upcoming,
                noShowMeetings: noShow,
                allDayMeetings: allDay,
                avgDurationMins: avgMin
            };
        },

        /**
         * Validates and normalizes opportunity probability between 0 and 100.
         */
        getOppProbability: function (o) {
            if (!o) return 50;
            if (o.probability !== undefined && o.probability !== null && o.probability !== '') {
                var prob = this.toSafeNumber(o.probability, -1);
                if (prob >= 0 && prob <= 100) return prob;
            }
            var stageMap = {
                'Prospecting': 10,
                'Qualification': 20,
                'Proposal': 50,
                'Negotiation': 80,
                'Closed Won': 100,
                'Closed Lost': 0
            };
            return stageMap[o.stage] !== undefined ? stageMap[o.stage] : 50;
        },

        escapeHtml: function (str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        },

        parseEspoDate: function (v) {
            if (!v) return null;
            var s = String(v).trim();
            if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
                var p = s.split('-');
                return new Date(+p[0], +p[1] - 1, +p[2]);
            }
            var m = s.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
            if (m) return new Date(Date.UTC(+m[1], +m[2]-1, +m[3], +m[4], +m[5], +(m[6] || 0)));
            var d = new Date(s);
            return isNaN(d.getTime()) ? null : d;
        },

        getLocalDateStr: function (dateInput) {
            if (!dateInput) {
                dateInput = new Date();
            }
            if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
                return dateInput.trim();
            }
            var d = this.parseEspoDate(dateInput);
            if (!d) return '';
            var y = d.getFullYear();
            var m = String(d.getMonth() + 1).padStart(2, '0');
            var day = String(d.getDate()).padStart(2, '0');
            return y + '-' + m + '-' + day;
        },

        getTomorrowDateStr: function () {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return this.getLocalDateStr(tomorrow);
        },

        fetchTodayLeadsCount: function () {
            var todayStr = this.getLocalDateStr();
            var url = 'api/v1/Lead?maxSize=1&select=id,createdAt' +
                      '&where[0][type]=between&where[0][attribute]=createdAt' +
                      '&where[0][value][]=' + encodeURIComponent(todayStr + ' 00:00:00') +
                      '&where[0][value][]=' + encodeURIComponent(todayStr + ' 23:59:59');
            var req;
            if (window.Espo && window.Espo.Ajax && typeof window.Espo.Ajax.getRequest === 'function') {
                req = window.Espo.Ajax.getRequest(url.replace(/^api\/v1\//, ''));
            } else {
                req = $.ajax({ url: url, type: 'GET', dataType: 'json', headers: { 'X-Requested-With': 'XMLHttpRequest' } });
            }
            return req.then(function (res) {
                if (res && typeof res.total === 'number' && res.total >= 0) {
                    return res.total;
                }
                var list = (res && Array.isArray(res.list)) ? res.list : [];
                return list.length;
            }).catch(function (err) {
                console.warn('[Analytics BI] Auxiliary Today Leads fetch failed:', err);
                return 'N/A';
            });
        },

        fetchMonthAccountsCount: function () {
            var todayStr = this.getLocalDateStr();
            var monthStartStr = todayStr.substring(0, 7) + '-01';
            var url = 'api/v1/Account?maxSize=1&select=id,createdAt' +
                      '&where[0][type]=between&where[0][attribute]=createdAt' +
                      '&where[0][value][]=' + encodeURIComponent(monthStartStr + ' 00:00:00') +
                      '&where[0][value][]=' + encodeURIComponent(todayStr + ' 23:59:59');
            var req;
            if (window.Espo && window.Espo.Ajax && typeof window.Espo.Ajax.getRequest === 'function') {
                req = window.Espo.Ajax.getRequest(url.replace(/^api\/v1\//, ''));
            } else {
                req = $.ajax({ url: url, type: 'GET', dataType: 'json', headers: { 'X-Requested-With': 'XMLHttpRequest' } });
            }
            return req.then(function (res) {
                if (res && typeof res.total === 'number' && res.total >= 0) {
                    return res.total;
                }
                var list = (res && Array.isArray(res.list)) ? res.list : [];
                return list.length;
            }).catch(function (err) {
                console.warn('[Analytics BI] Auxiliary Month Accounts fetch failed:', err);
                return 'N/A';
            });
        },

        isMeetingUpcoming: function (m) {
            if (!m || !m.dateStart) return false;
            var d = this.parseEspoDate(m.dateStart);
            return d ? d.getTime() > Date.now() : false;
        },

        getPeriodBoundaries: function () {
            var f = this.activeFilter;
            var todayStr = this.getLocalDateStr();
            var now = new Date();

            var monday = new Date(now);
            monday.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
            var sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);

            var year = todayStr.substring(0, 4);
            var month = todayStr.substring(0, 7);

            var from = null, to = null;

            if (f === 'today') {
                from = todayStr; to = todayStr;
            } else if (f === 'yesterday') {
                var yest = new Date(now); yest.setDate(now.getDate() - 1);
                from = this.getLocalDateStr(yest); to = from;
            } else if (f === 'week') {
                from = this.getLocalDateStr(monday);
                to = this.getLocalDateStr(sunday);
            } else if (f === 'month') {
                from = month + '-01';
                var lastDayMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                to = this.getLocalDateStr(lastDayMonth);
            } else if (f === 'thisyear') {
                from = year + '-01-01';
                to = year + '-12-31';
            } else if (f === 'lastyear') {
                var ly = String(Number(year) - 1);
                from = ly + '-01-01'; to = ly + '-12-31';
            } else if (f === 'custom') {
                if (this.customDateFrom && this.customDateTo && this.customDateFrom <= this.customDateTo) {
                    from = this.customDateFrom;
                    to = this.customDateTo;
                } else {
                    from = null;
                    to = null;
                }
            } else {
                var m = f ? f.match(/^last(\d+)$/) : null;
                if (m) {
                    var n = parseInt(m[1], 10);
                    var cutoff = new Date(now);
                    cutoff.setDate(now.getDate() - n + 1);
                    from = this.getLocalDateStr(cutoff);
                    to = todayStr;
                }
            }
            return { from: from, to: to };
        },

        periodToRange: function () {
            return this.getPeriodBoundaries();
        },

        formatDate: function (dateStr) {
            if (!dateStr) return 'N/A';
            try {
                if (this.getDateTime && typeof this.getDateTime().toDisplayDate === 'function') {
                    return this.getDateTime().toDisplayDate(dateStr);
                }
                var d = this.parseEspoDate(dateStr);
                if (!d) return dateStr;
                return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            } catch (e) {
                return String(dateStr).substring(0, 10);
            }
        },

        getCurrencyCode: function () {
            if (this.getConfig && typeof this.getConfig === 'function' && this.getConfig()) {
                return this.getConfig().get('currency') || this.getConfig().get('baseCurrency') || 'USD';
            }
            return 'USD';
        },

        formatCurrency: function (amount) {
            var val = this.toSafeNumber(amount, 0);
            var code = this.getCurrencyCode();
            if (!this._currencyFormatter || this._currencyFormatterCode !== code) {
                try {
                    this._currencyFormatterCode = code;
                    this._currencyFormatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: code,
                        maximumFractionDigits: 0
                    });
                } catch (e) {
                    this._currencyFormatter = null;
                }
            }
            return this._currencyFormatter ? this._currencyFormatter.format(val) : code + ' ' + val.toLocaleString();
        },

        templateContent: `
            <div class="analytics-bi-wrapper">
                <!-- Header Control Bar -->
                <div class="header-bar">
                    <div class="header-left">
                        <div class="header-title-row">
                            <h2 class="header-title">
                                <i class="fas fa-chart-line header-icon"></i>
                                <span>CodakCRM Enterprise BI Platform</span>
                            </h2>
                            <span class="live-status-pill">
                                <span class="pulse-dot"></span>
                                Native Tier-4 Engine
                            </span>
                        </div>
                        <p class="header-subtitle">Real-time Multi-Entity Business Intelligence & Pipeline Analytics</p>
                    </div>
                    <div class="header-actions">
                        <button id="btn-export-csv" class="btn btn-secondary">
                            <i class="fas fa-download"></i> Export CSV
                        </button>
                        <button id="btn-refresh-analytics" class="btn btn-primary">
                            <i class="fas fa-sync-alt refresh-spinner"></i> Refresh Data
                        </button>
                    </div>
                </div>

                <!-- Entity Tab Switcher Bar -->
                <div class="tab-switcher-bar">
                    <button class="entity-tab-pill active" data-tab="all"><i class="fas fa-th-large"></i> Overview</button>
                    <button class="entity-tab-pill" data-tab="Lead"><i class="fas fa-user-tag"></i> Leads</button>
                    <button class="entity-tab-pill" data-tab="Opportunity"><i class="fas fa-briefcase"></i> Opportunities</button>
                    <button class="entity-tab-pill" data-tab="Account"><i class="fas fa-building"></i> Accounts</button>
                    <button class="entity-tab-pill" data-tab="Contact"><i class="fas fa-address-book"></i> Contacts</button>
                    <button class="entity-tab-pill" data-tab="Email"><i class="fas fa-envelope"></i> Emails</button>
                    <button class="entity-tab-pill" data-tab="Meeting"><i class="fas fa-calendar-alt"></i> Meetings</button>
                </div>

                <!-- Enterprise Filter Controls Bar (Dropdown Selects) -->
                <div class="filter-controls-bar">
                    <div class="filter-dropdowns-group">
                        <!-- Entity Select Dropdown -->
                        <div class="filter-dropdown-item">
                            <label for="analytics-entity-select" class="filter-dropdown-label"><i class="fas fa-filter"></i> Module:</label>
                            <div class="custom-select-wrapper">
                                <select id="analytics-entity-select" class="filter-select">
                                    <option value="all">Overview (All Modules)</option>
                                    <option value="Lead">Leads</option>
                                    <option value="Opportunity">Opportunities</option>
                                    <option value="Account">Accounts</option>
                                    <option value="Contact">Contacts</option>
                                    <option value="Email">Emails</option>
                                    <option value="Meeting">Meetings</option>
                                </select>
                                <i class="fas fa-chevron-down select-arrow"></i>
                            </div>
                        </div>

                        <!-- Period Select Dropdown -->
                        <div class="filter-dropdown-item">
                            <label for="analytics-period-select" class="filter-dropdown-label"><i class="fas fa-calendar-alt"></i> Period:</label>
                            <div class="custom-select-wrapper">
                                <select id="analytics-period-select" class="filter-select">
                                    <optgroup label="Presets">
                                        <option value="all">All Time (Full History)</option>
                                        <option value="today">Today</option>
                                        <option value="yesterday">Yesterday</option>
                                        <option value="last2">Last 2 Days</option>
                                        <option value="last3">Last 3 Days</option>
                                        <option value="week">This Week</option>
                                        <option value="last7">Last 7 Days</option>
                                        <option value="last10">Last 10 Days</option>
                                        <option value="last14">Last 14 Days</option>
                                        <option value="month">This Month</option>
                                        <option value="last30">Last 30 Days</option>
                                        <option value="last90">Last 90 Days</option>
                                        <option value="thisyear">This Year</option>
                                        <option value="lastyear">Last Year</option>
                                    </optgroup>
                                    <optgroup label="Deals">
                                        <option value="won">Closed Won Deals</option>
                                    </optgroup>
                                    <optgroup label="Custom">
                                        <option value="custom">Custom Range (Between...)</option>
                                    </optgroup>
                                </select>
                                <i class="fas fa-chevron-down select-arrow"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Custom Date Range Row (shown only when 'custom' is selected) -->
                    <div id="analytics-custom-range-row" class="custom-date-range-row" style="display:none;">
                        <label class="filter-dropdown-label"><i class="fas fa-calendar-check"></i> From:</label>
                        <input type="date" id="analytics-period-date-from" class="filter-date-input" />
                        <label class="filter-dropdown-label" style="margin-left:8px;"><i class="fas fa-calendar-check"></i> To:</label>
                        <input type="date" id="analytics-period-date-to" class="filter-date-input" />
                    </div>

                    <!-- Search & Active Filter Chips Container -->
                    <div class="search-group">
                        <div id="active-filters-container" class="active-filters-container"></div>
                        <div class="search-input-wrapper">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" id="analytics-search-input" class="search-input" placeholder="Search across records...">
                        </div>
                    </div>
                </div>

                <!-- Loading State -->
                <div id="analytics-loader" class="loader-container">
                    <div class="spinner-ring"></div>
                    <p class="loader-text">Loading Enterprise CRM Metrics...</p>
                </div>

                <!-- Main Dynamic Dashboard Content Area -->
                <div id="analytics-content" style="display: none;">
                    <!-- KPI Cards Grid -->
                    <div id="kpi-grid" class="kpi-grid"></div>

                    <!-- Charts Grid Area -->
                    <div id="charts-wrapper" class="charts-grid"></div>

                    <!-- Data Tables Container -->
                    <div id="tables-wrapper" class="tables-grid"></div>
                </div>
            </div>

            <style id="analytics-bi-global-styles">
                .analytics-bi-wrapper {
                    --color-primary: #005a70;
                    --color-primary-hover: #004557;
                    --color-primary-light: #00a4c8;
                    --color-primary-subtle: #e0f2fe;
                    --color-success: #059669;
                    --color-success-bg: #ecfdf5;
                    --color-warning: #d97706;
                    --color-warning-bg: #fffbeb;
                    --color-danger: #dc2626;
                    --color-danger-bg: #fef2f2;
                    --color-info: #0284c7;
                    --color-info-bg: #f0f9ff;
                    --color-purple: #7c3aed;
                    --color-purple-bg: #f3e8ff;
                    --color-bg-main: #f8fafc;
                    --color-card-bg: #ffffff;
                    --color-text-main: #0f172a;
                    --color-text-muted: #64748b;
                    --color-border: #e2e8f0;
                    --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

                    padding: 32px 28px;
                    background: var(--color-bg-main);
                    color: var(--color-text-main);
                    min-height: 100vh;
                    font-family: var(--font-family-base);
                }

                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

                .analytics-bi-wrapper .header-bar {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    padding: 24px 30px;
                    background: var(--color-card-bg);
                    border: 1px solid var(--color-border);
                    border-radius: 20px;
                    margin-bottom: 24px;
                    box-shadow: 0 8px 30px -6px rgba(0, 45, 60, 0.04);
                    position: relative;
                    overflow: hidden;
                }
                .analytics-bi-wrapper .header-bar::before {
                    content: "";
                    position: absolute;
                    top: 0; left: 0; width: 5px; height: 100%;
                    background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
                }
                .analytics-bi-wrapper .header-left { display: flex; flex-direction: column; gap: 4px; }
                .analytics-bi-wrapper .header-title-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
                .analytics-bi-wrapper .header-title { margin: 0; font-size: 22px; font-weight: 800; color: var(--color-text-main); display: flex; align-items: center; gap: 10px; letter-spacing: -0.02em; }
                .analytics-bi-wrapper .header-icon { color: var(--color-primary-light); }
                .analytics-bi-wrapper .header-subtitle { margin: 0; font-size: 13px; color: var(--color-text-muted); font-weight: 500; }
                .analytics-bi-wrapper .header-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

                .analytics-bi-wrapper .live-status-pill {
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 12px;
                    background: var(--color-primary-subtle);
                    color: var(--color-primary);
                    border-radius: 20px;
                    border: 1px solid #bae6fd;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .analytics-bi-wrapper .pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-primary-light); display: inline-block; animation: pulse 1.5s infinite; }

                /* Buttons Scoped Strictly to Dashboard Wrapper */
                .analytics-bi-wrapper .btn {
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    border: none;
                }
                .analytics-bi-wrapper .btn:focus-visible { outline: 2px solid var(--color-primary-light); outline-offset: 2px; }
                .analytics-bi-wrapper .btn-primary {
                    background: linear-gradient(135deg, var(--color-primary) 0%, #007c9b 100%);
                    color: #ffffff;
                    box-shadow: 0 4px 14px rgba(0, 90, 112, 0.2);
                }
                .analytics-bi-wrapper .btn-primary:hover {
                    background: linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 164, 200, 0.3);
                }
                .analytics-bi-wrapper .btn-primary.is-loading .refresh-spinner { animation: spin 0.8s linear infinite; }
                .analytics-bi-wrapper .btn-secondary {
                    background: #ffffff;
                    color: var(--color-primary);
                    border: 1px solid var(--color-border);
                }
                .analytics-bi-wrapper .btn-secondary:hover {
                    background: var(--color-info-bg);
                    border-color: var(--color-primary-light);
                    color: var(--color-primary-light);
                    transform: translateY(-2px);
                }

                /* Tab Switcher */
                .analytics-bi-wrapper .tab-switcher-bar { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 20px; }
                .analytics-bi-wrapper .entity-tab-pill {
                    padding: 9px 18px;
                    background: #ffffff;
                    color: var(--color-text-muted);
                    border: 1px solid var(--color-border);
                    border-radius: 14px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .analytics-bi-wrapper .entity-tab-pill:hover { background: var(--color-info-bg); color: var(--color-primary); border-color: var(--color-primary-light); transform: translateY(-1px); }
                .analytics-bi-wrapper .entity-tab-pill.active {
                    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
                    color: #ffffff;
                    border-color: var(--color-primary);
                    box-shadow: 0 4px 16px rgba(0, 164, 200, 0.25);
                }

                /* Filters Bar */
                .analytics-bi-wrapper .filter-controls-bar {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    padding: 16px 24px;
                    background: var(--color-card-bg);
                    border: 1px solid var(--color-border);
                    border-radius: 18px;
                    margin-bottom: 28px;
                    box-shadow: 0 4px 16px -4px rgba(0,0,0,0.02);
                }
                .analytics-bi-wrapper .filter-dropdowns-group { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
                .analytics-bi-wrapper .filter-dropdown-item { display: flex; align-items: center; gap: 8px; }
                .analytics-bi-wrapper .filter-dropdown-label { font-size: 12px; font-weight: 800; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; }

                .analytics-bi-wrapper .custom-select-wrapper { position: relative; display: inline-block; }
                .analytics-bi-wrapper .filter-select {
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    padding: 8px 36px 8px 14px;
                    background: #ffffff;
                    color: var(--color-text-main);
                    border: 1px solid #cbd5e1;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 700;
                    font-family: var(--font-family-base);
                    cursor: pointer;
                    outline: none;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 2px 6px rgba(0,0,0,0.02);
                }
                .analytics-bi-wrapper .filter-select:hover {
                    border-color: var(--color-primary-light);
                    background: var(--color-info-bg);
                }
                .analytics-bi-wrapper .filter-select:focus {
                    border-color: var(--color-primary-light);
                    box-shadow: 0 0 0 3px rgba(0, 164, 200, 0.18);
                }
                .analytics-bi-wrapper .filter-select optgroup {
                    font-weight: 800;
                    color: var(--color-primary);
                    background: #f1f5f9;
                    font-style: normal;
                    padding: 6px 8px;
                    font-size: 11px;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }
                .analytics-bi-wrapper .filter-select option {
                    font-weight: 600;
                    color: #0f172a;
                    background: #ffffff;
                    padding: 8px 12px;
                    font-size: 13px;
                }
                .analytics-bi-wrapper .select-arrow {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    font-size: 11px;
                    color: var(--color-text-muted);
                }

                .analytics-bi-wrapper .search-group { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
                .analytics-bi-wrapper .active-filters-container {
                    display: none;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .analytics-bi-wrapper .active-filters-label {
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .analytics-bi-wrapper .filter-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    font-weight: 700;
                    padding: 5px 10px;
                    background: var(--color-primary-subtle);
                    color: var(--color-primary);
                    border: 1px solid #bae6fd;
                    border-radius: 10px;
                    animation: chipIn 0.2s ease;
                }
                .analytics-bi-wrapper .chip-remove {
                    cursor: pointer;
                    font-size: 10px;
                    opacity: 0.7;
                    transition: opacity 0.15s, transform 0.15s;
                }
                .analytics-bi-wrapper .chip-remove:hover { opacity: 1; transform: scale(1.2); }
                .analytics-bi-wrapper .clear-all-filters-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 11px;
                    font-weight: 800;
                    padding: 5px 12px;
                    background: var(--color-danger-bg);
                    color: var(--color-danger);
                    border: 1px solid #fecaca;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.15s;
                }
                .analytics-bi-wrapper .clear-all-filters-btn:hover { background: #fee2e2; transform: translateY(-1px); }

                .analytics-bi-wrapper .custom-date-range-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                    width: 100%;
                    padding: 10px 0 2px 0;
                    border-top: 1px dashed var(--color-border);
                    margin-top: 10px;
                    animation: chipIn 0.2s ease;
                }
                .analytics-bi-wrapper .filter-date-input {
                    padding: 7px 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    font-family: var(--font-family-base);
                    color: var(--color-text-main);
                    background: #ffffff;
                    outline: none;
                    cursor: pointer;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }
                .analytics-bi-wrapper .filter-date-input:focus {
                    border-color: var(--color-primary-light);
                    box-shadow: 0 0 0 3px rgba(0,164,200,0.15);
                }
                @keyframes chipIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }

                @keyframes cardIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                .analytics-bi-wrapper .kpi-card, .analytics-bi-wrapper .chart-box, .analytics-bi-wrapper .table-box { animation: cardIn 0.35s ease backwards; }
                .analytics-bi-wrapper .kpi-grid .kpi-card:nth-child(2) { animation-delay: 0.04s; }
                .analytics-bi-wrapper .kpi-grid .kpi-card:nth-child(3) { animation-delay: 0.08s; }
                .analytics-bi-wrapper .kpi-grid .kpi-card:nth-child(4) { animation-delay: 0.12s; }
                .analytics-bi-wrapper .kpi-grid .kpi-card:nth-child(5) { animation-delay: 0.16s; }
                .analytics-bi-wrapper .kpi-grid .kpi-card:nth-child(6) { animation-delay: 0.20s; }

                .analytics-bi-wrapper .data-table thead .data-th { position: sticky; top: 0; z-index: 2; }
                .analytics-bi-wrapper .interactive-bar-item:focus-visible { outline: 2px solid var(--color-primary-light); outline-offset: 2px; }
                .analytics-bi-wrapper .kpi-card:hover .kpi-val { transform: scale(1.02); transition: transform 0.2s ease; }
                .analytics-bi-wrapper .search-input-wrapper { position: relative; display: flex; align-items: center; }
                .analytics-bi-wrapper .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 13px; color: var(--color-text-muted); pointer-events: none; z-index: 2; }
                .analytics-bi-wrapper .search-input {
                    padding: 9px 16px 9px 38px !important; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 13px; outline: none; width: 240px; transition: all 0.2s; background: #ffffff; font-family: var(--font-family-base); text-indent: 0 !important;
                }
                .analytics-bi-wrapper .search-input:focus { border-color: var(--color-primary-light); box-shadow: 0 0 0 3px rgba(0,164,200,0.15); }

                /* Loader */
                .analytics-bi-wrapper .loader-container { text-align: center; padding: 70px 0; background: var(--color-card-bg); border-radius: 20px; border: 1px solid var(--color-border); box-shadow: 0 6px 20px -4px rgba(0,0,0,0.02); }
                .analytics-bi-wrapper .spinner-ring { width: 44px; height: 44px; border: 4px solid var(--color-primary-subtle); border-top-color: var(--color-primary-light); border-radius: 50%; display: inline-block; animation: spin 0.8s linear infinite; }
                .analytics-bi-wrapper .loader-text { margin-top: 16px; font-size: 14px; font-weight: 700; color: var(--color-primary); }

                /* Grids Layout */
                .analytics-bi-wrapper .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; margin-bottom: 28px; }
                .analytics-bi-wrapper .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px; margin-bottom: 28px; }
                .analytics-bi-wrapper .tables-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 20px; }

                /* KPI Card */
                .analytics-bi-wrapper .kpi-card {
                    background: var(--color-card-bg);
                    border: 1px solid var(--color-border);
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 4px 16px -4px rgba(0, 45, 60, 0.03);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                }
                .analytics-bi-wrapper .kpi-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%); }
                .analytics-bi-wrapper .kpi-card:hover { transform: translateY(-3px); border-color: var(--color-primary-light); box-shadow: 0 10px 24px -4px rgba(0, 164, 200, 0.15); }
                .analytics-bi-wrapper .kpi-header { display: flex; justify-content: space-between; align-items: center; }
                .analytics-bi-wrapper .kpi-title { font-size: 11px; font-weight: 800; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .analytics-bi-wrapper .kpi-badge { font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 10px; background: var(--color-primary-subtle); color: var(--color-primary); }
                .analytics-bi-wrapper .kpi-val { font-size: 24px; font-weight: 800; color: var(--color-primary); margin-top: 8px; letter-spacing: -0.02em; }

                /* Chart Box */
                .analytics-bi-wrapper .chart-box { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 18px; padding: 22px; box-shadow: 0 4px 16px -4px rgba(0,0,0,0.02); transition: all 0.2s; }
                .analytics-bi-wrapper .chart-box:hover { box-shadow: 0 8px 24px -4px rgba(0, 90, 112, 0.06); }
                .analytics-bi-wrapper .chart-title { margin: 0 0 16px 0; font-size: 13px; font-weight: 800; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.05em; }
                .analytics-bi-wrapper .chart-subtitle { margin: 2px 0 0 0; font-size: 12px; color: var(--color-text-muted); }

                /* Table Box & Data Cells */
                .analytics-bi-wrapper .table-box { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 18px; padding: 22px; box-shadow: 0 4px 16px -4px rgba(0,0,0,0.02); overflow: hidden; }
                .analytics-bi-wrapper .table-title { margin: 0; font-size: 15px; font-weight: 800; color: var(--color-text-main); }
                .analytics-bi-wrapper .table-subtitle { margin: 2px 0 0 0; font-size: 12px; color: var(--color-text-muted); }
                .analytics-bi-wrapper .table-responsive {
                    overflow-x: auto;
                    margin-top: 16px;
                    max-height: 520px;
                    overflow-y: auto;
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 transparent;
                }
                .analytics-bi-wrapper .table-responsive::-webkit-scrollbar { height: 4px; width: 4px; }
                .analytics-bi-wrapper .table-responsive::-webkit-scrollbar-track { background: transparent; }
                .analytics-bi-wrapper .table-responsive::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

                .analytics-bi-wrapper .data-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; white-space: nowrap; }
                .analytics-bi-wrapper .data-th { padding: 12px 14px; font-weight: 700; color: var(--color-text-muted); background: var(--color-bg-main); border-bottom: 2px solid var(--color-border); white-space: nowrap; }
                .analytics-bi-wrapper .data-row { transition: background 0.15s ease; border-bottom: 1px solid #f1f5f9; }
                .analytics-bi-wrapper .data-row:hover { background: var(--color-info-bg) !important; }
                .analytics-bi-wrapper .data-td { padding: 10px 14px; color: var(--color-text-main); vertical-align: middle; white-space: nowrap; }
                .analytics-bi-wrapper .data-td-bold { padding: 10px 14px; font-weight: 700; color: var(--color-text-main); vertical-align: middle; white-space: nowrap; }
                .analytics-bi-wrapper .data-td-muted { padding: 10px 14px; color: var(--color-text-muted); vertical-align: middle; white-space: nowrap; }
                .analytics-bi-wrapper .data-td-right { text-align: right; }
                .analytics-bi-wrapper .cell-truncate {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: inline-block;
                    vertical-align: middle;
                }

                /* Clean Badges */
                .analytics-bi-wrapper .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 800; line-height: 1; }
                .analytics-bi-wrapper .badge-primary { background: var(--color-primary-subtle); color: var(--color-primary); }
                .analytics-bi-wrapper .badge-success { background: var(--color-success-bg); color: var(--color-success); }
                .analytics-bi-wrapper .badge-warning { background: var(--color-warning-bg); color: var(--color-warning); }
                .analytics-bi-wrapper .badge-danger { background: var(--color-danger-bg); color: var(--color-danger); }
                .analytics-bi-wrapper .badge-info { background: var(--color-info-bg); color: var(--color-info); }
                .analytics-bi-wrapper .badge-purple { background: var(--color-purple-bg); color: var(--color-purple); }

                /* Table Action Button */
                .analytics-bi-wrapper .table-action-btn {
                    padding: 5px 12px;
                    background: var(--color-primary-light);
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 700;
                    display: inline-block;
                    transition: all 0.2s;
                    box-shadow: 0 2px 6px rgba(0, 164, 200, 0.2);
                    cursor: pointer;
                    border: none;
                }
                .analytics-bi-wrapper .table-action-btn:hover { background: var(--color-primary); color: #ffffff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 90, 112, 0.3); }

                /* Interactive & Static Bar Items */
                .analytics-bi-wrapper .interactive-bar-item {
                    cursor: pointer;
                    padding: 8px 12px;
                    border-radius: 12px;
                    border: 1px solid transparent;
                    background: transparent;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    margin-bottom: 6px;
                }
                .analytics-bi-wrapper .interactive-bar-item:hover {
                    background: var(--color-info-bg);
                    border-color: #bae6fd;
                    transform: translateX(3px);
                }
                .analytics-bi-wrapper .interactive-bar-item.is-selected {
                    background: var(--color-primary-subtle);
                    border-color: var(--color-primary-light);
                    box-shadow: 0 4px 14px rgba(0, 164, 200, 0.15);
                }
                .analytics-bi-wrapper .static-ratio-item {
                    padding: 8px 12px;
                    border-radius: 12px;
                    margin-bottom: 6px;
                }
                .analytics-bi-wrapper .bar-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    margin-bottom: 6px;
                }
                .analytics-bi-wrapper .bar-item-label-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .analytics-bi-wrapper .bar-item-right-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .analytics-bi-wrapper .filter-icon-checked {
                    color: var(--color-primary-light);
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                .analytics-bi-wrapper .filter-icon-unchecked {
                    color: #cbd5e1;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                .analytics-bi-wrapper .interactive-bar-item.is-unchecked {
                    opacity: 0.55;
                    background: rgba(241, 245, 249, 0.5);
                }
                .analytics-bi-wrapper .interactive-bar-item.is-unchecked .bar-progress-fill {
                    background: #cbd5e1 !important;
                }
                .analytics-bi-wrapper .interactive-bar-item.is-unchecked .bar-item-name {
                    text-decoration: line-through;
                    color: var(--color-text-muted);
                }
                .analytics-bi-wrapper .bar-item-name {
                    font-weight: 700;
                    color: var(--color-text-main);
                }
                .analytics-bi-wrapper .bar-item-count {
                    font-weight: 800;
                    color: var(--color-primary);
                }
                .analytics-bi-wrapper .bar-item-pct {
                    font-weight: 600;
                    color: var(--color-text-muted);
                    font-size: 11px;
                }
                .analytics-bi-wrapper .bar-progress-track {
                    width: 100%;
                    height: 8px;
                    background: #f1f5f9;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid var(--color-border);
                }
                .analytics-bi-wrapper .bar-progress-fill {
                    height: 100%;
                    border-radius: 8px;
                    transition: width 0.4s ease;
                }

                /* Empty State Box */
                .analytics-bi-wrapper .empty-state-box { text-align: center; padding: 36px 20px; background: var(--color-bg-main); border-radius: 14px; border: 1px dashed var(--color-border); }
                .analytics-bi-wrapper .empty-state-icon { font-size: 28px; color: var(--color-text-muted); opacity: 0.5; margin-bottom: 8px; }
                .analytics-bi-wrapper .empty-state-title { font-size: 14px; font-weight: 700; color: var(--color-text-main); margin: 0 0 4px 0; }
                .analytics-bi-wrapper .empty-state-desc { font-size: 12px; color: var(--color-text-muted); margin: 0; }

                @media (max-width: 768px) {
                    .analytics-bi-wrapper { padding: 16px 12px; }
                    .analytics-bi-wrapper .header-bar { padding: 16px; flex-direction: column; align-items: flex-start; }
                    .analytics-bi-wrapper .header-actions { width: 100%; justify-content: flex-start; }
                    .analytics-bi-wrapper .search-input { width: 100%; }
                    .analytics-bi-wrapper .charts-grid, .analytics-bi-wrapper .tables-grid { grid-template-columns: 1fr; }
                }
            </style>
        `,

        events: {
            'click #btn-refresh-analytics': 'loadMetrics',
            'click #btn-export-csv': 'exportCSV',
            'click .entity-tab-pill': 'onEntityTabClick',
            'change #analytics-entity-select': 'onEntitySelectChange',
            'change #analytics-period-select': 'onPeriodSelectChange',
            'change #analytics-period-date-from': 'onPeriodDateChange',
            'change #analytics-period-date-to': 'onPeriodDateChange',
            'input #analytics-period-date-from': 'onPeriodDateChange',
            'input #analytics-period-date-to': 'onPeriodDateChange',
            'input #analytics-search-input': 'onSearchInput',
            'click .chip-remove': 'onChipRemove',
            'click .clear-all-filters-btn': 'clearCategoryFilter',
            'click .interactive-bar-item': 'onBarItemClick',
            'click .btn-view-record': 'onViewRecordClick'
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);

            var $styles = $('#analytics-bi-global-styles');
            if ($styles.length > 1) {
                $styles.slice(1).remove();
            }

            this.loadMetrics();
            try {
                var $tabs = $('#navbar .tabs > li, .navbar-nav > li');
                $tabs.removeClass('active');
                $tabs.filter('[data-name="AnalyticsDashboard"], .tab-AnalyticsDashboard, :has(a[href*="AnalyticsDashboard"])').addClass('active');
            } catch (e) {
                console.warn('[Analytics BI] navbar highlight hack failed — markup may have changed:', e);
            }
        },

        onViewRecordClick: function (e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            var scope = $target.attr('data-scope');
            var id = $target.attr('data-id');

            if (!scope || !id) return;

            var route = scope + '/view/' + id;
            if (this.getRouter && this.getRouter()) {
                this.getRouter().navigate(route, { trigger: true });
            } else if (window.Backbone && window.Backbone.history) {
                window.Backbone.history.navigate(route, { trigger: true });
            } else {
                window.location.hash = '#' + route;
            }
        },

        onEntitySelectChange: function (e) {
            var tab = $(e.currentTarget).val();
            this.setEntityTab(tab);
        },

        onEntityTabClick: function (e) {
            var tab = $(e.currentTarget).attr('data-tab');
            this.setEntityTab(tab);
        },

        setEntityTab: function (tab) {
            this.activeTab = tab;
            this.$el.find('.entity-tab-pill').removeClass('active');
            this.$el.find('.entity-tab-pill[data-tab="' + tab + '"]').addClass('active');
            this.$el.find('#analytics-entity-select').val(tab);

            var $wonOption = this.$el.find('#analytics-period-select option[value="won"]');
            if (this.activeTab !== 'all' && this.activeTab !== 'Opportunity') {
                $wonOption.prop('disabled', true).hide();
                if (this.activeFilter === 'won') {
                    this.activeFilter = 'all';
                    this.$el.find('#analytics-period-select').val('all');
                }
            } else {
                $wonOption.prop('disabled', false).show();
            }

            this.clearCategoryFilter();
        },

        onPeriodSelectChange: function (e) {
            this.activeFilter = $(e.currentTarget).val();
            var isCustom = (this.activeFilter === 'custom');
            this.$el.find('#analytics-custom-range-row').toggle(isCustom);

            if (isCustom) {
                this.customDateFrom = this.$el.find('#analytics-period-date-from').val() || null;
                this.customDateTo   = this.$el.find('#analytics-period-date-to').val()   || null;
                if (this.customDateFrom && this.customDateTo && this.customDateFrom <= this.customDateTo) {
                    this.loadMetrics();
                }
                return;
            } else {
                this.customDateFrom = null;
                this.customDateTo = null;
                this.$el.find('#analytics-period-date-from, #analytics-period-date-to').val('');
                if (this.activeFilter === 'won') {
                    this.clearCategoryFilter();
                }
            }
            this.loadMetrics();
        },

        onPeriodDateChange: function () {
            var from = this.$el.find('#analytics-period-date-from').val() || null;
            var to   = this.$el.find('#analytics-period-date-to').val()   || null;

            if (!from || !to || from > to) {
                this.customDateFrom = null;
                this.customDateTo   = null;
                return;
            }

            this.customDateFrom = from;
            this.customDateTo   = to;
            this.loadMetrics();
        },

        onSearchInput: function (e) {
            this.searchTerm = $(e.currentTarget).val().toLowerCase().trim();
            this.processAndRender();
        },

        onBarItemClick: function (e) {
            var $t = $(e.currentTarget);
            var field = $t.attr('data-field');
            var val = String($t.attr('data-value'));
            var entity = $t.attr('data-entity') || this.activeTab;
            var label = $t.find('.bar-item-name').text() || val;

            if (field && val !== undefined) {
                var filterKey = entity + ':' + field;
                if (!this.categoryFilters) this.categoryFilters = {};
                if (!this.categoryFilters[filterKey]) this.categoryFilters[filterKey] = {};

                var currentlyChecked = !(this.categoryFilters[filterKey][val] && this.categoryFilters[filterKey][val].excluded);
                if (currentlyChecked) {
                    this.categoryFilters[filterKey][val] = { excluded: true, label: label, field: field };
                } else {
                    delete this.categoryFilters[filterKey][val];
                    if (Object.keys(this.categoryFilters[filterKey]).length === 0) {
                        delete this.categoryFilters[filterKey];
                    }
                }

                this.updateFilterBadge();
                this.processAndRender();
            }
        },

        onChipRemove: function (e) {
            e.stopPropagation();
            var $chip = $(e.currentTarget).closest('.filter-chip');
            var key = $chip.attr('data-key');
            var val = String($chip.attr('data-val'));
            if (this.categoryFilters && this.categoryFilters[key]) {
                delete this.categoryFilters[key][val];
                if (Object.keys(this.categoryFilters[key]).length === 0) {
                    delete this.categoryFilters[key];
                }
            }
            this.updateFilterBadge();
            this.processAndRender();
        },

        updateFilterBadge: function () {
            var self = this;
            var chips = [];
            if (this.categoryFilters) {
                for (var k in this.categoryFilters) {
                    if (!this.categoryFilters.hasOwnProperty(k)) continue;
                    var map = this.categoryFilters[k];
                    for (var val in map) {
                        if (map.hasOwnProperty(val) && map[val] && map[val].excluded) {
                            chips.push({ key: k, val: val, label: map[val].label });
                        }
                    }
                }
            }

            var $container = this.$el.find('#active-filters-container');
            if (!chips.length) {
                $container.html('').hide();
                return;
            }

            var html = '<span class="active-filters-label">Excluding:</span>';
            chips.forEach(function (c) {
                html += '<span class="filter-chip" data-key="' + self.escapeHtml(c.key) + '" data-val="' + self.escapeHtml(c.val) + '">' +
                    '<span>' + self.escapeHtml(c.label) + '</span>' +
                    '<i class="fas fa-times chip-remove"></i></span>';
            });
            html += '<button class="clear-all-filters-btn"><i class="fas fa-times-circle"></i> Clear All</button>';
            $container.html(html).css('display', 'flex');
        },

        clearCategoryFilter: function () {
            this.categoryFilters = {};
            this.$el.find('#active-filters-container').html('').hide();
            this.processAndRender();
        },

        exportCSV: function () {
            var self = this;
            var leads = this.activeFilteredLeads || this.rawLeads || [];
            var opps = this.activeFilteredOpps || this.rawOpps || [];
            var accounts = this.activeFilteredAccounts || this.rawAccounts || [];
            var contacts = this.activeFilteredContacts || this.rawContacts || [];
            var emails = this.activeFilteredEmails || this.rawEmails || [];
            var meetings = this.activeFilteredMeetings || this.rawMeetings || [];

            // UTF-8 BOM byte order mark to force Microsoft Excel to parse UTF-8 properly (Arabic & special chars)
            var csv = '\ufeff';

            function sanitizeForFormula(str) {
                if (/^[=+\-@\t\r]/.test(str)) {
                    return "'" + str;
                }
                return str;
            }

            function escapeCsv(val) {
                if (val === null || val === undefined) return '""';
                var str = sanitizeForFormula(String(val)).replace(/"/g, '""');
                return '"' + str + '"';
            }

            function formatPhone(phone) {
                if (!phone) return '""';
                var p = String(phone).trim();
                return '"\t' + p.replace(/"/g, '""') + '"';
            }

            function formatDateOnly(dateStr) {
                if (!dateStr) return '""';
                var str = String(dateStr).substring(0, 10);
                return escapeCsv(str);
            }

            function formatBool(val) {
                return escapeCsv(self.toSafeBoolean(val) ? 'Yes' : 'No');
            }

            function makeTitleRow(titleText, totalCols) {
                var cols = [escapeCsv(titleText)];
                for (var i = 1; i < totalCols; i++) {
                    cols.push('""');
                }
                return cols.join(',') + '\n';
            }

            var isOverview = (this.activeTab === 'all');
            var currCode = this.getCurrencyCode();

            // --- LEADS SECTION ---
            if (isOverview || this.activeTab === 'Lead') {
                if (isOverview) {
                    csv += makeTitleRow('=== LEADS DATA (' + leads.length + ' Records) ===', 15);
                }
                csv += [
                    'ID', 'Name', 'Status', 'Source', 'Industry',
                    'Opportunity Amount', 'Currency', 'Website', 'Email', 'Phone',
                    'Do Not Call', 'City', 'Country', 'Assigned User', 'Created Date'
                ].map(escapeCsv).join(',') + '\n';

                leads.forEach(function (l) {
                    var rawAmt = self.getReportingAmount(l);
                    csv += [
                        escapeCsv(l.id),
                        escapeCsv(l.name),
                        escapeCsv(l.status),
                        escapeCsv(l.source),
                        escapeCsv(l.industry),
                        escapeCsv(rawAmt.toFixed(2)),
                        escapeCsv(currCode),
                        escapeCsv(l.website),
                        escapeCsv(l.emailAddress),
                        formatPhone(l.phoneNumber),
                        formatBool(l.doNotCall),
                        escapeCsv(l.addressCity),
                        escapeCsv(l.addressCountry),
                        escapeCsv(l.assignedUserName),
                        formatDateOnly(l.createdAt)
                    ].join(',') + '\n';
                });
                csv += '\n';
            }

            // --- OPPORTUNITIES SECTION ---
            if (isOverview || this.activeTab === 'Opportunity') {
                if (isOverview) {
                    csv += makeTitleRow('=== OPPORTUNITIES DATA (' + opps.length + ' Records) ===', 11);
                }
                csv += [
                    'ID', 'Name', 'Account Name', 'Stage', 'Amount', 'Currency',
                    'Probability', 'Lead Source', 'Close Date', 'Assigned User', 'Created Date'
                ].map(escapeCsv).join(',') + '\n';

                opps.forEach(function (o) {
                    var prob = self.getOppProbability(o);
                    var rawAmt = self.getReportingAmount(o);
                    csv += [
                        escapeCsv(o.id),
                        escapeCsv(o.name),
                        escapeCsv(o.accountName),
                        escapeCsv(o.stage),
                        escapeCsv(rawAmt.toFixed(2)),
                        escapeCsv(currCode),
                        escapeCsv(prob + '%'),
                        escapeCsv(o.leadSource),
                        formatDateOnly(o.closeDate),
                        escapeCsv(o.assignedUserName),
                        formatDateOnly(o.createdAt)
                    ].join(',') + '\n';
                });
                csv += '\n';
            }

            // --- ACCOUNTS SECTION ---
            if (isOverview || this.activeTab === 'Account') {
                if (isOverview) {
                    csv += makeTitleRow('=== ACCOUNTS DATA (' + accounts.length + ' Records) ===', 13);
                }
                csv += [
                    'ID', 'Name', 'Type', 'Industry', 'SIC Code',
                    'Billing City', 'Billing State', 'Billing Country', 'Website',
                    'Email', 'Phone', 'Assigned User', 'Created Date'
                ].map(escapeCsv).join(',') + '\n';

                accounts.forEach(function (a) {
                    csv += [
                        escapeCsv(a.id),
                        escapeCsv(a.name),
                        escapeCsv(a.type),
                        escapeCsv(a.industry),
                        escapeCsv(a.sicCode),
                        escapeCsv(a.billingAddressCity),
                        escapeCsv(a.billingAddressState),
                        escapeCsv(a.billingAddressCountry),
                        escapeCsv(a.website),
                        escapeCsv(a.emailAddress),
                        formatPhone(a.phoneNumber),
                        escapeCsv(a.assignedUserName),
                        formatDateOnly(a.createdAt)
                    ].join(',') + '\n';
                });
                csv += '\n';
            }

            // --- CONTACTS SECTION ---
            if (isOverview || this.activeTab === 'Contact') {
                if (isOverview) {
                    csv += makeTitleRow('=== CONTACTS DATA (' + contacts.length + ' Records) ===', 11);
                }
                csv += [
                    'ID', 'Name', 'Account Name', 'Title/Role', 'Email',
                    'Phone', 'Do Not Call', 'City', 'Country', 'Assigned User', 'Created Date'
                ].map(escapeCsv).join(',') + '\n';

                contacts.forEach(function (c) {
                    csv += [
                        escapeCsv(c.id),
                        escapeCsv(c.name),
                        escapeCsv(c.accountName),
                        escapeCsv(c.title),
                        escapeCsv(c.emailAddress),
                        formatPhone(c.phoneNumber),
                        formatBool(c.doNotCall),
                        escapeCsv(c.addressCity),
                        escapeCsv(c.addressCountry),
                        escapeCsv(c.assignedUserName),
                        formatDateOnly(c.createdAt)
                    ].join(',') + '\n';
                });
                csv += '\n';
            }

            // --- EMAILS SECTION ---
            if (isOverview || this.activeTab === 'Email') {
                if (isOverview) {
                    csv += makeTitleRow('=== EMAILS DATA (' + emails.length + ' Records) ===', 9);
                }
                csv += [
                    'ID', 'Subject', 'Status', 'Date Sent', 'From',
                    'Is Replied', 'Is Read', 'Assigned User', 'Created Date'
                ].map(escapeCsv).join(',') + '\n';

                emails.forEach(function (e) {
                    csv += [
                        escapeCsv(e.id),
                        escapeCsv(e.name),
                        escapeCsv(e.status),
                        formatDateOnly(e.dateSent),
                        escapeCsv(e.fromString),
                        formatBool(e.isReplied),
                        formatBool(e.isRead),
                        escapeCsv(e.assignedUserName),
                        formatDateOnly(e.createdAt)
                    ].join(',') + '\n';
                });
                csv += '\n';
            }

            // --- MEETINGS SECTION ---
            if (isOverview || this.activeTab === 'Meeting') {
                if (isOverview) {
                    csv += makeTitleRow('=== MEETINGS DATA (' + meetings.length + ' Records) ===', 10);
                }
                csv += [
                    'ID', 'Name', 'Status', 'Start Date', 'End Date',
                    'Duration (Mins)', 'Parent Name', 'Parent Type', 'Assigned User', 'Created Date'
                ].map(escapeCsv).join(',') + '\n';

                meetings.forEach(function (m) {
                    var durationMin = Math.round(self.toSafeNumber(m.duration, 0) / 60);
                    csv += [
                        escapeCsv(m.id),
                        escapeCsv(m.name),
                        escapeCsv(m.status),
                        formatDateOnly(m.dateStart),
                        formatDateOnly(m.dateEnd),
                        escapeCsv(durationMin),
                        escapeCsv(m.parentName),
                        escapeCsv(m.parentType),
                        escapeCsv(m.assignedUserName),
                        formatDateOnly(m.createdAt)
                    ].join(',') + '\n';
                });
                csv += '\n';
            }

            var now = new Date();
            var dateFileStr = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
            var filename = 'CodakCRM_Export_' + (this.activeTab) + '_' + dateFileStr + '.csv';

            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            var objectUrl = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = objectUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 1000);
        },

        loadMetrics: function () {
            if (this.isRemoved()) return;
            this._loadSeq = (this._loadSeq || 0) + 1;
            var currentSeq = this._loadSeq;
            this._missingReportingAmountCount = 0;

            var self = this;
            var $btnRefresh = this.$el.find('#btn-refresh-analytics');
            $btnRefresh.addClass('is-loading');

            this.$el.find('#analytics-loader').show();
            this.$el.find('#analytics-content').hide();

            var leadSelect = 'name,firstName,lastName,salutationName,title,accountName,status,source,industry,opportunityAmount,opportunityAmountConverted,website,emailAddress,phoneNumber,doNotCall,addressCity,addressState,addressCountry,assignedUserName,createdAt';
            var oppSelect = 'name,accountName,stage,amount,amountConverted,probability,leadSource,closeDate,assignedUserName,createdAt';
            var accountSelect = 'name,website,emailAddress,phoneNumber,type,industry,sicCode,billingAddressCity,billingAddressState,billingAddressCountry,shippingAddressCity,description,assignedUserName,createdAt';
            var contactSelect = 'name,firstName,lastName,salutationName,title,accountName,emailAddress,phoneNumber,doNotCall,addressCity,addressCountry,assignedUserName,createdAt';
            var emailSelect = 'name,status,dateSent,isRead,isReplied,fromString,assignedUserName,createdAt';
            var meetingSelect = 'name,status,dateStart,dateEnd,duration,isAllDay,parentName,parentType,assignedUserName,createdAt';

            var periodRange = this.getPeriodBoundaries();

            Promise.all([
                self.fetchAllPages('Lead', leadSelect, 'createdAt', periodRange),
                self.fetchAllPages('Opportunity', oppSelect, 'closeDate', periodRange),
                self.fetchAllPages('Account', accountSelect, 'createdAt', periodRange),
                self.fetchAllPages('Contact', contactSelect, 'createdAt', periodRange),
                self.fetchAllPages('Email', emailSelect, 'dateSent', periodRange),
                self.fetchAllPages('Meeting', meetingSelect, 'dateStart', periodRange),
                self.fetchTodayLeadsCount(),
                self.fetchMonthAccountsCount()
            ]).then(function (results) {
                if (self.isRemoved() || currentSeq !== self._loadSeq) return;

                self.rawLeads = results[0].list;     self.totalLeadsCount = results[0].total;
                self.rawOpps = results[1].list;      self.totalOppsCount = results[1].total;
                self.rawAccounts = results[2].list;  self.totalAccountsCount = results[2].total;
                self.rawContacts = results[3].list;  self.totalContactsCount = results[3].total;
                self.rawEmails = results[4].list;    self.totalEmailsCount = results[4].total;
                self.rawMeetings = results[5].list;  self.totalMeetingsCount = results[5].total;
                self.independentTodayLeadsCount = results[6];
                self.independentMonthAccountsCount = results[7];

                self.isSampled = false;
                self.fetchErrorEntities = results
                    .filter(function (r) { return r && r.error; })
                    .map(function (r) { return r.entity; });

                self.processAndRender();
                $btnRefresh.removeClass('is-loading');
                self.$el.find('#analytics-loader').hide();
                self.$el.find('#analytics-content').fadeIn(300);
            }).catch(function (err) {
                if (self.isRemoved() || currentSeq !== self._loadSeq) return;
                console.error('[Analytics BI] Error fetching metrics:', err);
                self.rawLeads = []; self.rawOpps = []; self.rawAccounts = [];
                self.rawContacts = []; self.rawEmails = []; self.rawMeetings = [];
                self.totalLeadsCount = 0; self.totalOppsCount = 0; self.totalAccountsCount = 0;
                self.totalContactsCount = 0; self.totalEmailsCount = 0; self.totalMeetingsCount = 0;
                self.independentTodayLeadsCount = 'N/A';
                self.independentMonthAccountsCount = 'N/A';
                self.fetchErrorEntities = ['Lead', 'Opportunity', 'Account', 'Contact', 'Email', 'Meeting'];
                self.processAndRender();
                $btnRefresh.removeClass('is-loading');
                self.$el.find('#analytics-loader').hide();
                self.$el.find('#analytics-content').fadeIn(300);
            });
        },

        fetchAllPages: function (entity, fields, dateField, dateRange) {
            var self = this;
            var allList = [];
            var maxSize = 200;
            var totalCount = -1;
            var maxPages = 250;
            var pageCount = 0;

            function fetchNext(offset) {
                pageCount++;
                return self.ajaxGetRequest(entity, fields, dateField, offset, maxSize, dateRange).then(function (res) {
                    var pageList = (res && res.list && Array.isArray(res.list)) ? res.list : [];
                    if (pageList.length > 0) {
                        Array.prototype.push.apply(allList, pageList);
                    }

                    if (res && typeof res.total === 'number' && res.total >= 0) {
                        totalCount = res.total;
                    }

                    if (pageList.length < maxSize || pageCount >= maxPages || (totalCount >= 0 && allList.length >= totalCount)) {
                        return {
                            list: allList,
                            total: totalCount >= 0 ? totalCount : allList.length,
                            error: false,
                            entity: entity
                        };
                    }
                    return fetchNext(offset + maxSize);
                });
            }

            return fetchNext(0).catch(function (err) {
                console.warn('[Analytics BI] Fetch error for ' + entity + ':', err);
                return { list: [], total: 0, error: true, entity: entity };
            });
        },

        ajaxGetRequest: function (entity, selectFields, dateField, offset, maxSize, dateRange) {
            var orderByField = dateField || 'createdAt';
            var limit = maxSize || 200;
            var pageOffset = offset || 0;
            var url = 'api/v1/' + entity + '?maxSize=' + limit + '&offset=' + pageOffset + '&orderBy=' + orderByField + '&order=desc';
            if (selectFields) {
                url += '&select=' + selectFields;
            }
            if (dateRange && dateField && (dateRange.from || dateRange.to)) {
                if (dateRange.from && dateRange.to) {
                    url += '&where[0][type]=between&where[0][attribute]=' + encodeURIComponent(dateField) +
                           '&where[0][value][]=' + encodeURIComponent(dateRange.from + ' 00:00:00') +
                           '&where[0][value][]=' + encodeURIComponent(dateRange.to + ' 23:59:59');
                } else if (dateRange.from) {
                    url += '&where[0][type]=gte&where[0][attribute]=' + encodeURIComponent(dateField) +
                           '&where[0][value]=' + encodeURIComponent(dateRange.from + ' 00:00:00');
                } else if (dateRange.to) {
                    url += '&where[0][type]=lte&where[0][attribute]=' + encodeURIComponent(dateField) +
                           '&where[0][value]=' + encodeURIComponent(dateRange.to + ' 23:59:59');
                }
            }

            if (window.Espo && window.Espo.Ajax && typeof window.Espo.Ajax.getRequest === 'function') {
                var espoUrl = url.replace(/^api\/v1\//, '');
                return window.Espo.Ajax.getRequest(espoUrl);
            }

            return $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
        },

        processAndRender: function () {
            var self = this;
            var leads = this.rawLeads;
            var opps = this.rawOpps;
            var accounts = this.rawAccounts;
            var contacts = this.rawContacts;
            var emails = this.rawEmails;
            var meetings = this.rawMeetings;

            if (this.searchTerm) {
                var term = this.searchTerm;
                function matchSearch(item, fields) {
                    return fields.some(function (f) {
                        return String(item[f] || '').toLowerCase().indexOf(term) > -1;
                    });
                }
                leads = leads.filter(function (l) { return matchSearch(l, ['name', 'firstName', 'lastName', 'title', 'accountName', 'emailAddress', 'phoneNumber', 'addressCity', 'addressCountry', 'industry', 'source', 'status', 'assignedUserName']); });
                opps = opps.filter(function (o) { return matchSearch(o, ['name', 'accountName', 'stage', 'leadSource', 'assignedUserName']); });
                accounts = accounts.filter(function (a) { return matchSearch(a, ['name', 'type', 'industry', 'sicCode', 'emailAddress', 'phoneNumber', 'website', 'billingAddressCity', 'billingAddressCountry', 'assignedUserName']); });
                contacts = contacts.filter(function (c) { return matchSearch(c, ['name', 'firstName', 'lastName', 'title', 'accountName', 'emailAddress', 'phoneNumber', 'addressCity', 'addressCountry', 'assignedUserName']); });
                emails = emails.filter(function (e) { return matchSearch(e, ['name', 'fromString', 'status', 'assignedUserName']); });
                meetings = meetings.filter(function (m) { return matchSearch(m, ['name', 'parentName', 'parentType', 'status', 'assignedUserName']); });
            }

            function filterByDate(list, dateProp) {
                var f = self.activeFilter;
                if (f === 'all') return list;
                var range = self.getPeriodBoundaries();

                return list.filter(function (item) {
                    var d = item[dateProp];
                    if (!d) return false;
                    var dateStr = self.getLocalDateStr(d);
                    if (!dateStr) return false;

                    if (range.from && range.to) return dateStr >= range.from && dateStr <= range.to;
                    if (range.from) return dateStr >= range.from;
                    if (range.to) return dateStr <= range.to;
                    return true;
                });
            }

            if (this.activeFilter !== 'all') {
                if (this.activeFilter === 'won') {
                    opps = opps.filter(function (o) { return self.isStageWon(o.stage); });
                } else {
                    leads = filterByDate(leads, 'createdAt');
                    opps = filterByDate(opps, 'closeDate');
                    accounts = filterByDate(accounts, 'createdAt');
                    contacts = filterByDate(contacts, 'createdAt');
                    emails = filterByDate(emails, 'dateSent');
                    meetings = filterByDate(meetings, 'dateStart');
                }
            }

            if (this.categoryFilters && Object.keys(this.categoryFilters).length > 0) {
                var categoryFilters = this.categoryFilters;

                function matchCategoryFilters(item, itemScope) {
                    for (var filterKey in categoryFilters) {
                        if (!categoryFilters.hasOwnProperty(filterKey)) continue;
                        var parts = filterKey.split(':');
                        var filterScope = parts[0];
                        var field = parts[1];

                        if (filterScope === 'all' || filterScope === itemScope) {
                            var raw = item[field];
                            var val = (raw === undefined || raw === null || raw === '') ? '__EMPTY__' : String(raw);
                            var filterMap = categoryFilters[filterKey];
                            if (filterMap && filterMap[val] && filterMap[val].excluded) {
                                return false;
                            }
                        }
                    }
                    return true;
                }

                leads = leads.filter(function (l) { return matchCategoryFilters(l, 'Lead'); });
                opps = opps.filter(function (o) { return matchCategoryFilters(o, 'Opportunity'); });
                accounts = accounts.filter(function (a) { return matchCategoryFilters(a, 'Account'); });
                contacts = contacts.filter(function (c) { return matchCategoryFilters(c, 'Contact'); });
                emails = emails.filter(function (e) { return matchCategoryFilters(e, 'Email'); });
                meetings = meetings.filter(function (m) { return matchCategoryFilters(m, 'Meeting'); });
            }

            this.renderDashboard(leads, opps, accounts, contacts, emails, meetings);
        },

        renderDashboard: function (leads, opps, accounts, contacts, emails, meetings) {
            var self = this;
            var tab = this.activeTab;

            this.activeFilteredLeads = leads || [];
            this.activeFilteredOpps = opps || [];
            this.activeFilteredAccounts = accounts || [];
            this.activeFilteredContacts = contacts || [];
            this.activeFilteredEmails = emails || [];
            this.activeFilteredMeetings = meetings || [];

            this.$el.find('#won-scope-notice, #missing-currency-notice').remove();
            if (this.activeTab === 'all' && this.activeFilter === 'won') {
                this.$el.find('#kpi-grid').before(
                    '<div id="won-scope-notice" style="margin-bottom:16px; padding:10px 16px; background:var(--color-info-bg); ' +
                    'border:1px solid #bae6fd; border-radius:12px; font-size:12px; font-weight:700; color:var(--color-primary);">' +
                    '<i class="fas fa-info-circle" style="margin-right:6px;"></i>' +
                    '"Closed Won Deals" filters Opportunities only — other modules below show all-time data.</div>'
                );
            }

            if (this._missingReportingAmountCount > 0) {
                this.$el.find('#kpi-grid').before(
                    '<div id="missing-currency-notice" style="margin-bottom:16px; padding:10px 16px; background:var(--color-warning-bg); ' +
                    'border:1px solid #fde68a; border-radius:12px; font-size:12px; font-weight:700; color:var(--color-warning);">' +
                    '<i class="fas fa-exclamation-triangle" style="margin-right:6px;"></i>' +
                    'Diagnostic Notice: ' + this._missingReportingAmountCount + ' record(s) missing base currency conversion. Unconverted raw amounts excluded from multi-currency totals to prevent arithmetic corruption.</div>'
                );
            }

            // --- COMPUTATIONS ---
            var todayStr = this.getLocalDateStr();
            var monthStartStr = todayStr.substring(0, 7) + '-01';

            var hasErr = function (entity) {
                return self.fetchErrorEntities && self.fetchErrorEntities.indexOf(entity) > -1;
            };

            // --- COMPUTATIONS VIA SINGLE-PASS AGGREGATORS ---
            var lm = this.calculateLeadMetrics(leads, hasErr('Lead'));
            var om = this.calculateOpportunityMetrics(opps, hasErr('Opportunity'));
            var am = this.calculateAccountMetrics(accounts, hasErr('Account'));
            var cm = this.calculateContactMetrics(contacts, hasErr('Contact'));
            var em = this.calculateEmailMetrics(emails, hasErr('Email'));
            var mm = this.calculateMeetingMetrics(meetings, hasErr('Meeting'));

            var newLeadsToday = (this.independentTodayLeadsCount !== undefined && this.independentTodayLeadsCount !== null)
                ? this.independentTodayLeadsCount
                : (hasErr('Lead') ? 'N/A' : (this.rawLeads || []).filter(function (l) { return l.createdAt && self.getLocalDateStr(l.createdAt) === todayStr; }).length);

            var newAccountsMonth = (this.independentMonthAccountsCount !== undefined && this.independentMonthAccountsCount !== null)
                ? this.independentMonthAccountsCount
                : (hasErr('Account') ? 'N/A' : (this.rawAccounts || []).filter(function (a) { return a.createdAt && self.getLocalDateStr(a.createdAt) >= monthStartStr; }).length);

            function fmtKpi(v, mode) {
                if (v === 'N/A' || v === undefined || v === null) return 'N/A';
                if (mode === 'currency') return self.formatCurrency(v);
                if (mode === 'pct') return v + '%';
                if (mode === 'min') return v + ' min';
                return typeof v === 'number' ? v.toLocaleString() : String(v);
            }

            // --- RENDER KPIS ---
            var kpiHtml = '';
            var kpis = [];

            if (tab === 'all') {
                kpis = [
                    { title: 'Total Leads', val: fmtKpi(lm.totalLeads), color: 'var(--color-primary)', badge: 'Leads' },
                    { title: 'Total Revenue', val: fmtKpi(om.totalRevenue, 'currency'), color: 'var(--color-success)', badge: 'Won Opps' },
                    { title: 'Total Accounts', val: fmtKpi(am.totalAccounts), color: 'var(--color-primary-light)', badge: 'Accounts' },
                    { title: 'Total Contacts', val: fmtKpi(cm.totalContacts), color: 'var(--color-info)', badge: 'Contacts' },
                    { title: 'Total Emails', val: fmtKpi(em.totalEmails), color: 'var(--color-purple)', badge: 'Emails' },
                    { title: 'Total Meetings', val: fmtKpi(mm.totalMeetings), color: 'var(--color-warning)', badge: 'Meetings' }
                ];
            } else if (tab === 'Lead') {
                kpis = [
                    { title: 'Total Leads', val: fmtKpi(lm.totalLeads), color: 'var(--color-primary)', badge: 'Active' },
                    { title: 'New Leads Today', val: fmtKpi(newLeadsToday), color: 'var(--color-primary-light)', badge: 'Today' },
                    { title: 'Potential Leads', val: fmtKpi(lm.potentialLeads), color: 'var(--color-info)', badge: 'Pipeline' },
                    { title: 'In Process + Converted', val: fmtKpi(lm.qualifiedLeads), color: 'var(--color-primary)', badge: 'Active Pipeline' },
                    { title: 'Converted Leads', val: fmtKpi(lm.convertedLeads), color: 'var(--color-success)', badge: 'Converted' },
                    { title: 'Lost / Dead', val: fmtKpi(lm.lostLeads), color: 'var(--color-danger)', badge: 'Closed' },
                    { title: 'Conversion Rate', val: fmtKpi(lm.convRate, 'pct'), color: 'var(--color-purple)', badge: 'Ratio' },
                    { title: 'Lead Opp Value', val: fmtKpi(lm.totalLeadOppAmount, 'currency'), color: 'var(--color-primary)', badge: 'Pipeline Value' }
                ];
            } else if (tab === 'Opportunity') {
                kpis = [
                    { title: 'Total Revenue', val: fmtKpi(om.totalRevenue, 'currency'), color: 'var(--color-success)', badge: 'Closed Won' },
                    { title: 'Total Opportunities', val: fmtKpi(om.totalOpps), color: 'var(--color-primary-light)', badge: 'Total' },
                    { title: 'Won Deals', val: fmtKpi(om.wonOpps), color: 'var(--color-success)', badge: 'Won' },
                    { title: 'Open Deals', val: fmtKpi(om.openOpps), color: 'var(--color-info)', badge: 'Open' },
                    { title: 'Lost Deals', val: fmtKpi(om.lostOpps), color: 'var(--color-danger)', badge: 'Lost' },
                    { title: 'Avg Deal Size', val: fmtKpi(om.avgDeal, 'currency'), color: 'var(--color-primary)', badge: 'Average' },
                    { title: 'Weighted Pipeline', val: fmtKpi(om.weightedPipeline, 'currency'), color: 'var(--color-purple)', badge: 'Weighted' },
                    { title: 'Win Rate', val: fmtKpi(om.winRate, 'pct'), color: 'var(--color-purple)', badge: 'Ratio' }
                ];
            } else if (tab === 'Account') {
                kpis = [
                    { title: 'Total Accounts', val: fmtKpi(am.totalAccounts), color: 'var(--color-primary)', badge: 'Total' },
                    { title: 'Customers', val: fmtKpi(am.customerAccounts), color: 'var(--color-success)', badge: 'Customers' },
                    { title: 'Partners', val: fmtKpi(am.partnerAccounts), color: 'var(--color-info)', badge: 'Partners' },
                    { title: 'Investors / Resellers', val: fmtKpi(am.investorAccounts), color: 'var(--color-primary)', badge: 'Investors' },
                    { title: 'New This Month', val: fmtKpi(newAccountsMonth), color: 'var(--color-primary-light)', badge: 'Month' },
                    { title: 'With Email', val: fmtKpi(am.accWithEmail), color: 'var(--color-purple)', badge: 'Email' },
                    { title: 'With Phone', val: fmtKpi(am.accWithPhone), color: 'var(--color-warning)', badge: 'Phone' },
                    { title: 'With Website', val: fmtKpi(am.accWithWebsite), color: 'var(--color-info)', badge: 'Website' }
                ];
            } else if (tab === 'Contact') {
                kpis = [
                    { title: 'Total Contacts', val: fmtKpi(cm.totalContacts), color: 'var(--color-primary)', badge: 'Total' },
                    { title: 'With Email %', val: fmtKpi(cm.emailPct, 'pct'), color: 'var(--color-primary-light)', badge: 'Coverage' },
                    { title: 'With Phone %', val: fmtKpi(cm.phonePct, 'pct'), color: 'var(--color-info)', badge: 'Coverage' },
                    { title: 'Do Not Call Ratio', val: fmtKpi(cm.dncPct, 'pct'), color: 'var(--color-danger)', badge: 'DNC' },
                    { title: 'With Account', val: fmtKpi(cm.withAccountCount), color: 'var(--color-success)', badge: 'Linked' },
                    { title: 'Complete Profiles', val: fmtKpi(cm.completeProfilesCount), color: 'var(--color-purple)', badge: 'Full Data' }
                ];
            } else if (tab === 'Email') {
                kpis = [
                    { title: 'Total Emails', val: fmtKpi(em.totalEmails), color: 'var(--color-primary)', badge: 'Total' },
                    { title: 'Sent Emails', val: fmtKpi(em.sentEmails), color: 'var(--color-success)', badge: 'Outbound' },
                    { title: 'Draft Emails', val: fmtKpi(em.draftEmails), color: 'var(--color-warning)', badge: 'Drafts' },
                    { title: 'Failed Emails', val: fmtKpi(em.failedEmails), color: 'var(--color-danger)', badge: 'Failed' },
                    { title: 'Reply Rate', val: fmtKpi(em.replyRate, 'pct'), color: 'var(--color-purple)', badge: 'Replied' },
                    { title: 'Read Rate', val: fmtKpi(em.readRate, 'pct'), color: 'var(--color-primary-light)', badge: 'Read' }
                ];
            } else if (tab === 'Meeting') {
                kpis = [
                    { title: 'Total Meetings', val: fmtKpi(mm.totalMeetings), color: 'var(--color-primary)', badge: 'Total' },
                    { title: 'Held Meetings', val: fmtKpi(mm.heldMeetings), color: 'var(--color-success)', badge: 'Completed' },
                    { title: 'Upcoming / Planned', val: fmtKpi(mm.upcomingMeetings), color: 'var(--color-primary-light)', badge: 'Upcoming' },
                    { title: 'No-Show / Not Held', val: fmtKpi(mm.noShowMeetings), color: 'var(--color-danger)', badge: 'Missed' },
                    { title: 'All Day Meetings', val: fmtKpi(mm.allDayMeetings), color: 'var(--color-purple)', badge: 'All Day' },
                    { title: 'Avg Duration', val: fmtKpi(mm.avgDurationMins, 'min'), color: 'var(--color-warning)', badge: 'Average' }
                ];
            }

            kpis.forEach(function (k) {
                kpiHtml += `
                    <div class="kpi-card">
                        <div class="kpi-header">
                            <div class="kpi-title">${k.title}</div>
                            <span class="kpi-badge">${k.badge}</span>
                        </div>
                        <div class="kpi-val" style="color: ${k.color}">${k.val}</div>
                    </div>
                `;
            });
            this.$el.find('#kpi-grid').html(kpiHtml);

            this.$el.find('#sample-notice, #fetch-error-notice').remove();
            if (this.fetchErrorEntities && this.fetchErrorEntities.length) {
                this.$el.find('#kpi-grid').before(
                    '<div id="fetch-error-notice" style="margin-bottom:16px; padding:10px 16px; background:var(--color-danger-bg); ' +
                    'border:1px solid #fecaca; border-radius:12px; font-size:12px; font-weight:700; color:var(--color-danger);">' +
                    '<i class="fas fa-exclamation-triangle" style="margin-right:6px;"></i>' +
                    'Could not load: ' + this.escapeHtml(this.fetchErrorEntities.join(', ')) +
                    '. The figures below may be incomplete — try Refresh Data.</div>'
                );
            }

            this.renderChartsSection(leads, opps, accounts, contacts, emails, meetings);
            this.renderTablesSection(leads, opps, accounts, contacts, emails, meetings);
        },

        renderChartsSection: function (leads, opps, accounts, contacts, emails, meetings) {
            var self = this;
            var tab = this.activeTab;
            var html = '';

            var oppStageOptions = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
            var leadStatusOptions = ['New', 'Assigned', 'In Process', 'Converted', 'Recycled', 'Dead'];
            var accountTypeOptions = ['Customer', 'Investor', 'Partner', 'Reseller'];
            var emailStatusOptions = ['Draft', 'Sending', 'Sent', 'Archived', 'Failed'];
            var meetingStatusOptions = ['Planned', 'Held', 'Not Held'];

            if (tab === 'all') {
                html = `
                    <div class="chart-box" style="grid-column: 1 / -1;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <div>
                                <h4 class="chart-title"><i class="fas fa-chart-area" style="margin-right: 6px;"></i> Revenue Growth & Monthly Trend</h4>
                                <p class="chart-subtitle">Actual Closed Won revenue aggregated across recent months</p>
                            </div>
                            <span class="badge badge-info">Real Monthly Data</span>
                        </div>
                        <div id="chart-revenue-trend-container" style="width: 100%; min-height: 200px;"></div>
                    </div>

                    <div class="chart-box"><h4 class="chart-title"><i class="fas fa-filter" style="margin-right: 6px;"></i> Leads by Status</h4><div id="chart-leads-status"></div></div>
                    <div class="chart-box"><h4 class="chart-title"><i class="fas fa-funnel-dollar" style="margin-right: 6px;"></i> Opportunities Stage Funnel</h4><div id="chart-opps-stage"></div></div>
                    <div class="chart-box"><h4 class="chart-title"><i class="fas fa-building" style="margin-right: 6px;"></i> Accounts by Type</h4><div id="chart-accounts-type"></div></div>
                    <div class="chart-box"><h4 class="chart-title"><i class="fas fa-users" style="margin-right: 6px;"></i> Contacts by Account</h4><div id="chart-contacts-account"></div></div>
                    <div class="chart-box"><h4 class="chart-title"><i class="fas fa-paper-plane" style="margin-right: 6px;"></i> Emails by Status</h4><div id="chart-emails-status"></div></div>
                    <div class="chart-box"><h4 class="chart-title"><i class="fas fa-calendar-check" style="margin-right: 6px;"></i> Meetings by Status</h4><div id="chart-meetings-status"></div></div>
                `;
            } else if (tab === 'Lead') {
                html = `
                    <div class="chart-box"><h4 class="chart-title">Leads by Status</h4><div id="chart-leads-status"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Leads by Source</h4><div id="chart-leads-source"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Leads by Industry</h4><div id="chart-leads-industry"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Leads by Country</h4><div id="chart-leads-country"></div></div>
                `;
            } else if (tab === 'Opportunity') {
                html = `
                    <div class="chart-box" style="grid-column: 1 / -1;">
                        <h4 class="chart-title">Revenue Growth & Monthly Trend</h4>
                        <div id="chart-revenue-trend-container" style="width: 100%; min-height: 200px;"></div>
                    </div>
                    <div class="chart-box"><h4 class="chart-title">Stage Funnel</h4><div id="chart-opps-stage"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Lead Source Breakdown</h4><div id="chart-opps-source"></div></div>
                `;
            } else if (tab === 'Account') {
                html = `
                    <div class="chart-box"><h4 class="chart-title">Accounts by Type</h4><div id="chart-accounts-type"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Accounts by Industry</h4><div id="chart-accounts-industry"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Accounts by Billing Country</h4><div id="chart-accounts-country"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Accounts by Billing City</h4><div id="chart-accounts-city"></div></div>
                `;
            } else if (tab === 'Contact') {
                html = `
                    <div class="chart-box"><h4 class="chart-title">Contacts by Top Accounts</h4><div id="chart-contacts-account"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Contacts by Country</h4><div id="chart-contacts-country"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Contacts by Title / Role</h4><div id="chart-contacts-title"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Do Not Call Ratio</h4><div id="chart-contacts-dnc"></div></div>
                `;
            } else if (tab === 'Email') {
                html = `
                    <div class="chart-box"><h4 class="chart-title">Emails by Status</h4><div id="chart-emails-status"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Sent vs Other Statuses</h4><div id="chart-emails-sent-vs-received"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Replied Ratio</h4><div id="chart-emails-replied"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Read Ratio</h4><div id="chart-emails-read"></div></div>
                `;
            } else if (tab === 'Meeting') {
                html = `
                    <div class="chart-box"><h4 class="chart-title">Meetings by Status</h4><div id="chart-meetings-status"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Upcoming vs Past Meetings</h4><div id="chart-meetings-upcoming"></div></div>
                    <div class="chart-box"><h4 class="chart-title">Meetings by Parent Type</h4><div id="chart-meetings-parent"></div></div>
                `;
            }

            this.$el.find('#charts-wrapper').html(html);

            if (this.$el.find('#chart-revenue-trend-container').length) {
                this.renderSvgAreaChart('#chart-revenue-trend-container', opps);
            }

            if (tab === 'all') {
                this.renderBarChart('#chart-leads-status', leads, 'status', 'status', 'var(--color-primary-light)', leadStatusOptions, 'Lead');
                this.renderBarChart('#chart-opps-stage', opps, 'stage', 'stage', 'var(--color-primary)', oppStageOptions, 'Opportunity');
                this.renderBarChart('#chart-accounts-type', accounts, 'type', 'type', 'var(--color-info)', accountTypeOptions, 'Account');
                this.renderBarChart('#chart-contacts-account', contacts, 'accountName', 'accountName', 'var(--color-primary)', null, 'Contact');
                this.renderBarChart('#chart-emails-status', emails, 'status', 'status', 'var(--color-purple)', emailStatusOptions, 'Email');
                this.renderBarChart('#chart-meetings-status', meetings, 'status', 'status', 'var(--color-warning)', meetingStatusOptions, 'Meeting');
            } else if (tab === 'Lead') {
                this.renderBarChart('#chart-leads-status', leads, 'status', 'status', 'var(--color-primary-light)', leadStatusOptions);
                this.renderBarChart('#chart-leads-source', leads, 'source', 'source', 'var(--color-info)');
                this.renderBarChart('#chart-leads-industry', leads, 'industry', 'industry', 'var(--color-primary)');
                this.renderBarChart('#chart-leads-country', leads, 'addressCountry', 'addressCountry', 'var(--color-purple)');
            } else if (tab === 'Opportunity') {
                this.renderBarChart('#chart-opps-stage', opps, 'stage', 'stage', 'var(--color-primary)', oppStageOptions);
                this.renderBarChart('#chart-opps-source', opps, 'leadSource', 'leadSource', 'var(--color-primary-light)');
            } else if (tab === 'Account') {
                this.renderBarChart('#chart-accounts-type', accounts, 'type', 'type', 'var(--color-primary-light)', accountTypeOptions);
                this.renderBarChart('#chart-accounts-industry', accounts, 'industry', 'industry', 'var(--color-info)');
                this.renderBarChart('#chart-accounts-country', accounts, 'billingAddressCountry', 'billingAddressCountry', 'var(--color-primary)');
                this.renderBarChart('#chart-accounts-city', accounts, 'billingAddressCity', 'billingAddressCity', 'var(--color-purple)');
            } else if (tab === 'Contact') {
                this.renderBarChart('#chart-contacts-account', contacts, 'accountName', 'accountName', 'var(--color-primary-light)');
                this.renderBarChart('#chart-contacts-country', contacts, 'addressCountry', 'addressCountry', 'var(--color-info)');
                this.renderBarChart('#chart-contacts-title', contacts, 'title', 'title', 'var(--color-primary)');
                this.renderCustomRatioChart('#chart-contacts-dnc', contacts, function(c){ return self.toSafeBoolean(c.doNotCall) ? 'Do Not Call' : 'Allow Call'; }, 'var(--color-danger)');
            } else if (tab === 'Email') {
                this.renderBarChart('#chart-emails-status', emails, 'status', 'status', 'var(--color-purple)', emailStatusOptions);
                this.renderCustomRatioChart('#chart-emails-sent-vs-received', emails, function(e){ return e.status === 'Sent' ? 'Sent' : 'Not Sent (Draft/Other)'; }, 'var(--color-primary-light)');
                this.renderCustomRatioChart('#chart-emails-replied', emails, function(e){ return self.toSafeBoolean(e.isReplied) ? 'Replied' : 'No Reply'; }, 'var(--color-success)');
                this.renderCustomRatioChart('#chart-emails-read', emails, function(e){ return self.toSafeBoolean(e.isRead) ? 'Read' : 'Unread'; }, 'var(--color-info)');
            } else if (tab === 'Meeting') {
                this.renderBarChart('#chart-meetings-status', meetings, 'status', 'status', 'var(--color-warning)', meetingStatusOptions);
                this.renderCustomRatioChart('#chart-meetings-upcoming', meetings, function(m){
                    return self.isMeetingUpcoming(m) ? 'Upcoming' : 'Past / Completed';
                }, 'var(--color-primary-light)');
                this.renderBarChart('#chart-meetings-parent', meetings, 'parentType', 'parentType', 'var(--color-primary)');
            }
        },

        renderTablesSection: function (leads, opps, accounts, contacts, emails, meetings) {
            var self = this;
            var tab = this.activeTab;
            var html = '';
            var isOverview = (tab === 'all');
            var hasExclusions = self.categoryFilters && Object.keys(self.categoryFilters).length > 0;

            var gridStyle = (!isOverview) ? 'grid-column: 1 / -1;' : '';

            function renderTableBox(title, subtitle, headersHtml, rowsHtml) {
                return `
                    <div class="table-box" style="${gridStyle}">
                        <div>
                            <h4 class="table-title">${self.escapeHtml(title)}</h4>
                            <p class="table-subtitle">${self.escapeHtml(subtitle)}</p>
                        </div>
                        <div class="table-responsive">
                            <table class="data-table">
                                <thead>
                                    <tr>${headersHtml}</tr>
                                </thead>
                                <tbody>${rowsHtml}</tbody>
                            </table>
                        </div>
                    </div>
                `;
            }

            function renderEmptyRow(colspan, message) {
                var reason = hasExclusions
                    ? 'Some categories are currently excluded by your active filters. Remove a filter chip above to see more records.'
                    : (self.searchTerm ? 'No records match your search term.' : (message || 'No records match your active filters.'));
                return `
                    <tr>
                        <td colspan="${colspan}" style="padding: 0;">
                            <div class="empty-state-box">
                                <i class="fas fa-inbox empty-state-icon"></i>
                                <h5 class="empty-state-title">No Records Found</h5>
                                <p class="empty-state-desc">${self.escapeHtml(reason)}</p>
                            </div>
                        </td>
                    </tr>
                `;
            }

            // Leads Table
            var leadsRows = '';
            leads.slice(0, 10).forEach(function (l) {
                var idStr = self.escapeHtml(l.id);
                var nameStr = self.escapeHtml(l.name || 'N/A');
                var accStr = self.escapeHtml(l.accountName || 'N/A');
                var statusStr = self.escapeHtml(l.status || 'New');
                var srcStr = self.escapeHtml(l.source || 'Direct');
                var indStr = self.escapeHtml(l.industry || 'N/A');
                var amountStr = self.formatCurrency(self.getReportingAmount(l));
                var userStr = self.escapeHtml(l.assignedUserName || 'Unassigned');

                if (isOverview) {
                    leadsRows += `
                        <tr class="data-row">
                            <td class="data-td-bold" title="${nameStr}"><span class="cell-truncate" style="max-width: 140px;">${nameStr}</span></td>
                            <td class="data-td"><span class="badge badge-primary">${statusStr}</span></td>
                            <td class="data-td-muted" title="${srcStr}"><span class="cell-truncate" style="max-width: 100px;">${srcStr}</span></td>
                            <td class="data-td-bold" style="color: var(--color-success);">${amountStr}</td>
                            <td class="data-td data-td-right"><a href="#Lead/view/${idStr}" data-scope="Lead" data-id="${idStr}" class="table-action-btn btn-view-record">View</a></td>
                        </tr>
                    `;
                } else {
                    leadsRows += `
                        <tr class="data-row">
                            <td class="data-td-bold" title="${nameStr}"><span class="cell-truncate" style="max-width: 160px;">${nameStr}</span></td>
                            <td class="data-td-muted" title="${accStr}"><span class="cell-truncate" style="max-width: 150px;">${accStr}</span></td>
                            <td class="data-td"><span class="badge badge-primary">${statusStr}</span></td>
                            <td class="data-td-muted">${srcStr}</td>
                            <td class="data-td-muted">${indStr}</td>
                            <td class="data-td-bold" style="color: var(--color-success);">${amountStr}</td>
                            <td class="data-td-muted" title="${userStr}"><span class="cell-truncate" style="max-width: 110px;">${userStr}</span></td>
                            <td class="data-td data-td-right"><a href="#Lead/view/${idStr}" data-scope="Lead" data-id="${idStr}" class="table-action-btn btn-view-record">View</a></td>
                        </tr>
                    `;
                }
            });
            if (!leads.length) leadsRows = renderEmptyRow(isOverview ? 5 : 8, 'No lead records match your search criteria.');

            // Opps Table
            var oppsRows = '';
            opps.slice(0, 10).forEach(function (o) {
                var idStr = self.escapeHtml(o.id);
                var nameStr = self.escapeHtml(o.name || 'N/A');
                var accStr = self.escapeHtml(o.accountName || 'N/A');
                var stageStr = self.escapeHtml(o.stage || 'Prospecting');
                var amountStr = self.formatCurrency(self.getReportingAmount(o));
                var probVal = self.getOppProbability(o);
                var srcStr = self.escapeHtml(o.leadSource || 'N/A');
                var dateStr = self.formatDate(o.closeDate);
                var userStr = self.escapeHtml(o.assignedUserName || 'Unassigned');

                if (isOverview) {
                    oppsRows += `
                        <tr class="data-row">
                            <td class="data-td-bold" title="${nameStr}"><span class="cell-truncate" style="max-width: 140px;">${nameStr}</span></td>
                            <td class="data-td"><span class="badge badge-info">${stageStr}</span></td>
                            <td class="data-td-bold" style="color: var(--color-success);">${amountStr}</td>
                            <td class="data-td-muted">${dateStr}</td>
                            <td class="data-td data-td-right"><a href="#Opportunity/view/${idStr}" data-scope="Opportunity" data-id="${idStr}" class="table-action-btn btn-view-record">View</a></td>
                        </tr>
                    `;
                } else {
                    oppsRows += `
                        <tr class="data-row">
                            <td class="data-td-bold" title="${nameStr}"><span class="cell-truncate" style="max-width: 160px;">${nameStr}</span></td>
                            <td class="data-td-muted" title="${accStr}"><span class="cell-truncate" style="max-width: 150px;">${accStr}</span></td>
                            <td class="data-td"><span class="badge badge-info">${stageStr}</span></td>
                            <td class="data-td-bold" style="color: var(--color-success);">${amountStr}</td>
                            <td class="data-td-bold" style="color: var(--color-purple);">${probVal}%</td>
                            <td class="data-td-muted">${srcStr}</td>
                            <td class="data-td-muted">${dateStr}</td>
                            <td class="data-td-muted" title="${userStr}"><span class="cell-truncate" style="max-width: 110px;">${userStr}</span></td>
                            <td class="data-td data-td-right"><a href="#Opportunity/view/${idStr}" data-scope="Opportunity" data-id="${idStr}" class="table-action-btn btn-view-record">View</a></td>
                        </tr>
                    `;
                }
            });
            if (!opps.length) oppsRows = renderEmptyRow(isOverview ? 5 : 9, 'No opportunity deals found matching filter.');

            // Accounts Table
            var accountsRows = '';
            accounts.slice(0, 10).forEach(function (a) {
                var idStr = self.escapeHtml(a.id);
                var nameStr = self.escapeHtml(a.name || 'N/A');
                var typeStr = self.escapeHtml(a.type || 'Customer');
                var indStr = self.escapeHtml(a.industry || 'N/A');
                var emailStr = self.escapeHtml(a.emailAddress || 'N/A');
                var phoneStr = self.escapeHtml(a.phoneNumber || 'N/A');
                var cityStr = self.escapeHtml(a.billingAddressCity || 'N/A');
                var countryStr = self.escapeHtml(a.billingAddressCountry || 'N/A');
                var userStr = self.escapeHtml(a.assignedUserName || 'Unassigned');

                accountsRows += `
                    <tr class="data-row">
                        <td class="data-td-bold" title="${nameStr}"><span class="cell-truncate" style="max-width: 160px;">${nameStr}</span></td>
                        <td class="data-td"><span class="badge badge-primary">${typeStr}</span></td>
                        <td class="data-td-muted" title="${indStr}"><span class="cell-truncate" style="max-width: 120px;">${indStr}</span></td>
                        <td class="data-td" style="color: var(--color-primary-light); font-weight: 600;" title="${emailStr}"><span class="cell-truncate" style="max-width: 160px;">${emailStr}</span></td>
                        <td class="data-td-muted">${phoneStr}</td>
                        <td class="data-td-muted">${cityStr}</td>
                        <td class="data-td-muted">${countryStr}</td>
                        <td class="data-td-muted" title="${userStr}"><span class="cell-truncate" style="max-width: 110px;">${userStr}</span></td>
                        <td class="data-td data-td-right"><a href="#Account/view/${idStr}" data-scope="Account" data-id="${idStr}" class="table-action-btn btn-view-record">View</a></td>
                    </tr>
                `;
            });
            if (!accounts.length) accountsRows = renderEmptyRow(9, 'No account company records found.');

            // Contacts Table
            var contactsRows = '';
            contacts.slice(0, 10).forEach(function (c) {
                var idStr = self.escapeHtml(c.id);
                var nameStr = self.escapeHtml(c.name || 'N/A');
                var accStr = self.escapeHtml(c.accountName || 'N/A');
                var titleStr = self.escapeHtml(c.title || 'N/A');
                var emailStr = self.escapeHtml(c.emailAddress || 'N/A');
                var phoneStr = self.escapeHtml(c.phoneNumber || 'N/A');
                var dncBadge = self.toSafeBoolean(c.doNotCall) ? '<span class="badge badge-danger">DNC</span>' : '<span class="badge badge-success">OK</span>';
                var countryStr = self.escapeHtml(c.addressCountry || 'N/A');
                var userStr = self.escapeHtml(c.assignedUserName || 'Unassigned');

                contactsRows += `
                    <tr class="data-row">
                        <td class="data-td-bold" title="${nameStr}"><span class="cell-truncate" style="max-width: 150px;">${nameStr}</span></td>
                        <td class="data-td-muted" title="${accStr}"><span class="cell-truncate" style="max-width: 140px;">${accStr}</span></td>
                        <td class="data-td-muted" title="${titleStr}"><span class="cell-truncate" style="max-width: 120px;">${titleStr}</span></td>
                        <td class="data-td" style="color: var(--color-primary-light); font-weight: 600;" title="${emailStr}"><span class="cell-truncate" style="max-width: 150px;">${emailStr}</span></td>
                        <td class="data-td-muted">${phoneStr}</td>
                        <td class="data-td">${dncBadge}</td>
                        <td class="data-td-muted">${countryStr}</td>
                        <td class="data-td-muted" title="${userStr}"><span class="cell-truncate" style="max-width: 110px;">${userStr}</span></td>
                        <td class="data-td data-td-right"><a href="#Contact/view/${idStr}" data-scope="Contact" data-id="${idStr}" class="table-action-btn btn-view-record">View</a></td>
                    </tr>
                `;
            });
            if (!contacts.length) contactsRows = renderEmptyRow(9, 'No contact person records found.');

            // Emails Table
            var emailsRows = '';
            emails.slice(0, 10).forEach(function (e) {
                var idStr = self.escapeHtml(e.id);
                var nameStr = self.escapeHtml(e.name || 'N/A');
                var statusStr = self.escapeHtml(e.status || 'Sent');
                var fromStr = self.escapeHtml(e.fromString || 'N/A');
                var dateStr = self.formatDate(e.dateSent || e.createdAt);
                var readBadge = self.toSafeBoolean(e.isRead) ? '<span class="badge badge-success">Read</span>' : '<span class="badge badge-warning">Unread</span>';
                var repliedBadge = self.toSafeBoolean(e.isReplied)
                    ? '<span class="badge badge-info">Replied</span>'
                    : '<span class="data-td-muted" style="padding:0;">—</span>';
                var userStr = self.escapeHtml(e.assignedUserName || 'System');

                emailsRows += `
                    <tr class="data-row">
                        <td class="data-td-bold" title="${nameStr}"><span class="cell-truncate" style="max-width: 200px;">${nameStr}</span></td>
                        <td class="data-td"><span class="badge badge-purple">${statusStr}</span></td>
                        <td class="data-td-muted" title="${fromStr}"><span class="cell-truncate" style="max-width: 150px;">${fromStr}</span></td>
                        <td class="data-td-muted">${dateStr}</td>
                        <td class="data-td">${readBadge}</td>
                        <td class="data-td">${repliedBadge}</td>
                        <td class="data-td-muted" title="${userStr}"><span class="cell-truncate" style="max-width: 110px;">${userStr}</span></td>
                        <td class="data-td data-td-right"><a href="#Email/view/${idStr}" data-scope="Email" data-id="${idStr}" class="table-action-btn btn-view-record">View</a></td>
                    </tr>
                `;
            });
            if (!emails.length) emailsRows = renderEmptyRow(8, 'No email activity records found.');

            // Meetings Table
            var meetingsRows = '';
            meetings.slice(0, 10).forEach(function (m) {
                var idStr = self.escapeHtml(m.id);
                var nameStr = self.escapeHtml(m.name || 'N/A');
                var statusStr = self.escapeHtml(m.status || 'Planned');
                var parentStr = m.parentName ? self.escapeHtml(m.parentType + ': ' + m.parentName) : 'N/A';
                var dateStartStr = self.formatDate(m.dateStart);
                var dateEndStr = self.formatDate(m.dateEnd);
                var durMins = Math.round(self.toSafeNumber(m.duration, 0) / 60);
                var userStr = self.escapeHtml(m.assignedUserName || 'Unassigned');

                meetingsRows += `
                    <tr class="data-row">
                        <td class="data-td-bold" title="${nameStr}"><span class="cell-truncate" style="max-width: 160px;">${nameStr}</span></td>
                        <td class="data-td"><span class="badge badge-warning">${statusStr}</span></td>
                        <td class="data-td-muted" title="${parentStr}"><span class="cell-truncate" style="max-width: 150px;">${parentStr}</span></td>
                        <td class="data-td-muted">${dateStartStr}</td>
                        <td class="data-td-muted">${dateEndStr}</td>
                        <td class="data-td-bold" style="color: var(--color-warning);">${durMins} min</td>
                        <td class="data-td-muted" title="${userStr}"><span class="cell-truncate" style="max-width: 110px;">${userStr}</span></td>
                        <td class="data-td data-td-right"><a href="#Meeting/view/${idStr}" data-scope="Meeting" data-id="${idStr}" class="table-action-btn btn-view-record">View</a></td>
                    </tr>
                `;
            });
            if (!meetings.length) meetingsRows = renderEmptyRow(8, 'No scheduled meeting records found.');

            if (tab === 'all') {
                html += renderTableBox('Recent Leads', 'Showing top 10 of ' + leads.length + ' matching lead records', '<th class="data-th">Name</th><th class="data-th">Status</th><th class="data-th">Source</th><th class="data-th">Opp Amount</th><th class="data-th data-td-right">Action</th>', leadsRows);
                html += renderTableBox('Recent Opportunities', 'Showing top 10 of ' + opps.length + ' matching deal records', '<th class="data-th">Name</th><th class="data-th">Stage</th><th class="data-th">Amount</th><th class="data-th">Close Date</th><th class="data-th data-td-right">Action</th>', oppsRows);
            } else if (tab === 'Lead') {
                html += renderTableBox('Leads Directory', 'Showing top 10 of ' + leads.length + ' matching lead records', '<th class="data-th">Name</th><th class="data-th">Account</th><th class="data-th">Status</th><th class="data-th">Source</th><th class="data-th">Industry</th><th class="data-th">Opp Amount</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', leadsRows);
            } else if (tab === 'Opportunity') {
                html += renderTableBox('Opportunities Pipeline', 'Showing top 10 of ' + opps.length + ' matching deal records', '<th class="data-th">Name</th><th class="data-th">Account</th><th class="data-th">Stage</th><th class="data-th">Amount</th><th class="data-th">Prob</th><th class="data-th">Source</th><th class="data-th">Close Date</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', oppsRows);
            } else if (tab === 'Account') {
                html += renderTableBox('Accounts Directory', 'Showing top 10 of ' + accounts.length + ' matching account records', '<th class="data-th">Name</th><th class="data-th">Type</th><th class="data-th">Industry</th><th class="data-th">Email</th><th class="data-th">Phone</th><th class="data-th">City</th><th class="data-th">Country</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', accountsRows);
            } else if (tab === 'Contact') {
                html += renderTableBox('Contacts Directory', 'Showing top 10 of ' + contacts.length + ' matching contact records', '<th class="data-th">Name</th><th class="data-th">Account</th><th class="data-th">Title</th><th class="data-th">Email</th><th class="data-th">Phone</th><th class="data-th">DNC</th><th class="data-th">Country</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', contactsRows);
            } else if (tab === 'Email') {
                html += renderTableBox('Emails Log', 'Showing top 10 of ' + emails.length + ' matching email records', '<th class="data-th">Subject</th><th class="data-th">Status</th><th class="data-th">From</th><th class="data-th">Date</th><th class="data-th">Read</th><th class="data-th">Replied</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', emailsRows);
            } else if (tab === 'Meeting') {
                html += renderTableBox('Meetings Schedule', 'Showing top 10 of ' + meetings.length + ' matching meeting records', '<th class="data-th">Name</th><th class="data-th">Status</th><th class="data-th">Parent Record</th><th class="data-th">Date Start</th><th class="data-th">Date End</th><th class="data-th">Duration</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', meetingsRows);
            }

            this.$el.find('#tables-wrapper').html(html);
        },

        renderSvgAreaChart: function (selector, opps) {
            var self = this;
            if (this.fetchErrorEntities && this.fetchErrorEntities.indexOf('Opportunity') > -1) {
                this.$el.find(selector).html(
                    '<div class="empty-state-box" style="padding: 24px;"><i class="fas fa-exclamation-circle empty-state-icon" style="color: var(--color-danger);"></i>' +
                    '<p class="empty-state-title" style="color: var(--color-danger);">Opportunity Data Unavailable</p>' +
                    '<p class="empty-state-desc">Could not fetch Opportunity data from server. Revenue trend chart cannot be plotted.</p></div>'
                );
                return;
            }

            var months = [];
            var now = new Date();

            for (var i = 5; i >= 0; i--) {
                var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                var monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
                var monthLabel = d.toLocaleString('en-US', { month: 'short' });
                months.push({ key: monthKey, label: monthLabel, amount: 0 });
            }

            (opps || []).filter(function (o) { return self.isStageWon(o.stage); }).forEach(function (o) {
                if (!o.closeDate) return;
                var mKey = String(o.closeDate).substring(0, 7);
                months.forEach(function (m) { if (m.key === mKey) m.amount += self.getReportingAmount(o); });
            });

            var amounts = months.map(function (m) { return m.amount; });
            var max = Math.max.apply(null, amounts) || 1000;

            var padL = 60, padR = 24, padT = 20, padB = 24;
            var width = 560, height = 200;
            var plotW = width - padL - padR;
            var plotH = height - padT - padB;

            function xAt(idx) { return padL + (idx / (amounts.length - 1)) * plotW; }
            function yAt(amt) { return padT + (1 - amt / max) * plotH; }

            var pathD = "M " + padL + " " + (padT + plotH) + " ";
            amounts.forEach(function (amt, idx) { pathD += "L " + xAt(idx) + " " + yAt(amt) + " "; });
            var linePath = pathD;
            pathD += "L " + (padL + plotW) + " " + (padT + plotH) + " Z";

            var gridlinesHtml = '', steps = 3;
            for (var g = 0; g <= steps; g++) {
                var gy = padT + (g / steps) * plotH;
                var gVal = Math.round(max - (g / steps) * max);
                gridlinesHtml +=
                    '<line x1="' + padL + '" y1="' + gy + '" x2="' + (padL + plotW) + '" y2="' + gy +
                    '" stroke="#e2e8f0" stroke-dasharray="4 4" stroke-width="1" />' +
                    '<text x="' + (padL - 8) + '" y="' + (gy + 3) + '" font-size="9" font-weight="700" fill="#94a3b8" text-anchor="end">' +
                    self.formatCurrency(gVal) + '</text>';
            }

            var dotsHtml = '';
            amounts.forEach(function (amt, idx) {
                var x = xAt(idx), y = yAt(amt);
                var anchor = idx === 0 ? 'start' : (idx === amounts.length - 1 ? 'end' : 'middle');
                var labelY = Math.max(y - 9, padT + 2);
                dotsHtml +=
                    '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="#00a4c8" stroke="#ffffff" stroke-width="2.5" />' +
                    '<text x="' + x + '" y="' + (height - 6) + '" font-size="11" font-weight="700" fill="#64748b" text-anchor="' + anchor + '">' + months[idx].label + '</text>' +
                    '<text x="' + x + '" y="' + labelY + '" font-size="9" font-weight="800" fill="#005a70" text-anchor="' + anchor + '">' + self.formatCurrency(amt) + '</text>';
            });

            var svgHtml =
                '<svg viewBox="0 0 ' + width + ' ' + height + '" style="width:100%; height:210px;">' +
                    '<defs><linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">' +
                    '<stop offset="0%" stop-color="#00a4c8" stop-opacity="0.3" />' +
                    '<stop offset="100%" stop-color="#00a4c8" stop-opacity="0.0" /></linearGradient></defs>' +
                    gridlinesHtml +
                    '<path d="' + pathD + '" fill="url(#skyGrad)" />' +
                    '<path d="' + linePath + '" fill="none" stroke="#00a4c8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />' +
                    dotsHtml +
                '</svg>';
            this.$el.find(selector).html(svgHtml);
        },

        renderBarChart: function (selector, list, prop, fieldName, barColor, predefinedOptions, entityScope) {
            var self = this;
            var counts = {};
            var EMPTY_LABEL = 'Direct / Default';

            if (predefinedOptions && Array.isArray(predefinedOptions)) {
                predefinedOptions.forEach(function (opt) {
                    counts[opt] = 0;
                });
            }
            (list || []).forEach(function (item) {
                var raw = item[prop];
                var key = (raw === undefined || raw === null || raw === '') ? EMPTY_LABEL : String(raw);
                counts[key] = (counts[key] || 0) + 1;
            });

            var sumCounts = 0;
            Object.keys(counts).forEach(function (k) { sumCounts += counts[k]; });
            if (!sumCounts) sumCounts = 1;

            var scope = entityScope || self.activeTab;
            var filterKey = scope + ':' + fieldName;
            var activeFilterMap = self.categoryFilters && self.categoryFilters[filterKey];

            var entries = Object.keys(counts).map(function (k) { return { key: k, count: counts[k] }; });

            var TOP_N = 8;
            var otherEntry = null;
            if (!predefinedOptions) {
                entries.sort(function (a, b) { return b.count - a.count; });
                if (entries.length > TOP_N) {
                    var otherCount = entries.slice(TOP_N).reduce(function (s, e) { return s + e.count; }, 0);
                    entries = entries.slice(0, TOP_N);
                    otherEntry = { key: 'Other', count: otherCount };
                    entries.push(otherEntry);
                }
            }

            var html = '';
            entries.forEach(function (entry) {
                var key = entry.key;
                var cnt = entry.count;
                var isOtherBucket = (entry === otherEntry);
                var pct = Math.round((cnt / sumCounts) * 100);
                var escapedLabel = self.escapeHtml(key);
                var storedVal = (key === EMPTY_LABEL) ? '__EMPTY__' : key;
                var escapedAttr = self.escapeHtml(storedVal);

                var excludedEntry = activeFilterMap ? activeFilterMap[storedVal] : null;
                var isChecked = !(excludedEntry && excludedEntry.excluded);

                if (isOtherBucket) {
                    html += `
                        <div class="static-ratio-item">
                            <div class="bar-item-header">
                                <div class="bar-item-label-group">
                                    <span class="bar-item-name">${escapedLabel}</span>
                                </div>
                                <span class="bar-item-count">${cnt} <span class="bar-item-pct">(${pct}%)</span></span>
                            </div>
                            <div class="bar-progress-track">
                                <div class="bar-progress-fill" style="width: ${pct}%; background: #cbd5e1;"></div>
                            </div>
                        </div>
                    `;
                    return;
                }

                var iconHtml = isChecked
                    ? '<i class="fas fa-check-square filter-icon-checked"></i>'
                    : '<i class="far fa-square filter-icon-unchecked"></i>';

                var itemClass = isChecked ? 'is-checked' : 'is-unchecked';

                html += `
                    <div class="interactive-bar-item ${itemClass}" tabindex="0" role="button" aria-label="Toggle filter for ${escapedLabel}" data-entity="${scope}" data-field="${fieldName}" data-value="${escapedAttr}">
                        <div class="bar-item-header">
                            <div class="bar-item-label-group">
                                <span class="bar-item-name">${escapedLabel}</span>
                            </div>
                            <div class="bar-item-right-group">
                                <span class="bar-item-count">${cnt} <span class="bar-item-pct">(${pct}%)</span></span>
                                ${iconHtml}
                            </div>
                        </div>
                        <div class="bar-progress-track">
                            <div class="bar-progress-fill" style="width: ${pct}%; background: linear-gradient(90deg, var(--color-primary) 0%, ${barColor} 100%);"></div>
                        </div>
                    </div>
                `;
            });
            if (!Object.keys(counts).length) {
                html = '<div class="empty-state-box"><p class="empty-state-desc">No breakdown data available.</p></div>';
            }
            this.$el.find(selector).html(html);
        },

        renderCustomRatioChart: function (selector, list, customEvaluator, barColor) {
            var self = this;
            var counts = {};
            (list || []).forEach(function (item) {
                var val = customEvaluator(item);
                counts[val] = (counts[val] || 0) + 1;
            });

            var sumCounts = 0;
            Object.keys(counts).forEach(function (k) { sumCounts += counts[k]; });
            if (!sumCounts) sumCounts = 1;

            var html = '';
            Object.keys(counts).forEach(function (key) {
                var cnt = counts[key];
                var pct = Math.round((cnt / sumCounts) * 100);
                var escapedLabel = self.escapeHtml(key);

                html += `
                    <div class="static-ratio-item">
                        <div class="bar-item-header">
                            <div class="bar-item-label-group">
                                <i class="fas fa-chart-pie" style="color: var(--color-primary-light); font-size: 11px;"></i>
                                <span class="bar-item-name">${escapedLabel}</span>
                            </div>
                            <span class="bar-item-count">${cnt} <span class="bar-item-pct">(${pct}%)</span></span>
                        </div>
                        <div class="bar-progress-track">
                            <div class="bar-progress-fill" style="width: ${pct}%; background: linear-gradient(90deg, var(--color-primary) 0%, ${barColor} 100%);"></div>
                        </div>
                    </div>
                `;
            });
            if (!Object.keys(counts).length) {
                html = '<div class="empty-state-box"><p class="empty-state-desc">No ratio data available.</p></div>';
            }
            this.$el.find(selector).html(html);
        }
    });
});
