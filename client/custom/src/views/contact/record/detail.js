define('custom:views/contact/record/detail', ['crm:views/contact/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:accountId', this.handleTitleFieldVisibility, this);
            this.listenTo(this.model, 'change:portalUserId', this.handlePortalUserFieldVisibility, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleTitleFieldVisibility();
            this.handlePortalUserFieldVisibility();
        },

        handleTitleFieldVisibility: function () {
            if (this.model.get('accountId')) {
                this.showField('title');
            } else {
                this.hideField('title');
            }
        },

        handlePortalUserFieldVisibility: function () {
            if (this.model.get('portalUserId')) {
                this.showField('portalUser');
            } else {
                this.hideField('portalUser');
            }
        }
    });
});
