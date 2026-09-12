define('custom:views/lead/record/detail', ['crm:views/lead/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:status change:convertedAt', this.handleConvertedVisibility, this);
            this.listenTo(this.model, 'change:status', this.renderLeadHeaderRibbon, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleConvertedVisibility();
            this.renderLeadHeaderRibbon();
        },

        renderLeadHeaderRibbon: function () {
            if (!this.isRendered()) return;
            
            var status = this.model.get('status') || 'New';
            var assignedUser = this.model.get('assignedUserName') || 'Unassigned';

            var statuses = ['New', 'Assigned', 'In Process', 'Converted'];
            var isDeadOrRecycled = status === 'Dead' || status === 'Recycled';

            var html = '<div class="custom-entity-header-ribbon lead-ribbon" style="margin-bottom: 20px; padding: 16px 22px; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 1px solid #cbd5e1; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,45,60,0.04); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">';
            
            html += '<div style="display: flex; align-items: center; gap: 14px;">';
            html += '<div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, rgba(0, 164, 200, 0.15) 0%, rgba(0, 90, 112, 0.08) 100%); color: #005a70; display: flex; align-items: center; justify-content: center; font-size: 20px;"><i class="fas fa-user-tag"></i></div>';
            html += '<div>';
            html += '<div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Lead Status Pipeline</div>';
            html += '<div style="font-size: 15px; font-weight: 800; color: #005a70; display: flex; align-items: center; gap: 8px; margin-top: 2px;"><span>' + status + '</span><span class="badge badge-primary" style="font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 3px 10px; border-radius: 12px;"><i class="fas fa-user"></i> ' + assignedUser + '</span></div>';
            html += '</div></div>';

            html += '<div class="lead-pipeline-steps" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">';
            if (isDeadOrRecycled) {
                html += '<span style="padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 800; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;"><i class="fas fa-exclamation-triangle"></i> Status: ' + status + '</span>';
            } else {
                var passed = true;
                statuses.forEach(function (st) {
                    var isActive = status === st;
                    var style = isActive 
                        ? 'background: linear-gradient(135deg, #005a70 0%, #00a4c8 100%); color: #ffffff; font-weight: 800; box-shadow: 0 4px 14px rgba(0, 164, 200, 0.35);' 
                        : (passed ? 'background: #e0f2fe; color: #0284c7; font-weight: 700;' : 'background: #f1f5f9; color: #94a3b8; font-weight: 600;');
                    html += '<span style="padding: 6px 14px; border-radius: 20px; font-size: 12px; transition: all 0.2s ease; ' + style + '">' + st + '</span>';
                    if (isActive) passed = false;
                });
            }
            html += '</div></div>';

            var $existing = this.$el.find('.lead-ribbon');
            if ($existing.length) {
                $existing.replaceWith(html);
            } else {
                this.$el.find('.record').prepend(html);
            }
        },

        handleConvertedVisibility: function () {
            var isConverted = this.model.get('status') === 'Converted';
            var hasConvertedAt = !!this.model.get('convertedAt');

            if (isConverted && hasConvertedAt) {
                this.showField('convertedAt');
            } else {
                this.hideField('convertedAt');
            }

            if (isConverted) {
                this.showPanel('convertedTo');
            } else {
                this.hidePanel('convertedTo');
            }
        }
    });
});
