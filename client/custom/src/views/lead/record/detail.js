define('custom:views/lead/record/detail', ['crm:views/lead/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:status change:convertedAt', this.handleConvertedVisibility, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleConvertedVisibility();
        },

        handleConvertedVisibility: function () {
            var isConverted = this.model.get('status') === 'Converted';
            var hasConvertedAt = !!this.model.get('convertedAt');

            if (isConverted && hasConvertedAt) {
                this.showField('convertedAt');
            } else {
                this.hideField('convertedAt');
            }

            if (isConverted) {
                this.showPanel('convertedTo');
            } else {
                this.hidePanel('convertedTo');
            }
        }
    });
});
