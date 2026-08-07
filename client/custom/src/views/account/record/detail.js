define('custom:views/account/record/detail', ['crm:views/account/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
        }
    });
});
