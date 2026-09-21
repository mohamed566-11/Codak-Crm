define('custom:views/user/record/edit', ['views/record/edit'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.handleQuotaAndAdminPanelVisibility();
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleQuotaAndAdminPanelVisibility();
        },

        handleQuotaAndAdminPanelVisibility: function () {
            if (!this.getUser().isAdmin()) {
                var fields = [
                    'cMaxAccountsQuota',
                    'cMaxLeadsQuota',
                    'cMaxContactsQuota',
                    'cMaxOpportunitiesQuota',
                    'cMaxUsersQuota',
                    'cEnableAdminAccess',
                    'cAllowedAdminItems'
                ];

                fields.forEach(function (field) {
                    this.hideField(field);
                }.bind(this));

                if (this.isRendered()) {
                    this.$el.find('.panel').each(function (i, el) {
                        var $el = $(el);
                        var text = $el.text();
                        if (text.indexOf('Creation Quotas') !== -1 || text.indexOf('Administration Access') !== -1) {
                            $el.hide();
                        }
                    });
                }
            }
        }
    });
});
