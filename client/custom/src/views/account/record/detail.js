define('custom:views/account/record/detail', ['crm:views/account/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:type change:industry change:website', this.renderAccountHeaderRibbon, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.renderAccountHeaderRibbon();
        },

        renderAccountHeaderRibbon: function () {
            if (!this.isRendered()) return;

            var type = this.model.get('type') || 'Customer';
            var industry = this.model.get('industry') || 'General Business';
            var website = this.model.get('website') || '';

            var html = '<div class="custom-entity-header-ribbon account-ribbon" style="margin-bottom: 20px; padding: 18px 24px; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 1px solid #cbd5e1; border-radius: 16px; box-shadow: 0 4px 18px rgba(0,45,60,0.04); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">';

            html += '<div style="display: flex; align-items: center; gap: 14px;">';
            html += '<div style="width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(135deg, #005a70 0%, #007c9b 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 4px 12px rgba(0,90,112,0.25);"><i class="fas fa-building"></i></div>';
            html += '<div>';
            html += '<div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Enterprise Account Profile</div>';
            html += '<div style="font-size: 16px; font-weight: 800; color: #005a70; display: flex; align-items: center; gap: 8px; margin-top: 2px;"><span>' + (this.model.get('name') || 'Account Record') + '</span><span class="badge" style="font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 3px 10px; border-radius: 12px;">' + type + '</span></div>';
            html += '</div></div>';

            html += '<div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">';
            html += '<span style="font-size: 12px; font-weight: 700; padding: 6px 14px; background: #f1f5f9; color: #334155; border-radius: 20px; border: 1px solid #e2e8f0;"><i class="fas fa-industry"></i> Industry: ' + industry + '</span>';
            if (website) {
                var cleanUrl = website.indexOf('http') === 0 ? website : 'http://' + website;
                html += '<a href="' + cleanUrl + '" target="_blank" style="font-size: 12px; font-weight: 700; padding: 6px 14px; background: #e0f2fe; color: #0284c7; border-radius: 20px; text-decoration: none;"><i class="fas fa-globe"></i> Visit Website</a>';
            }
            html += '</div></div>';

            var $existing = this.$el.find('.account-ribbon');
            if ($existing.length) {
                $existing.replaceWith(html);
            } else {
                this.$el.find('.record').prepend(html);
            }
        }
    });
});
