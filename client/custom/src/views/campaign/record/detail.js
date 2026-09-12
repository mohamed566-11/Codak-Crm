define('custom:views/campaign/record/detail', ['crm:views/campaign/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:status change:budget', this.renderCampaignHeaderRibbon, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.renderCampaignHeaderRibbon();
        },

        renderCampaignHeaderRibbon: function () {
            if (!this.isRendered()) return;

            var status = this.model.get('status') || 'Draft';
            var budget = Number(this.model.get('budget') || 0);
            var currency = this.model.get('budgetCurrency') || '$';
            var formattedBudget = currency + ' ' + budget.toLocaleString('en-US');

            var html = '<div class="custom-entity-header-ribbon campaign-ribbon" style="margin-bottom: 20px; padding: 16px 22px; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 1px solid #cbd5e1; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,45,60,0.04); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">';

            html += '<div style="display: flex; align-items: center; gap: 14px;">';
            html += '<div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #005a70 0%, #00a4c8 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 20px;"><i class="fas fa-bullhorn"></i></div>';
            html += '<div>';
            html += '<div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Marketing Campaign & Budget</div>';
            html += '<div style="font-size: 15px; font-weight: 800; color: #005a70; display: flex; align-items: center; gap: 8px; margin-top: 2px;"><span>' + (this.model.get('name') || 'Campaign Record') + '</span><span class="badge badge-primary" style="font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 3px 10px; border-radius: 12px;">' + status + '</span></div>';
            html += '</div></div>';

            html += '<div style="font-size: 12px; font-weight: 800; padding: 6px 14px; background: #ecfdf5; color: #059669; border-radius: 20px; border: 1px solid #a7f3d0;"><i class="fas fa-coins"></i> Budget: ' + formattedBudget + '</div>';
            html += '</div>';

            var $existing = this.$el.find('.campaign-ribbon');
            if ($existing.length) {
                $existing.replaceWith(html);
            } else {
                this.$el.find('.record').prepend(html);
            }
        }
    });
});
