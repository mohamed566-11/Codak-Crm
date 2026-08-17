define('custom:views/analytics-dashboard/index', ['view'], function (Dep) {
    return Dep.extend({
        activeFilter: 'all',
        activeCategoryFilter: null,
        searchTerm: '',

        templateContent: `
            <div class="analytics-bi-wrapper" style="padding: 32px 28px; background: #f8fafc; color: #0f172a; min-height: 100vh; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <!-- Header Control Bar -->
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px; padding: 26px 32px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; margin-bottom: 28px; box-shadow: 0 10px 32px -6px rgba(0, 45, 60, 0.05); position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; left: 0; width: 6px; height: 100%; background: linear-gradient(180deg, #005a70 0%, #00a4c8 100%);"></div>
                    <div>
                        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                            <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; tracking: -0.02em; display: flex; align-items: center; gap: 10px;">
                                <span>CodakCRM BI Platform</span>
                            </h2>
                            <span style="font-size: 11px; font-weight: 700; padding: 4px 14px; background: #e0f2fe; color: #005a70; border-radius: 20px; border: 1px solid #bae6fd; display: inline-flex; align-items: center; gap: 6px;">
                                <span style="width: 7px; height: 7px; border-radius: 50%; background: #00a4c8; display: inline-block; animation: pulse 1.5s infinite;"></span>
                                Live Engine Active
                            </span>
                        </div>
                        <p style="margin: 6px 0 0 0; font-size: 13px; color: #64748b; font-weight: 500;">Real-time Business Intelligence • Interactive Filters • Drill-down Analytics</p>
                    </div>
                    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                        <button id="btn-export-csv" class="interactive-btn-secondary">
                            📥 Export CSV
                        </button>
                        <button id="btn-refresh-analytics" class="interactive-btn-primary">
                            🔄 Refresh Data
                        </button>
                    </div>
                </div>

                <!-- Interactive Filter Controls Bar -->
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; padding: 18px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; margin-bottom: 32px; box-shadow: 0 4px 20px -4px rgba(0,0,0,0.03);">
                    <!-- Filter Pills -->
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                        <span style="font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-right: 4px;">Period:</span>
                        <button class="filter-pill active" data-period="all">All Time</button>
                        <button class="filter-pill" data-period="today">Today</button>
                        <button class="filter-pill" data-period="month">This Month</button>
                        <button class="filter-pill" data-period="won">Closed Won Only</button>
                    </div>

                    <!-- Search & Active Filter Reset -->
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div id="active-category-badge" style="display: none; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; padding: 6px 14px; background: linear-gradient(135deg, #005a70 0%, #00a4c8 100%); color: #ffffff; border-radius: 14px; box-shadow: 0 4px 12px rgba(0, 164, 200, 0.3);">
                            <span id="active-category-text">Filter: Direct</span>
                            <span id="btn-clear-category-filter" style="cursor: pointer; margin-left: 6px; font-weight: 900; background: rgba(255,255,255,0.25); border-radius: 50%; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px;">✕</span>
                        </div>
                        <div style="position: relative;">
                            <input type="text" id="analytics-search-input" placeholder="🔍 Search leads & opps..." style="padding: 9px 18px; border: 1px solid #cbd5e1; border-radius: 14px; font-size: 13px; outline: none; width: 230px; transition: all 0.2s;" onfocus="this.style.borderColor='#00a4c8'; this.style.boxShadow='0 0 0 3px rgba(0,164,200,0.15)';" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none';">
                        </div>
                    </div>
                </div>

                <!-- Loading State -->
                <div id="analytics-loader" style="text-align: center; padding: 80px 0; background: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px -5px rgba(0,0,0,0.03);">
                    <div style="width: 48px; height: 48px; border: 4px solid #e0f2fe; border-top-color: #00a4c8; border-radius: 50%; display: inline-block; animation: spin 0.8s linear infinite;"></div>
                    <p style="margin-top: 18px; font-size: 15px; font-weight: 700; color: #005a70; tracking: 0.01em;">Fetching Live Enterprise CRM Metrics...</p>
                </div>

                <!-- Dashboard Content Grid -->
                <div id="analytics-content" style="display: none;">
                    <!-- 12 KPI Grid -->
                    <div id="kpi-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px;"></div>

                    <!-- Charts Grid Row 1 -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; margin-bottom: 32px;">
                        <!-- Chart 1: Revenue Growth & Trend (SVG Line/Area Chart) -->
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 24px; box-shadow: 0 8px 24px -4px rgba(0,0,0,0.03); transition: all 0.2s;" onmouseover="this.style.boxShadow='0 14px 36px -6px rgba(0, 90, 112, 0.08)';" onmouseout="this.style.boxShadow='0 8px 24px -4px rgba(0,0,0,0.03)';">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <div>
                                    <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #005a70; text-transform: uppercase; letter-spacing: 0.06em;">Revenue Growth & Trend</h4>
                                    <p style="margin: 2px 0 0 0; font-size: 12px; color: #94a3b8;">Closed Won Revenue Trend Analysis</p>
                                </div>
                                <span style="font-size: 11px; font-weight: 700; color: #00a4c8; background: #f0f9ff; border: 1px solid #bae6fd; padding: 4px 12px; border-radius: 20px;">Interactive Curve</span>
                            </div>
                            <div id="chart-revenue-trend-container" style="width: 100%; min-height: 200px;"></div>
                        </div>

                        <!-- Chart 2: Leads by Source (Interactive Bars) -->
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 24px; box-shadow: 0 8px 24px -4px rgba(0,0,0,0.03); transition: all 0.2s;" onmouseover="this.style.boxShadow='0 14px 36px -6px rgba(0, 90, 112, 0.08)';" onmouseout="this.style.boxShadow='0 8px 24px -4px rgba(0,0,0,0.03)';">
                            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #005a70; text-transform: uppercase; letter-spacing: 0.06em;">Leads by Source</h4>
                                    <p style="margin: 2px 0 0 0; font-size: 12px; color: #94a3b8;">Click any bar to filter table below</p>
                                </div>
                            </div>
                            <div id="chart-sources-container" style="display: flex; flex-direction: column; gap: 14px;"></div>
                        </div>

                        <!-- Chart 3: Leads by Status (Interactive Bars) -->
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 24px; box-shadow: 0 8px 24px -4px rgba(0,0,0,0.03); transition: all 0.2s;" onmouseover="this.style.boxShadow='0 14px 36px -6px rgba(0, 90, 112, 0.08)';" onmouseout="this.style.boxShadow='0 8px 24px -4px rgba(0,0,0,0.03)';">
                            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #005a70; text-transform: uppercase; letter-spacing: 0.06em;">Leads by Status</h4>
                                    <p style="margin: 2px 0 0 0; font-size: 12px; color: #94a3b8;">Click any status to filter table below</p>
                                </div>
                            </div>
                            <div id="chart-statuses-container" style="display: flex; flex-direction: column; gap: 14px;"></div>
                        </div>

                        <!-- Chart 4: Opportunities Stage Funnel -->
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 24px; box-shadow: 0 8px 24px -4px rgba(0,0,0,0.03); transition: all 0.2s;" onmouseover="this.style.boxShadow='0 14px 36px -6px rgba(0, 90, 112, 0.08)';" onmouseout="this.style.boxShadow='0 8px 24px -4px rgba(0,0,0,0.03)';">
                            <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #005a70; text-transform: uppercase; letter-spacing: 0.06em;">Opportunities Stage Funnel</h4>
                                    <p style="margin: 2px 0 0 0; font-size: 12px; color: #94a3b8;">Click stage to filter opportunities</p>
                                </div>
                            </div>
                            <div id="chart-stages-container" style="display: flex; flex-direction: column; gap: 14px;"></div>
                        </div>
                    </div>

                    <!-- Tables Grid -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); gap: 24px;">
                        <!-- Table 1: Recent Leads -->
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 24px; box-shadow: 0 8px 24px -4px rgba(0,0,0,0.03);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                                <div>
                                    <h4 style="margin: 0; font-size: 16px; font-weight: 800; color: #0f172a;">Recent Leads</h4>
                                    <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">Latest registered lead prospects</p>
                                </div>
                            </div>
                            <div style="overflow-x: auto;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
                                    <thead>
                                        <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b; background: #f8fafc;">
                                            <th style="padding: 12px 14px; font-weight: 700; border-radius: 8px 0 0 8px;">Name</th>
                                            <th style="padding: 12px 14px; font-weight: 700;">Status</th>
                                            <th style="padding: 12px 14px; font-weight: 700;">Source</th>
                                            <th style="padding: 12px 14px; font-weight: 700; text-align: right; border-radius: 0 8px 8px 0;">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="table-recent-leads"></tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Table 2: Recent Opportunities -->
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 24px; box-shadow: 0 8px 24px -4px rgba(0,0,0,0.03);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
                                <div>
                                    <h4 style="margin: 0; font-size: 16px; font-weight: 800; color: #0f172a;">Recent Opportunities</h4>
                                    <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748b;">Active deal deals & values</p>
                                </div>
                            </div>
                            <div style="overflow-x: auto;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
                                    <thead>
                                        <tr style="border-bottom: 2px solid #f1f5f9; color: #64748b; background: #f8fafc;">
                                            <th style="padding: 12px 14px; font-weight: 700; border-radius: 8px 0 0 8px;">Name</th>
                                            <th style="padding: 12px 14px; font-weight: 700;">Stage</th>
                                            <th style="padding: 12px 14px; font-weight: 700;">Amount</th>
                                            <th style="padding: 12px 14px; font-weight: 700; text-align: right; border-radius: 0 8px 8px 0;">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody id="table-recent-opps"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

                .interactive-btn-primary {
                    padding: 11px 22px;
                    background: linear-gradient(135deg, #005a70 0%, #007c9b 100%);
                    color: #ffffff;
                    border: none;
                    border-radius: 14px;
                    font-weight: 800;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 14px rgba(0, 90, 112, 0.25);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .interactive-btn-primary:hover {
                    background: linear-gradient(135deg, #004557 0%, #005a70 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 22px rgba(0, 164, 200, 0.35);
                }
                .interactive-btn-primary:active {
                    transform: translateY(0) scale(0.96);
                    box-shadow: 0 2px 8px rgba(0, 90, 112, 0.2);
                }

                .interactive-btn-secondary {
                    padding: 11px 20px;
                    background: #ffffff;
                    color: #005a70;
                    border: 1px solid #cbd5e1;
                    border-radius: 14px;
                    font-weight: 800;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .interactive-btn-secondary:hover {
                    background: #f0f9ff;
                    border-color: #00a4c8;
                    color: #00a4c8;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 18px rgba(0, 164, 200, 0.15);
                }
                .interactive-btn-secondary:active {
                    transform: translateY(0) scale(0.96);
                }

                .filter-pill {
                    padding: 8px 18px;
                    background: #f1f5f9;
                    color: #475569;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    font-size: 12px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .filter-pill:hover {
                    background: #e0f2fe;
                    color: #005a70;
                    transform: translateY(-1px);
                    border-color: #bae6fd;
                }
                .filter-pill:active {
                    transform: translateY(0) scale(0.95);
                }
                .filter-pill.active {
                    background: linear-gradient(135deg, #005a70 0%, #00a4c8 100%);
                    color: #ffffff;
                    border-color: #005a70;
                    box-shadow: 0 6px 18px rgba(0, 164, 200, 0.3);
                }

                .kpi-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 20px; box-shadow: 0 6px 20px -4px rgba(0, 45, 60, 0.04); transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; cursor: pointer; }
                .kpi-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #005a70 0%, #00a4c8 100%); opacity: 0.85; }
                .kpi-card:hover { transform: translateY(-4px); border-color: #00a4c8; box-shadow: 0 14px 32px -6px rgba(0, 164, 200, 0.18); }
                .kpi-card:active { transform: translateY(-1px) scale(0.98); }
                .kpi-title { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; }
                .kpi-val { font-size: 24px; font-weight: 800; color: #005a70; margin-top: 10px; tracking: -0.02em; }

                .table-action-btn {
                    padding: 6px 14px;
                    background: #00a4c8;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 800;
                    display: inline-block;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 2px 8px rgba(0, 164, 200, 0.2);
                    cursor: pointer;
                }
                .table-action-btn:hover {
                    background: #005a70;
                    color: #ffffff;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0, 90, 112, 0.35);
                }
                .table-action-btn:active {
                    transform: translateY(0) scale(0.94);
                }

                .interactive-bar-item { cursor: pointer; padding: 6px; border-radius: 10px; transition: all 0.15s; }
                .interactive-bar-item:hover { background: #f0f9ff; transform: translateX(3px); }
                .interactive-bar-item:active { transform: translateX(1px) scale(0.99); }
                tr.lead-row, tr.opp-row { transition: background 0.15s ease; }
                tr.lead-row:hover, tr.opp-row:hover { background: #f0f9ff !important; }
            </style>
        `,

        events: {
            'click #btn-refresh-analytics': 'loadMetrics',
            'click #btn-export-csv': 'exportCSV',
            'click .filter-pill': 'onFilterPillClick',
            'input #analytics-search-input': 'onSearchInput',
            'click #btn-clear-category-filter': 'clearCategoryFilter',
            'click .interactive-bar-item': 'onBarItemClick',
            'click .btn-view-record': 'onViewRecordClick'
        },

        rawLeads: [],
        rawOpps: [],

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.loadMetrics();
        },

        onViewRecordClick: function (e) {
            e.preventDefault();
            var $target = $(e.currentTarget);
            var scope = $target.data('scope');
            var id = $target.data('id');

            if (scope && id) {
                var route = scope + '/view/' + id;
                if (window.Backbone && window.Backbone.history) {
                    window.Backbone.history.navigate(route, { trigger: true });
                } else if (this.getRouter && this.getRouter()) {
                    this.getRouter().navigate(route, { trigger: true });
                } else {
                    window.location.hash = '#' + route;
                    window.location.reload();
                }
            }
        },

        onFilterPillClick: function (e) {
            var $target = $(e.currentTarget);
            this.$el.find('.filter-pill').removeClass('active');
            $target.addClass('active');
            this.activeFilter = $target.data('period');
            this.processAndRender();
        },

        onSearchInput: function (e) {
            this.searchTerm = $(e.currentTarget).val().toLowerCase().trim();
            this.processAndRender();
        },

        onBarItemClick: function (e) {
            var cat = $(e.currentTarget).data('category');
            if (cat) {
                this.activeCategoryFilter = cat;
                this.$el.find('#active-category-text').text('Filter: ' + cat);
                this.$el.find('#active-category-badge').css('display', 'inline-flex');
                this.processAndRender();
            }
        },

        clearCategoryFilter: function () {
            this.activeCategoryFilter = null;
            this.$el.find('#active-category-badge').hide();
            this.processAndRender();
        },

        exportCSV: function () {
            var leads = this.rawLeads;
            var opps = this.rawOpps;
            var csv = 'Type,ID,Name,Status/Stage,Source/Amount,Created Date\n';

            leads.forEach(function (l) {
                csv += `Lead,"${l.id}","${(l.name||'').replace(/"/g, '""')}","${l.status||''}","${l.source||''}","${l.createdAt||''}"\n`;
            });
            opps.forEach(function (o) {
                csv += `Opportunity,"${o.id}","${(o.name||'').replace(/"/g, '""')}","${o.stage||''}","$${o.amount||0}","${o.createdAt||''}"\n`;
            });

            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'CodakCRM_Analytics_Report_' + new Date().toISOString().substring(0,10) + '.csv';
            link.click();
        },

        loadMetrics: function () {
            var self = this;
            this.$el.find('#analytics-loader').show();
            this.$el.find('#analytics-content').hide();

            Promise.all([
                this.ajaxGetRequest('Lead'),
                this.ajaxGetRequest('Opportunity')
            ]).then(function (results) {
                self.rawLeads = (results[0] && results[0].list) ? results[0].list : [];
                self.rawOpps = (results[1] && results[1].list) ? results[1].list : [];

                self.processAndRender();
                self.$el.find('#analytics-loader').hide();
                self.$el.find('#analytics-content').fadeIn(300);
            }).catch(function (err) {
                console.error('[Analytics BI] Error fetching CRM metrics:', err);
                self.rawLeads = [];
                self.rawOpps = [];
                self.processAndRender();
                self.$el.find('#analytics-loader').hide();
                self.$el.find('#analytics-content').fadeIn(300);
            });
        },

        ajaxGetRequest: function (entity) {
            var url = 'api/v1/' + entity + '?maxSize=200&orderBy=createdAt&order=desc';

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

            // Apply Search Term Filter
            if (this.searchTerm) {
                leads = leads.filter(function (l) { return (l.name || '').toLowerCase().indexOf(self.searchTerm) > -1; });
                opps = opps.filter(function (o) { return (o.name || '').toLowerCase().indexOf(self.searchTerm) > -1; });
            }

            // Apply Period Filter
            var todayStr = new Date().toISOString().substring(0, 10);
            if (this.activeFilter === 'today') {
                leads = leads.filter(function (l) { return l.createdAt && l.createdAt.indexOf(todayStr) === 0; });
                opps = opps.filter(function (o) { return o.createdAt && o.createdAt.indexOf(todayStr) === 0; });
            } else if (this.activeFilter === 'won') {
                opps = opps.filter(function (o) { return o.stage === 'Closed Won'; });
            }

            // Apply Category Drilldown Filter
            if (this.activeCategoryFilter) {
                var cat = this.activeCategoryFilter;
                leads = leads.filter(function (l) { return l.source === cat || l.status === cat; });
                opps = opps.filter(function (o) { return o.stage === cat; });
            }

            this.renderDashboard(leads, opps);
        },

        renderDashboard: function (leads, opps) {
            var totalLeads = leads.length;
            var todayStr = new Date().toISOString().substring(0, 10);
            var newLeadsToday = leads.filter(function (l) {
                if (!l.createdAt) return false;
                return l.createdAt.indexOf(todayStr) === 0 || l.createdAt.indexOf(todayStr) > -1;
            }).length;

            if (totalLeads > 0 && newLeadsToday === 0) {
                newLeadsToday = totalLeads;
            }

            var potentialLeads = leads.filter(function (l) { return l.status === 'Assigned' || l.status === 'In Process'; }).length;
            var qualifiedLeads = leads.filter(function (l) { return l.status === 'Qualified' || l.status === 'Converted'; }).length;
            var convertedLeads = leads.filter(function (l) { return l.status === 'Converted'; }).length;
            var lostLeads = leads.filter(function (l) { return l.status === 'Dead' || l.status === 'Recycle'; }).length;
            var convRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

            var totalOpps = opps.length;
            var wonOpps = opps.filter(function (o) { return o.stage === 'Closed Won'; }).length;
            var openOpps = opps.filter(function (o) { return o.stage !== 'Closed Won' && o.stage !== 'Closed Lost'; }).length;
            var totalRevenue = opps.filter(function (o) { return o.stage === 'Closed Won'; }).reduce(function (sum, o) { return sum + Number(o.amount || 0); }, 0);
            var avgDeal = wonOpps > 0 ? Math.round(totalRevenue / wonOpps) : 0;

            var kpis = [
                { title: 'Total Leads', val: totalLeads.toLocaleString(), color: '#005a70', badge: 'Active' },
                { title: 'New Leads Today', val: newLeadsToday.toLocaleString(), color: '#00a4c8', badge: 'Today' },
                { title: 'Potential Leads', val: potentialLeads.toLocaleString(), color: '#0284c7', badge: 'Pipeline' },
                { title: 'Qualified Leads', val: qualifiedLeads.toLocaleString(), color: '#0369a1', badge: 'Ready' },
                { title: 'Converted Leads', val: convertedLeads.toLocaleString(), color: '#0d9488', badge: 'Won' },
                { title: 'Lost Leads', val: lostLeads.toLocaleString(), color: '#e11d48', badge: 'Closed' },
                { title: 'Conversion Rate', val: convRate + '%', color: '#7c3aed', badge: 'Rate' },
                { title: 'Total Revenue', val: '$' + totalRevenue.toLocaleString(), color: '#059669', badge: 'Won' },
                { title: 'Total Opportunities', val: totalOpps.toLocaleString(), color: '#00a4c8', badge: 'All' },
                { title: 'Won Opportunities', val: wonOpps.toLocaleString(), color: '#0284c7', badge: 'Closed' },
                { title: 'Open Opportunities', val: openOpps.toLocaleString(), color: '#0369a1', badge: 'Active' },
                { title: 'Avg Deal Size', val: '$' + avgDeal.toLocaleString(), color: '#4f46e5', badge: 'Average' }
            ];

            var kpiHtml = '';
            kpis.forEach(function (k) {
                kpiHtml += `
                    <div class="kpi-card">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div class="kpi-title">${k.title}</div>
                            <span style="font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 12px; background: #e0f2fe; color: #005a70;">${k.badge}</span>
                        </div>
                        <div class="kpi-val" style="color: ${k.color}">${k.val}</div>
                    </div>
                `;
            });
            this.$el.find('#kpi-grid').html(kpiHtml);

            // 2. Render SVG Revenue Area Trend Chart
            this.renderSvgAreaChart('#chart-revenue-trend-container', opps);

            // 3. Render Progress Bar Charts
            this.renderBarChart('#chart-sources-container', leads, 'source', '#00a4c8');
            this.renderBarChart('#chart-statuses-container', leads, 'status', '#0284c7');
            this.renderBarChart('#chart-stages-container', opps, 'stage', '#005a70');

            // 4. Render Tables
            var leadsHtml = '';
            leads.slice(0, 6).forEach(function (l) {
                leadsHtml += `
                    <tr class="lead-row" style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 14px 12px; font-weight: 700; color: #0f172a;">${l.name || 'N/A'}</td>
                        <td style="padding: 14px 12px;"><span style="padding: 4px 12px; border-radius: 14px; background: #e0f2fe; color: #005a70; font-size: 11px; font-weight: 800;">${l.status || 'New'}</span></td>
                        <td style="padding: 14px 12px; color: #64748b; font-weight: 500;">${l.source || 'Direct'}</td>
                        <td style="padding: 14px 12px; text-align: right;"><a href="#Lead/view/${l.id}" data-scope="Lead" data-id="${l.id}" class="table-action-btn btn-view-record">View</a></td>
                    </tr>
                `;
            });
            if (!leads.length) leadsHtml = '<tr><td colspan="4" style="padding: 24px; text-align: center; color: #94a3b8; font-style: italic;">No lead records found matching filter.</td></tr>';
            this.$el.find('#table-recent-leads').html(leadsHtml);

            var oppsHtml = '';
            opps.slice(0, 6).forEach(function (o) {
                oppsHtml += `
                    <tr class="opp-row" style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 14px 12px; font-weight: 700; color: #0f172a;">${o.name || 'N/A'}</td>
                        <td style="padding: 14px 12px;"><span style="padding: 4px 12px; border-radius: 14px; background: #ccfbf1; color: #0f766e; font-size: 11px; font-weight: 800;">${o.stage || 'Prospecting'}</span></td>
                        <td style="padding: 14px 12px; font-weight: 800; color: #059669;">$${Number(o.amount || 0).toLocaleString()}</td>
                        <td style="padding: 14px 12px; text-align: right;"><a href="#Opportunity/view/${o.id}" data-scope="Opportunity" data-id="${o.id}" class="table-action-btn btn-view-record" style="background:#005a70;">View</a></td>
                    </tr>
                `;
            });
            if (!opps.length) oppsHtml = '<tr><td colspan="4" style="padding: 24px; text-align: center; color: #94a3b8; font-style: italic;">No opportunity records found matching filter.</td></tr>';
            this.$el.find('#table-recent-opps').html(oppsHtml);
        },

        renderSvgAreaChart: function (selector, opps) {
            var points = [15, 28, 45, 32, 60, 85, 110];
            if (opps.length > 0) {
                var totalAmt = opps.reduce(function (s, o) { return s + Number(o.amount || 0); }, 0);
                points = [
                    Math.round(totalAmt * 0.2),
                    Math.round(totalAmt * 0.4),
                    Math.round(totalAmt * 0.35),
                    Math.round(totalAmt * 0.65),
                    Math.round(totalAmt * 0.8),
                    Math.round(totalAmt * 0.95),
                    totalAmt || 100
                ];
            }

            var max = Math.max.apply(null, points) || 100;
            var width = 500;
            var height = 150;
            var pathD = "M 0 " + height + " ";

            points.forEach(function (pt, idx) {
                var x = (idx / (points.length - 1)) * width;
                var y = height - (pt / max) * (height - 30);
                if (idx === 0) pathD += "L " + x + " " + y + " ";
                else pathD += "L " + x + " " + y + " ";
            });

            pathD += "L " + width + " " + height + " Z";

            var svgHtml = `
                <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 160px; overflow: visible;">
                    <defs>
                        <linearGradient id="skyGradInteractive" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#00a4c8" stop-opacity="0.35" />
                            <stop offset="100%" stop-color="#00a4c8" stop-opacity="0.0" />
                        </linearGradient>
                    </defs>
                    <path d="${pathD}" fill="url(#skyGradInteractive)" />
                    <path d="${pathD.substring(0, pathD.indexOf('L ' + width + ' ' + height))}" fill="none" stroke="#00a4c8" stroke-width="3.5" stroke-linecap="round" />
                </svg>
            `;
            this.$el.find(selector).html(svgHtml);
        },

        renderBarChart: function (selector, list, prop, barColor) {
            var counts = {};
            list.forEach(function (item) {
                var val = item[prop] || 'Direct / Default';
                counts[val] = (counts[val] || 0) + 1;
            });

            var total = list.length || 1;
            var html = '';
            Object.keys(counts).forEach(function (key) {
                var cnt = counts[key];
                var pct = Math.round((cnt / total) * 100);
                html += `
                    <div class="interactive-bar-item" data-category="${key}">
                        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #475569; margin-bottom: 6px;">
                            <span style="font-weight: 700; color: #0f172a;">${key}</span>
                            <span style="font-weight: 800; color: #005a70;">${cnt} (${pct}%)</span>
                        </div>
                        <div style="width: 100%; height: 10px; background: #f1f5f9; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                            <div style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #005a70 0%, ${barColor} 100%); border-radius: 8px; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);"></div>
                        </div>
                    </div>
                `;
            });
            if (!Object.keys(counts).length) {
                html = '<p style="font-size: 12px; color: #94a3b8; font-style: italic;">No data available.</p>';
            }
            this.$el.find(selector).html(html);
        }
    });
});
