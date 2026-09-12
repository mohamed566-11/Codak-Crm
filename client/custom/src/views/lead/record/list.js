define('custom:views/lead/record/list', ['views/record/list'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.enhanceTableRows();
        },

        enhanceTableRows: function () {
            this.$el.find('table.list tbody tr').addClass('data-row');
        }
    });
});
