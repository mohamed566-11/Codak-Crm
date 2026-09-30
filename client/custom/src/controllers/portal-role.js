define('custom:controllers/portal-role', ['controllers/record'], function (Dep) {
    return Dep.extend({
        checkAccess: function (action) {
            var user = this.getUser();
            if (action === 'read') {
                return true;
            }
            if (user.isAdmin() || user.get('cEnableAdminAccess')) {
                return true;
            }
            return Dep.prototype.checkAccess.call(this, action);
        }
    });
});
