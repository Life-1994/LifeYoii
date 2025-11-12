'use client'

import RevenueChart from '@/components/financial/RevenueChart'

export default function FinancialReportsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">التقارير المالية / Financial Reports</h1>
        <p className="text-gray-600">تحليل شامل للإيرادات والمدفوعات</p>
      </div>

      <RevenueChart />
    </div>
  )
}
