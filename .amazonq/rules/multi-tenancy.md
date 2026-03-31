# قواعد Multi-Tenancy

## بنية المشروع

المشروع يدعم نوعين من المستأجرين:
- **Dedicated Tenant**: قاعدة بيانات منفصلة — عزل تلقائي، لا حاجة لـ `tenant_id`
- **Shared Tenant**: نفس قاعدة البيانات — العزل عبر `tenant_id` في كل جدول

العزل يتم عبر `TenantScope` (Global Scope) المُطبَّق في `BelongsToTenant` trait الموجود في `BaseModel`.

---

## القاعدة الأساسية: الاستعلامات اليدوية

### ❌ ممنوع — JOIN يدوي بدون شرط tenant

```php
JournalLine::select(...)
    ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.entry_id')
    ->where('journal_entries.status', 'posted')
    ->get();
// ← journal_entries لا يخضع لـ TenantScope تلقائياً
```

### ✅ الصحيح — استخدام whereHas بدلاً من JOIN

```php
JournalLine::whereHas('entry', fn($q) =>
    $q->where('status', 'posted')
)
->selectRaw('account_id, SUM(debit_base) as debit, SUM(credit_base) as credit')
->groupBy('account_id')
->get();
// ← Eloquent يطبق TenantScope على entry تلقائياً
```

### ✅ الصحيح — إذا كان JOIN يدوي ضرورياً للأداء

```php
$tenantId = app(TenantManager::class)->getId();

JournalLine::select(...)
    ->join('journal_entries', function ($join) use ($tenantId) {
        $join->on('journal_entries.id', '=', 'journal_lines.entry_id');
        // شرط الـ tenant إلزامي على كل جدول مُضاف بـ JOIN
        if ($tenantId) {
            $join->where('journal_entries.tenant_id', $tenantId);
        }
    })
    ->get();
```

### ✅ الصحيح — DB::table() Raw Query

```php
$tenantId = app(TenantManager::class)->getId();

DB::table('journal_lines')
    ->join('journal_entries', 'journal_entries.id', '=', 'journal_lines.entry_id')
    ->where('journal_lines.tenant_id', $tenantId)      // ← إلزامي
    ->where('journal_entries.tenant_id', $tenantId)    // ← إلزامي على كل جدول
    ->get();
```

---

## القاعدة الذهبية

> **كل جدول يظهر في JOIN يدوي أو Raw Query يجب أن يحمل شرط `tenant_id` صريحاً — بدون استثناء.**

`TenantScope` يحمي **الجدول الرئيسي فقط** في استعلام Eloquent، ولا يمتد تلقائياً لأي جدول مُضاف بـ `join()`.

---

## استثناء: Dedicated Tenant

عند `$manager->isDedicated() === true` لا حاجة لشرط `tenant_id` لأن قاعدة البيانات منفصلة بالكامل. لكن يُفضَّل دائماً كتابة الكود بشكل يعمل في الحالتين.

---

## الجداول التي تحمل tenant_id في هذا المشروع

- `accounts`
- `journal_entries`
- `journal_lines` ← عبر `entry_id` (لا يحمل tenant_id مباشرة)
- `fiscal_periods`
- وكل جدول يرث من `BaseModel`
