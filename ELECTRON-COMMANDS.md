# ⚡ Electron - أوامر سريعة

## 🔄 التحديث للنسخة الإلكترونية

```bash
cd sport-zone-project

# 1. نسخ الملفات
cp package-electron.json package.json
cp next-config-electron.js next.config.js
mkdir -p electron
cp electron-main.js electron/main.js
cp electron-preload.js electron/preload.js

# 2. تثبيت
npm install
```

---

## 🧪 الاختبار

```bash
# اختبار في وضع Electron (يفتح نافذة البرنامج)
npm run electron:dev
```

---

## 📦 البناء

### بناء لـ Windows:
```bash
npm run electron:build-win
```
**النتيجة:** `dist/Sport-Zone-Setup-2.0.0.exe`

### بناء لـ macOS:
```bash
npm run electron:build-mac
```
**النتيجة:** `dist/Sport-Zone-2.0.0.dmg`

### بناء لـ Linux:
```bash
npm run electron:build-linux
```
**النتيجة:** `dist/Sport-Zone-2.0.0.AppImage`

---

## 🎯 بناء سريع (نظامك الحالي)

```bash
npm run electron:build
```

---

## 🔧 حل المشاكل

### خطأ في البناء:
```bash
rm -rf node_modules out dist
npm install
npm run electron:build-win
```

### الأيقونة لا تظهر:
```bash
# تحقق من:
ls build/icon.png
```

---

## 📊 المواصفات

**الحجم المتوقع:**
- Windows: ~100 MB
- macOS: ~120 MB  
- Linux: ~100 MB

**الوقت المتوقع:**
- البناء: 3-5 دقائق
- التثبيت: 1 دقيقة

---

## ✅ قبل البناء النهائي

- [ ] npm run electron:dev (اختبار)
- [ ] جميع الصفحات تعمل
- [ ] الألوان صحيحة
- [ ] القوائم عربية
- [ ] الشعار يظهر

---

## 🎉 بعد البناء

```bash
# الملفات في:
ls dist/

# توزيع:
# - Windows: Sport-Zone-Setup-2.0.0.exe
# - macOS: Sport-Zone-2.0.0.dmg
# - Linux: Sport-Zone-2.0.0.AppImage
```

---

## 📦 الأوامر الكاملة

```bash
# تطوير
npm run dev                    # Next.js فقط
npm run electron:dev           # Electron + Next.js

# بناء
npm run build                  # Next.js (إلزامي قبل Electron)
npm run electron:build         # بناء للنظام الحالي
npm run electron:build-win     # Windows
npm run electron:build-mac     # macOS
npm run electron:build-linux   # Linux

# قاعدة البيانات
npm run setup                  # إعداد أولي
npm run db:push                # تحديث
npm run db:studio              # مدير قاعدة البيانات
```

---

**🚀 جاهز للبناء!**
