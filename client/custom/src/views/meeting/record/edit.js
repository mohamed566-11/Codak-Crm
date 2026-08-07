define('custom:views/meeting/record/edit', ['views/record/edit'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:isAllDay', this.handleDurationReadOnly, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleDurationReadOnly();
        },

        handleDurationReadOnly: function () {
            if (this.model.get('isAllDay')) {
                this.setFieldReadOnly('duration');
            } else {
                this.setFieldNotReadOnly('duration');
            }
        }
    });
});
