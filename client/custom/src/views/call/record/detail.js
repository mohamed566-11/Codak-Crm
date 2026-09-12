define('custom:views/call/record/detail', ['crm:views/call/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:status change:direction', this.renderCallHeaderRibbon, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.renderCallHeaderRibbon();
        },

        renderCallHeaderRibbon: function () {
            if (!this.isRendered()) return;

            var status = this.model.get('status') || 'Planned';
            var direction = this.model.get('direction') || 'Outbound';

            var html = '<div class="custom-entity-header-ribbon call-ribbon" style="margin-bottom: 20px; padding: 16px 22px; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 1px solid #cbd5e1; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,45,60,0.04); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">';

            html += '<div style="display: flex; align-items: center; gap: 14px;">';
            html += '<div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #005a70 0%, #00a4c8 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 20px;"><i class="fas fa-phone-alt"></i></div>';
            html += '<div>';
            html += '<div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Call Details</div>';
            html += '<div style="font-size: 15px; font-weight: 800; color: #005a70; display: flex; align-items: center; gap: 8px; margin-top: 2px;"><span>' + (this.model.get('name') || 'Call Record') + '</span><span class="badge badge-primary" style="font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 3px 10px; border-radius: 12px;">' + direction + ' • ' + status + '</span></div>';
            html += '</div></div>';

            html += '</div>';

            var $existing = this.$el.find('.call-ribbon');
            if ($existing.length) {
                $existing.replaceWith(html);
            } else {
                this.$el.find('.record').prepend(html);
            }
        }
    });
});
