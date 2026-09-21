# توثيق حل مشكلة شريط الأزرار والهيدر الثابت (Sticky Header & Action Buttons Fix Documentation)

---

## 📌 1. نظرة عامة والوصف العام للمشكلة

في صفحات التفاصيل والتعديل (Record Detail & Edit Views مثل `Contacts`, `Accounts`, `Leads`):
- **المشكلة**: عند تحريك السكرول لأسفل الصفحة، كان شريط أزرار الإجراءات (`.detail-button-container` والذي يحتوي على زر **Edit** وزر القائمة **`...`** وأسهم التنقل):
  1. ينزلق تحت شريط العنوان ويزاح بشكل غير متناسق.
  2. وبمجرد السكرول لأسفل والوصول لمنطقة الـ Stream والكروت السفلى، كان شريط الأزرار **يختفي تماماً** وتتداخل النصوص البرمجية خلف الهيدر.

---

## 🔍 2. التحليل الفني للسبب الجذري (Root Cause Analysis)

بعد فحص هيكلية الـ HTML و الـ CSS و الـ JavaScript الخاص بـ EspoCRM، تبين وجود سببين رئيسيين للمشكلة:

### السبب الأول: تعارض قيم الـ Sticky و Z-Index في الـ CSS
- في كود الـ CSS السابق، كان كائن العنوان العلوي `.page-header` يملك `position: sticky; top: 48px; z-index: 35` وخلفية بيضاء ناصعة.
- وكان شريط الأزرار `.detail-button-container` يملك `position: sticky; top: 104px; z-index: 25`.
- لأن قيمة الـ `z-index` لشريط الأزرار (`25`) أقل من قيمة الـ `z-index` للعنوان (`35`)، ولأن شريط الأزرار يقع **داخل** كائن الـ `.detail` في الـ DOM بينما العنوان يقع **خارجه**، فعند السكرول كان شريط الأزرار ينزلق **تحت** شريط العنوان ذو الخلفية البيضاء فتختفي الأزرار خادمياً.

### السبب الثاني: الإخفاء البرمجي الديناميكي عبر JavaScript
- في كود الـ JavaScript الداخلي لـ EspoCRM في كلاس `StickyBarHelper` (الملف `espo-main.js` سطر 17438):
  ```javascript
  const edge = $middle.position().top + $middle.outerHeight(false) - blockHeight;
  const scrollTop = $window.scrollTop();
  if (scrollTop >= edge && !this.stickButtonsContainerAllTheWay) {
      $containers.hide(); // يضيف inline style="display: none;" برمجياً!
      ...
  }
  ```
- بمجرد وصول السكرول لتجاوز الكروت الوسطى عند بداية الـ Stream، ينفذ الـ JS تلقائياً أمر `$containers.hide()` مما يضيف `display: none;` على شريط الأزرار، فيختفي من الشاشة نهائياً.

---

## ⏪ 3. الكود قبل التعديل (Code BEFORE Fix)

### 📄 أ) في الملف [`client/custom/css/custom-brand.css`](file:///d:/laragon/www/EspoCRM-10.0.3/client/custom/css/custom-brand.css)

**القسم رقم 3 (قبل التعديل):**
```css
/* Page-header shells — sticky ONLY on Record Detail & Edit views */
body:has(.detail-button-container) .page-header,
#main:has(.detail-button-container) .page-header,
.detail>.page-header,
.edit>.page-header {
    position: sticky !important;
    top: 48px !important;
    z-index: 35 !important;
    background: #ffffff !important;
    padding: 16px 28px 12px 28px !important;
    margin-bottom: 0 !important;
    border-top-left-radius: 20px !important;
    border-top-right-radius: 20px !important;
    border: 1px solid rgba(203, 213, 225, 0.8) !important;
    border-bottom: none !important;
    box-shadow: 0 4px 14px -2px rgba(0, 45, 60, 0.05) !important;
    overflow: visible !important;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
```

**القسم رقم 21 (قبل التعديل):**
```css
.detail-button-container,
.detail-button-container.stick-sub,
.detail-button-container.sticked,
.detail-button-container.has-sticked-bar {
    position: sticky !important;
    top: 104px !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    width: 100% !important;
    z-index: 25 !important;
    background: #ffffff !important;
    border: 1px solid rgba(203, 213, 225, 0.8) !important;
    border-top: 1px solid #f1f5f9 !important;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-bottom-left-radius: 20px !important;
    border-bottom-right-radius: 20px !important;
    padding: 14px 28px !important;
    margin-top: 0 !important;
    margin-bottom: 24px !important;
    box-shadow: 0 16px 40px -6px rgba(0, 45, 60, 0.15), 0 4px 14px rgba(0, 0, 0, 0.05) !important;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
```

