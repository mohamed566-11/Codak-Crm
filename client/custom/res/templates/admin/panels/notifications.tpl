{{#if notificationList}}
<div class="codak-notifications-wrapper">
    {{#each notificationList}}
        {{#if isGitDeploy}}
        <!-- CodakCRM Smart Upgrade Center Card -->
        <div class="codak-upgrade-card" data-id="{{id}}">
            <div class="codak-upgrade-header">
                <div class="codak-badge-pulse">
                    <span class="pulse-dot"></span>
                    <span class="badge-text">⚡ CODAK CRM SMART UPDATE CENTER</span>
                </div>
                <div class="codak-version-pills">
                    <span class="pill-old">v{{currentVersion}}</span>
                    <span class="pill-arrow">➔</span>
                    <span class="pill-new">v{{latestVersion}}</span>
                </div>
            </div>

            <div class="codak-upgrade-body">
                <div class="codak-update-info">
                    <div class="update-title">
                        <i class="fa fa-github"></i>
                        <span>تحديث جديد متوفر على المستودع (GitHub Repository)</span>
                    </div>
                    {{#if commitMsg}}
                    <div class="update-commit-desc">
                        <i class="fa fa-code-fork"></i>
                        <code>{{commitHash}}</code> - <span>{{commitMsg}}</span>
                    </div>
                    {{/if}}
                </div>

                <!-- One-Click Deploy Idle Button State -->
                <div class="codak-action-container">
                    <button type="button" class="btn btn-codak-upgrade" data-action="runGitDeployUpgrade">
                        <i class="fa fa-rocket"></i>
                        <span>ترقية وتحديث النظام الآن</span>
                    </button>
                </div>

                <!-- Interactive Stepper & Progress Bar (Hidden initially) -->
                <div class="codak-progress-container hidden" id="codak-deploy-progress">
                    <div class="codak-progress-header">
                        <span class="status-label"><i class="fa fa-refresh fa-spin"></i> <span id="codak-status-text">جاري ترقية النظام...</span></span>
                        <span class="percentage-label" id="codak-progress-percent">0%</span>
                    </div>
                    
                    <div class="codak-progress-track">
                        <div class="codak-progress-bar" id="codak-progress-fill" style="width: 0%;"></div>
                    </div>

                    <div class="codak-steps-list">
                        <div class="codak-step-item" data-step="gitPull">
                            <span class="step-icon"><i class="fa fa-circle-o"></i></span>
                            <span class="step-text">1. جلب التحديثات من GitHub (git pull)</span>
                        </div>
                        <div class="codak-step-item" data-step="clearCache">
                            <span class="step-icon"><i class="fa fa-circle-o"></i></span>
                            <span class="step-text">2. تفريغ التخزين المؤقت (clear-cache)</span>
                        </div>
                        <div class="codak-step-item" data-step="rebuild">
                            <span class="step-icon"><i class="fa fa-circle-o"></i></span>
                            <span class="step-text">3. إعادة بناء الملفات والأصول (rebuild)</span>
                        </div>
                        <div class="codak-step-item" data-step="updateTimestamp">
                            <span class="step-icon"><i class="fa fa-circle-o"></i></span>
                            <span class="step-text">4. تحديث نسخة وطابع النظام (update-app-timestamp)</span>
                        </div>
                    </div>
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
