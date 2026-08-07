define('custom:views/case/record/detail', ['crm:views/case/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:id', this.handleNumberVisibility, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleNumberVisibility();
        },

        handleNumberVisibility: function () {
            if (this.model.get('id')) {
                this.showField('number');
            } else {
                this.hideField('number');
            }
        }
    });
});
