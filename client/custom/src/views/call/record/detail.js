define('custom:views/call/record/detail', ['crm:views/call/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            console.log('[FRONTEND VERIFY] Loaded custom:views/call/record/detail');
            Dep.prototype.setup.call(this);
        }
    });
});
