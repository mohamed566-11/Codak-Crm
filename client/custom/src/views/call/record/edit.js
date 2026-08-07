define('custom:views/call/record/edit', ['views/record/edit'], function (Dep) {
    return Dep.extend({
        setup: function () {
            console.log('[FRONTEND VERIFY] Loaded custom:views/call/record/edit');
            Dep.prototype.setup.call(this);
        }
    });
});
