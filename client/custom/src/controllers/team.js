define('custom:controllers/team', ['controllers/record'], function (RecordController) {
    return RecordController.extend({
        checkAccess: function (action) {
            return !!this.getAcl().check(this.name, action);
        }
    });
});
