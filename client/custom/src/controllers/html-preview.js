define('custom:controllers/html-preview', ['controllers/base'], function (Dep) {
    return Dep.extend({
        actionIndex: function () {
            this.main('custom:views/html-preview/index');
        }
    });
});
