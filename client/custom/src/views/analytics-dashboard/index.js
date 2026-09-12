define('custom:views/analytics-dashboard/index', ['view'], function (Dep) {
    return Dep.extend({
        activeFilter: 'all',
        activeTab: 'all',
        categoryFilters: {},
        searchTerm: '',

        escapeHtml: function (str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        },

        getLocalDateStr: function (dateInput) {
            var d = dateInput ? new Date(dateInput) : new Date();
            if (isNaN(d.getTime())) return '';
            var y = d.getFullYear();
            var m = String(d.getMonth() + 1).padStart(2, '0');
            var day = String(d.getDate()).padStart(2, '0');
            return y + '-' + m + '-' + day;
        },

        isMeetingUpcoming: function (m) {
            var now = Date.now();
            if (m.dateStart) return new Date(m.dateStart).getTime() > now;
            return m.status === 'Planned';
        },

        formatDate: function (dateStr) {
            if (!dateStr) return 'N/A';
            try {
                if (this.getDateTime && typeof this.getDateTime().toDisplayDate === 'function') {
                    return this.getDateTime().toDisplayDate(dateStr);
                }
                var d = new Date(dateStr);
                if (isNaN(d.getTime())) return dateStr;
                return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            } catch (e) {
                return String(dateStr).substring(0, 10);
            }
        },

        formatCurrency: function (amount) {
            var val = Number(amount || 0);
            if (!this._currencyFormatter) {
                try {
                    this._currencyFormatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0
                    });
                } catch (e) {
                    this._currencyFormatter = null;
                }
            }
            return this._currencyFormatter ? this._currencyFormatter.format(val) : '$' + val.toLocaleString();
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
                                    <option value="all">All Time (Full History)</option>
                                    <option value="today">Today</option>
                                    <option value="week">This Week</option>
                                    <option value="month">This Month</option>
                                    <option value="won">Closed Won Deals</option>
                                </select>
                                <i class="fas fa-chevron-down select-arrow"></i>
                            </div>
                        </div>
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

            <style>
                :root {
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
                }

                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

                .analytics-bi-wrapper {
                    padding: 32px 28px;
                    background: var(--color-bg-main);
                    color: var(--color-text-main);
                    min-height: 100vh;
                    font-family: var(--font-family-base);
                }

                /* Header Layout */
                .header-bar {
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
                .header-bar::before {
                    content: "";
                    position: absolute;
                    top: 0; left: 0; width: 5px; height: 100%;
                    background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
                }
                .header-left { display: flex; flex-direction: column; gap: 4px; }
                .header-title-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
                .header-title { margin: 0; font-size: 22px; font-weight: 800; color: var(--color-text-main); display: flex; align-items: center; gap: 10px; tracking: -0.02em; }
                .header-icon { color: var(--color-primary-light); }
                .header-subtitle { margin: 0; font-size: 13px; color: var(--color-text-muted); font-weight: 500; }
                .header-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }

                .live-status-pill {
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
                .pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-primary-light); display: inline-block; animation: pulse 1.5s infinite; }

                /* Buttons */
                .btn {
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
                .btn:focus-visible { outline: 2px solid var(--color-primary-light); outline-offset: 2px; }
                .btn-primary {
                    background: linear-gradient(135deg, var(--color-primary) 0%, #007c9b 100%);
                    color: #ffffff;
                    box-shadow: 0 4px 14px rgba(0, 90, 112, 0.2);
                }
                .btn-primary:hover {
                    background: linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 164, 200, 0.3);
                }
                .btn-primary.is-loading .refresh-spinner { animation: spin 0.8s linear infinite; }
                .btn-secondary {
                    background: #ffffff;
                    color: var(--color-primary);
                    border: 1px solid var(--color-border);
                }
                .btn-secondary:hover {
                    background: var(--color-info-bg);
                    border-color: var(--color-primary-light);
                    color: var(--color-primary-light);
                    transform: translateY(-2px);
                }

                /* Tab Switcher */
                .tab-switcher-bar { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 20px; }
                .entity-tab-pill {
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
                .entity-tab-pill:hover { background: var(--color-info-bg); color: var(--color-primary); border-color: var(--color-primary-light); transform: translateY(-1px); }
                .entity-tab-pill.active {
                    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
                    color: #ffffff;
                    border-color: var(--color-primary);
                    box-shadow: 0 4px 16px rgba(0, 164, 200, 0.25);
                }

                /* Filters Bar with Styled Dropdowns */
                .filter-controls-bar {
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
                .filter-dropdowns-group { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
                .filter-dropdown-item { display: flex; align-items: center; gap: 8px; }
                .filter-dropdown-label { font-size: 12px; font-weight: 800; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; }
                
                .custom-select-wrapper { position: relative; display: inline-block; }
                .filter-select {
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
                .filter-select:hover {
                    border-color: var(--color-primary-light);
                    background: var(--color-info-bg);
                }
                .filter-select:focus {
                    border-color: var(--color-primary-light);
                    box-shadow: 0 0 0 3px rgba(0, 164, 200, 0.18);
                }
                .select-arrow {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    font-size: 11px;
                    color: var(--color-text-muted);
                }

                .search-group { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
                /* Active Filter Chips */
                .active-filters-container {
                    display: none;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .active-filters-label {
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .filter-chip {
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
                .chip-remove {
                    cursor: pointer;
                    font-size: 10px;
                    opacity: 0.7;
                    transition: opacity 0.15s, transform 0.15s;
                }
                .chip-remove:hover { opacity: 1; transform: scale(1.2); }
                .clear-all-filters-btn {
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
                .clear-all-filters-btn:hover { background: #fee2e2; transform: translateY(-1px); }
                @keyframes chipIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }

                /* Entrance Animations & Sticky Table Header */
                @keyframes cardIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                .kpi-card, .chart-box, .table-box { animation: cardIn 0.35s ease backwards; }
                .kpi-grid .kpi-card:nth-child(2) { animation-delay: 0.04s; }
                .kpi-grid .kpi-card:nth-child(3) { animation-delay: 0.08s; }
                .kpi-grid .kpi-card:nth-child(4) { animation-delay: 0.12s; }
                .kpi-grid .kpi-card:nth-child(5) { animation-delay: 0.16s; }
                .kpi-grid .kpi-card:nth-child(6) { animation-delay: 0.20s; }

                .table-responsive { max-height: 520px; overflow-y: auto; }
                .data-table thead .data-th { position: sticky; top: 0; z-index: 2; }
                .interactive-bar-item:focus-visible { outline: 2px solid var(--color-primary-light); outline-offset: 2px; }
                .kpi-card:hover .kpi-val { transform: scale(1.02); transition: transform 0.2s ease; }
                .search-input-wrapper { position: relative; display: flex; align-items: center; }
                .search-icon { position: absolute; left: 12px; font-size: 12px; color: var(--color-text-muted); pointer-events: none; }
                .search-input {
                    padding: 8px 16px 8px 34px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 13px; outline: none; width: 240px; transition: all 0.2s; background: #ffffff; font-family: var(--font-family-base);
                }
                .search-input:focus { border-color: var(--color-primary-light); box-shadow: 0 0 0 3px rgba(0,164,200,0.15); }

                /* Loader */
                .loader-container { text-align: center; padding: 70px 0; background: var(--color-card-bg); border-radius: 20px; border: 1px solid var(--color-border); box-shadow: 0 6px 20px -4px rgba(0,0,0,0.02); }
                .spinner-ring { width: 44px; height: 44px; border: 4px solid var(--color-primary-subtle); border-top-color: var(--color-primary-light); border-radius: 50%; display: inline-block; animation: spin 0.8s linear infinite; }
                .loader-text { margin-top: 16px; font-size: 14px; font-weight: 700; color: var(--color-primary); }

                /* Grids Layout */
                .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; margin-bottom: 28px; }
                .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px; margin-bottom: 28px; }
                .tables-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 20px; }

                /* KPI Card */
                .kpi-card {
                    background: var(--color-card-bg);
                    border: 1px solid var(--color-border);
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 4px 16px -4px rgba(0, 45, 60, 0.03);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    position: relative;
                    overflow: hidden;
                }
                .kpi-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%); }
                .kpi-card:hover { transform: translateY(-3px); border-color: var(--color-primary-light); box-shadow: 0 10px 24px -4px rgba(0, 164, 200, 0.15); }
                .kpi-header { display: flex; justify-content: space-between; align-items: center; }
                .kpi-title { font-size: 11px; font-weight: 800; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .kpi-badge { font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 10px; background: var(--color-primary-subtle); color: var(--color-primary); }
                .kpi-val { font-size: 24px; font-weight: 800; color: var(--color-primary); margin-top: 8px; tracking: -0.02em; }

                /* Chart Box */
                .chart-box { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 18px; padding: 22px; box-shadow: 0 4px 16px -4px rgba(0,0,0,0.02); transition: all 0.2s; }
                .chart-box:hover { box-shadow: 0 8px 24px -4px rgba(0, 90, 112, 0.06); }
                .chart-title { margin: 0 0 16px 0; font-size: 13px; font-weight: 800; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.05em; }
                .chart-subtitle { margin: 2px 0 0 0; font-size: 12px; color: var(--color-text-muted); }

                /* Table Box & Data Cells */
                .table-box { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 18px; padding: 22px; box-shadow: 0 4px 16px -4px rgba(0,0,0,0.02); overflow: hidden; }
                .table-title { margin: 0; font-size: 15px; font-weight: 800; color: var(--color-text-main); }
                .table-subtitle { margin: 2px 0 0 0; font-size: 12px; color: var(--color-text-muted); }
                .table-responsive {
                    overflow-x: auto;
                    margin-top: 16px;
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 transparent;
                }
                .table-responsive::-webkit-scrollbar { height: 4px; }
                .table-responsive::-webkit-scrollbar-track { background: transparent; }
                .table-responsive::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

                .data-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; white-space: nowrap; }
                .data-th { padding: 12px 14px; font-weight: 700; color: var(--color-text-muted); background: var(--color-bg-main); border-bottom: 2px solid var(--color-border); white-space: nowrap; }
                .data-row { transition: background 0.15s ease; border-bottom: 1px solid #f1f5f9; }
                .data-row:hover { background: var(--color-info-bg) !important; }
                .data-td { padding: 10px 14px; color: var(--color-text-main); vertical-align: middle; white-space: nowrap; }
                .data-td-bold { padding: 10px 14px; font-weight: 700; color: var(--color-text-main); vertical-align: middle; white-space: nowrap; }
                .data-td-muted { padding: 10px 14px; color: var(--color-text-muted); vertical-align: middle; white-space: nowrap; }
                .data-td-right { text-align: right; }
                .cell-truncate {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: inline-block;
                    vertical-align: middle;
                }

                /* Clean Badges (Replaces Emojis) */
                .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 800; line-height: 1; }
                .badge-primary { background: var(--color-primary-subtle); color: var(--color-primary); }
                .badge-success { background: var(--color-success-bg); color: var(--color-success); }
                .badge-warning { background: var(--color-warning-bg); color: var(--color-warning); }
                .badge-danger { background: var(--color-danger-bg); color: var(--color-danger); }
                .badge-info { background: var(--color-info-bg); color: var(--color-info); }
                .badge-purple { background: var(--color-purple-bg); color: var(--color-purple); }

                /* Table Action Button */
                .table-action-btn {
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
                .table-action-btn:hover { background: var(--color-primary); color: #ffffff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 90, 112, 0.3); }

                /* Interactive & Static Bar Items */
                .interactive-bar-item {
                    cursor: pointer;
                    padding: 8px 12px;
                    border-radius: 12px;
                    border: 1px solid transparent;
                    background: transparent;
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    margin-bottom: 6px;
                }
                .interactive-bar-item:hover {
                    background: var(--color-info-bg);
                    border-color: #bae6fd;
                    transform: translateX(3px);
                }
                .interactive-bar-item.is-selected {
                    background: var(--color-primary-subtle);
                    border-color: var(--color-primary-light);
                    box-shadow: 0 4px 14px rgba(0, 164, 200, 0.15);
                }
                .static-ratio-item {
                    padding: 8px 12px;
                    border-radius: 12px;
                    margin-bottom: 6px;
                }
                .bar-item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 12px;
                    margin-bottom: 6px;
                }
                .bar-item-label-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .bar-item-right-group {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .filter-icon-checked {
                    color: var(--color-primary-light);
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                .filter-icon-unchecked {
                    color: #cbd5e1;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                .interactive-bar-item.is-unchecked {
                    opacity: 0.55;
                    background: rgba(241, 245, 249, 0.5);
                }
                .interactive-bar-item.is-unchecked .bar-progress-fill {
                    background: #cbd5e1 !important;
                }
                .interactive-bar-item.is-unchecked .bar-item-name {
                    text-decoration: line-through;
                    color: var(--color-text-muted);
                }
                .bar-item-name {
                    font-weight: 700;
                    color: var(--color-text-main);
                }
                .bar-item-count {
                    font-weight: 800;
                    color: var(--color-primary);
                }
                .bar-item-pct {
                    font-weight: 600;
                    color: var(--color-text-muted);
                    font-size: 11px;
                }
                .bar-progress-track {
                    width: 100%;
                    height: 8px;
                    background: #f1f5f9;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid var(--color-border);
                }
                .bar-progress-fill {
                    height: 100%;
                    border-radius: 8px;
                    transition: width 0.4s ease;
                }

                /* Empty State Box */
                .empty-state-box { text-align: center; padding: 36px 20px; background: var(--color-bg-main); border-radius: 14px; border: 1px dashed var(--color-border); }
                .empty-state-icon { font-size: 28px; color: var(--color-text-muted); opacity: 0.5; margin-bottom: 8px; }
                .empty-state-title { font-size: 14px; font-weight: 700; color: var(--color-text-main); margin: 0 0 4px 0; }
                .empty-state-desc { font-size: 12px; color: var(--color-text-muted); margin: 0; }

                @media (max-width: 768px) {
                    .analytics-bi-wrapper { padding: 16px 12px; }
                    .header-bar { padding: 16px; flex-direction: column; align-items: flex-start; }
                    .header-actions { width: 100%; justify-content: flex-start; }
                    .search-input { width: 100%; }
                    .charts-grid, .tables-grid { grid-template-columns: 1fr; }
                }
            </style>
        `,

        events: {
            'click #btn-refresh-analytics': 'loadMetrics',
            'click #btn-export-csv': 'exportCSV',
            'click .entity-tab-pill': 'onEntityTabClick',
            'change #analytics-entity-select': 'onEntitySelectChange',
            'change #analytics-period-select': 'onPeriodSelectChange',
            'input #analytics-search-input': 'onSearchInput',
            'click .chip-remove': 'onChipRemove',
            'click .clear-all-filters-btn': 'clearCategoryFilter',
            'click .interactive-bar-item': 'onBarItemClick',
            'click .btn-view-record': 'onViewRecordClick'
        },

        rawLeads: [],
        rawOpps: [],
        rawAccounts: [],
        rawContacts: [],
        rawEmails: [],
        rawMeetings: [],
        _currencyFormatter: null,
        isSampled: false,

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

        onEntitySelectChange: function (e) {
            var tab = $(e.currentTarget).val();
            this.setEntityTab(tab);
        },

        onEntityTabClick: function (e) {
            var tab = $(e.currentTarget).data('tab');
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
            if (this.activeFilter === 'won') {
                this.clearCategoryFilter();
            }
            this.processAndRender();
        },

        onSearchInput: function (e) {
            this.searchTerm = $(e.currentTarget).val().toLowerCase().trim();
            this.processAndRender();
        },

        onBarItemClick: function (e) {
            var $t = $(e.currentTarget);
            var field = $t.data('field');
            var val = String($t.data('value'));
            var entity = $t.data('entity') || this.activeTab;
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
            var key = $chip.data('key');
            var val = String($chip.data('val'));
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

            function escapeCsv(val) {
                if (val === null || val === undefined) return '""';
                var str = String(val).replace(/"/g, '""');
                return '"' + str + '"';
            }

            // Tab-prefix trick prevents Excel from converting phone numbers to scientific notation (e.g., 1.1566E+10)
            function formatPhone(phone) {
                if (!phone) return '""';
                var p = String(phone).trim();
                return '"\t' + p.replace(/"/g, '""') + '"';
            }

            // Short YYYY-MM-DD date format prevents Excel cell overflow (##########)
            function formatDateOnly(dateStr) {
                if (!dateStr) return '""';
                var str = String(dateStr).substring(0, 10);
                return escapeCsv(str);
            }

            function formatMoney(val) {
                var num = Number(val || 0);
                return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
            }

            function formatBool(val) {
                return val ? 'Yes' : 'No';
            }

            function makeTitleRow(titleText, totalCols) {
                var cols = [escapeCsv(titleText)];
                for (var i = 1; i < totalCols; i++) {
                    cols.push('""');
                }
                return cols.join(',') + '\n';
            }

            var isOverview = (this.activeTab === 'all');

            // --- LEADS SECTION ---
            if (isOverview || this.activeTab === 'Lead') {
                if (isOverview) {
                    csv += makeTitleRow('=== LEADS DATA (' + leads.length + ' Records) ===', 14);
                }
                csv += [
                    'ID', 'Name', 'Status', 'Source', 'Industry',
                    'Opportunity Amount', 'Website', 'Email', 'Phone',
                    'Do Not Call', 'City', 'Country', 'Assigned User', 'Created Date'
                ].map(escapeCsv).join(',') + '\n';

                leads.forEach(function (l) {
                    csv += [
                        escapeCsv(l.id),
                        escapeCsv(l.name),
                        escapeCsv(l.status),
                        escapeCsv(l.source),
                        escapeCsv(l.industry),
                        formatMoney(l.opportunityAmount),
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
                    csv += makeTitleRow('=== OPPORTUNITIES DATA (' + opps.length + ' Records) ===', 10);
                }
                csv += [
                    'ID', 'Name', 'Account Name', 'Stage', 'Amount',
                    'Probability', 'Lead Source', 'Close Date', 'Assigned User', 'Created Date'
                ].map(escapeCsv).join(',') + '\n';

                opps.forEach(function (o) {
                    var prob = self.getOppProbability(o);
                    csv += [
                        escapeCsv(o.id),
                        escapeCsv(o.name),
                        escapeCsv(o.accountName),
                        escapeCsv(o.stage),
                        formatMoney(o.amount),
                        prob + '%',
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
                    var durationMin = m.duration ? Math.round(Number(m.duration) / 60) : 0;
                    csv += [
                        escapeCsv(m.id),
                        escapeCsv(m.name),
                        escapeCsv(m.status),
                        formatDateOnly(m.dateStart),
                        formatDateOnly(m.dateEnd),
                        durationMin,
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
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        },

        loadMetrics: function () {
            var self = this;
            var $btnRefresh = this.$el.find('#btn-refresh-analytics');
            $btnRefresh.addClass('is-loading');

            this.$el.find('#analytics-loader').show();
            this.$el.find('#analytics-content').hide();

            var leadSelect = 'name,firstName,lastName,salutationName,title,accountName,status,source,industry,opportunityAmount,website,emailAddress,phoneNumber,doNotCall,addressCity,addressState,addressCountry,assignedUserName,createdAt';
            var oppSelect = 'name,accountName,stage,amount,amountConverted,probability,leadSource,closeDate,assignedUserName,createdAt';
            var accountSelect = 'name,website,emailAddress,phoneNumber,type,industry,sicCode,billingAddressCity,billingAddressState,billingAddressCountry,shippingAddressCity,description,assignedUserName,createdAt';
            var contactSelect = 'name,firstName,lastName,salutationName,title,accountName,emailAddress,phoneNumber,doNotCall,addressCity,addressCountry,assignedUserName,createdAt';
            var emailSelect = 'name,status,dateSent,isRead,isReplied,fromString,assignedUserName,createdAt';
            var meetingSelect = 'name,status,dateStart,dateEnd,duration,isAllDay,parentName,parentType,assignedUserName,createdAt';

            function safeFetch(entity, fields) {
                return self.ajaxGetRequest(entity, fields).then(function (res) {
                    return (res && res.list) ? res.list : [];
                }).catch(function (err) {
                    console.warn('[Analytics BI] Fetch warning for ' + entity + ':', err);
                    return [];
                });
            }

            Promise.all([
                safeFetch('Lead', leadSelect),
                safeFetch('Opportunity', oppSelect),
                safeFetch('Account', accountSelect),
                safeFetch('Contact', contactSelect),
                safeFetch('Email', emailSelect),
                safeFetch('Meeting', meetingSelect)
            ]).then(function (results) {
                self.rawLeads = results[0];
                self.rawOpps = results[1];
                self.rawAccounts = results[2];
                self.rawContacts = results[3];
                self.rawEmails = results[4];
                self.rawMeetings = results[5];

                self.isSampled = [
                    self.rawLeads, self.rawOpps, self.rawAccounts,
                    self.rawContacts, self.rawEmails, self.rawMeetings
                ].some(function (list) { return list.length >= 200; });

                self.processAndRender();
                $btnRefresh.removeClass('is-loading');
                self.$el.find('#analytics-loader').hide();
                self.$el.find('#analytics-content').fadeIn(300);
            }).catch(function (err) {
                console.error('[Analytics BI] Error fetching metrics:', err);
                self.rawLeads = []; self.rawOpps = []; self.rawAccounts = [];
                self.rawContacts = []; self.rawEmails = []; self.rawMeetings = [];
                self.processAndRender();
                $btnRefresh.removeClass('is-loading');
                self.$el.find('#analytics-loader').hide();
                self.$el.find('#analytics-content').fadeIn(300);
            });
        },

        ajaxGetRequest: function (entity, selectFields) {
            var url = 'api/v1/' + entity + '?maxSize=200&orderBy=createdAt&order=desc';
            if (selectFields) {
                url += '&select=' + selectFields;
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

            var todayStr = this.getLocalDateStr();
            var now = new Date();
            var monday = new Date(now);
            monday.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
            var weekStartStr = this.getLocalDateStr(monday);
            var monthStartStr = todayStr.substring(0, 7) + '-01';

            function filterByDate(list, dateProp) {
                return list.filter(function (item) {
                    var d = item[dateProp] || item.createdAt;
                    if (!d) return false;
                    var dateStr = self.getLocalDateStr(d);

                    if (self.activeFilter === 'today') return dateStr === todayStr;
                    if (self.activeFilter === 'week') return dateStr >= weekStartStr && dateStr <= todayStr;
                    if (self.activeFilter === 'month') return dateStr >= monthStartStr;
                    return true;
                });
            }

            if (this.activeFilter !== 'all') {
                if (this.activeFilter === 'won') {
                    opps = opps.filter(function (o) { return o.stage === 'Closed Won'; });
                } else {
                    leads = filterByDate(leads, 'createdAt');
                    opps = filterByDate(opps, 'createdAt');
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

        getOppProbability: function (o) {
            if (o.probability !== undefined && o.probability !== null && o.probability !== '') {
                return Number(o.probability);
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

        renderDashboard: function (leads, opps, accounts, contacts, emails, meetings) {
            var self = this;
            var tab = this.activeTab;

            this.activeFilteredLeads = leads || [];
            this.activeFilteredOpps = opps || [];
            this.activeFilteredAccounts = accounts || [];
            this.activeFilteredContacts = contacts || [];
            this.activeFilteredEmails = emails || [];
            this.activeFilteredMeetings = meetings || [];

            // --- COMPUTATIONS ---
            var totalLeads = leads.length;
            var todayStr = this.getLocalDateStr();
            var newLeadsToday = leads.filter(function (l) { return l.createdAt && self.getLocalDateStr(l.createdAt) === todayStr; }).length;
            var potentialLeads = leads.filter(function (l) { return l.status === 'Assigned' || l.status === 'In Process'; }).length;
            var qualifiedLeads = leads.filter(function (l) { return l.status === 'In Process' || l.status === 'Converted'; }).length;
            var convertedLeads = leads.filter(function (l) { return l.status === 'Converted'; }).length;
            var lostLeads = leads.filter(function (l) { return l.status === 'Dead' || l.status === 'Recycled'; }).length;
            var convRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;
            var totalLeadOppAmount = leads.reduce(function (sum, l) { return sum + Number(l.opportunityAmount || 0); }, 0);

            var totalOpps = opps.length;
            var wonOpps = opps.filter(function (o) { return o.stage === 'Closed Won'; }).length;
            var openOpps = opps.filter(function (o) { return o.stage !== 'Closed Won' && o.stage !== 'Closed Lost'; }).length;
            var lostOpps = opps.filter(function (o) { return o.stage === 'Closed Lost'; }).length;
            var totalRevenue = opps.filter(function (o) { return o.stage === 'Closed Won'; }).reduce(function (sum, o) { return sum + Number(o.amount || 0); }, 0);
            var avgDeal = wonOpps > 0 ? Math.round(totalRevenue / wonOpps) : 0;
            var weightedPipeline = Math.round(opps.reduce(function (sum, o) {
                var prob = self.getOppProbability(o);
                return sum + (Number(o.amount || 0) * prob / 100);
            }, 0));
            var winRate = totalOpps > 0 ? ((wonOpps / totalOpps) * 100).toFixed(1) : 0;

            var totalAccounts = accounts.length;
            var customerAccounts = accounts.filter(function (a) { return a.type === 'Customer'; }).length;
            var partnerAccounts = accounts.filter(function (a) { return a.type === 'Partner'; }).length;
            var investorAccounts = accounts.filter(function (a) { return a.type === 'Investor' || a.type === 'Reseller'; }).length;
            var monthStartStr = todayStr.substring(0, 7) + '-01';
            var newAccountsMonth = accounts.filter(function (a) { return a.createdAt && self.getLocalDateStr(a.createdAt) >= monthStartStr; }).length;
            var accWithEmail = accounts.filter(function (a) { return a.emailAddress; }).length;
            var accWithPhone = accounts.filter(function (a) { return a.phoneNumber; }).length;

            var totalContacts = contacts.length;
            var withEmailCount = contacts.filter(function (c) { return c.emailAddress; }).length;
            var withPhoneCount = contacts.filter(function (c) { return c.phoneNumber; }).length;
            var dncContacts = contacts.filter(function (c) { return c.doNotCall; }).length;
            var emailPct = totalContacts > 0 ? Math.round((withEmailCount / totalContacts) * 100) : 0;
            var phonePct = totalContacts > 0 ? Math.round((withPhoneCount / totalContacts) * 100) : 0;
            var dncPct = totalContacts > 0 ? Math.round((dncContacts / totalContacts) * 100) : 0;
            var withAccountCount = contacts.filter(function (c) { return c.accountName; }).length;

            var totalEmails = emails.length;
            var sentEmails = emails.filter(function (e) { return e.status === 'Sent'; }).length;
            var draftEmails = emails.filter(function (e) { return e.status === 'Draft'; }).length;
            var failedEmails = emails.filter(function (e) { return e.status === 'Failed'; }).length;
            var repliedEmails = emails.filter(function (e) { return e.isReplied === true; }).length;
            var readEmails = emails.filter(function (e) { return e.isRead === true; }).length;
            var replyRate = totalEmails > 0 ? ((repliedEmails / totalEmails) * 100).toFixed(1) : 0;
            var readRate = totalEmails > 0 ? ((readEmails / totalEmails) * 100).toFixed(1) : 0;

            var totalMeetings = meetings.length;
            var heldMeetings = meetings.filter(function (m) { return m.status === 'Held'; }).length;
            var upcomingMeetings = meetings.filter(function (m) { return self.isMeetingUpcoming(m); }).length;
            var noShowMeetings = meetings.filter(function (m) { return m.status === 'Not Held'; }).length;
            var allDayMeetings = meetings.filter(function (m) { return m.isAllDay === true; }).length;
            var avgDurationSeconds = totalMeetings > 0 ? Math.round(meetings.reduce(function (s, m) { return s + Number(m.duration || 0); }, 0) / totalMeetings) : 0;
            var avgDurationMins = Math.round(avgDurationSeconds / 60);

            // --- RENDER KPIS ---
            var kpiHtml = '';
            var kpis = [];

            if (tab === 'all') {
                kpis = [
                    { title: 'Total Leads', val: totalLeads.toLocaleString(), color: 'var(--color-primary)', badge: 'Leads' },
                    { title: 'Total Revenue', val: self.formatCurrency(totalRevenue), color: 'var(--color-success)', badge: 'Won Opps' },
                    { title: 'Total Accounts', val: totalAccounts.toLocaleString(), color: 'var(--color-primary-light)', badge: 'Accounts' },
                    { title: 'Total Contacts', val: totalContacts.toLocaleString(), color: 'var(--color-info)', badge: 'Contacts' },
                    { title: 'Total Emails', val: totalEmails.toLocaleString(), color: 'var(--color-purple)', badge: 'Emails' },
                    { title: 'Total Meetings', val: totalMeetings.toLocaleString(), color: 'var(--color-warning)', badge: 'Meetings' }
                ];
            } else if (tab === 'Lead') {
                kpis = [
                    { title: 'Total Leads', val: totalLeads.toLocaleString(), color: 'var(--color-primary)', badge: 'Active' },
                    { title: 'New Leads Today', val: newLeadsToday.toLocaleString(), color: 'var(--color-primary-light)', badge: 'Today' },
                    { title: 'Potential Leads', val: potentialLeads.toLocaleString(), color: 'var(--color-info)', badge: 'Pipeline' },
                    { title: 'In Process + Converted', val: qualifiedLeads.toLocaleString(), color: 'var(--color-primary)', badge: 'Active Pipeline' },
                    { title: 'Converted Leads', val: convertedLeads.toLocaleString(), color: 'var(--color-success)', badge: 'Converted' },
                    { title: 'Lost / Dead', val: lostLeads.toLocaleString(), color: 'var(--color-danger)', badge: 'Closed' },
                    { title: 'Conversion Rate', val: convRate + '%', color: 'var(--color-purple)', badge: 'Ratio' },
                    { title: 'Lead Opp Value', val: self.formatCurrency(totalLeadOppAmount), color: 'var(--color-primary)', badge: 'Pipeline Value' }
                ];
            } else if (tab === 'Opportunity') {
                kpis = [
                    { title: 'Total Revenue', val: self.formatCurrency(totalRevenue), color: 'var(--color-success)', badge: 'Closed Won' },
                    { title: 'Total Opportunities', val: totalOpps.toLocaleString(), color: 'var(--color-primary-light)', badge: 'Total' },
                    { title: 'Won Deals', val: wonOpps.toLocaleString(), color: 'var(--color-success)', badge: 'Won' },
                    { title: 'Open Deals', val: openOpps.toLocaleString(), color: 'var(--color-info)', badge: 'Open' },
                    { title: 'Lost Deals', val: lostOpps.toLocaleString(), color: 'var(--color-danger)', badge: 'Lost' },
                    { title: 'Avg Deal Size', val: self.formatCurrency(avgDeal), color: 'var(--color-primary)', badge: 'Average' },
                    { title: 'Weighted Pipeline', val: self.formatCurrency(weightedPipeline), color: 'var(--color-purple)', badge: 'Weighted' },
                    { title: 'Win Rate', val: winRate + '%', color: 'var(--color-purple)', badge: 'Ratio' }
                ];
            } else if (tab === 'Account') {
                kpis = [
                    { title: 'Total Accounts', val: totalAccounts.toLocaleString(), color: 'var(--color-primary)', badge: 'Total' },
                    { title: 'Customers', val: customerAccounts.toLocaleString(), color: 'var(--color-success)', badge: 'Customers' },
                    { title: 'Partners', val: partnerAccounts.toLocaleString(), color: 'var(--color-info)', badge: 'Partners' },
                    { title: 'Investors / Resellers', val: investorAccounts.toLocaleString(), color: 'var(--color-primary)', badge: 'Investors' },
                    { title: 'New This Month', val: newAccountsMonth.toLocaleString(), color: 'var(--color-primary-light)', badge: 'Month' },
                    { title: 'With Email', val: accWithEmail.toLocaleString(), color: 'var(--color-purple)', badge: 'Email' },
                    { title: 'With Phone', val: accWithPhone.toLocaleString(), color: 'var(--color-warning)', badge: 'Phone' },
                    { title: 'With Website', val: accounts.filter(function (a) { return a.website; }).length.toLocaleString(), color: 'var(--color-info)', badge: 'Website' }
                ];
            } else if (tab === 'Contact') {
                kpis = [
                    { title: 'Total Contacts', val: totalContacts.toLocaleString(), color: 'var(--color-primary)', badge: 'Total' },
                    { title: 'With Email %', val: emailPct + '%', color: 'var(--color-primary-light)', badge: 'Coverage' },
                    { title: 'With Phone %', val: phonePct + '%', color: 'var(--color-info)', badge: 'Coverage' },
                    { title: 'Do Not Call Ratio', val: dncPct + '%', color: 'var(--color-danger)', badge: 'DNC' },
                    { title: 'With Account', val: withAccountCount.toLocaleString(), color: 'var(--color-success)', badge: 'Linked' },
                    { title: 'Complete Profiles', val: contacts.filter(function (c) { return c.emailAddress && c.phoneNumber; }).length.toLocaleString(), color: 'var(--color-purple)', badge: 'Full Data' }
                ];
            } else if (tab === 'Email') {
                kpis = [
                    { title: 'Total Emails', val: totalEmails.toLocaleString(), color: 'var(--color-primary)', badge: 'Total' },
                    { title: 'Sent Emails', val: sentEmails.toLocaleString(), color: 'var(--color-success)', badge: 'Outbound' },
                    { title: 'Draft Emails', val: draftEmails.toLocaleString(), color: 'var(--color-warning)', badge: 'Drafts' },
                    { title: 'Failed Emails', val: failedEmails.toLocaleString(), color: 'var(--color-danger)', badge: 'Failed' },
                    { title: 'Reply Rate', val: replyRate + '%', color: 'var(--color-purple)', badge: 'Replied' },
                    { title: 'Read Rate', val: readRate + '%', color: 'var(--color-primary-light)', badge: 'Read' }
                ];
            } else if (tab === 'Meeting') {
                kpis = [
                    { title: 'Total Meetings', val: totalMeetings.toLocaleString(), color: 'var(--color-primary)', badge: 'Total' },
                    { title: 'Held Meetings', val: heldMeetings.toLocaleString(), color: 'var(--color-success)', badge: 'Completed' },
                    { title: 'Upcoming / Planned', val: upcomingMeetings.toLocaleString(), color: 'var(--color-primary-light)', badge: 'Upcoming' },
                    { title: 'No-Show / Not Held', val: noShowMeetings.toLocaleString(), color: 'var(--color-danger)', badge: 'Missed' },
                    { title: 'All Day Meetings', val: allDayMeetings.toLocaleString(), color: 'var(--color-purple)', badge: 'All Day' },
                    { title: 'Avg Duration', val: avgDurationMins + ' min', color: 'var(--color-warning)', badge: 'Average' }
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

            this.$el.find('#sample-notice').remove();
            if (this.isSampled) {
                this.$el.find('#kpi-grid').before(
                    '<div id="sample-notice" style="margin-bottom:16px; padding:10px 16px; background:var(--color-warning-bg); ' +
                    'border:1px solid #fde68a; border-radius:12px; font-size:12px; font-weight:700; color:var(--color-warning);">' +
                    '<i class="fas fa-info-circle" style="margin-right:6px;"></i>' +
                    'Showing analytics based on the most recent 200 records per module. Totals may not reflect the full database.</div>'
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
                                <p class="chart-subtitle">Actual Closed Won revenue aggregated across the last 6 calendar months</p>
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
                        <h4 class="chart-title">Revenue Growth & Monthly Trend (Last 6 Months)</h4>
                        <div id="chart-revenue-trend-container" style="width: 100%; min-height: 200px;"></div>
                    </div>
                    <div class="chart-box"><h4 class="chart-title">Stage Funnel (All 6 Pipeline Stages)</h4><div id="chart-opps-stage"></div></div>
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
                this.renderCustomRatioChart('#chart-contacts-dnc', contacts, function(c){ return c.doNotCall ? 'Do Not Call' : 'Allow Call'; }, 'var(--color-danger)');
            } else if (tab === 'Email') {
                this.renderBarChart('#chart-emails-status', emails, 'status', 'status', 'var(--color-purple)', emailStatusOptions);
                this.renderCustomRatioChart('#chart-emails-sent-vs-received', emails, function(e){ return e.status === 'Sent' ? 'Sent' : 'Not Sent (Draft/Other)'; }, 'var(--color-primary-light)');
                this.renderCustomRatioChart('#chart-emails-replied', emails, function(e){ return e.isReplied ? 'Replied' : 'No Reply'; }, 'var(--color-success)');
                this.renderCustomRatioChart('#chart-emails-read', emails, function(e){ return e.isRead ? 'Read' : 'Unread'; }, 'var(--color-info)');
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
                var nameStr = self.escapeHtml(l.name || 'N/A');
                var accStr = self.escapeHtml(l.accountName || 'N/A');
                var statusStr = self.escapeHtml(l.status || 'New');
                var srcStr = self.escapeHtml(l.source || 'Direct');
                var indStr = self.escapeHtml(l.industry || 'N/A');
                var amountStr = self.formatCurrency(l.opportunityAmount || 0);
                var userStr = self.escapeHtml(l.assignedUserName || 'Unassigned');

                if (isOverview) {
                    leadsRows += `
                        <tr class="data-row">
                            <td class="data-td-bold" title="${nameStr}"><span class="cell-truncate" style="max-width: 140px;">${nameStr}</span></td>
                            <td class="data-td"><span class="badge badge-primary">${statusStr}</span></td>
                            <td class="data-td-muted" title="${srcStr}"><span class="cell-truncate" style="max-width: 100px;">${srcStr}</span></td>
                            <td class="data-td-bold" style="color: var(--color-success);">${amountStr}</td>
                            <td class="data-td data-td-right"><a href="#Lead/view/${l.id}" data-scope="Lead" data-id="${l.id}" class="table-action-btn btn-view-record">View</a></td>
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
                            <td class="data-td data-td-right"><a href="#Lead/view/${l.id}" data-scope="Lead" data-id="${l.id}" class="table-action-btn btn-view-record">View</a></td>
                        </tr>
                    `;
                }
            });
            if (!leads.length) leadsRows = renderEmptyRow(isOverview ? 5 : 8, 'No lead records match your search criteria.');

            // Opps Table
            var oppsRows = '';
            opps.slice(0, 10).forEach(function (o) {
                var nameStr = self.escapeHtml(o.name || 'N/A');
                var accStr = self.escapeHtml(o.accountName || 'N/A');
                var stageStr = self.escapeHtml(o.stage || 'Prospecting');
                var amountStr = self.formatCurrency(o.amount || 0);
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
                            <td class="data-td data-td-right"><a href="#Opportunity/view/${o.id}" data-scope="Opportunity" data-id="${o.id}" class="table-action-btn btn-view-record">View</a></td>
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
                            <td class="data-td data-td-right"><a href="#Opportunity/view/${o.id}" data-scope="Opportunity" data-id="${o.id}" class="table-action-btn btn-view-record">View</a></td>
                        </tr>
                    `;
                }
            });
            if (!opps.length) oppsRows = renderEmptyRow(isOverview ? 5 : 9, 'No opportunity deals found matching filter.');

            // Accounts Table
            var accountsRows = '';
            accounts.slice(0, 10).forEach(function (a) {
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
                        <td class="data-td data-td-right"><a href="#Account/view/${a.id}" data-scope="Account" data-id="${a.id}" class="table-action-btn btn-view-record">View</a></td>
                    </tr>
                `;
            });
            if (!accounts.length) accountsRows = renderEmptyRow(9, 'No account company records found.');

            // Contacts Table
            var contactsRows = '';
            contacts.slice(0, 10).forEach(function (c) {
                var nameStr = self.escapeHtml(c.name || 'N/A');
                var accStr = self.escapeHtml(c.accountName || 'N/A');
                var titleStr = self.escapeHtml(c.title || 'N/A');
                var emailStr = self.escapeHtml(c.emailAddress || 'N/A');
                var phoneStr = self.escapeHtml(c.phoneNumber || 'N/A');
                var dncBadge = c.doNotCall ? '<span class="badge badge-danger">DNC</span>' : '<span class="badge badge-success">OK</span>';
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
                        <td class="data-td data-td-right"><a href="#Contact/view/${c.id}" data-scope="Contact" data-id="${c.id}" class="table-action-btn btn-view-record">View</a></td>
                    </tr>
                `;
            });
            if (!contacts.length) contactsRows = renderEmptyRow(9, 'No contact person records found.');

            // Emails Table
            var emailsRows = '';
            emails.slice(0, 10).forEach(function (e) {
                var nameStr = self.escapeHtml(e.name || 'N/A');
                var statusStr = self.escapeHtml(e.status || 'Sent');
                var fromStr = self.escapeHtml(e.fromString || 'N/A');
                var dateStr = self.formatDate(e.dateSent || e.createdAt);
                var readBadge = e.isRead ? '<span class="badge badge-success">Read</span>' : '<span class="badge badge-warning">Unread</span>';
                var repliedBadge = e.isReplied
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
                        <td class="data-td data-td-right"><a href="#Email/view/${e.id}" data-scope="Email" data-id="${e.id}" class="table-action-btn btn-view-record">View</a></td>
                    </tr>
                `;
            });
            if (!emails.length) emailsRows = renderEmptyRow(8, 'No email activity records found.');

            // Meetings Table
            var meetingsRows = '';
            meetings.slice(0, 10).forEach(function (m) {
                var nameStr = self.escapeHtml(m.name || 'N/A');
                var statusStr = self.escapeHtml(m.status || 'Planned');
                var parentStr = m.parentName ? self.escapeHtml(m.parentType + ': ' + m.parentName) : 'N/A';
                var dateStartStr = self.formatDate(m.dateStart);
                var dateEndStr = self.formatDate(m.dateEnd);
                var durMins = Math.round(Number(m.duration || 0) / 60);
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
                        <td class="data-td data-td-right"><a href="#Meeting/view/${m.id}" data-scope="Meeting" data-id="${m.id}" class="table-action-btn btn-view-record">View</a></td>
                    </tr>
                `;
            });
            if (!meetings.length) meetingsRows = renderEmptyRow(8, 'No scheduled meeting records found.');

            if (tab === 'all') {
                html += renderTableBox('Recent Leads', 'Latest lead records', '<th class="data-th">Name</th><th class="data-th">Status</th><th class="data-th">Source</th><th class="data-th">Opp Amount</th><th class="data-th data-td-right">Action</th>', leadsRows);
                html += renderTableBox('Recent Opportunities', 'Active deal values', '<th class="data-th">Name</th><th class="data-th">Stage</th><th class="data-th">Amount</th><th class="data-th">Close Date</th><th class="data-th data-td-right">Action</th>', oppsRows);
            } else if (tab === 'Lead') {
                html += renderTableBox('Leads Directory', 'Complete lead record list', '<th class="data-th">Name</th><th class="data-th">Account</th><th class="data-th">Status</th><th class="data-th">Source</th><th class="data-th">Industry</th><th class="data-th">Opp Amount</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', leadsRows);
            } else if (tab === 'Opportunity') {
                html += renderTableBox('Opportunities Pipeline', 'Deals in progress & won', '<th class="data-th">Name</th><th class="data-th">Account</th><th class="data-th">Stage</th><th class="data-th">Amount</th><th class="data-th">Prob</th><th class="data-th">Source</th><th class="data-th">Close Date</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', oppsRows);
            } else if (tab === 'Account') {
                html += renderTableBox('Accounts Directory', 'Companies & Partners', '<th class="data-th">Name</th><th class="data-th">Type</th><th class="data-th">Industry</th><th class="data-th">Email</th><th class="data-th">Phone</th><th class="data-th">City</th><th class="data-th">Country</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', accountsRows);
            } else if (tab === 'Contact') {
                html += renderTableBox('Contacts Directory', 'Client People & Roles', '<th class="data-th">Name</th><th class="data-th">Account</th><th class="data-th">Title</th><th class="data-th">Email</th><th class="data-th">Phone</th><th class="data-th">DNC</th><th class="data-th">Country</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', contactsRows);
            } else if (tab === 'Email') {
                html += renderTableBox('Emails Log', 'Communication history', '<th class="data-th">Subject</th><th class="data-th">Status</th><th class="data-th">From</th><th class="data-th">Date</th><th class="data-th">Read</th><th class="data-th">Replied</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', emailsRows);
            } else if (tab === 'Meeting') {
                html += renderTableBox('Meetings Schedule', 'Events & Appointments', '<th class="data-th">Name</th><th class="data-th">Status</th><th class="data-th">Parent Record</th><th class="data-th">Date Start</th><th class="data-th">Date End</th><th class="data-th">Duration</th><th class="data-th">Assigned</th><th class="data-th data-td-right">Action</th>', meetingsRows);
            }

            this.$el.find('#tables-wrapper').html(html);
        },

        renderSvgAreaChart: function (selector, opps) {
            var self = this;
            var months = [];
            var now = new Date();

            for (var i = 5; i >= 0; i--) {
                var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                var monthKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
                var monthLabel = d.toLocaleString('en-US', { month: 'short' });
                months.push({ key: monthKey, label: monthLabel, amount: 0 });
            }

            opps.filter(function (o) { return o.stage === 'Closed Won'; }).forEach(function (o) {
                var dateStr = o.closeDate || o.createdAt;
                if (dateStr) {
                    var mKey = String(dateStr).substring(0, 7);
                    months.forEach(function (m) { if (m.key === mKey) m.amount += Number(o.amount || 0); });
                }
            });

            var amounts = months.map(function (m) { return m.amount; });
            var max = Math.max.apply(null, amounts) || 1000;

            // Padding داخلي عشان النصوص ماتتقصش
            var padL = 60, padR = 24, padT = 20, padB = 24;
            var width = 560, height = 200;
            var plotW = width - padL - padR;
            var plotH = height - padT - padB;

            function xAt(idx) { return padL + (idx / (amounts.length - 1)) * plotW; }
            function yAt(amt) { return padT + (1 - amt / max) * plotH; }

            var pathD = "M " + padL + " " + (padT + plotH) + " ";
            amounts.forEach(function (amt, idx) { pathD += "L " + xAt(idx) + " " + yAt(amt) + " "; });
            var linePath = pathD; // نسخة الخط قبل ما نقفل المساحة
            pathD += "L " + (padL + plotW) + " " + (padT + plotH) + " Z";

            // Gridlines + labels على المحور الرأسي
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

            // النقاط + الـ labels مع محاذاة ذكية للأطراف
            var dotsHtml = '';
            amounts.forEach(function (amt, idx) {
                var x = xAt(idx), y = yAt(amt);
                var anchor = idx === 0 ? 'start' : (idx === amounts.length - 1 ? 'end' : 'middle');
                var labelY = Math.max(y - 9, padT + 2); // منع النص من الخروج فوق منطقة الرسم
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
            list.forEach(function (item) {
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

            var html = '';
            Object.keys(counts).forEach(function (key) {
                var cnt = counts[key];
                var pct = Math.round((cnt / sumCounts) * 100);
                var escapedLabel = self.escapeHtml(key);
                var storedVal = (key === EMPTY_LABEL) ? '__EMPTY__' : key;
                var escapedAttr = self.escapeHtml(storedVal);

                var excludedEntry = activeFilterMap ? activeFilterMap[storedVal] : null;
                var isChecked = !(excludedEntry && excludedEntry.excluded);

                var iconHtml = isChecked
                    ? '<i class="fas fa-check-square filter-icon-checked"></i>'
                    : '<i class="far fa-square filter-icon-unchecked"></i>';

                var itemClass = isChecked ? 'is-checked' : 'is-unchecked';

                html += `
                    <div class="interactive-bar-item ${itemClass}" data-entity="${scope}" data-field="${fieldName}" data-value="${escapedAttr}">
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
            list.forEach(function (item) {
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
