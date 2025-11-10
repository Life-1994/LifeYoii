'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import PaymentForm from '@/components/payments/PaymentForm'

interface InvoiceDetails {
  id: string
  invoiceNumber: string
  member: {
    id: string
    fullName: string
    memberNumber: string
    phone: string
    email?: string
  }
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  discount: number
  tax: number
  total: number
  status: string
  dueDate: string
  paidDate?: string
  createdAt: string
  notes?: string
  payments: Array<{
    id: string
    amount: number
    status: string
    method: string
    createdAt: string
  }>
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchInvoice()
    }
  }, [params.id])

  const fetchInvoice = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/invoices/${params.id}`)
      const data = await response.json()
      setInvoice(data)
    } catch (error) {
      console.error('Error fetching invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}/pdf`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${invoice?.invoiceNumber}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading PDF:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      DRAFT: 'bg-gray-200 text-gray-800',
      PENDING: 'bg-yellow-200 text-yellow-800',
      PAID: 'bg-green-200 text-green-800',
      OVERDUE: 'bg-red-200 text-red-800',
      CANCELLED: 'bg-gray-300 text-gray-600',
    }
    return badges[status] || 'bg-gray-200 text-gray-800'
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-8">جاري التحميل...</div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="p-8">
        <div className="text-center py-8">لم يتم العثور على الفاتورة</div>
      </div>
    )
  }

  const totalPaid = invoice.payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)
  const remainingAmount = invoice.total - totalPaid

  return (
    <div className="p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            فاتورة رقم {invoice.invoiceNumber}
          </h1>
          <p className="text-gray-600">تفاصيل الفاتورة</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            تحميل PDF
          </button>
          {invoice.status !== 'PAID' && remainingAmount > 0 && (
            <button
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {showPaymentForm ? 'إخفاء الدفع' : 'دفع الفاتورة'}
            </button>
          )}
        </div>
      </div>

      {showPaymentForm && remainingAmount > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">دفع الفاتورة</h2>
          <PaymentForm
            memberId={invoice.member.id}
            invoiceId={invoice.id}
            amount={remainingAmount}
            onSuccess={() => {
              setShowPaymentForm(false)
              fetchInvoice()
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold mb-2">معلومات العميل</h2>
                <p className="text-lg">{invoice.member.fullName}</p>
                <p className="text-gray-600">{invoice.member.memberNumber}</p>
                <p className="text-gray-600">{invoice.member.phone}</p>
                {invoice.member.email && (
                  <p className="text-gray-600">{invoice.member.email}</p>
                )}
              </div>
              <span className={`px-3 py-1 rounded ${getStatusBadge(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-2">التواريخ</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">تاريخ الإنشاء:</span>
                  <p>{new Date(invoice.createdAt).toLocaleDateString('ar-SA')}</p>
                </div>
                <div>
                  <span className="text-gray-600">تاريخ الاستحقاق:</span>
                  <p>{new Date(invoice.dueDate).toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">بنود الفاتورة</h3>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-right">البند</th>
                    <th className="px-4 py-2 text-right">الكمية</th>
                    <th className="px-4 py-2 text-right">السعر</th>
                    <th className="px-4 py-2 text-right">المجموع</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3">{item.unitPrice.toFixed(2)} SAR</td>
                      <td className="px-4 py-3">{item.total.toFixed(2)} SAR</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{invoice.subtotal.toFixed(2)} SAR</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم:</span>
                    <span>-{invoice.discount.toFixed(2)} SAR</span>
                  </div>
                )}
                {invoice.tax > 0 && (
                  <div className="flex justify-between">
                    <span>الضريبة:</span>
                    <span>{invoice.tax.toFixed(2)} SAR</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>المجموع الإجمالي:</span>
                  <span>{invoice.total.toFixed(2)} SAR</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-bold mb-2">ملاحظات</h3>
                <p className="text-gray-600">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">ملخص الدفع</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">المبلغ الكلي:</span>
                <span className="font-bold">{invoice.total.toFixed(2)} SAR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">المدفوع:</span>
                <span className="font-bold text-green-600">
                  {totalPaid.toFixed(2)} SAR
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-gray-600">المتبقي:</span>
                <span className="font-bold text-red-600">
                  {remainingAmount.toFixed(2)} SAR
                </span>
              </div>
            </div>
          </div>

          {invoice.payments.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">سجل المدفوعات</h2>
              <div className="space-y-3">
                {invoice.payments.map((payment) => (
                  <div key={payment.id} className="border-b pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{payment.amount.toFixed(2)} SAR</p>
                        <p className="text-sm text-gray-600">{payment.method}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        payment.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
