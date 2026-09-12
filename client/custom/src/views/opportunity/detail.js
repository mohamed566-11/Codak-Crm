define('custom:views/opportunity/detail', ['crm:views/opportunity/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:stage', this.handleLastStageVisibility, this);
            this.listenTo(this.model, 'change:stage change:amount change:probability', this.renderOpportunityHeaderRibbon, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleLastStageVisibility();
            this.renderOpportunityHeaderRibbon();
        },

        renderOpportunityHeaderRibbon: function () {
            if (!this.isRendered()) return;

            var stage = this.model.get('stage') || 'Prospecting';
            var amount = Number(this.model.get('amount') || 0);
            var currency = this.model.get('amountCurrency') || '$';
            var probability = this.model.get('probability') !== undefined && this.model.get('probability') !== null ? (this.model.get('probability') + '%') : 'N/A';
            var formattedAmount = currency + ' ' + amount.toLocaleString('en-US');

            var stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];
            var isClosedLost = stage === 'Closed Lost';

            var html = '<div class="custom-entity-header-ribbon opp-ribbon" style="margin-bottom: 20px; padding: 18px 24px; background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%); border: 1px solid #bae6fd; border-radius: 16px; box-shadow: 0 4px 18px rgba(0,90,112,0.06); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">';

            html += '<div style="display: flex; align-items: center; gap: 14px;">';
            html += '<div style="width: 46px; height: 46px; border-radius: 14px; background: linear-gradient(135deg, #005a70 0%, #00a4c8 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 4px 12px rgba(0,164,200,0.3);"><i class="fas fa-briefcase"></i></div>';
            html += '<div>';
            html += '<div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Opportunity Deal Value & Stage</div>';
            html += '<div style="font-size: 18px; font-weight: 800; color: #005a70; display: flex; align-items: center; gap: 10px; margin-top: 2px;"><span>' + formattedAmount + '</span><span class="badge" style="font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 12px;"><i class="fas fa-percentage"></i> Win Prob: ' + probability + '</span></div>';
            html += '</div></div>';

            html += '<div class="opp-pipeline-steps" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">';
            if (isClosedLost) {
                html += '<span style="padding: 7px 18px; border-radius: 20px; font-size: 12px; font-weight: 800; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;"><i class="fas fa-times-circle"></i> Closed Lost</span>';
            } else {
                var passed = true;
                stages.forEach(function (st) {
                    var isActive = stage === st;
                    var style = isActive
                        ? 'background: linear-gradient(135deg, #005a70 0%, #00a4c8 100%); color: #ffffff; font-weight: 800; box-shadow: 0 4px 14px rgba(0, 164, 200, 0.35);'
                        : (passed ? 'background: #e0f2fe; color: #0284c7; font-weight: 700;' : 'background: #f1f5f9; color: #94a3b8; font-weight: 600;');
                    html += '<span style="padding: 6px 14px; border-radius: 20px; font-size: 12px; transition: all 0.2s ease; ' + style + '">' + st + '</span>';
                    if (isActive) passed = false;
                });
            }
            html += '</div></div>';

            var $existing = this.$el.find('.opp-ribbon');
            if ($existing.length) {
                $existing.replaceWith(html);
            } else {
                this.$el.find('.record').prepend(html);
            }
        },

        handleLastStageVisibility: function () {
            if (this.model.get('stage') === 'Closed Lost') {
                this.showField('lastStage');
            } else {
                this.hideField('lastStage');
            }
        }
    });
});
