'use client'

import { useState, useEffect } from 'react'
import CouponForm from '@/components/coupons/CouponForm'

interface Coupon {
  id: string
  code: string
  type: string
  value: number
  minAmount?: number
  maxUses?: number
  usedCount: number
  validFrom: string
  validUntil: string
  isActive: boolean
  createdAt: string
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/coupons')
      const data = await response.json()
      setCoupons(data.coupons || [])
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCouponCreated = (coupon: Coupon) => {
    setCoupons([coupon, ...coupons])
    setShowForm(false)
  }

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  const isValid = (validFrom: string, validUntil: string) => {
    const now = new Date()
    return new Date(validFrom) <= now && new Date(validUntil) >= now
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">كوبونات الخصم / Coupons</h1>
          <p className="text-gray-600">إدارة كوبونات الخصم والعروض الترويجية</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'إخفاء النموذج' : 'إضافة كوبون جديد'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">إنشاء كوبون جديد</h2>
          <CouponForm onSuccess={handleCouponCreated} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الكود
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  النوع
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  القيمة
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الحد الأدنى
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الاستخدامات
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الصلاحية
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-blue-600">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {coupon.type === 'PERCENTAGE' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    {coupon.type === 'PERCENTAGE' 
                      ? `${coupon.value}%` 
                      : `${coupon.value} SAR`
                    }
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {coupon.minAmount ? `${coupon.minAmount} SAR` : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {coupon.usedCount} / {coupon.maxUses || '∞'}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div>
                      من: {new Date(coupon.validFrom).toLocaleDateString('ar-SA')}
                    </div>
                    <div>
                      إلى: {new Date(coupon.validUntil).toLocaleDateString('ar-SA')}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {!coupon.isActive ? (
                      <span className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-800">
                        غير نشط
                      </span>
                    ) : isExpired(coupon.validUntil) ? (
                      <span className="px-2 py-1 rounded text-xs bg-red-200 text-red-800">
                        منتهي
                      </span>
                    ) : isValid(coupon.validFrom, coupon.validUntil) ? (
                      <span className="px-2 py-1 rounded text-xs bg-green-200 text-green-800">
                        نشط
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-yellow-200 text-yellow-800">
                        قريباً
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {coupons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد كوبونات
          </div>
        )}
      </div>
    </div>
  )
}
