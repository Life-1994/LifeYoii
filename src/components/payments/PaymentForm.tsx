'use client'

import { useState } from 'react'
import { PaymentMethod } from '@/lib/types'

interface PaymentFormProps {
  memberId: string
  invoiceId?: string
  amount: number
  onSuccess?: (payment: any) => void
  onError?: (error: string) => void
}

export default function PaymentForm({
  memberId,
  invoiceId,
  amount,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          invoiceId,
          amount,
          method,
          description,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process payment')
      }

      onSuccess?.(data.payment)
    } catch (error: any) {
      console.error('Payment error:', error)
      onError?.(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          المبلغ / Amount
        </label>
        <input
          type="text"
          value={`${amount.toFixed(2)} SAR`}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          طريقة الدفع / Payment Method
        </label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as PaymentMethod)}
          className="w-full p-2 border rounded"
          required
        >
          <option value={PaymentMethod.CASH}>نقدي / Cash</option>
          <option value={PaymentMethod.CARD}>بطاقة / Card</option>
          <option value={PaymentMethod.BANK_TRANSFER}>تحويل بنكي / Bank Transfer</option>
          <option value={PaymentMethod.STRIPE}>Stripe</option>
          <option value={PaymentMethod.PAYPAL}>PayPal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          الوصف / Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="وصف الدفعة..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'جاري المعالجة...' : 'إتمام الدفع / Complete Payment'}
      </button>
    </form>
  )
}
