'use client'

import { useState, useEffect } from 'react'

interface RevenueData {
  totalRevenue: number
  monthlyRevenue: number
  weeklyRevenue: number
  dailyRevenue: number
  pendingPayments: number
  completedPayments: number
  refundedAmount: number
}

export default function RevenueChart() {
  const [data, setData] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly')

  useEffect(() => {
    fetchRevenueData()
  }, [])

  const fetchRevenueData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/payments?limit=1000')
      const paymentsData = await response.json()
      
      const payments = paymentsData.payments || []
      
      // Calculate revenue
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const totalRevenue = payments
        .filter((p: any) => p.status === 'COMPLETED')
        .reduce((sum: number, p: any) => sum + p.amount, 0)

      const dailyRevenue = payments
        .filter((p: any) => 
          p.status === 'COMPLETED' && 
          new Date(p.createdAt) >= todayStart
        )
        .reduce((sum: number, p: any) => sum + p.amount, 0)

      const weeklyRevenue = payments
        .filter((p: any) => 
          p.status === 'COMPLETED' && 
          new Date(p.createdAt) >= weekStart
        )
        .reduce((sum: number, p: any) => sum + p.amount, 0)

      const monthlyRevenue = payments
        .filter((p: any) => 
          p.status === 'COMPLETED' && 
          new Date(p.createdAt) >= monthStart
        )
        .reduce((sum: number, p: any) => sum + p.amount, 0)

      const pendingPayments = payments
        .filter((p: any) => p.status === 'PENDING')
        .reduce((sum: number, p: any) => sum + p.amount, 0)

      const completedPayments = payments
        .filter((p: any) => p.status === 'COMPLETED')
        .length

      const refundedAmount = payments
        .filter((p: any) => p.status === 'REFUNDED')
        .reduce((sum: number, p: any) => sum + p.amount, 0)

      setData({
        totalRevenue,
        monthlyRevenue,
        weeklyRevenue,
        dailyRevenue,
        pendingPayments,
        completedPayments,
        refundedAmount,
      })
    } catch (error) {
      console.error('Error fetching revenue data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  if (!data) {
    return <div className="text-center py-8">لا توجد بيانات</div>
  }

  const getCurrentRevenue = () => {
    switch (period) {
      case 'daily':
        return data.dailyRevenue
      case 'weekly':
        return data.weeklyRevenue
      case 'monthly':
        return data.monthlyRevenue
      default:
        return data.monthlyRevenue
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">التقارير المالية / Financial Reports</h2>
        
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="p-2 border rounded"
        >
          <option value="daily">يومي / Daily</option>
          <option value="weekly">أسبوعي / Weekly</option>
          <option value="monthly">شهري / Monthly</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">الإيرادات الحالية</h3>
          <p className="text-3xl font-bold text-blue-600">
            {getCurrentRevenue().toFixed(2)} SAR
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {period === 'daily' ? 'اليوم' : period === 'weekly' ? 'هذا الأسبوع' : 'هذا الشهر'}
          </p>
        </div>

        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">إجمالي الإيرادات</h3>
          <p className="text-3xl font-bold text-green-600">
            {data.totalRevenue.toFixed(2)} SAR
          </p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">المدفوعات المعلقة</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {data.pendingPayments.toFixed(2)} SAR
          </p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>

        <div className="bg-red-100 p-6 rounded-lg">
          <h3 className="text-sm text-gray-600 mb-2">المبالغ المستردة</h3>
          <p className="text-3xl font-bold text-red-600">
            {data.refundedAmount.toFixed(2)} SAR
          </p>
          <p className="text-xs text-gray-500 mt-1">Refunded</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-bold mb-4">ملخص سريع / Quick Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>عدد المدفوعات المكتملة:</span>
            <span className="font-bold">{data.completedPayments}</span>
          </div>
          <div className="flex justify-between">
            <span>الإيرادات اليومية:</span>
            <span className="font-bold">{data.dailyRevenue.toFixed(2)} SAR</span>
          </div>
          <div className="flex justify-between">
            <span>الإيرادات الأسبوعية:</span>
            <span className="font-bold">{data.weeklyRevenue.toFixed(2)} SAR</span>
          </div>
          <div className="flex justify-between">
            <span>الإيرادات الشهرية:</span>
            <span className="font-bold">{data.monthlyRevenue.toFixed(2)} SAR</span>
          </div>
        </div>
      </div>
    </div>
  )
}
