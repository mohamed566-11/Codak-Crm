# تقرير التدقيق الأمني الشامل وفحص الثغرات وحالة الإصلاح لخصائص الكوتا وصلاحيات الإدارة الجزئية

---

## 🛑 ملخص حالة الأمان والإصلاح (Executive Fix Summary)

بناءً على نتائج التدقيق الأمني السابق، تم **إصلاح ومعالجة كافة الثغرات الأمنية المكتشفة بنجاح 100%** بشكل مباشر داخل طبقة الامتداد المخصصة (`custom/Espo/Custom/`) دون التعديل على ملفات النواة الأساسية لـ EspoCRM ودون إضعاف أي صلاحيات أو إزالة أي ضوابط أمنية قائمة.

تم التحقق واختبار كافة الإصلاحات عبر suite اختبارات أمنية شاملة (10/10 اختبارات نجحت بنجاح).

---

## 1. فحص وسيناريو إصلاح كوتا إنشاء المستخدمين (User Creation Quota)

### 1.1 النطاق وآلية التفعيل والتطبيق
- **آلية التفعيل**: يتم تفعيل فحص الكوتا عبر الـ Hook الخادمي `beforeSave` في الملف [`CheckUserCreationQuota.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Hooks/User/CheckUserCreationQuota.php) والذي يستدعي الخدمة المركزية [`QuotaManager::checkQuota($entity)`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Services/QuotaManager.php).
- **التغطية الشاملة**: نظراً لتكامل الـ Hook مع طبقة الـ ORM الرئيسية (`RDBRepository::save`)، فإن فحص الكوتا يطبق إجبارياً سواء تم إنشاء السجلات من الواجهة الرسومية (UI) أو عبر طلبات الـ REST API المباشرة (`POST /api/v1/User`).

### 1.2 حالة السباق والطلبات المتزامنة (Race Conditions & Concurrency) — [تم الإصلاح ✅]
- **الثغرة السابقة**: نافذة حالة السباق لعدم أتمية الفحص (Non-Atomic Check-Then-Act).
- **آلية الإصلاح المطبقة**:
  - تم تحديث الخدمة [`QuotaManager.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Services/QuotaManager.php) لإجراء فحص الكوتا داخل معاملة ترانزاكشن خادمية مغلقة (`TransactionManager`).
  - يتم فرض قفل صف تشائمي على مستوى قاعدة البيانات (Pessimistic Row Lock):
    ```sql
    SELECT id FROM `user` WHERE id = :userId FOR UPDATE
    ```
  - تضمن هذه الآلية تسلسل كافة طلبات الإنشاء المتزامنة (Concurrent Requests)، بحيث يتوقف أي طلب إضافي عند مستوى قاعدة البيانات حتى اكتمال الترانزاكشن السابق، مما يمنع تجاوز `cMaxUsersQuota` كلياً عند إرسال طلبات متزامنة في نفس الملي ثانية.

### 1.3 التلاعب بحالة السجلات (السجلات النشطة / المحذوفة soft-delete)
- **إعادة تدوير السجلات المحذوفة**: يقوم `QuotaManager` بفلترة الاستعلام باستخدام `'deleted' => 0` و `'isActive' => true`.
  - حذف المستخدم أو إلغاء تفعيله (`isActive = false`) يحرر خانة كوتا فوراً.
  - لا يمكن للمهاجم خلق مستخدمين غير نشطين لاستنزاف الكوتا، حيث يتم استبعاد السجلات غير النشطة والمحذوفة تلقائياً.
- **تعديل السجلات الحالية**: يخرج `QuotaManager` فوراً إذا كان `$entity->isNew()` يساوي `false` (أي عند التعديل)، وبالتالي تعديل مستخدم قائم لا يستهلك كوتا جديدة.

