define('custom:views/admin/index', ['views/admin/index'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);

            var user = this.getUser();
            if (!user.isAdmin() && user.get('cEnableAdminAccess')) {
                var allowedItems = user.get('cAllowedAdminItems') || [];

                var filteredPanelList = [];
                (this.panelDataList || []).forEach(function (panel) {
                    var newPanel = Espo.Utils.cloneDeep(panel);
                    newPanel.itemList = (newPanel.itemList || []).filter(function (item) {
                        var itemKey = item.description || 
                                      item.name || 
                                      (item.action ? item.action : '') || 
                                      (item.url ? item.url.replace('#Admin/', '').replace('#', '') : '');
                        return allowedItems.includes(itemKey) || allowedItems.includes(item.name) || allowedItems.includes(item.description);
                    });
                    if (newPanel.itemList.length > 0) {
                        filteredPanelList.push(newPanel);
                    }
                });
                this.panelDataList = filteredPanelList;
            }

            if (!this.getConfig().get('adminNotificationsDisabled')) {
                var notificationsViewName = this.getMetadata().get('clientDefs.Admin.views.notificationsPanel') ||
                                               this.getMetadata().get('clientDefs.Admin.notificationsPanel') ||
                                               'custom:views/admin/panels/notifications';
                this.createView('notificationsPanel', notificationsViewName, {
                    selector: '.notifications-panel-container'
                });
            }
        }
    });
});
