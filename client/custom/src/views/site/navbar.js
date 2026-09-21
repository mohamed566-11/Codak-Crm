define('custom:views/site/navbar', ['views/site/navbar'], function (Dep) {
    return Dep.extend({
        setupMenu: function () {
            Dep.prototype.setupMenu.call(this);

            var user = this.getUser();
            var hasAdmin = (this.menuDataList || []).some(function (item) {
                return item.name === 'admin' || item.link === '#Admin';
            });

            if (!user.isAdmin() && user.get('cEnableAdminAccess')) {
                if (!hasAdmin) {
                    var adminItem = {
                        name: 'admin',
                        link: '#Admin',
                        label: this.getLanguage().translatePath('Global.labels.Administration'),
                        iconClass: 'fas fa-gear'
                    };

                    var prefIndex = this.menuDataList.findIndex(function (item) {
                        return item.name === 'preferences' || item.link === '#Preferences';
                    });

                    if (prefIndex !== -1) {
                        this.menuDataList.splice(prefIndex, 0, adminItem);
                    } else {
                        this.menuDataList.push(adminItem);
                    }
                }
            } else if (!user.isAdmin() && !user.get('cEnableAdminAccess')) {
                if (hasAdmin) {
                    this.menuDataList = (this.menuDataList || []).filter(function (item) {
                        return item.name !== 'admin' && item.link !== '#Admin';
                    });
                }
            }
        }
    });
});
