# نظام ERP

نظام تخطيط موارد المؤسسات (ERP) مبني بـ Laravel 12 و React 19.

## التقنيات المستخدمة

| الطبقة | التقنية |
|--------|---------|
| Backend | Laravel 12 (PHP 8.2+) |
| Frontend | React 19 + TypeScript + Inertia.js |
| Styling | Tailwind CSS v4 |
| Build Tool | Vite |
| Database | SQLite (تطوير) |

## البنية المعمارية

يتبع المشروع **معمارية معيارية (Modular Architecture)** مع مبادئ **DDD (Domain-Driven Design)**.

كل وحدة تحتوي على:

```
Module/
├── Domain/          # النماذج، الأحداث، DTOs
├── Application/     # Use Cases، Listeners
├── Infrastructure/  # نماذج Eloquent، Repositories
└── Web/             # Controllers، Requests
```

## الوحدات (Modules)

| الوحدة | الوصف |
|--------|-------|
| **Accounting** | محاسبة، دليل حسابات، قيود يومية، ميزان مراجعة |
| **CRM** | إدارة العملاء والموردين |
| **Inventory** | إدارة المخزون، حركات المخزون، تكاليف FIFO |
| **Sales** | أوامر البيع، فواتير المبيعات |
| **Purchasing** | أوامر الشراء، فواتير المشتريات، استلام البضائع |
| **Warehouse** | إدارة المستودعات، تحويل المخزون |
| **Payments** | إدارة المدفوعات |
| **Currency** | إدارة العملات وأسعار الصرف |
| **Analytics** | لوحة تحليلات |

## الحزم الرئيسية

**Backend:**
- `stancl/tenancy` — دعم تعدد المستأجرين (Multi-tenancy)
- `spatie/laravel-permission` — إدارة الصلاحيات والأدوار
- `inertiajs/inertia-laravel` — ربط Laravel بـ React
- `kalnoy/nestedset` — الشجرة الهرمية لدليل الحسابات

**Frontend:**
- `@inertiajs/react` — تكامل Inertia مع React
- `i18next` — دعم تعدد اللغات (عربي / إنجليزي)
- `zustand` — إدارة الحالة
- `lucide-react` — أيقونات
- `sonner` — إشعارات

## تشغيل المشروع

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run dev
```

أو باستخدام السكريبت المدمج:

```bash
composer run setup
composer run dev
```

## الترخيص

MIT
