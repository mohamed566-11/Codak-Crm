define('custom:views/user/record/detail', ['views/user/record/detail'], function (Dep) {
    return Dep.extend({
        bottomView: 'custom:views/user/record/detail-bottom',

        setup: function () {
            Dep.prototype.setup.call(this);

            var isTargetAdmin = this.model.isAdmin ? this.model.isAdmin() : (this.model.get('type') === 'admin');
            var isUserAdmin = this.getUser().isAdmin();

            if (!isUserAdmin && isTargetAdmin) {
                this.removeButton('edit');
                this.removeButton('access');
                this.dropdownItemList = [];
                this.menuList = [];
            } else {
                if ((isUserAdmin || this.getUser().get('cEnableAdminAccess')) && !this.model.isPortal()) {
                    var hasAccessBtn = this.buttonList && this.buttonList.some(function (b) { return b.name === 'access'; });
                    if (!hasAccessBtn) {
                        this.addButton({
                            name: 'access',
                            label: 'Access',
                            style: 'default',
                            onClick: function () {
                                this.actionAccess();
                            }.bind(this)
                        });
                    }
                }

                if (this.canEditPassword()) {
                    var hasChangePassword = this.dropdownItemList && this.dropdownItemList.some(function (item) { return item.name === 'changePassword'; });
                    if (!hasChangePassword) {
                        this.addDropdownItem({
                            name: 'changePassword',
                            label: 'Change Password',
                            style: 'default'
                        });
                    }
                }
            }

            this.handleQuotaAndAdminPanelVisibility();
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);

            var isTargetAdmin = this.model.isAdmin ? this.model.isAdmin() : (this.model.get('type') === 'admin');
            var isUserAdmin = this.getUser().isAdmin();

            if (!isUserAdmin && isTargetAdmin) {
                this.removeButton('edit');
                this.removeButton('access');
                this.hideHeaderActionItem('edit');
                this.hideHeaderActionItem('access');
                this.dropdownItemList = [];
                this.menuList = [];
                this.$el.find('button[data-action="edit"]').remove();
                this.$el.find('button[data-action="access"]').remove();
                this.$el.find('.actions-btn, button.dropdown-toggle, .dropdown-toggle, [data-toggle="dropdown"]').remove();
            }

            this.handleQuotaAndAdminPanelVisibility();
        },

        canEditPassword: function () {
            var isTargetAdmin = this.model.isAdmin ? this.model.isAdmin() : (this.model.get('type') === 'admin');
            var isUserAdmin = this.getUser().isAdmin();

            if (!isUserAdmin && isTargetAdmin) {
                return false;
            }

            if (isUserAdmin) {
                return true;
            }
            var currentUserId = this.getUser().id;
            var targetUserId = this.model.id;
            var createdById = this.model.get('createdById');
            return (targetUserId === currentUserId || (createdById && createdById === currentUserId));
        },

        getGridLayout: function (callback) {
            Dep.prototype.getGridLayout.call(this, function (data) {
                if (this.detailLayout && this.canEditPassword()) {
                    var hasPasswordSection = this.detailLayout.some(function (panel) {
                        return panel.name === 'passwordSection' || panel.label === 'Password';
                    });
                    if (!hasPasswordSection) {
                        this.detailLayout.push({
                            label: "Password",
                            name: "passwordSection",
                            rows: [
                                [
                                    {
                                        name: "changePasswordButton",
                                        view: "views/fields/base",
                                        customLabel: "Password",
                                        customCode: '<button class="btn btn-default btn-sm action" data-action="changePassword" type="button"><span class="fas fa-key"></span> ' + (this.translate('Change Password', 'labels', 'User') || 'Change Password') + '</button>'
                                    },
                                    false
                                ]
                            ]
                        });
                        if (data && data.layout) {
                            data.layout = this.convertDetailLayout(this.detailLayout);
                        }
                    }
                }
                callback(data);
            }.bind(this));
        },

        actionChangePassword: function () {
            var self = this;
            var title = this.translate('Change Password', 'labels', 'User') || 'Change Password';
            var isSelf = (this.model.id === this.getUser().id);

            var toggleFn = "var grp=this.closest('.pwd-input-group'); var inp=grp.querySelector('input'); var ico=this.querySelector('i'); if(inp.type==='password'){inp.type='text';ico.className='fas fa-eye-slash';this.classList.add('is-active');}else{inp.type='password';ico.className='fas fa-eye';this.classList.remove('is-active');}";

            var pwdAddonLock = '<span class="input-group-addon"><i class="fas fa-lock"></i></span>';
            var pwdAddonKey = '<span class="input-group-addon"><i class="fas fa-key"></i></span>';
            var pwdAddonShield = '<span class="input-group-addon"><i class="fas fa-shield-alt"></i></span>';
            var eyeBtn = '<span class="input-group-btn"><button type="button" class="btn btn-default toggle-pwd-btn" title="Reveal / Hide Password" onclick="' + toggleFn + '"><i class="fas fa-eye"></i></button></span>';

            var bodyHtml = '';
            if (isSelf && !this.getUser().isAdmin()) {
                bodyHtml += '<div class="cell form-group">' +
                    '<label class="control-label">' + (this.translate('currentPassword', 'fields', 'User') || 'Current Password') + '</label>' +
                    '<div class="input-group pwd-input-group">' + pwdAddonLock + '<input type="password" class="form-control" name="modalCurrentPassword" autocomplete="current-password" placeholder="' + (this.translate('currentPassword', 'fields', 'User') || 'Current Password') + '">' + eyeBtn + '</div>' +
                    '</div>';
            }
            bodyHtml += '<div class="cell form-group">' +
                '<label class="control-label">' + (this.translate('password', 'fields', 'User') || 'New Password') + '</label>' +
                '<div class="input-group pwd-input-group">' + pwdAddonKey + '<input type="password" class="form-control" name="modalPassword" autocomplete="new-password" placeholder="' + (this.translate('password', 'fields', 'User') || 'New Password') + '">' + eyeBtn + '</div>' +
                '</div>' +
                '<div class="cell form-group">' +
                '<label class="control-label">' + (this.translate('passwordConfirm', 'fields', 'User') || 'Confirm Password') + '</label>' +
                '<div class="input-group pwd-input-group">' + pwdAddonShield + '<input type="password" class="form-control" name="modalPasswordConfirm" autocomplete="new-password" placeholder="' + (this.translate('passwordConfirm', 'fields', 'User') || 'Confirm Password') + '">' + eyeBtn + '</div>' +
                '</div>';

            this.createView('changePasswordModal', 'views/modal', {
                title: title,
                backdrop: true,
                body: bodyHtml,
                buttons: [
                    {
                        name: 'save',
                        label: this.translate('Save') || 'Save',
                        style: 'primary',
                        onClick: function (dialog) {
                            var $currentPwd = dialog.$el.find('input[name="modalCurrentPassword"]');
                            var $pwd = dialog.$el.find('input[name="modalPassword"]');
                            var $pwdConfirm = dialog.$el.find('input[name="modalPasswordConfirm"]');

                            var currentPassword = $currentPwd.length ? $currentPwd.val() : null;
                            var password = $pwd.val();
                            var passwordConfirm = $pwdConfirm.val();

                            if (isSelf && !self.getUser().isAdmin() && !currentPassword) {
                                self.notify(self.translate('fieldIsRequired', 'messages').replace('{field}', 'Current Password'), 'error');
                                return;
                            }
                            if (!password) {
                                self.notify(self.translate('fieldIsRequired', 'messages').replace('{field}', 'Password'), 'error');
                                return;
                            }
                            if (password !== passwordConfirm) {
                                self.notify(self.translate('passwordsNotMatch', 'messages') || 'Passwords do not match', 'error');
                                return;
                            }

                            self.notify('Saving...', 'loading');

                            var promise;
                            if (isSelf && !self.getUser().isAdmin()) {
                                promise = self.getAjax().put('UserSecurity/password', {
                                    currentPassword: currentPassword,
                                    password: password
                                });
                            } else {
                                promise = self.getAjax().put('User/' + self.model.id, {
                                    password: password,
                                    passwordConfirm: passwordConfirm
                                });
                            }

                            promise.then(function () {
                                self.notify('Password updated successfully', 'success');
                                dialog.close();
                            }).catch(function (xhr) {
                                var msg = 'Error';
                                if (xhr && xhr.responseJSON && xhr.responseJSON.message) {
                                    msg = xhr.responseJSON.message;
                                }
                                self.notify(msg, 'error');
                            });
                        }
                    },
                    {
                        name: 'cancel',
                        label: this.translate('Cancel') || 'Cancel',
                        onClick: function (dialog) {
                            dialog.close();
                        }
                    }
                ]
            }, function (view) {
                view.render();
            });
        },

        handleQuotaAndAdminPanelVisibility: function () {
            if (!this.getUser().isAdmin()) {
                var fields = [
                    'cMaxAccountsQuota',
                    'cMaxLeadsQuota',
                    'cMaxContactsQuota',
                    'cMaxOpportunitiesQuota',
                    'cMaxUsersQuota',
                    'cEnableAdminAccess',
                    'cAllowedAdminItems'
                ];

                fields.forEach(function (field) {
                    this.hideField(field);
                }.bind(this));

                if (this.isRendered()) {
                    this.$el.find('.panel').each(function (i, el) {
                        var $el = $(el);
                        var text = $el.text();
                        if (text.indexOf('Creation Quotas') !== -1 || text.indexOf('Administration Access') !== -1) {
                            $el.hide();
                        }
                    });
                }
            }
        }
    });
});
