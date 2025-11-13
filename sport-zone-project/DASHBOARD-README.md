# لوحة التحكم الإحصائية المتقدمة
# Advanced Analytics Dashboard

## نظرة عامة | Overview

لوحة تحكم شاملة لإدارة النادي الرياضي تعرض جميع الإحصائيات في الوقت الفعلي مع رسوم بيانية تفاعلية.

A comprehensive dashboard for gym management displaying all statistics in real-time with interactive charts.

## المميزات الرئيسية | Key Features

### 📊 بطاقات الإحصائيات | Statistics Cards

لوحة التحكم تعرض 8 بطاقات إحصائية رئيسية:

1. **إجمالي الأعضاء** - Total Members
   - عرض العدد الإجمالي للأعضاء
   - نسبة التغيير الشهري
   - عدد الأعضاء النشطين

2. **حضور اليوم** - Today's Attendance
   - عدد الأعضاء الذين حضروا اليوم
   - يتحدث تلقائياً

3. **الاشتراكات الفعالة** - Active Subscriptions
   - عدد الاشتراكات النشطة حالياً
   - تنبيه بعدد الاشتراكات المنتهية خلال 7 أيام

4. **حجوزات اليوم** - Today's Bookings
   - عدد الحجوزات المؤكدة لليوم

5. **إيرادات الشهر** - Monthly Revenue
   - إجمالي إيرادات الشهر الحالي
   - نسبة التغيير مقارنة بالشهر السابق

6. **المصروفات** - Expenses
   - مصروفات الشهر الحالي

7. **صافي الربح** - Net Profit
   - الفرق بين الإيرادات والمصروفات
   - يتغير اللون حسب القيمة (أخضر للربح، أحمر للخسارة)

8. **المدربون النشطون** - Active Trainers
   - عدد المدربين النشطين في النادي

### 📈 الرسوم البيانية التفاعلية | Interactive Charts

#### 1. نمو الأعضاء (Line Chart)
- يعرض نمو عدد الأعضاء خلال آخر 12 شهر
- رسم بياني خطي تفاعلي
- يظهر الاتجاه العام للنمو

#### 2. الإيرادات الشهرية (Bar Chart)
- رسم بياني عمودي للإيرادات
- يعرض آخر 12 شهر
- يسهل مقارنة الأشهر ببعضها

#### 3. معدل الحضور الأسبوعي (Area Chart)
- رسم بياني مساحي للحضور
- يعرض آخر 7 أيام
- يساعد في تحديد أيام الذروة

#### 4. توزيع الاشتراكات (Pie Chart)
- رسم دائري يوضح توزيع أنواع الاشتراكات
- نسبة كل نوع من الاشتراكات
- ألوان متناسقة وسهلة التمييز

### 📋 قوائم النشاط الأخير | Recent Activity Lists

#### آخر الأعضاء المسجلين
- عرض آخر 10 أعضاء مسجلين
- صورة أو حرف أول من الاسم
- رقم العضوية
- تاريخ التسجيل
- رابط مباشر لصفحة العضو

#### الاشتراكات المنتهية قريباً
- اشتراكات تنتهي خلال 7 أيام القادمة
- تنبيهات ملونة (برتقالي)
- عرض عدد الأيام المتبقية
- معلومات العضو والباقة

### 📤 تصدير التقارير | Export Reports

#### تصدير PDF
- تقرير كامل بصيغة PDF
- يحتوي على جميع الإحصائيات
- جاهز للطباعة
- يدعم اللغة العربية

#### تصدير Excel
- تصدير البيانات بصيغة Excel
- أوراق متعددة (إحصائيات، أعضاء، اشتراكات)
- سهل التعديل والتحليل
- متوافق مع Microsoft Excel

#### طباعة
- طباعة مباشرة من المتصفح
- تنسيق مناسب للطباعة

## التقنيات المستخدمة | Technologies Used

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Interactive charts
- **Lucide React** - Beautiful icons

### Backend
- **Prisma ORM** - Database management
- **SQLite** - Database
- **Next.js API Routes** - RESTful APIs

### Export Libraries
- **jsPDF** (v3.0.2) - PDF generation
- **jsPDF-AutoTable** - PDF tables
- **XLSX** - Excel generation

### Utilities
- **date-fns** - Date formatting
- **Radix UI** - UI components

## البنية التقنية | Technical Architecture

