define('custom:views/task/record/edit', ['views/record/edit'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:status', this.handleDateCompletedVisibility, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleDateCompletedVisibility();
        },

        handleDateCompletedVisibility: function () {
            if (this.model.get('status') === 'Completed') {
                this.showField('dateCompleted');
            } else {
                this.hideField('dateCompleted');
            }
        }
    });
});
