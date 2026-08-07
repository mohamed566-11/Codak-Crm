# دليل استبدال Footer في EspoCRM — الطريقة الصحيحة النهائية

## 🔍 كيف يعمل الـ Footer في EspoCRM؟

```
PHP (ClientManager.php)
  └── يقرأ html/main.html ويبدّل {{variables}}
        └── يحمّل espo-main.js
              └── Backbone.js يرنّدر views/site/footer
                    └── يقرأ template "site/footer" من client/lib/templates.tpl
                          └── يعرض <p class="credit small">...</p>
```

---

## 📋 الملفات المطلوبة

### ✅ الملفات التي يجب إنشاؤها (Create)

| الملف | الغرض |
|-------|-------|
| [client/custom/css/el-hany-footer.css](file:///d:/laragon/www/EspoCRM-9.3.8/client/custom/css/el-hany-footer.css) | إخفاء `.credit` القديم |
| [client/custom/src/el-hany-footer-aggressive.js](file:///d:/laragon/www/EspoCRM-9.3.8/client/custom/src/el-hany-footer-aggressive.js) | حقن الفوتر الجديد ديناميكياً |
| [custom/Espo/Custom/Resources/metadata/app/client.json](file:///d:/laragon/www/EspoCRM-9.3.8/custom/Espo/Custom/Resources/metadata/app/client.json) | تسجيل الـ CSS والـ JS في النظام |

### ✅ الملفات التي يجب تعديلها (Edit)

| الملف | ماذا نعدّل |
|-------|-----------|
| [client/res/templates/site/footer.tpl](file:///d:/laragon/www/EspoCRM-9.3.8/client/res/templates/site/footer.tpl) | استبدال محتواه بـ footer الجديد |

---

## 📝 محتوى كل ملف

### 1. [client/custom/css/el-hany-footer.css](file:///d:/laragon/www/EspoCRM-9.3.8/client/custom/css/el-hany-footer.css)
```css
/* إخفاء الفوتر الأصلي */
footer p.credit,
footer .credit,
#footer p.credit,
#footer .credit {
    display: none !important;
}

/* El Hany footer styles */
.el-hany-footer-container {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    padding: 10px 0 !important;
}
.el-hany-copyright {
    display: inline-flex !important;
    align-items: center !important;
    color: #555 !important;
    font-size: 13px !important;
    font-family: 'Inter', 'Segoe UI', sans-serif !important;
    margin: 0 !important;
}
.el-hany-brand {
    color: #1a1a2e !important;
    font-weight: 600 !important;
    margin-left: 5px !important;
}
```

---

### 2. [client/custom/src/el-hany-footer-aggressive.js](file:///d:/laragon/www/EspoCRM-9.3.8/client/custom/src/el-hany-footer-aggressive.js)
```javascript
(function () {
    'use strict';
    var isApplying = false;

    function applyFooter() {
        if (isApplying) return;
        isApplying = true;
        try {
            var footer = document.querySelector('footer, #footer');
            if (!footer) return;

            // إخفاء العناصر القديمة
            footer.querySelectorAll('.credit, p.credit, a[href*="espocrm.com"]')
                .forEach(function(el) {
                    el.style.setProperty('display', 'none', 'important');
                });

            // حقن الفوتر الجديد (مرة واحدة فقط)
            if (footer.querySelector('.el-hany-footer-container')) return;

            var container = document.createElement('div');
            container.className = 'el-hany-footer-container';
            container.innerHTML = '<p class="el-hany-copyright">&copy; 2026 <span class="el-hany-brand">El Hany</span></p>';
            footer.appendChild(container);
        } finally {
            isApplying = false;
        }
    }

    applyFooter();

    // مراقبة DOM — childList فقط (بدون attributes لتجنب اللوب)
    var observer = new MutationObserver(applyFooter);
    document.addEventListener('DOMContentLoaded', function () {
        applyFooter();
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    });

    window.addEventListener('load', applyFooter);
})();
```

---

### 3. [custom/Espo/Custom/Resources/metadata/app/client.json](file:///d:/laragon/www/EspoCRM-9.3.8/custom/Espo/Custom/Resources/metadata/app/client.json)
```json
{
    "scriptList": [
        "__APPEND__",
        "client/custom/src/el-hany-footer-aggressive.js"
    ],
    "linkList": [
        "__APPEND__",
        {
            "href": "client/custom/css/el-hany-footer.css",
            "rel": "stylesheet"
        }
    ]
}
```

---

### 4. [client/res/templates/site/footer.tpl](file:///d:/laragon/www/EspoCRM-9.3.8/client/res/templates/site/footer.tpl)
```html
<div class="el-hany-footer-container">
    <p class="el-hany-copyright">
        &copy; 2026 <span class="el-hany-brand">El Hany</span>
    </p>
</div>
```

---

## ⚡ الأوامر التي يجب تشغيلها

```bash
php command.php clear-cache
php command.php rebuild
php command.php update-app-timestamp
```

---

## 🌀 المتصفح بعد التعديلات

افتح DevTools → Network → فعّل **Disable Cache**، ثم اضغط `Ctrl + Shift + R`

---

## ⚠️ أهم نقطة تعلّمناها

> الـ `rebuild` يعيد بناء [client/lib/templates.tpl](file:///d:/laragon/www/EspoCRM-9.3.8/client/lib/templates.tpl) تلقائياً من ملفات [.tpl](file:///d:/laragon/www/EspoCRM-9.3.8/client/lib/templates.tpl)  
> لذلك تعديل [client/res/templates/site/footer.tpl](file:///d:/laragon/www/EspoCRM-9.3.8/client/res/templates/site/footer.tpl) مباشرةً ثم `rebuild` هو الطريقة الصحيحة  
> وليس تعديل [templates.tpl](file:///d:/laragon/www/EspoCRM-9.3.8/client/lib/templates.tpl) يدوياً (لأن الـ `rebuild` سيتجاهله)

