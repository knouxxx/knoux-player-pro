# 🎬 KNOUX Player X™ - The Cinematic Intelligence Media System

![KNOUX Player X](https://knoux.tech/banner.png)

## ✨ المميزات الرئيسية

### 🎮 محرك وسائط متقدم
- دعم FFmpeg مع 300+ كودك
- تسريع الأجهزة (GPU Acceleration)
- معالجة صوت 10-band EQ
- دعم WebCodecs و WebGL

### 🎨 واجهة Neon Glass
- تصميم زجاجي حديث مع تأثيرات Neon
- دعم RTL كامل (عربي/إنجليزي)
- Framer Motion للرسوم المتحركة
- 22 مكون Neon مخصص

### 🔌 نظام بلاجن قوي
- SDK كامل للمطورين
- Hot Reload للبلاجنز
- API موثقة بالكامل
- نظام أذونات متقدم

### 🗄️ إدارة حالة محترفة
- Redux Toolkit مع TypeScript
- Middleware مخصص
- Selectors متطورة
- Persistence للإعدادات

## 🚀 البدء السريع

### التثبيت
```bash
git clone https://github.com/knuux7-ctrl/KNOX-Player-X-.git
cd KNOX-Player-X-
npm install
npm run dev
```

### الأوامر المتاحة
```bash
npm run dev              # تشغيل وضع التطوير
npm run build            # بناء المشروع
npm run make             # بناء المثبتات
npm test                 # تشغيل الاختبارات
npm run lint             # فحص جودة الكود
npm run type-check       # التحقق من الأنواع
```

## 📦 البناء للنشر

### Windows (NSIS)
```bash
npm run make:windows
```

### macOS (DMG)
```bash
npm run make:mac
```

### Linux (AppImage/DEB/RPM)
```bash
npm run make:linux
```

## 🏗️ بنية المشروع
```
knoux-player-x/
├── desktop/           # Electron Main Process
│   ├── main/         # العمليات الرئيسية
│   ├── preload/      # Preload scripts
│   └── resources/    # أيقونات ومثبّتات
├── src/              # المصدر الرئيسي
│   ├── core/         # محرك الوسائط
│   ├── ui/           # واجهة المستخدم
│   ├── state/        # إدارة الحالة
│   └── services/     # الخدمات
├── plugins/          # نظام البلاجن
├── tests/            # الاختبارات
└── docs/             # الوثائق
```

## 🔧 التقنيات المستخدمة
- **Frontend**: React 18 + TypeScript + Redux Toolkit
- **Backend**: Electron 28 + Node.js
- **UI**: Framer Motion + Neon Glass Design
- **Media**: FFmpeg + WebCodecs + Hardware Acceleration
- **Build**: Webpack 5 + Electron Forge

## 📞 الدعم والاتصال
- **المطور**: Sadek Elgazar (KNOUX) - أبو ريتاج
- **البريد**: info@knoux.tech
- **GitHub**: https://github.com/knuux7-ctrl/KNOX-Player-X-
- **الموقع**: https://knoux.tech

## 📄 الرخصة
Proprietary - © 2023 Sadek Elgazar (KNOUX)

## ✅ حالة التحقق قبل الدمج

### الأوامر التي تم تشغيلها
- `npm install` (فشل: 403 Forbidden عند تنزيل حزم من registry.npmjs.org)
- `npm run typecheck` (فشل بعد تعذر تثبيت التبعيات)
- `npm run dev` (فشل: cross-env غير مثبت)
- `npm run electron:dev` (فشل: cross-env غير مثبت)
- `npm run build:renderer` (فشل: webpack غير مثبت)
- `npm run build:main` (فشل: webpack غير مثبت)
- `npm run build` (فشل بسبب build:renderer)
- `npm test` (فشل: jest غير مثبت)
- `npm run make` (فشل بسبب build:renderer)
- `npm run ci:smoke` (فشل: تنزيل electron محجوب 403)

### القيود المعروفة
- بيئة CI الحالية تمنع تنزيل بعض التبعيات من registry.npmjs.org (403 Forbidden).
- لا يمكن تأكيد تشغيل التطبيق أو نجاح البناء حتى يتم السماح بالتبعيات المطلوبة.

### المنصات المؤكدة
- لم يتم تأكيد أي منصة حتى الآن بسبب فشل التثبيت في بيئة التنفيذ الحالية.
