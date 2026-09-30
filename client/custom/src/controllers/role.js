define('custom:controllers/role', ['controllers/record'], function (Dep) {
    return Dep.extend({
        checkAccess: function (action) {
            var user = this.getUser();
            if (user.isAdmin()) {
                return true;
            }
            // Strict security lock: Non-admin users are strictly blocked from navigating to #Role pages
            return false;
        }
    });
});
