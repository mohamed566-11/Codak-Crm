{{#if notificationList}}
<div class="codak-notifications-wrapper">
    {{#each notificationList}}
        {{#if isGitDeploy}}
        <!-- CodakCRM Smart Upgrade Center Card -->
        <div class="codak-upgrade-card {{#unless isGitUpdateAvailable}}is-up-to-date{{/unless}}" data-id="{{id}}">
            <div class="codak-upgrade-layout">
                <!-- Square Icon Box on Left -->
                <div class="codak-icon-box">
                    {{#if isGitUpdateAvailable}}
                    <i class="fa fa-refresh"></i>
                    {{else}}
                    <i class="fa fa-check"></i>
                    {{/if}}
                </div>

                <!-- Content Area -->
                <div class="codak-content-area">
                    <div class="codak-content-top">
                        <div class="codak-top-left">
                            {{#if isGitUpdateAvailable}}
                            <div class="codak-badge-status update-available">
                                <span class="status-dot"></span>
                                <span class="status-text">UPDATE AVAILABLE</span>
                            </div>
                            <h3 class="codak-card-title">Codak CRM Update Available</h3>
                            <p class="codak-card-subtitle">A new release is ready to be installed safely.</p>
                            {{else}}
                            <div class="codak-badge-status up-to-date">
                                <span class="status-dot"></span>
                                <span class="status-text">SYSTEM UP TO DATE</span>
                            </div>
                            <h3 class="codak-card-title">Codak CRM Up to Date</h3>
                            <p class="codak-card-subtitle">All updates and security patches are installed and running optimally.</p>
                            {{/if}}
                        </div>

                        <div class="codak-version-group">
                            {{#if currentVersion}}<span class="pill-version old">v{{currentVersion}}</span>{{/if}}
                            {{#if isGitUpdateAvailable}}
                                {{#if hasNewAppVersion}}
                                <span class="version-arrow">→</span>
                                <span class="pill-version new">v{{latestVersion}}</span>
                                {{/if}}
                            {{/if}}
                        </div>
                    </div>

                    {{#if isGitUpdateAvailable}}
                    <!-- Actions Row -->
                    <div class="codak-actions-row">
                        <button type="button" class="btn btn-codak-primary" data-action="runGitDeployUpgrade">
                            <i class="fa fa-rocket"></i>
                            <span>Upgrade to {{#if latestVersion}}v{{latestVersion}}{{else}}latest version{{/if}}</span>
                            <i class="fa fa-angle-right icon-arrow"></i>
                        </button>
                    </div>

                    <!-- Interactive Stepper & Progress Bar (Hidden initially) -->
                    <div class="codak-progress-container hidden" id="codak-deploy-progress">
                        <div class="codak-progress-header">
                            <span class="status-label"><i class="fa fa-spin fa-spinner"></i> <span id="codak-status-text">Upgrading system...</span></span>
                            <span class="percentage-label" id="codak-progress-percent">0%</span>
                        </div>
                        <div class="codak-progress-track">
                            <div class="codak-progress-bar" id="codak-progress-fill" style="width: 0%;"></div>
                        </div>

                        <div class="codak-steps-list">
                            <div class="codak-step-item" data-step="gitPull">
                                <span class="step-icon"><i class="fa fa-circle-o"></i></span>
                                <span class="step-text">1. Fetching latest updates (git pull)</span>
                            </div>
                            <div class="codak-step-item" data-step="rebuild">
                                <span class="step-icon"><i class="fa fa-circle-o"></i></span>
                                <span class="step-text">2. Rebuilding system assets (rebuild)</span>
                            </div>
                            <div class="codak-step-item" data-step="clearCache">
                                <span class="step-icon"><i class="fa fa-circle-o"></i></span>
                                <span class="step-text">3. Clearing application cache (clear-cache)</span>
                            </div>
                            <div class="codak-step-item" data-step="updateTimestamp">
                                <span class="step-icon"><i class="fa fa-circle-o"></i></span>
                                <span class="step-text">4. Updating application timestamp</span>
                            </div>
                        </div>
                    </div>
                    {{/if}}
                </div>
            </div>
        </div>
        {{else}}
        <!-- Standard Admin Notification Fallback -->
        <div class="panel panel-danger margin-bottom-sm">
            <div class="panel-body">
                <div class="list-container">
                    <div class="list-group list list-expanded">
                        <div data-id="{{id}}" class="list-group-item notification-item">
                            <div class="text-danger complex-text">{{complexText message}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {{/if}}
    {{/each}}
</div>
{{/if}}
