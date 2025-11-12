'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Payment {
  id: string
  amount: number
  currency: string
  method: string
  status: string
  description?: string
  receiptNumber?: string
  createdAt: string
  member: {
    fullName: string
    memberNumber: string
  }
  invoice?: {
    invoiceNumber: string
  }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')

  useEffect(() => {
    fetchPayments()
  }, [statusFilter, methodFilter])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      let url = '/api/payments?'
      if (statusFilter !== 'all') url += `status=${statusFilter}&`
      if (methodFilter !== 'all') url += `method=${methodFilter}&`
      
      const response = await fetch(url)
      const data = await response.json()
      setPayments(data.payments || [])
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      PENDING: 'bg-yellow-200 text-yellow-800',
      COMPLETED: 'bg-green-200 text-green-800',
      FAILED: 'bg-red-200 text-red-800',
      REFUNDED: 'bg-gray-200 text-gray-800',
      CANCELLED: 'bg-gray-300 text-gray-600',
    }
    return badges[status] || 'bg-gray-200 text-gray-800'
  }

  const getMethodText = (method: string) => {
    const texts: Record<string, string> = {
      CASH: 'نقدي',
      CARD: 'بطاقة',
      BANK_TRANSFER: 'تحويل بنكي',
      PAYPAL: 'PayPal',
      STRIPE: 'Stripe',
      APPLE_PAY: 'Apple Pay',
      GOOGLE_PAY: 'Google Pay',
    }
    return texts[method] || method
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-8">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">المدفوعات / Payments</h1>
        <p className="text-gray-600">إدارة جميع المدفوعات والمعاملات المالية</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">الحالة / Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">الكل</option>
              <option value="COMPLETED">مكتمل</option>
              <option value="PENDING">معلق</option>
              <option value="FAILED">فشل</option>
              <option value="REFUNDED">مسترد</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">الطريقة / Method</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">الكل</option>
              <option value="CASH">نقدي</option>
              <option value="CARD">بطاقة</option>
              <option value="BANK_TRANSFER">تحويل بنكي</option>
              <option value="STRIPE">Stripe</option>
              <option value="PAYPAL">PayPal</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  رقم الإيصال
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  العميل
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  المبلغ
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الطريقة
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الحالة
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  التاريخ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {payment.receiptNumber || '-'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.member.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.member.memberNumber}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {payment.amount.toFixed(2)} {payment.currency}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {getMethodText(payment.method)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد مدفوعات
          </div>
        )}
      </div>
    </div>
  )
}
