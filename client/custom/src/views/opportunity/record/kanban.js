define('custom:views/opportunity/record/kanban', ['crm:views/opportunity/record/kanban'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.enhanceKanbanStyle();
        },

        enhanceKanbanStyle: function () {
            this.$el.find('.kanban-column-header').css({
                'background': 'linear-gradient(135deg, #005a70 0%, #007c9b 100%)',
                'color': '#ffffff',
                'border-radius': '12px',
                'padding': '10px 14px',
                'font-weight': '700',
                'margin-bottom': '12px'
            });
            this.$el.find('.kanban-card').css({
                'border-radius': '12px',
                'border': '1px solid #cbd5e1',
                'box-shadow': '0 4px 14px rgba(0,45,60,0.04)',
                'transition': 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            });
        }
    });
});
