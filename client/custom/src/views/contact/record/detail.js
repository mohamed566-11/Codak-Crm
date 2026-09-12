define('custom:views/contact/record/detail', ['crm:views/contact/record/detail'], function (Dep) {
    return Dep.extend({
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:accountId', this.handleTitleFieldVisibility, this);
            this.listenTo(this.model, 'change:portalUserId', this.handlePortalUserFieldVisibility, this);
            this.listenTo(this.model, 'change:emailAddress change:phoneNumber change:accountName', this.renderContactHeaderRibbon, this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.handleTitleFieldVisibility();
            this.handlePortalUserFieldVisibility();
            this.renderContactHeaderRibbon();
        },

        renderContactHeaderRibbon: function () {
            if (!this.isRendered()) return;

            var name = (this.model.get('firstName') || '') + ' ' + (this.model.get('lastName') || '');
            var email = this.model.get('emailAddress') || '';
            var accountName = this.model.get('accountName') || 'Independent Contact';
            var title = this.model.get('title') || 'Contact Person';

            var html = '<div class="custom-entity-header-ribbon contact-ribbon" style="margin-bottom: 20px; padding: 18px 24px; background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%); border: 1px solid #bae6fd; border-radius: 16px; box-shadow: 0 4px 18px rgba(0,90,112,0.06); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">';

            html += '<div style="display: flex; align-items: center; gap: 14px;">';
            html += '<div style="width: 46px; height: 46px; border-radius: 50%; background: linear-gradient(135deg, #005a70 0%, #00a4c8 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 12px rgba(0,164,200,0.3);"><i class="fas fa-address-book"></i></div>';
            html += '<div>';
            html += '<div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Contact Card Profile</div>';
            html += '<div style="font-size: 16px; font-weight: 800; color: #005a70; display: flex; align-items: center; gap: 8px; margin-top: 2px;"><span>' + (name.trim() || 'Contact') + '</span><span class="badge" style="font-size: 11px; background: #e0f2fe; color: #0284c7; padding: 3px 10px; border-radius: 12px;">' + title + ' @ ' + accountName + '</span></div>';
            html += '</div></div>';

            html += '<div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">';
            if (email) {
                html += '<a href="mailto:' + email + '" style="font-size: 12px; font-weight: 700; padding: 7px 16px; background: linear-gradient(135deg, #005a70 0%, #007c9b 100%); color: #ffffff; border-radius: 20px; text-decoration: none; box-shadow: 0 4px 12px rgba(0,90,112,0.25);"><i class="fas fa-envelope"></i> Send Email</a>';
            }
            if (this.model.id) {
                html += '<a href="#Meeting/create?contactId=' + this.model.id + '" style="font-size: 12px; font-weight: 700; padding: 7px 16px; background: #e0f2fe; color: #0284c7; border-radius: 20px; text-decoration: none;"><i class="fas fa-calendar-plus"></i> Schedule Meeting</a>';
            }
            html += '</div></div>';

            var $existing = this.$el.find('.contact-ribbon');
            if ($existing.length) {
                $existing.replaceWith(html);
            } else {
                this.$el.find('.record').prepend(html);
            }
        },

        handleTitleFieldVisibility: function () {
            if (this.model.get('accountId')) {
                this.showField('title');
            } else {
                this.hideField('title');
            }
        },

        handlePortalUserFieldVisibility: function () {
            if (this.model.get('portalUserId')) {
                this.showField('portalUser');
            } else {
                this.hideField('portalUser');
            }
        }
    });
});
