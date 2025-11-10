'use client'

import InvoiceList from '@/components/invoices/InvoiceList'

export default function InvoicesPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">الفواتير / Invoices</h1>
        <p className="text-gray-600">إدارة الفواتير وطباعتها وإرسالها للعملاء</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <InvoiceList />
      </div>
    </div>
  )
}
