define('custom:views/call/record/list', ['views/record/list'], function (Dep) {
    return Dep.extend({
        setup: function () {
            console.log('[FRONTEND VERIFY] Loaded custom:views/call/record/list');
            Dep.prototype.setup.call(this);
        }
    });
});