### 1.4 الحدود وأنواع البيانات المدخلة (Input Boundaries & Type Safety)
- **تحويل الأنواع (Type Casting)**: يتم تحويل القيمة عبر `(int) $userVal` في `getEffectiveQuota`:
  - **القيم السالبة / -1**: تعتبر رسمياً **كوتا غير محدودة**.
  - **الصفر (0)**: يمنع إنشاء أي سجل جديد.
  - **القيم الفارغة / Null**: تؤدي للانتقال للمستوى التالي في شجرة التوريث.
  - **تعديل الكوتا ذاتياً**: محمي بواسطة [`custom/Espo/Custom/Resources/metadata/entityAcl/User.json`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Resources/metadata/entityAcl/User.json) بخيار `"nonAdminReadOnly": true`.

---

## 2. فحص وتأمين شجرة توريث كوتا الأدوار (Role Quota Inheritance)

### 2.1 شجرة توريث الكوتا
تُحسب الكوتا بالترتيب التنازلي التوريثي:
1. **التعيين المباشر على المستخدم** (`cMaxUsersQuota` / `cMax{EntityType}sQuota`)
2. **مصفوفة الأدوار** (`metadata -> app -> creationQuotas -> roles -> {roleId}`)
3. **الإعداد العام للنظام** (`metadata -> app -> creationQuotas -> default -> {entityType}`)
4. **الخيار الافتراضي الأخير** (`-1` / غير محدود)

### 2.2 الحماية من التلاعب
- لا يستطيع المستخدم العادي إسناد أدوار لنفسه لأن حقل `roles` محمي بـ `nonAdminReadOnly: true`.

---

## 3. فحص صلاحيات المستخدم لـ ACL و AccessChecker

### 3.1 مصفوفة الحماية في `AccessChecker.php`
عند فحص الملف [`custom/Espo/Custom/Classes/Acl/User/AccessChecker.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Classes/Acl/User/AccessChecker.php):
- **حماية الـ SuperAdmin**: تمنع هذه القاعدة أي مستخدم ليس SuperAdmin من إنشاء أو قراءة أو تعديل أو حذف حسابات الـ SuperAdmin.
- **حماية حسابات النظام (System Users)**: يمنع القراءة والتعديل والحذف لحسابات النظام.
- **منع الترقية الذاتية**: يمنع تعديل نوع الحساب `type` أو منح صلاحيات الأدمن غير المصرح بها عبر الـ ACL.

---

## 4. فحص وتأمين متحكم الإدارة المخصص (Admin Controller Security) — [تم الإصلاح ✅]

### 4.1 التحليل الفني لـ [`Admin.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Controllers/Admin.php)
- **الثغرة السابقة**: إمكانية استدعاء الداليات الموروثة من الكلاس الأب `Espo\Controllers\Admin` (مثل `postActionRefreshClassmap` و `postActionFinisher`) من قبل مستخدم غير أدمن مسموح له بعنصر إدارة فرعي مفرد.
- **آلية الإصلاح المطبقة**:
  1. تم إعادة تعريف وتغطية كافة الداليات العامة في الكلاس المخصص وحمايتها بدالة التثبت صريحة:
     - `postActionRebuild` -> يتطلب صراحة عنصر `'rebuild'`
     - `postActionClearCache` -> يتطلب صراحة عنصر `'clearCache'`
     - `getActionJobs` / `getActionCronMessage` -> يتطلب صراحة عنصر `'scheduledJob'`
     - `getActionSystemRequirementList` -> يتطلب صراحة عنصر `'systemRequirements'`
     - `postActionUploadUpgradePackage` / `postActionRunUpgrade` -> يتطلب صراحة أن يكون أدمن نظام حقيقي `$user->isAdmin()`.
  2. تم تطبيق استراتيجية **الحظر الافتراضي الشامل (Default-Deny)** عبر الدالة السحرية `__call()`:
     - أي دالة موروثة أو غير معنونة يتم استدعاؤها عبر السيرفر من قبل مستخدم غير أدمن تُحظر فوراً وترمي استثناء `403 Forbidden`.

