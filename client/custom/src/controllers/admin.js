define('custom:controllers/admin', ['controllers/admin'], function (Dep) {
    return Dep.extend({
        checkAccessGlobal: function () {
            var user = this.getUser();
            if (user.isAdmin() || user.get('cEnableAdminAccess')) {
                return true;
            }
            return Dep.prototype.checkAccessGlobal.call(this);
        },

        actionIndex: function (options) {
            options = options || {};
            var isReturn = options.isReturn;
            if (this.getRouter().backProcessed) {
                isReturn = true;
            }
            var key = 'index';
            if (!isReturn && this.getStoredMainView(key)) {
                this.clearStoredMainView(key);
            }

            Espo.loader.require('custom:views/admin/index', function (View) {
                var view = new View();
                this.main(view, null, function (v) {
                    v.render();
                    this.listenTo(v, 'clear-cache', this.clearCache);
                    this.listenTo(v, 'rebuild', this.rebuild);
                }.bind(this), {
                    useStored: isReturn,
                    key: key
                });
            }.bind(this));
        }
    });
});
