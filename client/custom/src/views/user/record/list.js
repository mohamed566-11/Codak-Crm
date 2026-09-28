define('custom:views/user/record/list', ['views/user/record/list'], function (Dep) {
    return Dep.extend({
        rowActionsView: 'custom:views/user/record/row-actions/default'
    });
});
