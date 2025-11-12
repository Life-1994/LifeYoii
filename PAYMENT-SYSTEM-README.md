# نظام الدفع والفواتير المتقدم / Advanced Payment & Billing System

## Overview / نظرة عامة

This is a comprehensive payment and billing system integrated with the Sport Zone Gym management application. It supports multiple payment gateways, invoice management, coupons, and financial reporting.

هذا نظام شامل للدفع والفواتير متكامل مع تطبيق إدارة نادي Sport Zone الرياضي. يدعم بوابات دفع متعددة، وإدارة الفواتير، والكوبونات، والتقارير المالية.

## Features / المميزات

### 1. Payment Gateways / بوابات الدفع
- ✅ Cash payments / الدفع النقدي
- ✅ Card payments / الدفع بالبطاقة
- ✅ Bank transfers / التحويل البنكي
- ✅ Stripe integration / دمج Stripe
- ⚠️ PayPal integration / دمج PayPal (prepared, needs configuration)
- ⚠️ Apple Pay / Google Pay (prepared, needs configuration)

### 2. Invoice Management / إدارة الفواتير
- ✅ Create invoices automatically / إنشاء فواتير تلقائياً
- ✅ Unique invoice numbers / أرقام فواتير فريدة
- ✅ Invoice items and details / بنود الفاتورة والتفاصيل
- ✅ Invoice status tracking / تتبع حالة الفاتورة
- ✅ PDF generation / توليد ملفات PDF
- ✅ Payment tracking / تتبع المدفوعات

### 3. Coupons & Discounts / الكوبونات والخصومات
- ✅ Create discount coupons / إنشاء كوبونات خصم
- ✅ Percentage or fixed amount discounts / خصومات بالنسبة أو المبلغ الثابت
- ✅ Coupon validation / التحقق من صحة الكوبونات
- ✅ Usage limits / حدود الاستخدام
- ✅ Validity period / فترة الصلاحية

### 4. Financial Reports / التقارير المالية
- ✅ Revenue tracking (daily, weekly, monthly) / تتبع الإيرادات
- ✅ Payment status overview / نظرة عامة على حالة المدفوعات
- ✅ Transaction history / سجل المعاملات
- ✅ Refund tracking / تتبع المبالغ المستردة

### 5. Payment Operations / عمليات الدفع
- ✅ Record manual payments / تسجيل المدفوعات اليدوية
- ✅ Process electronic payments / معالجة المدفوعات الإلكترونية
- ✅ Refund payments / استرداد المدفوعات
- ✅ Payment receipts / إيصالات الدفع

## Setup / الإعداد

### 1. Environment Variables / متغيرات البيئة

Update your `.env` file with the following configurations:

```env
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"

# PayPal Configuration (Optional)
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_SECRET="your_paypal_secret"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_client_id"
```

### 2. Database Setup / إعداد قاعدة البيانات

The database schema has been updated with the following models:
- Payment (enhanced)
- Invoice
- InvoiceItem
- Coupon
- Transaction

Run the following command to sync your database:

```bash
npm run db:push
```

