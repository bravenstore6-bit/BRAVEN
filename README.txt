BRAVEN - Supabase Edition

تم تحويل البيانات المشتركة من localStorage إلى Supabase:
- المنتجات والمخزون: Supabase
- الطلبات: Supabase
- السلة: localStorage لكل عميل (طبيعي)
- إتمام الطلب يستخدم RPC اسمها place_order لتحديث المخزون وتسجيل الطلب في معاملة واحدة.

خطوات التشغيل مرة واحدة:
1) افتح مشروع Supabase الخاص بـ BRAVEN.
2) افتح SQL Editor.
3) الصق محتوى ملف supabase.sql بالكامل واضغط Run.
4) في Supabase: Authentication -> Users -> Add user
   أنشئ حساب البريد/كلمة المرور الذي ستستخدمه لدخول admin.html.
5) ارفع محتويات مجلد BRAVEN-main إلى GitHub Pages مكان النسخة القديمة.
6) افتح الموقع من رابط GitHub Pages، وليس من نسخة قديمة محفوظة في المتصفح.

مهم:
- config.js يحتوي على Publishable key فقط، وهذا هو المفتاح المخصص للواجهة.
- لا تضع أي sb_secret_* داخل الموقع أو GitHub.
- لوحة الإدارة تستخدم Supabase Auth بدل كلمة مرور محلية.
- إذا غيّرت منتجاتك من admin.html ستظهر للعملاء على الأجهزة الأخرى بعد تحديث الصفحة.
- الطلبات الجديدة ستظهر في admin.html من أي جهاز بعد تسجيل دخول حساب الإدارة.

ملفات أساسية:
index.html
cart.html
admin.html
app.js
config.js
supabase.sql
styles.css
account.html