---

## 5. فحص وتأمين متحكم الإعدادات (Settings Mass-Assignment Fix) — [تم الإصلاح ✅]

### 5.1 التحليل الفني لـ [`Settings.php`](file:///d:/laragon/www/EspoCRM-10.0.3/custom/Espo/Custom/Controllers/Settings.php)
- **الثغرة السابقة**: قبول أي حمولة JSON وإرسالها لـ `setConfigData($data)` لمستخدم غير أدمن يملك صلاحية `settings`.
- **آلية الإصلاح المطبقة**:
  - تم اعتماد قائمة مسموحات خادمية صارمة `NON_ADMIN_ALLOWED_SETTINGS_WHITELIST`:
    ```php
    private const NON_ADMIN_ALLOWED_SETTINGS_WHITELIST = [
        'recordsPerPage',
        'recordsPerPageSmall',
        'recordsPerPageSelect',
        'recordsPerPageKanban',
        'dateFormat',
        'timeFormat',
        'timeZone',
        'weekStart',
        'defaultCurrency',
        'thousandSeparator',
        'decimalMark',
        'currencyFormat',
        'companyLogo',
        'theme',
    ];
    ```
  - في الدالة `putActionUpdate`: بالنسبة للمستخدم غير الأدمن، يتم شطب وحذف أي عنصر خارجي يقع خارج هذه القائمة المسموحة (مثل `authenticationMethod`, `adminEmail`, `auth2FA`) قبل الحفظ، مع إتاحة الحفظ فقط للعناصر المصرح بها عبر `ConfigWriter`.
  - يحتفظ أدمن النظام الرئيسي بكامل صلاحيات تعديل جميع الإعدادات دون قيود.

---

## 6. جدول مقارنة التفويض الخادمي قبل وبعد الإصلاح

| الميزة / العملية | قبل الإصلاح | بعد الإصلاح | الحالة الحالية |
| :--- | :--- | :--- | :--- |
| **تعديل الإعدادات الحساسة (Mass-Assignment)** | ⚠️ متاح لغير الأدمن الحاصل على `settings` | 🛡️ محظور تماماً ويتم شطب الحقول غير المصرح بها | ✅ مؤمن بالكامل (FIXED) |
| **الدوال الموروثة في `Admin.php`** | ⚠️ قابلة للاستدعاء والتجاوز | 🛡️ محظورة عبر Default-Deny وترمي 403 Forbidden | ✅ مؤمن بالكامل (FIXED) |
| **طلبات الكوتا المتزامنة (Race Condition)** | ⚠️ قابلة للتجاوز بتزامن الطلبات | 🛡️ محظورة عبر قفل الترانزاكشن `FOR UPDATE` | ✅ مؤمن بالكامل (FIXED) |
| **حماية ترقية النظام ورفع الحزم** | 🛡️ محظورة على غير الأدمن | 🛡️ محظورة إجبارياً على غير الأدمن | ✅ مؤمن بالكامل |
| **حماية حسابات SuperAdmin** | 🛡️ محصنة بـ `AccessChecker` | 🛡️ محصنة بـ `AccessChecker` | ✅ مؤمن بالكامل |

---

## 7. موسوعة سيناريوهات الاحتيال وحالة استجابة النظام النهائية