### 3. Stripe Setup / إعداد Stripe

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Configure webhook endpoint: `https://your-domain.com/api/payments/stripe/webhook`
4. Add webhook events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`

## API Routes / مسارات API

### Payments / المدفوعات
- `GET /api/payments` - List all payments
- `POST /api/payments` - Create a new payment
- `GET /api/payments/[id]` - Get payment details
- `PATCH /api/payments/[id]` - Update payment
- `POST /api/payments/[id]/refund` - Refund a payment
- `POST /api/payments/stripe/webhook` - Stripe webhook handler

### Invoices / الفواتير
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices/[id]` - Get invoice details
- `PATCH /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice
- `GET /api/invoices/[id]/pdf` - Generate invoice PDF

### Coupons / الكوبونات
- `GET /api/coupons` - List all coupons
- `POST /api/coupons` - Create a new coupon
- `POST /api/coupons/[code]/validate` - Validate and apply coupon

### Transactions / المعاملات
- `GET /api/transactions` - List all transactions

## Pages / الصفحات

### Dashboard Pages / صفحات لوحة التحكم
- `/payments` - Payments list and management
- `/invoices` - Invoices list
- `/invoices/[id]` - Invoice details and payment
- `/coupons` - Coupon management
- `/financial-reports` - Financial reports and analytics

## Usage Examples / أمثلة الاستخدام

### Creating a Payment / إنشاء دفعة

```typescript
const response = await fetch('/api/payments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    memberId: 'member_id',
    amount: 500,
    method: 'CASH',
    description: 'Monthly subscription',
  }),
})
```

### Creating an Invoice / إنشاء فاتورة

```typescript
const response = await fetch('/api/invoices', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    memberId: 'member_id',
    items: [
      {
        description: 'Monthly Membership',
        quantity: 1,
        unitPrice: 500,
      },
    ],
    discount: 0,
    tax: 0,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }),
})
```

### Validating a Coupon / التحقق من كوبون

```typescript
const response = await fetch('/api/coupons/SUMMER2024/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 500,
  }),
})
```

## Components / المكونات

### Payment Components / مكونات الدفع
- `PaymentForm` - Manual payment form
- `StripeCheckout` - Stripe payment integration

### Invoice Components / مكونات الفاتورة
- `InvoiceList` - Display list of invoices
- `InvoiceTemplate` - Invoice PDF template (via jsPDF)

### Other Components / مكونات أخرى
- `CouponForm` - Create and manage coupons
- `RevenueChart` - Financial reports and analytics

## Payment Methods / طرق الدفع

### Supported Methods / الطرق المدعومة
- `CASH` - نقدي
- `CARD` - بطاقة
- `BANK_TRANSFER` - تحويل بنكي
- `STRIPE` - Stripe
- `PAYPAL` - PayPal
- `APPLE_PAY` - Apple Pay
- `GOOGLE_PAY` - Google Pay

## Invoice Status / حالة الفاتورة

- `DRAFT` - مسودة
- `PENDING` - معلق
- `PAID` - مدفوع
- `OVERDUE` - متأخر
- `CANCELLED` - ملغي

## Payment Status / حالة الدفع

- `PENDING` - معلق
- `COMPLETED` - مكتمل
- `FAILED` - فشل
- `REFUNDED` - مسترد
- `CANCELLED` - ملغي

## Security Considerations / اعتبارات الأمان

1. **API Keys**: Never commit API keys to version control
2. **Webhook Signatures**: Always verify webhook signatures
3. **User Authentication**: Ensure proper authentication for all payment operations
4. **Data Validation**: Validate all input data before processing
5. **HTTPS**: Always use HTTPS in production

## Testing / الاختبار

### Stripe Test Cards / بطاقات Stripe التجريبية

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires 3D Secure: `4000 0027 6000 3184`

Use any future expiry date and any 3-digit CVC.

## Troubleshooting / استكشاف الأخطاء

### Common Issues / المشاكل الشائعة

1. **Stripe webhook not working**
   - Check webhook URL is correct
   - Verify webhook secret is set
   - Check webhook events are configured

2. **PDF generation fails**
   - Ensure jsPDF is installed correctly
   - Check invoice data is complete

3. **Payment not updating invoice**
   - Verify payment is linked to invoice (invoiceId)
   - Check payment status is COMPLETED

## Future Enhancements / تحسينات مستقبلية

- [ ] Email notifications for invoices
- [ ] Recurring subscription payments
- [ ] Payment installments
- [ ] Advanced financial analytics
- [ ] Export reports to Excel
- [ ] Multi-currency support
- [ ] Payment reminders

## Support / الدعم

For issues or questions, please create an issue in the repository.

## License / الرخصة

See LICENSE.txt for details.
