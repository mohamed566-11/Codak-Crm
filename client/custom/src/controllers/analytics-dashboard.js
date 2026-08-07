define('custom:controllers/analytics-dashboard', ['controllers/base'], function (Dep) {
    return Dep.extend({
        actionIndex: function () {
            this.main('custom:views/analytics-dashboard/index');
        }
    });
});
