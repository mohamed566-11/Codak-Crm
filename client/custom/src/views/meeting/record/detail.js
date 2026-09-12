define('custom:views/meeting/record/detail', ['crm:views/meeting/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:status change:dateStart', this.renderMeetingHeaderRibbon, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.renderMeetingHeaderRibbon();
        },

        renderMeetingHeaderRibbon: function () {
            if (!this.isRendered()) return;

            var status = this.model.get('status') || 'Planned';
            var dateStart = this.model.get('dateStart') || '';

            var badgeClass = 'background: #e0f2fe; color: #0284c7;';
            if (status === 'Held') badgeClass = 'background: #ecfdf5; color: #059669;';
            if (status === 'Not Held') badgeClass = 'background: #fef2f2; color: #dc2626;';

            var html = '<div class="custom-entity-header-ribbon meeting-ribbon" style="margin-bottom: 20px; padding: 16px 22px; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 1px solid #cbd5e1; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,45,60,0.04); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">';

            html += '<div style="display: flex; align-items: center; gap: 14px;">';
            html += '<div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #005a70 0%, #00a4c8 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 20px;"><i class="fas fa-calendar-alt"></i></div>';
            html += '<div>';
            html += '<div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Meeting Schedule & Status</div>';
            html += '<div style="font-size: 15px; font-weight: 800; color: #005a70; display: flex; align-items: center; gap: 8px; margin-top: 2px;"><span>' + (this.model.get('name') || 'Meeting') + '</span><span class="badge" style="font-size: 11px; padding: 3px 10px; border-radius: 12px; ' + badgeClass + '">' + status + '</span></div>';
            html += '</div></div>';

            if (dateStart) {
                html += '<div style="font-size: 12px; font-weight: 700; padding: 6px 14px; background: #e0f2fe; color: #0284c7; border-radius: 20px;"><i class="fas fa-clock"></i> Starts: ' + dateStart + '</div>';
            }

            html += '</div>';

            var $existing = this.$el.find('.meeting-ribbon');
            if ($existing.length) {
                $existing.replaceWith(html);
            } else {
                this.$el.find('.record').prepend(html);
            }
        }
    });
});
