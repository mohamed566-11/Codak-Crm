define('custom:views/opportunity/detail', ['crm:views/opportunity/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:stage', this.handleLastStageVisibility, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleLastStageVisibility();
        },

        handleLastStageVisibility: function () {
            if (this.model.get('stage') === 'Closed Lost') {
                this.showField('lastStage');
            } else {
                this.hideField('lastStage');
            }
        }
    });
});