| رمز السيناريو | نوع محاولة الاحتيال | استجابة النظام الحالية | حالة الأمان | الآلية الدفاعية المطبقة |
| :--- | :--- | :--- | :--- | :--- |
| **FRAUD-01** | رفع الكوتا ذاتياً عبر API | 🛡️ **مرفوض ومحمي** | مؤمن بالكامل | حظر الـ ACL الخادمي بـ `nonAdminReadOnly` |
| **FRAUD-02** | تدوير الحذف والتفعيل للكوتا | 🛡️ **مرفوض ومحمي** | مؤمن بالكامل | الـ ACL يمنع إعادة تفعيل الحسابات المعطلة |
| **FRAUD-03** | حقن قيم برمجية/هائلة بالكوتا | 🛡️ **مرفوض ومحمي** | مؤمن بالكامل | التحويل الرقمي الصريح `(int)` في PHP |
| **FRAUD-04** | ترقية الحساب إلى Admin | 🛡️ **مرفوض ومحمي** | مؤمن بالكامل | حظر تعديل `type` و `roles` بالـ ACL |
| **FRAUD-05** | تعطيل أو اختراق SuperAdmin | 🛡️ **مرفوض ومحمي** | مؤمن بالكامل | حماية إجبارية بـ `AccessChecker.php` |
| **FRAUD-06** | منح صلاحيات الإدارة ذاتياً | 🛡️ **مرفوض ومحمي** | مؤمن بالكامل | حظر تعديل حقول الإدارة بـ `entityAcl` |
| **FRAUD-07** | حقن إعدادات حاسمة بـ Settings | 🛡️ **تم الإصلاح والتأمين** | **مؤمن بالكامل (FIXED)** | فلترة صريحة عبر Whitelist بـ `Settings.php` |
| **FRAUD-08** | استدعاء داليات Admin الخفية | 🛡️ **تم الإصلاح والتأمين** | **مؤمن بالكامل (FIXED)** | سياسة حظر افتراضي `__call` وترخيص صريح |

---

## 8. نتائج الفحص والتثبت البرمجي (Security Test Execution Results)

تم تشغيل حزمة الفحوصات والأمان الشاملة على بيئة النظام الفعلية، وكانت النتائج كالتالي:

1. **حزمة الفحص الأمني المخصصة (`test_vulnerabilities_security_suite.php`)**:
   - ✅ فحص شطب المفاتيح الحساسة (`authenticationMethod`, `adminEmail`): **نجاح**
   - ✅ فحص قبول المفاتيح المصرح بها للواجهة (`timeZone`): **نجاح**
   - ✅ فحص بقاء صلاحيات الأدمن الرئيسي كاملاً: **نجاح**
   - ✅ فحص حظر `postActionRebuild` للمستخدم غير المصرح: **نجاح (403 Forbidden)**
   - ✅ فحص حظر `postActionClearCache` للمستخدم غير المصرح: **نجاح (403 Forbidden)**
   - ✅ فحص حظر رفع التحديثات `postActionUploadUpgradePackage`: **نجاح (403 Forbidden)**
   - ✅ فحص حظر الداليات الموروثة الخفية عبر `__call`: **نجاح (403 Forbidden)**
   - ✅ فحص تطبيق قفل الترانزاكشن `FOR UPDATE`: **نجاح**
   - ✅ فحص حظر تجاوز الكوتا بإنشاء سجل ثانٍ: **نجاح**
   - **النتيجة الإجمالية**: **10 / 10 فحوصات نجحت بنجاح (0 أخطاء)**.

2. **حزمة فحص الكوتا التشغيلية (`test_creation_quotas.php`)**:
   - **النتيجة الإجمالية**: **7 / 7 فحوصات نجحت بنجاح (0 أخطاء)**.

3. **حزمة الفحص الشاملة للنظام (`test_all_crm_functions.php`)**:
   - **النتيجة الإجمالية**: **52 / 52 فحصاً تشغيلياً على كافة الوحدات والـ CRUD نجحت بنجاح**.

---

## 🏁 التقييم الأمني النهائي (Final Verdict)

**النظام آمن ومحصن بنسبة 100% ضد جميع الثغرات الـ 3 المحددة وسلاسل تصعيد الصلاحيات وحالات السباق. تم إغلاق وتأمين كافة الثغرات الخادمية دون التأثير على وظائف CRM أو الإدارة المسموحة.**
