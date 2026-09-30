define('custom:views/admin/analytics-dashboard-settings', ['view'], function (Dep) {
    return Dep.extend({
        templateContent: `
            <div class="analytics-admin-settings-wrapper">
                <!-- Header Control Bar -->
                <div class="settings-header-bar">
                    <div class="header-left">
                        <div class="header-title-row">
                            <h2 class="header-title">
                                <i class="fas fa-chart-line header-icon"></i>
                                <span>Analytics Dashboard Visibility Settings</span>
                            </h2>
                            <span class="live-status-pill">
                                <i class="fas fa-shield-alt"></i> Admin Control Center
                            </span>
                        </div>
                        <p class="header-subtitle">Control global section visibility across the Analytics Dashboard. Enable or disable sections dynamically.</p>
                    </div>
                    <div class="header-actions">
                        <button id="btn-select-all" class="btn btn-secondary">
                            <i class="fas fa-check-double"></i> Select All
                        </button>
                        <button id="btn-deselect-all" class="btn btn-secondary">
                            <i class="fas fa-times"></i> Deselect All
                        </button>
                        <button id="btn-save-analytics-settings" class="btn btn-primary">
                            <i class="fas fa-save btn-icon-save"></i> Save Settings
                        </button>
                    </div>
                </div>

                <!-- Alert Notice -->
                <div class="settings-alert-info">
                    <i class="fas fa-info-circle alert-icon"></i>
                    <span>Changes made here apply globally across the Analytics Dashboard. Users with individual restrictions will only see sections allowed by both Global and User settings.</span>
                </div>

                <!-- Sections Grid -->
                <div class="sections-grid">
                    <!-- Overview Card -->
                    <div class="section-card" data-section="overview">
                        <div class="card-header">
                            <div class="card-icon-title">
                                <div class="icon-box overview-icon"><i class="fas fa-th-large"></i></div>
                                <div>
                                    <h4 class="card-title">Overview</h4>
                                    <span class="card-subtitle">النظرة العامة</span>
                                </div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" class="section-checkbox" data-section="overview" checked />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <p class="card-desc">Main multi-entity business intelligence overview & aggregate KPI summary across all CRM modules.</p>
                        <div class="card-footer">
                            <span class="status-badge status-visible"><i class="fas fa-eye"></i> Visible</span>
                            <span class="section-tag">Tab & Module Overview</span>
                        </div>
                    </div>

                    <!-- Leads Card -->
                    <div class="section-card" data-section="leads">
                        <div class="card-header">
                            <div class="card-icon-title">
                                <div class="icon-box leads-icon"><i class="fas fa-user-tag"></i></div>
                                <div>
                                    <h4 class="card-title">Leads</h4>
                                    <span class="card-subtitle">العملاء المحتملين</span>
                                </div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" class="section-checkbox" data-section="leads" checked />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <p class="card-desc">Lead pipeline performance, status distribution, lead source breakdown, and conversion rates.</p>
                        <div class="card-footer">
                            <span class="status-badge status-visible"><i class="fas fa-eye"></i> Visible</span>
                            <span class="section-tag">Lead Module</span>
                        </div>
                    </div>

                    <!-- Opportunities Card -->
                    <div class="section-card" data-section="opportunities">
                        <div class="card-header">
                            <div class="card-icon-title">
                                <div class="icon-box opps-icon"><i class="fas fa-briefcase"></i></div>
                                <div>
                                    <h4 class="card-title">Opportunities</h4>
                                    <span class="card-subtitle">الصفقات والفرص</span>
                                </div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" class="section-checkbox" data-section="opportunities" checked />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <p class="card-desc">Revenue growth trends, stage funnels, deal values, win rates, and weighted pipeline analytics.</p>
                        <div class="card-footer">
                            <span class="status-badge status-visible"><i class="fas fa-eye"></i> Visible</span>
                            <span class="section-tag">Opportunity Module</span>
                        </div>
                    </div>

                    <!-- Accounts Card -->
                    <div class="section-card" data-section="accounts">
                        <div class="card-header">
                            <div class="card-icon-title">
                                <div class="icon-box accounts-icon"><i class="fas fa-building"></i></div>
                                <div>
                                    <h4 class="card-title">Accounts</h4>
                                    <span class="card-subtitle">الحسابات والشركات</span>
                                </div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" class="section-checkbox" data-section="accounts" checked />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <p class="card-desc">Account categorizations, industry distributions, billing geographic breakdown, and contact availability.</p>
                        <div class="card-footer">
                            <span class="status-badge status-visible"><i class="fas fa-eye"></i> Visible</span>
                            <span class="section-tag">Account Module</span>
                        </div>
                    </div>

                    <!-- Contacts Card -->
                    <div class="section-card" data-section="contacts">
                        <div class="card-header">
                            <div class="card-icon-title">
                                <div class="icon-box contacts-icon"><i class="fas fa-address-book"></i></div>
                                <div>
                                    <h4 class="card-title">Contacts</h4>
                                    <span class="card-subtitle">جهات الاتصال</span>
                                </div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" class="section-checkbox" data-section="contacts" checked />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <p class="card-desc">Contact linkages to accounts, email/phone coverage ratios, profile completeness, and Do Not Call ratios.</p>
                        <div class="card-footer">
                            <span class="status-badge status-visible"><i class="fas fa-eye"></i> Visible</span>
                            <span class="section-tag">Contact Module</span>
                        </div>
                    </div>

                    <!-- Emails Card -->
                    <div class="section-card" data-section="emails">
                        <div class="card-header">
                            <div class="card-icon-title">
                                <div class="icon-box emails-icon"><i class="fas fa-envelope"></i></div>
                                <div>
                                    <h4 class="card-title">Emails</h4>
                                    <span class="card-subtitle">البريد الإلكتروني</span>
                                </div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" class="section-checkbox" data-section="emails" checked />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <p class="card-desc">Email activity breakdown, sent vs draft ratios, reply tracking rates, and read status statistics.</p>
                        <div class="card-footer">
                            <span class="status-badge status-visible"><i class="fas fa-eye"></i> Visible</span>
                            <span class="section-tag">Email Module</span>
                        </div>
                    </div>

                    <!-- Meetings Card -->
                    <div class="section-card" data-section="meetings">
                        <div class="card-header">
                            <div class="card-icon-title">
                                <div class="icon-box meetings-icon"><i class="fas fa-calendar-alt"></i></div>
                                <div>
                                    <h4 class="card-title">Meetings</h4>
                                    <span class="card-subtitle">الاجتماعات</span>
                                </div>
                            </div>
                            <label class="toggle-switch">
                                <input type="checkbox" class="section-checkbox" data-section="meetings" checked />
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <p class="card-desc">Meeting status metrics (Held, Planned, Not Held), upcoming schedule tracking, and average duration analysis.</p>
                        <div class="card-footer">
                            <span class="status-badge status-visible"><i class="fas fa-eye"></i> Visible</span>
                            <span class="section-tag">Meeting Module</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .analytics-admin-settings-wrapper {
                    --color-primary: #005a70;
                    --color-primary-hover: #004557;
                    --color-primary-light: #00a4c8;
                    --color-primary-subtle: #e0f2fe;
                    --color-success: #059669;
                    --color-success-bg: #ecfdf5;
                    --color-danger: #dc2626;
                    --color-danger-bg: #fef2f2;
                    --color-bg-main: #f8fafc;
                    --color-card-bg: #ffffff;
                    --color-text-main: #0f172a;
                    --color-text-muted: #64748b;
                    --color-border: #e2e8f0;

                    padding: 24px 20px;
                    background: var(--color-bg-main);
                    min-height: 85vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .analytics-admin-settings-wrapper .settings-header-bar {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    padding: 22px 28px;
                    background: var(--color-card-bg);
                    border: 1px solid var(--color-border);
                    border-radius: 18px;
                    margin-bottom: 20px;
                    box-shadow: 0 4px 20px -4px rgba(0, 45, 60, 0.04);
                    position: relative;
                    overflow: hidden;
                }
                .analytics-admin-settings-wrapper .settings-header-bar::before {
                    content: "";
                    position: absolute;
                    top: 0; left: 0; width: 5px; height: 100%;
                    background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
                }
                .analytics-admin-settings-wrapper .header-title-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
                .analytics-admin-settings-wrapper .header-title { margin: 0; font-size: 20px; font-weight: 800; color: var(--color-text-main); display: flex; align-items: center; gap: 10px; }
                .analytics-admin-settings-wrapper .header-icon { color: var(--color-primary-light); }
                .analytics-admin-settings-wrapper .header-subtitle { margin: 4px 0 0 0; font-size: 13px; color: var(--color-text-muted); font-weight: 500; }
                .analytics-admin-settings-wrapper .header-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }

                .analytics-admin-settings-wrapper .live-status-pill {
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 12px;
                    background: var(--color-primary-subtle);
                    color: var(--color-primary);
                    border-radius: 20px;
                    border: 1px solid #bae6fd;
                }

                .analytics-admin-settings-wrapper .btn {
                    padding: 9px 18px;
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
                .analytics-admin-settings-wrapper .btn-primary {
                    background: linear-gradient(135deg, var(--color-primary) 0%, #007c9b 100%);
                    color: #ffffff;
                    box-shadow: 0 4px 14px rgba(0, 90, 112, 0.2);
                }
                .analytics-admin-settings-wrapper .btn-primary:hover {
                    background: linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 164, 200, 0.3);
                }
                .analytics-admin-settings-wrapper .btn-secondary {
                    background: #ffffff;
                    color: var(--color-text-main);
                    border: 1px solid var(--color-border);
                }
                .analytics-admin-settings-wrapper .btn-secondary:hover {
                    background: var(--color-primary-subtle);
                    color: var(--color-primary);
                    border-color: var(--color-primary-light);
                    transform: translateY(-1px);
                }

                .analytics-admin-settings-wrapper .settings-alert-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 20px;
                    background: #f0f9ff;
                    border: 1px solid #bae6fd;
                    border-radius: 14px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #0369a1;
                    margin-bottom: 24px;
                }
                .analytics-admin-settings-wrapper .alert-icon { font-size: 16px; color: var(--color-primary-light); }

                /* Grid Layout */
                .analytics-admin-settings-wrapper .sections-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 20px;
                }

                /* Section Card */
                .analytics-admin-settings-wrapper .section-card {
                    background: var(--color-card-bg);
                    border: 1px solid var(--color-border);
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 4px 16px -4px rgba(0,0,0,0.02);
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                }
                .analytics-admin-settings-wrapper .section-card:hover {
                    border-color: var(--color-primary-light);
                    transform: translateY(-3px);
                    box-shadow: 0 10px 24px -4px rgba(0, 164, 200, 0.12);
                }
                .analytics-admin-settings-wrapper .section-card.is-hidden {
                    opacity: 0.75;
                    background: #f8fafc;
                    border-color: #cbd5e1;
                }

                .analytics-admin-settings-wrapper .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .analytics-admin-settings-wrapper .card-icon-title { display: flex; align-items: center; gap: 12px; }
                .analytics-admin-settings-wrapper .icon-box {
                    width: 42px; height: 42px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 18px; color: #ffffff;
                }
                .analytics-admin-settings-wrapper .overview-icon { background: linear-gradient(135deg, #005a70, #00a4c8); }
                .analytics-admin-settings-wrapper .leads-icon { background: linear-gradient(135deg, #0284c7, #38bdf8); }
                .analytics-admin-settings-wrapper .opps-icon { background: linear-gradient(135deg, #059669, #34d399); }
                .analytics-admin-settings-wrapper .accounts-icon { background: linear-gradient(135deg, #2563eb, #60a5fa); }
                .analytics-admin-settings-wrapper .contacts-icon { background: linear-gradient(135deg, #7c3aed, #a78bfa); }
                .analytics-admin-settings-wrapper .emails-icon { background: linear-gradient(135deg, #db2777, #f472b6); }
                .analytics-admin-settings-wrapper .meetings-icon { background: linear-gradient(135deg, #d97706, #fbbf24); }

                .analytics-admin-settings-wrapper .card-title { margin: 0; font-size: 16px; font-weight: 800; color: var(--color-text-main); }
                .analytics-admin-settings-wrapper .card-subtitle { font-size: 12px; color: var(--color-text-muted); font-weight: 600; }
                .analytics-admin-settings-wrapper .card-desc { font-size: 13px; color: var(--color-text-muted); margin: 0 0 16px 0; line-height: 1.5; }

                .analytics-admin-settings-wrapper .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 12px;
                    border-top: 1px dashed var(--color-border);
                }
                .analytics-admin-settings-wrapper .status-badge {
                    font-size: 11px;
                    font-weight: 800;
                    padding: 4px 10px;
                    border-radius: 12px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .analytics-admin-settings-wrapper .status-visible { background: var(--color-success-bg); color: var(--color-success); border: 1px solid #a7f3d0; }
                .analytics-admin-settings-wrapper .status-hidden { background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid #fecaca; }
                .analytics-admin-settings-wrapper .section-tag { font-size: 11px; font-weight: 700; color: var(--color-text-muted); background: #f1f5f9; padding: 3px 8px; border-radius: 8px; }

                /* Toggle Switch */
                .analytics-admin-settings-wrapper .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 48px;
                    height: 26px;
                    margin: 0;
                    cursor: pointer;
                }
                .analytics-admin-settings-wrapper .toggle-switch input { opacity: 0; width: 0; height: 0; }
                .analytics-admin-settings-wrapper .toggle-slider {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-color: #cbd5e1;
                    transition: .3s cubic-bezier(0.16, 1, 0.3, 1);
                    border-radius: 26px;
                }
                .analytics-admin-settings-wrapper .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 20px; width: 20px;
                    left: 3px; bottom: 3px;
                    background-color: white;
                    transition: .3s cubic-bezier(0.16, 1, 0.3, 1);
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .analytics-admin-settings-wrapper .toggle-switch input:checked + .toggle-slider {
                    background-color: var(--color-success);
                }
                .analytics-admin-settings-wrapper .toggle-switch input:checked + .toggle-slider:before {
                    transform: translateX(22px);
                }

                @media (max-width: 600px) {
                    .analytics-admin-settings-wrapper .settings-header-bar { padding: 16px; flex-direction: column; align-items: flex-start; }
                    .analytics-admin-settings-wrapper .header-actions { width: 100%; }
                    .analytics-admin-settings-wrapper .sections-grid { grid-template-columns: 1fr; }
                }
            </style>
        `,

        events: {
            'click #btn-save-analytics-settings': 'saveSettings',
            'click #btn-select-all': 'selectAll',
            'click #btn-deselect-all': 'deselectAll',
            'change .section-checkbox': 'onCheckboxChange'
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.loadCurrentSettings();
        },

        loadCurrentSettings: function () {
            var allSections = ['overview', 'leads', 'opportunities', 'accounts', 'contacts', 'emails', 'meetings'];
            var allowed = this.getConfig().get('cAllowedDashboardSections');
            
            if (!Array.isArray(allowed)) {
                allowed = allSections;
            }

            var self = this;
            allSections.forEach(function (sec) {
                var isChecked = allowed.indexOf(sec) !== -1;
                var $chk = self.$el.find('.section-checkbox[data-section="' + sec + '"]');
                $chk.prop('checked', isChecked);
                self.updateCardUI(sec, isChecked);
            });
        },

        onCheckboxChange: function (e) {
            var $chk = $(e.currentTarget);
            var sec = $chk.attr('data-section');
            var isChecked = $chk.is(':checked');
            this.updateCardUI(sec, isChecked);
        },

        updateCardUI: function (sec, isChecked) {
            var $card = this.$el.find('.section-card[data-section="' + sec + '"]');
            var $badge = $card.find('.status-badge');

            if (isChecked) {
                $card.removeClass('is-hidden');
                $badge.removeClass('status-hidden').addClass('status-visible').html('<i class="fas fa-eye"></i> Visible');
            } else {
                $card.addClass('is-hidden');
                $badge.removeClass('status-visible').addClass('status-hidden').html('<i class="fas fa-eye-slash"></i> Hidden');
            }
        },

        selectAll: function () {
            var self = this;
            this.$el.find('.section-checkbox').each(function () {
                $(this).prop('checked', true);
                var sec = $(this).attr('data-section');
                self.updateCardUI(sec, true);
            });
        },

        deselectAll: function () {
            var self = this;
            this.$el.find('.section-checkbox').each(function () {
                $(this).prop('checked', false);
                var sec = $(this).attr('data-section');
                self.updateCardUI(sec, false);
            });
        },

        saveSettings: function () {
            var self = this;
            var selected = [];
            this.$el.find('.section-checkbox:checked').each(function () {
                selected.push($(this).attr('data-section'));
            });

            var $btn = this.$el.find('#btn-save-analytics-settings');
            $btn.prop('disabled', true).find('.btn-icon-save').attr('class', 'fas fa-spinner fa-spin');

            Espo.Ajax.putRequest('Settings', {
                cAllowedDashboardSections: selected
            }).then(function (res) {
                $btn.prop('disabled', false).find('.btn-icon-save').attr('class', 'fas fa-save');
                
                // Update in-memory config model
                self.getConfig().set('cAllowedDashboardSections', selected);

                if (Espo.Ui && typeof Espo.Ui.notify === 'function') {
                    Espo.Ui.notify('Analytics Dashboard settings saved successfully', 'success');
                } else {
                    alert('Analytics Dashboard settings saved successfully!');
                }
            }).catch(function (err) {
                $btn.prop('disabled', false).find('.btn-icon-save').attr('class', 'fas fa-save');
                console.error('[Analytics BI] Error saving settings:', err);
                if (Espo.Ui && typeof Espo.Ui.notify === 'function') {
                    Espo.Ui.notify('Error saving settings', 'error');
                } else {
                    alert('Error saving settings!');
                }
            });
        }
    });
});
