define('custom:views/campaign/record/detail', ['crm:views/campaign/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:type', this.handleTypeVisibility, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleTypeVisibility();
        },

        handleTypeVisibility: function () {
            var type = this.model.get('type');
            var isEmailOrMail = ['Email', 'Newsletter', 'Informational Email', 'Mail'].includes(type);
            var isMail = type === 'Mail';
            var isEmailList = ['Email', 'Newsletter', 'Informational Email'].includes(type);
            var isTrackingUrlList = ['Email', 'Newsletter'].includes(type);

            if (isEmailOrMail) {
                this.showField('targetLists');
                this.showField('excludingTargetLists');
            } else {
                this.hideField('targetLists');
                this.hideField('excludingTargetLists');
            }

            if (isMail) {
                this.showField('contactsTemplate');
                this.showField('leadsTemplate');
                this.showField('accountsTemplate');
                this.showField('usersTemplate');
                this.showField('mailMergeOnlyWithAddress');
                this.showPanel('mailMerge');
            } else {
                this.hideField('contactsTemplate');
                this.hideField('leadsTemplate');
                this.hideField('accountsTemplate');
                this.hideField('usersTemplate');
                this.hideField('mailMergeOnlyWithAddress');
                this.hidePanel('mailMerge');
            }

            if (isEmailList) {
                this.showPanel('massEmails');
            } else {
                this.hidePanel('massEmails');
            }

            if (isTrackingUrlList) {
                this.showPanel('trackingUrls');
            } else {
                this.hidePanel('trackingUrls');
            }
        }
    });
});
