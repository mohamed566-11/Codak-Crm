define('custom:views/html-preview/index', ['view'], function (Dep) {
    return Dep.extend({
        templateContent: `
            <div class="page-header">
                <h3>
                    <span class="fab fa-html5 text-danger"></span>
                    {{translate 'HTML Preview Tool'}}
                </h3>
            </div>
            
            <div class="html-preview-tool-container row">
                <!-- Left Column: Code Editor -->
                <div class="col-md-6">
                    <div class="panel panel-default html-editor-panel">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <span class="fas fa-code"></span> HTML Code Editor
                            </h4>
                            <div class="btn-group pull-right">
                                <button class="btn btn-xs btn-default action-insert" data-template="card">Add Card</button>
                                <button class="btn btn-xs btn-default action-insert" data-template="button">Add Button</button>
                                <button class="btn btn-xs btn-default action-insert" data-template="table">Add Table</button>
                                <button class="btn btn-xs btn-warning action-clear">Clear</button>
                            </div>
                        </div>
                        <div class="panel-body">
                            <textarea id="html-code-input" class="form-control html-textarea" rows="16" placeholder="Type or paste your HTML code here..."></textarea>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Real-time Live Preview -->
                <div class="col-md-6">
                    <div class="panel panel-default html-preview-panel">
                        <div class="panel-heading">
                            <h4 class="panel-title">
                                <span class="fas fa-eye"></span> Live Preview Screen
                            </h4>
                        </div>
                        <div class="panel-body">
                            <div id="html-live-output" class="html-live-output-canvas"></div>
                        </div>
                    </div>
                </div>
            </div>
        `,

        events: {
            'input #html-code-input': 'updatePreview',
            'click .action-clear': 'clearCode',
            'click .action-insert': 'insertTemplate'
        },

        setup: function () {
            Dep.prototype.setup.call(this);
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            // Default Initial HTML Content
            var initialHtml = `<div style="padding: 20px; background: linear-gradient(135deg, #005a70 0%, #007c9b 100%); color: white; border-radius: 12px; font-family: sans-serif;">
    <h2 style="margin-top: 0; color: white;">👋 Welcome to CodakCRM HTML Preview!</h2>
    <p>Type any HTML content in the editor on the left to see live real-time rendering here.</p>
    <button style="background: #00a4c8; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">
        Codak Interactive Button
    </button>
</div>`;

            var $input = this.$el.find('#html-code-input');
            $input.val(initialHtml);
            this.updatePreview();
        },

        updatePreview: function () {
            var code = this.$el.find('#html-code-input').val();
            this.$el.find('#html-live-output').html(code);
        },

        clearCode: function () {
            this.$el.find('#html-code-input').val('').focus();
            this.updatePreview();
        },

        insertTemplate: function (e) {
            var templateType = $(e.currentTarget).data('template');
            var sampleCode = '';

            if (templateType === 'card') {
                sampleCode = '\n<div class="card" style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 10px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">\n    <h3 style="color: #005a70; margin-top:0;">Card Title</h3>\n    <p style="color: #64748b;">This is a sample card component inside CodakCRM HTML Preview tool.</p>\n</div>\n';
            } else if (templateType === 'button') {
                sampleCode = '\n<button class="btn btn-primary" style="background: #005a70; border: none; border-radius: 6px; padding: 8px 16px; color: #fff; font-weight: 600;">Custom Button</button>\n';
            } else if (templateType === 'table') {
                sampleCode = '\n<table class="table table-bordered" style="width:100%;">\n    <thead><tr style="background:#f1f5f9;"><th>Item</th><th>Status</th></tr></thead>\n    <tbody><tr><td>Project Alpha</td><td><span class="label label-success">Active</span></td></tr></tbody>\n</table>\n';
            }

            var $input = this.$el.find('#html-code-input');
            $input.val($input.val() + sampleCode);
            this.updatePreview();
        }
    });
});
