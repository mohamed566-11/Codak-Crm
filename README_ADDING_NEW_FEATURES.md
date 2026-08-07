# 🚀 دليل إضافة ميزة جديدة في CodakCRM (Tier-4 Custom Feature Guide)

هذا المستند يشرح بالتفصيل وبخطوات عملية كيفية إنشاء وإضافة **ميزة جديدة بالكامل (Custom Feature / Scope)** في نظام **CodakCRM**، استناداً إلى المعمارية القياسية وحقن الميزات على **الطبقة الرابعة (Tier-4 Architecture)** دون المساس بكود النواة الأساسي.

---

## 📌 المعمارية والقواعد الأساسية (Core Principles)

1. **الطبقة الرابعة فقط (Tier-4 Only):** جميع الميزات والملفات الجديدة توضع حصراً تحت:
   - Backend Metadata & Logic: `custom/Espo/Custom/...`
   - Frontend JS Views & Controllers: `client/custom/src/...`
2. **عدم مساس كود النواة (Zero Core Mutation):** لا يتم تعديل أو حذف أي ملف تحت `application/Espo/` أو `client/lib/`.
3. **التشغيل وإعادة التجميع (Build Pipeline):** بعد إضافة أي ملفات أو تعديل Metadata، يتم تنفيذ الأمرين:
   ```bash
   php command.php clear-cache
   php command.php rebuild
   ```

---

## 🛠️ الخطوات التوضيحية البسيطة (مثال ميزة `HtmlPreview` المنفذة)

تتكون أي ميزة فرونت-إند جديدة من **5 مكونات رئيسية**:

```
EspoCRM Project Root
├── client/custom/src/
│   ├── views/html-preview/index.js        <-- [1] واجهة العرض والتفاعل (View)
│   └── controllers/html-preview.js        <-- [2] معالج التوجيه (Controller)
└── custom/Espo/Custom/Resources/
    ├── metadata/app/clientRoutes.json     <-- [3] تعريف المسار (#HtmlPreview)
    ├── metadata/scopes/HtmlPreview.json   <-- [4] تعريف نطاق الميزة (Scope)
    └── i18n/en_US/Global.json             <-- [5] ترجمة اسم الميزة للقائمة
```

---

### 1️⃣ الخطوة الأولى: إنشاء ملف واجهة العرض (Client View)
أنشئ ملف العرض في المسار: `client/custom/src/views/html-preview/index.js`

```javascript
define('custom:views/html-preview/index', ['view'], function (Dep) {
    return Dep.extend({
        // 1. هيكل الـ HTML الخاص بالصفحة
        templateContent: `
            <div class="page-header">
                <h3>HTML Preview Tool</h3>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <textarea id="html-code-input" class="form-control" rows="12"></textarea>
                </div>
                <div class="col-md-6">
                    <div id="html-live-output"></div>
                </div>
            </div>
        `,

        // 2. الأحداث والتفاعلات (Event Listeners)
        events: {
            'input #html-code-input': 'updatePreview'
        },

        // 3. كود التنفيذ بعد رندر الصفحة
        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            this.updatePreview();
        },

        // 4. الدالة المنفذة عند التفاعل
        updatePreview: function () {
            var code = this.$el.find('#html-code-input').val();
            this.$el.find('#html-live-output').html(code);
        }
    });
});
```

---

### 2️⃣ الخطوة الثانية: إنشاء ملف معالج المسار (Client Controller)
أنشئ ملف الـ Controller في المسار: `client/custom/src/controllers/html-preview.js`

```javascript
define('custom:controllers/html-preview', ['controllers/base'], function (Dep) {
    return Dep.extend({
        // الدالة الرئيسية عند فتح رابط الميزة #HtmlPreview
        actionIndex: function () {
            this.main('custom:views/html-preview/index');
        }
    });
});
```

---

### 3️⃣ الخطوة الثالثة: تسجيل مسار الميزة (Register Client Route)
أضف مسار الرابط في الملف: `custom/Espo/Custom/Resources/metadata/app/clientRoutes.json`

```json
{
    "HtmlPreview": {
        "params": {
            "controller": "custom:controllers/html-preview",
            "action": "index"
        }
    }
}
```

---

### 4️⃣ الخطوة الرابعة: تسجيل نطاق الميزة (Register Scope Metadata)
أنشئ ملف الـ Scope في المسار: `custom/Espo/Custom/Resources/metadata/scopes/HtmlPreview.json`

```json
{
    "entity": false,
    "tab": true,
    "acl": false,
    "customizable": false
}
```

---

### 5️⃣ الخطوة الخامسة: الترجمة والإدراج في القائمة الجانبية (Sidebar & Translation)

1. **إضافة اسم التبويب في الترتيب المفضل:** في ملف `data/config.php` داخل مصفوفة `'tabList'`:
   ```php
   'tabList' => [
       0 => 'Account',
       1 => 'Contact',
       2 => 'Lead',
       3 => 'Opportunity',
       4 => 'HtmlPreview',  // <-- موقع الميزة الجديدة
   ],
   ```

2. **ترجمة الاسم المكتوب في القائمة:** في الملف `custom/Espo/Custom/Resources/i18n/en_US/Global.json`:
   ```json
   {
       "scopeNamesPlural": {
           "HtmlPreview": "HTML Preview"
       }
   }
   ```

---

## ⚡ خطوة التفعيل والتشغيل (Activation & Deployment)

بعد إنشاء الملفات الخمسة السابقة، نفّذ الأوامر التالية من الـ Terminal لتفريغ الكاش وإعادة بناء النظام:

```bash
php command.php clear-cache
php command.php rebuild
```

ثم افتح المتصفح واعمل **`Ctrl + Shift + R`** (Hard Refresh) وسوف تظهر الميزة الجديدة فوراً في القائمة الجانبية وتعمل بكفاءة عالية!
