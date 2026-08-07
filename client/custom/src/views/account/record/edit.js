define('custom:views/account/record/edit', ['views/record/edit'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
        }
    });
});
