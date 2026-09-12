define('custom:views/case/record/detail', ['crm:views/case/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:status change:priority', this.renderCaseHeaderRibbon, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.renderCaseHeaderRibbon();
        },

        renderCaseHeaderRibbon: function () {
            if (!this.isRendered()) return;

            var status = this.model.get('status') || 'New';
            var priority = this.model.get('priority') || 'Normal';

            var prioStyle = 'background: #f1f5f9; color: #475569;';
            if (priority === 'High' || priority === 'Urgent') prioStyle = 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; box-shadow: 0 0 10px rgba(220,38,38,0.2);';

            var html = '<div class="custom-entity-header-ribbon case-ribbon" style="margin-bottom: 20px; padding: 16px 22px; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 1px solid #cbd5e1; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,45,60,0.04); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">';

            html += '<div style="display: flex; align-items: center; gap: 14px;">';
            html += '<div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #005a70 0%, #00a4c8 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 20px;"><i class="fas fa-life-ring"></i></div>';
            html += '<div>';
            html += '<div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Support Ticket & Case Info</div>';
            html += '<div style="font-size: 15px; font-weight: 800; color: #005a70; display: flex; align-items: center; gap: 8px; margin-top: 2px;"><span>' + (this.model.get('name') || 'Case Record') + '</span><span class="badge" style="font-size: 11px; padding: 3px 10px; border-radius: 12px; background: #e0f2fe; color: #0284c7;">' + status + '</span></div>';
            html += '</div></div>';

            html += '<div style="font-size: 12px; font-weight: 800; padding: 6px 14px; border-radius: 20px; ' + prioStyle + '"><i class="fas fa-exclamation-circle"></i> Priority: ' + priority + '</div>';
            html += '</div>';

            var $existing = this.$el.find('.case-ribbon');
            if ($existing.length) {
                $existing.replaceWith(html);
            } else {
                this.$el.find('.record').prepend(html);
            }
        }
    });
});
