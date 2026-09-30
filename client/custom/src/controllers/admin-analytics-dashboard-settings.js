define('custom:controllers/admin-analytics-dashboard-settings', ['controllers/base'], function (Dep) {
    return Dep.extend({
        actionIndex: function () {
            if (!this.getUser().isAdmin() && !this.getUser().get('cEnableAdminAccess')) {
                this.getRouter().navigate('#Admin', { trigger: true });
                return;
            }
            this.main('custom:views/admin/analytics-dashboard-settings');
        }
    });
});
