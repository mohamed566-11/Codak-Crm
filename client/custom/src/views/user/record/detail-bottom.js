define('custom:views/user/record/detail-bottom', ['views/user/record/detail-bottom'], function (Dep) {
    return Dep.extend({
        setupPanels: function () {
            Dep.prototype.setupPanels.call(this);

            var streamPanel = this.panelList.find(function (panel) {
                return panel.name === 'stream';
            });

            if (!streamPanel) {
                this.panelList.push({
                    name: 'stream',
                    label: 'Stream',
                    view: 'views/user/record/panels/stream',
                    sticked: false,
                    hidden: false
                });
            } else {
                streamPanel.hidden = false;
            }

            if (this.recordHelper) {
                this.recordHelper.setPanelStateParam('stream', 'hiddenAclLocked', false);
                this.recordHelper.setPanelStateParam('stream', 'hidden', false);
            }
        }
    });
});
