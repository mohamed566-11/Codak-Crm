define('custom:views/admin/panels/notifications', ['views/admin/panels/notifications', 'ui'], function (Dep, Ui) {
    var CustomView = Dep.extend({
        template: 'custom:admin/panels/notifications',

        events: {
            'click [data-action="runGitDeployUpgrade"]': function (e) {
                e.preventDefault();
                this.confirmAndUpgrade();
            }
        },

        setup: function () {
            Dep.prototype.setup.call(this);
            this.isUpgrading = false;
        },

        data: function () {
            var data = Dep.prototype.data.call(this) || {};
            data.notificationList = data.notificationList || [];

            var config = this.getConfig();
            var user = this.getUser();
            var isAdmin = user && typeof user.isAdmin === 'function' ? user.isAdmin() : false;
            var isGitUpdateAvailable = Boolean(config.get('gitUpdateAvailable'));
            var currentVersion = config.get('version') || '10.0.3';
            var latestVersion = config.get('latestVersion') || currentVersion;
            var hasNewAppVersion = isGitUpdateAvailable && Boolean(latestVersion && currentVersion && latestVersion !== currentVersion);

            // Filter out any native Espo version check messages so we don't get duplicate cards
            data.notificationList = data.notificationList.filter(function (item) {
                if (!item) return false;
                if (item.isGitDeploy) return false;
                var msg = String(item.message || '').toLowerCase();
                if (msg.indexOf('version') !== -1 || msg.indexOf('codakcrm') !== -1 || msg.indexOf('espocrm') !== -1 || msg.indexOf('update') !== -1) {
                    return false;
                }
                return true;
            });

            // Always insert EXACTLY ONE GitDeploy card at the top
            var gitDeployItem = {
                id: 'git-deploy-update-card',
                isGitDeploy: true,
                isAdmin: isAdmin,
                isGitUpdateAvailable: isGitUpdateAvailable,
                currentVersion: currentVersion,
                latestVersion: isGitUpdateAvailable ? latestVersion : currentVersion,
                hasNewAppVersion: hasNewAppVersion
            };

            data.notificationList.unshift(gitDeployItem);

            return data;
        },

        confirmAndUpgrade: function () {
            if (this.isUpgrading) {
                return;
            }

            var self = this;
            this.confirm(
                'Are you sure you want to upgrade Codak CRM now? The update will safely execute across 4 automated steps.',
                function () {
                    self.startUpgradeProcess();
                }
            );
        },

        async startUpgradeProcess() {
            if (this.isUpgrading) {
                return;
            }

            this.isUpgrading = true;
            var $btn = this.$el.find('.btn-codak-primary, .btn-codak-upgrade');
            var $btnContainer = this.$el.find('.codak-actions-row, .codak-action-container');
            var $progressContainer = this.$el.find('#codak-deploy-progress');
            var $percentLabel = this.$el.find('#codak-progress-percent');
            var $progressFill = this.$el.find('#codak-progress-fill');
            var $statusText = this.$el.find('#codak-status-text');

            $btn.prop('disabled', true).addClass('disabled');
            $progressContainer.removeClass('hidden');

            // Reset all step items for a clean fresh pipeline run
            this.$el.find('.codak-step-item').removeClass('completed active error');
            this.$el.find('.codak-step-item .step-icon').html('<i class="fa fa-circle-o"></i>');
            $progressFill.css('width', '0%');
            $percentLabel.text('0%');

            var steps = [
                { key: 'gitPull', label: '1. Fetching latest release updates (git pull)', percent: 25 },
                { key: 'rebuild', label: '2. Rebuilding system assets (rebuild)', percent: 50 },
                { key: 'clearCache', label: '3. Clearing system cache (clear-cache)', percent: 75 },
                { key: 'updateTimestamp', label: '4. Updating application timestamp', percent: 100 }
            ];

            for (var i = 0; i < steps.length; i++) {
                var step = steps[i];
                var $stepEl = this.$el.find('.codak-step-item[data-step="' + step.key + '"]');

                $stepEl.removeClass('completed error').addClass('active');
                $stepEl.find('.step-icon').html('<i class="fa fa-spinner fa-spin text-info"></i>');

                // XSS safe status text rendering
                $statusText.empty().append($('<span></span>').text('Executing: ' + step.label));

                try {
                    var res = await Espo.Ajax.postRequest('GitDeploy/upgradeStep', { step: step.key });

                    if (res && res.success) {
                        $stepEl.removeClass('active').addClass('completed');
                        $stepEl.find('.step-icon').html('<i class="fa fa-check-circle text-success"></i>');
                        $progressFill.css('width', step.percent + '%');
                        $percentLabel.text(step.percent + '%');
                    } else {
                        var errMsg = (res && res.message) ? res.message : 'Upgrade failed at step ' + step.key;
                        throw new Error(errMsg);
                    }
                } catch (err) {
                    $stepEl.removeClass('active').addClass('error');
                    $stepEl.find('.step-icon').html('<i class="fa fa-times-circle text-danger"></i>');

                    var safeMsg = (err && err.message) ? err.message : 'An error occurred during upgrade';

                    // XSS safe error message rendering into status element
                    $statusText.empty()
                        .append($('<i class="fa fa-exclamation-triangle text-danger margin-right-xs"></i>'))
                        .append($('<span class="text-danger"></span>').text(safeMsg));

                    Ui.error(safeMsg, true);

                    // Re-enable retry option safely for fresh pipeline execution
                    this.isUpgrading = false;
                    $btn.prop('disabled', false).removeClass('disabled').html('<i class="fa fa-refresh"></i> <span>Retry Upgrade</span>');
                    $btnContainer.removeClass('hidden');
                    return;
                }
            }

            // All steps completed successfully
            this.isUpgrading = false;
            $statusText.empty()
                .append($('<i class="fa fa-check-circle text-success margin-right-xs"></i>'))
                .append($('<strong class="text-success"></strong>').text('🎉 Codak CRM system upgraded successfully! Reloading...'));

            Ui.success('System successfully upgraded to the latest release!', { suppress: false });

            setTimeout(function () {
                window.location.reload();
            }, 1800);
        }
    });

    try {
        define('views/admin/panels/notifications', [], function () {
            return CustomView;
        });
    } catch (e) {}

    return CustomView;
});
