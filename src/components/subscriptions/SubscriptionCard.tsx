'use client'

import { Calendar, DollarSign, Package, Clock } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

interface SubscriptionCardProps {
  subscription: any
  showMember?: boolean
}

export default function SubscriptionCard({ subscription, showMember = false }: SubscriptionCardProps) {
  const daysRemaining = differenceInDays(new Date(subscription.endDate), new Date())
  const isExpiring = daysRemaining <= 7 && daysRemaining >= 0
  const isExpired = daysRemaining < 0

  const getStatusBadge = () => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      expired: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
      frozen: 'bg-blue-100 text-blue-800 border-blue-200',
    }

    const labels: Record<string, string> = {
      active: 'نشط',
      expired: 'منتهي',
      cancelled: 'ملغي',
      frozen: 'مجمد',
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[subscription.status]}`}>
        {labels[subscription.status]}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          {showMember && (
            <p className="text-sm font-semibold text-slate-600 mb-1">
              {subscription.member?.fullName}
            </p>
          )}
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            {subscription.package?.name}
          </h3>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            تاريخ البداية
          </span>
          <span className="font-semibold text-slate-800">
            {format(new Date(subscription.startDate), 'yyyy-MM-dd')}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            تاريخ الانتهاء
          </span>
          <span className="font-semibold text-slate-800">
            {format(new Date(subscription.endDate), 'yyyy-MM-dd')}
          </span>
        </div>

        {subscription.status === 'active' && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4" />
              الأيام المتبقية
            </span>
            <span className={`font-bold ${isExpiring ? 'text-orange-600' : 'text-green-600'}`}>
              {daysRemaining} يوم
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-200">
          <span className="flex items-center gap-2 text-slate-600">
            <DollarSign className="w-4 h-4" />
            المبلغ
          </span>
          <div className="text-left">
            <span className="font-bold text-lg text-slate-800">
              {subscription.amount} ر.س
            </span>
            {subscription.discount > 0 && (
              <div className="text-xs text-green-600">
                خصم: {subscription.discount} ر.س
              </div>
            )}
          </div>
        </div>
      </div>

      {subscription.status === 'frozen' && subscription.freezeReason && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <p className="font-semibold text-blue-800 mb-1">سبب التجميد:</p>
          <p className="text-blue-700">{subscription.freezeReason}</p>
        </div>
      )}

      {isExpiring && subscription.status === 'active' && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
          ⚠️ ينتهي قريباً! يرجى التجديد
        </div>
      )}
    </div>
  )
}