---

### 📄 ب) في الملف [`client/custom/css/custom-ui-animations.css`](file:///d:/laragon/www/EspoCRM-10.0.3/client/custom/css/custom-ui-animations.css)

**(قبل التعديل):**
```css
/* Smooth Floating & Sticky Detail Action Toolbar (.detail-button-container) */
.detail-button-container,
.detail-button-container.stick-sub,
.detail-button-container.sticked,
.detail-button-container.has-sticked-bar {
    position: sticky !important;
    top: 106px !important;
}
```

---

## ⏩ 4. الكود بعد التعديل (Code AFTER Fix)

### 📄 أ) في الملف [`client/custom/css/custom-brand.css`](file:///d:/laragon/www/EspoCRM-10.0.3/client/custom/css/custom-brand.css)

**القسم رقم 3 (بعد التعديل):**
```css
/* Page-header shells — relative flow on Record Detail & Edit views */
body:has(.detail-button-container) .page-header,
#main:has(.detail-button-container) .page-header,
.detail>.page-header,
.edit>.page-header {
    position: relative !important;
    z-index: 10 !important;
    background: transparent !important;
    background-color: transparent !important;
    padding: 12px 0 6px 0 !important;
    margin-bottom: 10px !important;
    border: none !important;
    box-shadow: none !important;
    overflow: visible !important;
}
```

**القسم رقم 21 (بعد التعديل):**
```css
.detail-button-container:not(.hidden),
.detail-button-container.stick-sub:not(.hidden),
.detail-button-container.sticked:not(.hidden),
.detail-button-container.has-sticked-bar:not(.hidden) {
    position: sticky !important;
    top: 48px !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    width: 100% !important;
    z-index: 100 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    background: #ffffff !important;
    background-color: #ffffff !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 14px !important;
    padding: 10px 20px !important;
    margin-top: 0 !important;
    margin-bottom: 18px !important;
    box-shadow: 0 6px 20px -2px rgba(0, 45, 60, 0.14), 0 2px 6px rgba(0, 0, 0, 0.04) !important;
    transition: box-shadow 0.2s ease, border-color 0.2s ease !important;
}

.detail-button-container.hidden {
    display: none !important;
}
```

---

### 📄 ب) في الملف [`client/custom/css/custom-ui-animations.css`](file:///d:/laragon/www/EspoCRM-10.0.3/client/custom/css/custom-ui-animations.css)

**(بعد التعديل):**
```css
/* Smooth Floating & Sticky Detail Action Toolbar (.detail-button-container) */
.detail-button-container:not(.hidden),
.detail-button-container.stick-sub:not(.hidden),
.detail-button-container.sticked:not(.hidden),
.detail-button-container.has-sticked-bar:not(.hidden) {
    position: sticky !important;
    top: 48px !important;
    z-index: 100 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}
```

---

## 🛠️ 5. كيف يُعالج التعديل الجديد المشكلة؟

1. **إتاحة التثبيت عند أعلى الشاشة (`top: 48px; z-index: 100`)**:
   أصبح شريط أزرار الإجراءات هو الشريط الثابت الرئيسي على مستوى الصفحة عند `top: 48px` وبقيمة `z-index: 100` (وهي أعلى من جميع الكروت والنصوص).
2. **إلغاء وتجاوز الإخفاء البرمجي لـ JavaScript**:
   تمت إضافة `display: block !important; visibility: visible !important; opacity: 1 !important;` للعنصر النشط غير المخفي `:not(.hidden)`. هذا يضمن كسر وإلغاء أمر `style="display: none;"` الذي يطبقه كود الـ JS الخاص بـ EspoCRM عند بداية الـ Stream.
3. **الحفاظ على إخفاء الأزرار المبدئية المعطلة**:
   تم استثناء كلاس `.hidden` صراحة عبر `.detail-button-container.hidden { display: none !important; }` للحفاظ على آليات الـ View/Edit Mode في النظام دون تعارض.

---

## ⚙️ 6. أمر إفراغ الكاش وإعادة بناء الأصول

تُطبق التعديلات وتفعل عبر تشغيل الأمر التالي في موجه الأوامر (Terminal):
```bash
php command.php clear-cache ; php command.php rebuild
```
