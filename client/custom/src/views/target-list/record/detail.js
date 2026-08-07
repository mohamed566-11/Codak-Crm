define('custom:views/target-list/record/detail', ['crm:views/target-list/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:id', this.handleCountsVisibility, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleCountsVisibility();
        },

        handleCountsVisibility: function () {
            if (this.model.get('id')) {
                this.showField('entryCount');
                this.showField('optedOutCount');
            } else {
                this.hideField('entryCount');
                this.hideField('optedOutCount');
            }
        }
    });
});
