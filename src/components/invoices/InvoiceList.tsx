'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Invoice {
  id: string
  invoiceNumber: string
  member: {
    fullName: string
    memberNumber: string
  }
  total: number
  status: string
  dueDate: string
  createdAt: string
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchInvoices()
  }, [statusFilter])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const url = statusFilter !== 'all' 
        ? `/api/invoices?status=${statusFilter}`
        : '/api/invoices'
      
      const response = await fetch(url)
      const data = await response.json()
      setInvoices(data.invoices || [])
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
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

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      DRAFT: 'مسودة',
      PENDING: 'معلق',
      PAID: 'مدفوع',
      OVERDUE: 'متأخر',
      CANCELLED: 'ملغي',
    }
    return texts[status] || status
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">الفواتير / Invoices</h2>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">الكل</option>
          <option value="PENDING">معلق</option>
          <option value="PAID">مدفوع</option>
          <option value="OVERDUE">متأخر</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">رقم الفاتورة</th>
              <th className="px-4 py-2 border">العميل</th>
              <th className="px-4 py-2 border">المبلغ</th>
              <th className="px-4 py-2 border">الحالة</th>
              <th className="px-4 py-2 border">تاريخ الاستحقاق</th>
              <th className="px-4 py-2 border">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{invoice.invoiceNumber}</td>
                <td className="px-4 py-2 border">
                  {invoice.member.fullName}
                  <br />
                  <span className="text-sm text-gray-600">
                    {invoice.member.memberNumber}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  {invoice.total.toFixed(2)} SAR
                </td>
                <td className="px-4 py-2 border">
                  <span className={`px-2 py-1 rounded text-sm ${getStatusBadge(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                </td>
                <td className="px-4 py-2 border">
                  {new Date(invoice.dueDate).toLocaleDateString('ar-SA')}
                </td>
                <td className="px-4 py-2 border">
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    عرض
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          لا توجد فواتير
        </div>
      )}
    </div>
  )
}
