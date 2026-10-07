define('custom:views/admin/panels/notifications', ['views/admin/panels/notifications', 'ui'], function (Dep, Ui) {
    return Dep.extend({
        template: 'admin/panels/notifications',

        events: {
            'click [data-action="runGitDeployUpgrade"]': function (e) {
                e.preventDefault();
                this.startUpgradeProcess();
            }
        },

        setup: function () {
            Dep.prototype.setup.call(this);
        },

        async startUpgradeProcess() {
            var self = this;
            var $btnContainer = this.$el.find('.codak-action-container');
            var $progressContainer = this.$el.find('#codak-deploy-progress');
            var $percentLabel = this.$el.find('#codak-progress-percent');
            var $progressFill = this.$el.find('#codak-progress-fill');
            var $statusText = this.$el.find('#codak-status-text');

            $btnContainer.addClass('hidden');
            $progressContainer.removeClass('hidden');

            var steps = [
                { key: 'gitPull', label: '1. جلب التحديثات من GitHub (git pull)', percent: 25 },
                { key: 'clearCache', label: '2. تفريغ التخزين المؤقت (clear-cache)', percent: 50 },
                { key: 'rebuild', label: '3. إعادة بناء الملفات والأصول (rebuild)', percent: 75 },
                { key: 'updateTimestamp', label: '4. تحديث نسخة وطابع النظام (update-app-timestamp)', percent: 100 }
            ];

            for (var i = 0; i < steps.length; i++) {
                var step = steps[i];
                var $stepEl = this.$el.find('.codak-step-item[data-step="' + step.key + '"]');
                
                $stepEl.addClass('active');
                $stepEl.find('.step-icon').html('<i class="fa fa-spinner fa-spin text-info"></i>');
                $statusText.text('جاري تنفيذ: ' + step.label);

                try {
                    var res = await Espo.Ajax.postRequest('GitDeploy/upgradeStep', { step: step.key });
                    if (res && res.success) {
                        $stepEl.removeClass('active').addClass('completed');
                        $stepEl.find('.step-icon').html('<i class="fa fa-check-circle text-success"></i>');
                        $progressFill.css('width', step.percent + '%');
                        $percentLabel.text(step.percent + '%');
                    } else {
                        throw new Error((res && res.message) ? res.message : 'فشلت عملية الترقية');
                    }
                } catch (err) {
                    $stepEl.removeClass('active').addClass('error');
                    $stepEl.find('.step-icon').html('<i class="fa fa-times-circle text-danger"></i>');
                    Ui.error(err.message || 'حدث خطأ أثناء الترقية', true);
                    $btnContainer.removeClass('hidden');
                    return;
                }
            }

            $statusText.html('<strong class="text-success">🎉 تم تحديث المشروع بنجاح! جاري التنشيط...</strong>');
            Ui.success('تمت ترقية وتحديث النظام بنجاح إلى النسخة الجديدة!', { suppress: false });

            setTimeout(function () {
                window.location.reload();
            }, 1800);
        }
    });
});
