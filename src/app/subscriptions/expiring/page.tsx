'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, AlertCircle, RefreshCw } from 'lucide-react'
import { differenceInDays } from 'date-fns'
import SubscriptionCard from '@/components/subscriptions/SubscriptionCard'

export default function ExpiringSubscriptionsPage() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpiringSubscriptions()
  }, [])

  const fetchExpiringSubscriptions = async () => {
    setLoading(true)
    try {
      // Fetch all active subscriptions
      const response = await fetch('/api/subscriptions?status=active&limit=100')
      const data = await response.json()
      
      // Filter subscriptions expiring within 7 days
      const expiring = data.subscriptions.filter((sub: any) => {
        const daysRemaining = differenceInDays(new Date(sub.endDate), new Date())
        return daysRemaining >= 0 && daysRemaining <= 7
      })
      
      // Sort by days remaining (ascending)
      expiring.sort((a: any, b: any) => {
        const daysA = differenceInDays(new Date(a.endDate), new Date())
        const daysB = differenceInDays(new Date(b.endDate), new Date())
        return daysA - daysB
      })

      setSubscriptions(expiring)
    } catch (error) {
      console.error('Error fetching expiring subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRenewAll = async () => {
    if (!confirm(`هل تريد تجديد جميع الاشتراكات المنتهية (${subscriptions.length} اشتراك)؟`)) {
      return
    }

    alert('سيتم تطبيق هذه الميزة قريباً')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/subscriptions')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  اشتراكات منتهية
                </h1>
                <p className="text-sm text-slate-600">اشتراكات تنتهي خلال 7 أيام</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {subscriptions.length > 0 && (
                <button
                  onClick={handleRenewAll}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  تجديد الكل
                </button>
              )}
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="Sport Zone" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-orange-800 mb-2">تنبيه: اشتراكات تنتهي قريباً</h2>
              <p className="text-orange-700 text-sm">
                يوجد {subscriptions.length} اشتراك سينتهي خلال الأيام القادمة. يرجى التواصل مع الأعضاء للتجديد.
              </p>
            </div>
          </div>
        </div>

        {/* Subscriptions Grid */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-600">جاري التحميل...</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">رائع!</h3>
            <p className="text-slate-600">لا توجد اشتراكات تنتهي خلال الأيام القادمة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                showMember={true}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
