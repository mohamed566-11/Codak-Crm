define('custom:views/user/record/edit', ['views/user/record/edit'], function (Dep) {
    return Dep.extend({

        setup: function () {
            Dep.prototype.setup.call(this);
            this.handleQuotaAndAdminPanelVisibility();

            this.listenTo(this, 'before:save', function () {
                this.syncCustomPasswordFields();
            }.bind(this));
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);

            var isTargetAdmin = this.model.isAdmin ? this.model.isAdmin() : (this.model.get('type') === 'admin');
            var isUserAdmin = this.getUser().isAdmin();
            if (!isUserAdmin && isTargetAdmin) {
                this.notify('Access denied', 'error');
                this.getRouter().navigate('#User', { trigger: true });
                return;
            }

            this.handleQuotaAndAdminPanelVisibility();
            this.enhanceAdminPasswordFields();

            if (this._pwdObserver) {
                this._pwdObserver.disconnect();
                this._pwdObserver = null;
            }

            if (this.$el[0]) {
                var self = this;
                this._pwdObserver = new MutationObserver(function () {
                    self.enhanceAdminPasswordFields();
                });
                this._pwdObserver.observe(this.$el[0], { childList: true, subtree: true });
            }

            this.once('remove', function () {
                if (this._pwdObserver) {
                    this._pwdObserver.disconnect();
                    this._pwdObserver = null;
                }
            }.bind(this));

            this.$el.off('click', '.toggle-pwd-btn').on('click', '.toggle-pwd-btn', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $btn = $(this);
                var $group = $btn.closest('.pwd-input-group');
                var $input = $group.find('input');
                var $icon = $btn.find('i');

                if ($input.attr('type') === 'password') {
                    $input.attr('type', 'text');
                    $icon.attr('class', 'fas fa-eye-slash');
                    $btn.addClass('is-active');
                } else {
                    $input.attr('type', 'password');
                    $icon.attr('class', 'fas fa-eye');
                    $btn.removeClass('is-active');
                }
            });

            this._userTypedPassword = false;
            this.$el.off('input change keyup', 'input[name="password"], input[name="passwordConfirm"]')
                .on('input change keyup', 'input[name="password"], input[name="passwordConfirm"]', function () {
                    self._userTypedPassword = true;
                });

            this.clearPreFilledAdminPassword();
        },

        clearPreFilledAdminPassword: function () {
            var self = this;
            if (this._userTypedPassword) {
                return;
            }
            var clearInputs = function () {
                if (self._userTypedPassword) {
                    return;
                }
                self.$el.find('.cell[data-name="password"] input, .cell[data-name="passwordConfirm"] input, input[name="password"], input[name="passwordConfirm"]').each(function () {
                    var $inp = $(this);
                    $inp.attr('autocomplete', 'new-password');
                    if (!self._userTypedPassword && !$inp.is(':focus') && $inp.val()) {
                        $inp.val('');
                    }
                });
                if (self.model && !self._userTypedPassword) {
                    self.model.unset('password', { silent: true });
                    self.model.unset('passwordConfirm', { silent: true });
                }
            };

            clearInputs();
            setTimeout(clearInputs, 100);
        },

        enhanceAdminPasswordFields: function () {
            var self = this;
            var toggleFn = "var grp=this.closest('.pwd-input-group'); var inp=grp.querySelector('input'); var ico=this.querySelector('i'); if(inp.type==='password'){inp.type='text';ico.className='fas fa-eye-slash';this.classList.add('is-active');}else{inp.type='password';ico.className='fas fa-eye';this.classList.remove('is-active');}";

            this.$el.find('.cell[data-name="password"]').each(function () {
                var $cell = $(this);
                var $input = $cell.find('input[name="password"], input[type="password"]');
                if ($input.length) {
                    $input.attr('autocomplete', 'new-password');
                    if (!$input.parent().hasClass('pwd-input-group')) {
                        $input.attr('placeholder', self.translate('enterPassword', 'messages') || 'Enter password');
                        $input.wrap('<div class="input-group pwd-input-group"></div>');
                        var $group = $input.parent();
                        $group.prepend('<span class="input-group-addon"><i class="fas fa-key"></i></span>');
                        $group.append('<span class="input-group-btn"><button type="button" class="btn btn-default toggle-pwd-btn" title="Reveal / Hide Password" onclick="' + toggleFn + '"><i class="fas fa-eye"></i></button></span>');
                    }
                }
            });

            this.$el.find('.cell[data-name="passwordConfirm"]').each(function () {
                var $cell = $(this);
                var $input = $cell.find('input[name="passwordConfirm"], input[type="password"]');
                if ($input.length) {
                    $input.attr('autocomplete', 'new-password');
                    if (!$input.parent().hasClass('pwd-input-group')) {
                        $input.attr('placeholder', self.translate('confirmPassword', 'messages') || 'Confirm password');
                        $input.wrap('<div class="input-group pwd-input-group"></div>');
                        var $group = $input.parent();
                        $group.prepend('<span class="input-group-addon"><i class="fas fa-shield-alt"></i></span>');
                        $group.append('<span class="input-group-btn"><button type="button" class="btn btn-default toggle-pwd-btn" title="Reveal / Hide Password" onclick="' + toggleFn + '"><i class="fas fa-eye"></i></button></span>');
                    }
                }
            });

            this.$el.find('.cell[data-name="generatePassword"] button, button[data-action="generatePassword"]').each(function () {
                var $btn = $(this);
                if (!$btn.hasClass('pwd-gen-btn')) {
                    $btn.removeClass('btn-default').addClass('pwd-gen-btn');
                    if ($btn.find('i.fa-magic').length === 0) {
                        $btn.prepend('<i class="fas fa-magic"></i> ');
                    }
                }
            });
        },

        fetch: function () {
            var data = Dep.prototype.fetch.call(this);
            if (!this.getUser().isAdmin() && this.canEditPassword()) {
                var $pwd = this.$el.find('input[name="customPasswordInput"]');
                var $pwdConfirm = this.$el.find('input[name="customPasswordConfirmInput"]');
                if ($pwd.length && $pwd.val()) {
                    data.password = $pwd.val();
                    data.passwordConfirm = $pwdConfirm.val();
                    this.model.set({
                        password: $pwd.val(),
                        passwordConfirm: $pwdConfirm.val()
                    }, { silent: true });
                }
            }
            return data;
        },

        syncCustomPasswordFields: function () {
            if (!this.getUser().isAdmin() && this.canEditPassword()) {
                var $pwd = this.$el.find('input[name="customPasswordInput"]');
                var $pwdConfirm = this.$el.find('input[name="customPasswordConfirmInput"]');
                if ($pwd.length && $pwd.val()) {
                    this.model.set({
                        password: $pwd.val(),
                        passwordConfirm: $pwdConfirm.val()
                    }, { silent: true });
                }
            }
        },

        canEditPassword: function () {
            if (this.getUser().isAdmin()) {
                return true;
            }
            var currentUserId = this.getUser().id;
            var targetUserId = this.model.id;
            var createdById = this.model.get('createdById');
            return (this.model.isNew() || (targetUserId && targetUserId === currentUserId) || (createdById && createdById === currentUserId));
        },

        getGridLayout: function (callback) {
            this.getHelper().layoutManager.get(
                this.model.entityType,
                this.options.layoutName || this.layoutName,
                function (simpleLayout) {
                    var layout = Espo.Utils.cloneDeep(simpleLayout);
                    var panels = [];

                    if (this.getUser().isAdmin() || this.getUser().get('cEnableAdminAccess')) {
                        panels.push({
                            "label": "Teams and Access Control",
                            "name": "accessControl",
                            "rows": [
                                [{ "name": "type" }, { "name": "isActive" }],
                                [{ "name": "teams" }, { "name": "defaultTeam" }],
                                [{ "name": "roles" }, false]
                            ]
                        });

                        panels.push({
                            "label": "Portal",
                            "name": "portal",
                            "rows": [
                                [{ "name": "portals" }, { "name": "accounts" }],
                                [{ "name": "portalRoles" }, { "name": "contact" }]
                            ]
                        });
                    }

                    if (this.getUser().isAdmin() && this.model.isPortal()) {
                        panels.push({
                            "label": "Misc",
                            "name": "portalMisc",
                            "rows": [
                                [{ "name": "dashboardTemplate" }, false]
                            ]
                        });
                    }

                    if (this.model.isAdmin() || this.model.isRegular()) {
                        panels.push({
                            "label": "Misc",
                            "name": "misc",
                            "rows": [
                                [{ "name": "workingTimeCalendar" }, { "name": "layoutSet" }]
                            ]
                        });
                    }

                    if (this.canEditPassword() && !this.model.isApi()) {
                        var pwdRows = [];
                        if (this.getUser().isAdmin()) {
                            pwdRows = [
                                [
                                    {
                                        name: 'password',
                                        type: 'password',
                                        params: { required: false, readyToChange: true },
                                        view: 'views/user/fields/password'
                                    },
                                    {
                                        name: 'generatePassword',
                                        view: 'views/user/fields/generate-password',
                                        customLabel: ''
                                    }
                                ],
                                [
                                    {
                                        name: 'passwordConfirm',
                                        type: 'password',
                                        params: { required: false, readyToChange: true },
                                        view: 'views/fields/password'
                                    },
                                    {
                                        name: 'passwordPreview',
                                        view: 'views/fields/base',
                                        params: { readOnly: true }
                                    }
                                ],
                                [
                                    { name: 'sendAccessInfo' },
                                    {
                                        name: 'passwordInfo',
                                        type: 'text',
                                        customLabel: '',
                                        customCode: this.passwordInfoMessage || ''
                                    }
                                ]
                            ];
                        } else {
                            var toggleFn = "var grp=this.closest('.pwd-input-group'); var inp=grp.querySelector('input'); var ico=this.querySelector('i'); if(inp.type==='password'){inp.type='text';ico.className='fas fa-eye-slash';this.classList.add('is-active');}else{inp.type='password';ico.className='fas fa-eye';this.classList.remove('is-active');}";

                            var pwdAddon = '<span class="input-group-addon"><i class="fas fa-key"></i></span>';
                            var pwdConfirmAddon = '<span class="input-group-addon"><i class="fas fa-shield-alt"></i></span>';
                            var eyeBtn = '<span class="input-group-btn"><button type="button" class="btn btn-default toggle-pwd-btn" title="Reveal / Hide Password" onclick="' + toggleFn + '"><i class="fas fa-eye"></i></button></span>';

                            pwdRows = [
                                [
                                    {
                                        name: 'customPassword',
                                        view: 'views/fields/base',
                                        customLabel: this.translate('password', 'fields', 'User') || 'Password',
                                        customCode: '<div class="input-group pwd-input-group">' + pwdAddon + '<input type="password" class="form-control main-element" name="customPasswordInput" autocomplete="new-password" placeholder="' + (this.translate('enterPassword', 'messages') || 'Enter password') + '">' + eyeBtn + '</div>'
                                    },
                                    {
                                        name: 'customPasswordConfirm',
                                        view: 'views/fields/base',
                                        customLabel: this.translate('passwordConfirm', 'fields', 'User') || 'Confirm Password',
                                        customCode: '<div class="input-group pwd-input-group">' + pwdConfirmAddon + '<input type="password" class="form-control main-element" name="customPasswordConfirmInput" autocomplete="new-password" placeholder="' + (this.translate('confirmPassword', 'messages') || 'Confirm password') + '">' + eyeBtn + '</div>'
                                    }
                                ]
                            ];
                        }

                        panels.push({
                            label: 'Password',
                            name: 'passwordSectionPanel',
                            rows: pwdRows
                        });
                    }

                    var inserted = false;
                    for (var i = 0; i < layout.length; i++) {
                        if (layout[i].tabBreak && i > 0) {
                            layout.splice(i, 0, ...panels);
                            inserted = true;
                            break;
                        }
                    }
                    if (!inserted) {
                        layout.push(...panels);
                    }

                    this.detailLayout = layout;
                    var result = {
                        type: 'record',
                        layout: this.convertDetailLayout(layout)
                    };

                    callback(result);
                }.bind(this)
            );
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
                    'cAllowedAdminItems',
                    'cAllowedDashboardSections'
                ];

                fields.forEach(function (field) {
                    this.hideField(field);
                }.bind(this));

                if (this.isRendered()) {
                    this.$el.find('.panel').each(function (i, el) {
                        var $el = $(el);
                        var text = $el.text();
                        if (
                            text.indexOf('Creation Quotas') !== -1 ||
                            text.indexOf('Administration Access') !== -1 ||
                            text.indexOf('Analytics Dashboard Access Control') !== -1
                        ) {
                            $el.hide();
                        }
                    });
                }
            }
        }
    });
});
