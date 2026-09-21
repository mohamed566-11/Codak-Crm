define('custom:controllers/role', ['controllers/role'], function (Dep) {
    return Dep.extend({
        checkAccess: function (action) {
            var user = this.getUser();
            if (user.isAdmin() || user.get('cEnableAdminAccess')) {
                return true;
            }
            return Dep.prototype.checkAccess.call(this, action);
        }
    });
});
