define('custom:views/contact/record/edit', ['views/record/edit'], function (Dep) {
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
            this.enhanceFormLayout();
        },

        enhanceFormLayout: function () {
            this.$el.find('.panel').addClass('animate-fade-up');
            this.$el.find('.panel-heading').css({
                'font-size': '14px',
                'font-weight': '800',
                'color': '#005a70'
            });
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