```
src/
├── app/
│   ├── api/dashboard/          # API endpoints
│   │   ├── stats/              # General statistics
│   │   ├── member-growth/      # Member growth data
│   │   ├── revenue/            # Revenue data
│   │   ├── attendance/         # Attendance data
│   │   ├── subscriptions/      # Subscription distribution
│   │   ├── trainers-performance/  # Trainer stats
│   │   └── heatmap/            # Heatmap data
│   └── page.tsx                # Main dashboard page
│
├── components/dashboard/       # Dashboard components
│   ├── StatsCard.tsx           # Statistic card component
│   ├── MemberGrowthChart.tsx   # Member growth chart
│   ├── RevenueChart.tsx        # Revenue chart
│   ├── AttendanceChart.tsx     # Attendance chart
│   ├── SubscriptionPieChart.tsx  # Subscription pie chart
│   ├── RecentMembers.tsx       # Recent members list
│   ├── ExpiringSubscriptions.tsx  # Expiring subscriptions
│   └── ExportButtons.tsx       # Export functionality
│
└── lib/
    ├── dashboard-utils.ts      # Utility functions
    ├── chart-data.ts           # Chart data preparation
    ├── pdf-export.ts           # PDF export logic
    └── excel-export.ts         # Excel export logic
```

## API Endpoints

### GET /api/dashboard/stats
Returns general statistics:
- Total members, active members
- Today's attendance
- Active/expired subscriptions
- Today's bookings
- Monthly revenue/expenses
- Net profit
- Growth percentages

### GET /api/dashboard/member-growth
Returns member growth data for last 12 months

### GET /api/dashboard/revenue
Returns monthly revenue data for last 12 months

### GET /api/dashboard/attendance
Returns attendance data for last 7 days

### GET /api/dashboard/subscriptions
Returns subscription distribution by package type

### GET /api/dashboard/trainers-performance
Returns trainer performance statistics

### GET /api/dashboard/heatmap
Returns heatmap data for gym peak hours

## التثبيت والإعداد | Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
```bash
npm run db:push
npm run db:seed
```

### 3. Add Sample Dashboard Data
```bash
node prisma/seed-dashboard-data.js
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open Dashboard
Navigate to: http://localhost:3000

## الاستخدام | Usage

### عرض الإحصائيات
افتح الصفحة الرئيسية للاطلاع على جميع الإحصائيات والرسوم البيانية.

### تصدير التقارير
1. انقر على زر "تصدير PDF" لتنزيل تقرير PDF
2. انقر على زر "تصدير Excel" لتنزيل ملف Excel
3. انقر على زر "طباعة" للطباعة المباشرة

### التنقل
- انقر على بطاقات الإجراءات السريعة للانتقال إلى الصفحات المختلفة
- انقر على أسماء الأعضاء في قائمة "آخر الأعضاء" للانتقال إلى صفحة العضو

## التخصيص | Customization

### تغيير الألوان
يمكنك تخصيص ألوان البطاقات عن طريق تعديل prop `color` في component StatsCard:
```typescript
<StatsCard
  color="blue" // blue, green, purple, orange, red, yellow
  // ... other props
/>
```

### تغيير عدد الأشهر في الرسوم البيانية
في ملف `dashboard-utils.ts`، عدل function `generateMonthsArray`:
```typescript
generateMonthsArray(6) // لعرض 6 أشهر بدلاً من 12
```

### إضافة رسوم بيانية جديدة
1. أنشئ component جديد في `components/dashboard/`
2. أضف API endpoint في `app/api/dashboard/`
3. أضف Component في صفحة Dashboard

## الأداء | Performance

### تحسينات الأداء المطبقة:
- ✅ Server-side data fetching
- ✅ Parallel API calls
- ✅ Loading states
- ✅ Lazy loading for charts
- ✅ Optimized database queries
- ✅ React component memoization

### وقت التحميل:
- First Load: < 3 seconds
- Subsequent loads: < 1 second

## التوافق | Compatibility

### المتصفحات المدعومة:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

### الأجهزة:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1366px)
- ✅ Mobile (320px - 768px)

## الدعم | Support

للمساعدة والدعم:
- 📧 Email: support@sportzone.com
- 📱 Phone: +966 XX XXX XXXX
- 🌐 Website: https://sportzone.com

## الترخيص | License

هذا المشروع محمي بحقوق النشر © 2024 Sport Zone
This project is proprietary software © 2024 Sport Zone
