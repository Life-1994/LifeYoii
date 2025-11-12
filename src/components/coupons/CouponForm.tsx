'use client'

import { useState } from 'react'
import { DiscountType } from '@/lib/types'

interface CouponFormProps {
  onSuccess?: (coupon: any) => void
}

export default function CouponForm({ onSuccess }: CouponFormProps) {
  const [formData, setFormData] = useState({
    code: '',
    type: DiscountType.PERCENTAGE,
    value: '',
    minAmount: '',
    maxUses: '',
    validFrom: '',
    validUntil: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.code,
          type: formData.type,
          value: parseFloat(formData.value),
          minAmount: formData.minAmount ? parseFloat(formData.minAmount) : null,
          maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
          validFrom: formData.validFrom,
          validUntil: formData.validUntil,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create coupon')
      }

      onSuccess?.(data.coupon)
      
      // Reset form
      setFormData({
        code: '',
        type: DiscountType.PERCENTAGE,
        value: '',
        minAmount: '',
        maxUses: '',
        validFrom: '',
        validUntil: '',
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          كود الكوبون / Coupon Code
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full p-2 border rounded uppercase"
          required
          placeholder="SUMMER2024"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            نوع الخصم / Discount Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value={DiscountType.PERCENTAGE}>نسبة مئوية %</option>
            <option value={DiscountType.FIXED_AMOUNT}>مبلغ ثابت SAR</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            القيمة / Value
          </label>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            الحد الأدنى / Min Amount (اختياري)
          </label>
          <input
            type="number"
            name="minAmount"
            value={formData.minAmount}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            عدد الاستخدامات / Max Uses (اختياري)
          </label>
          <input
            type="number"
            name="maxUses"
            value={formData.maxUses}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            صالح من / Valid From
          </label>
          <input
            type="datetime-local"
            name="validFrom"
            value={formData.validFrom}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            صالح حتى / Valid Until
          </label>
          <input
            type="datetime-local"
            name="validUntil"
            value={formData.validUntil}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'جاري الإنشاء...' : 'إنشاء كوبون / Create Coupon'}
      </button>
    </form>
  )
}
