define('custom:views/user/record/row-actions/default', ['views/user/record/row-actions/default'], function (Dep) {
    return Dep.extend({
        getActionList: function () {
            var list = Dep.prototype.getActionList.call(this) || [];

            var isUserAdmin = this.getUser().isAdmin();
            var isTargetAdmin = this.model.isAdmin ? this.model.isAdmin() : (this.model.get('type') === 'admin');

            if (!isUserAdmin && isTargetAdmin) {
                list = list.filter(function (item) {
                    return item.action !== 'quickEdit' && item.action !== 'edit';
                });
            }

            return list;
        }
    });
});
