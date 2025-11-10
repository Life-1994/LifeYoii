'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Calendar } from 'lucide-react'
import { formatDateArabic } from '@/lib/dashboard-utils'

interface Subscription {
  id: string
  endDate: string
  member: {
    fullName: string
    phone: string
  }
  package: {
    name: string
  }
}

export default function ExpiringSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const today = new Date()
      const sevenDaysLater = new Date()
      sevenDaysLater.setDate(today.getDate() + 7)
      
      // This would need a proper API endpoint, using placeholder for now
      // For now, we'll create a mock endpoint call
      const response = await fetch('/api/members')
      const result = await response.json()
      
      // Filter subscriptions expiring in next 7 days
      const expiring: Subscription[] = []
      if (result.members) {
        result.members.forEach((member: any) => {
          if (member.subscriptions) {
            member.subscriptions.forEach((sub: any) => {
              const endDate = new Date(sub.endDate)
              if (endDate >= today && endDate <= sevenDaysLater && sub.status === 'active') {
                expiring.push({
                  id: sub.id,
                  endDate: sub.endDate,
                  member: {
                    fullName: member.fullName,
                    phone: member.phone
                  },
                  package: sub.package || { name: 'باقة' }
                })
              }
            })
          }
        })
      }
      
      setSubscriptions(expiring)
    } catch (error) {
      console.error('Error fetching expiring subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">الاشتراكات المنتهية قريباً</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">الاشتراكات المنتهية قريباً</h3>
        <div className="h-64 flex items-center justify-center text-slate-500">
          لا توجد اشتراكات منتهية في الأيام القادمة
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">الاشتراكات المنتهية قريباً</h3>
        <span className="text-sm text-orange-600 font-medium">
          {subscriptions.length} اشتراك
        </span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {subscriptions.map((subscription) => {
          const daysLeft = Math.ceil(
            (new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          )
          
          return (
            <div 
              key={subscription.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-orange-50 border border-orange-200"
            >
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{subscription.member.fullName}</p>
                <p className="text-sm text-slate-600">{subscription.package.name}</p>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-sm text-orange-600">
                  <Calendar className="w-4 h-4" />
                  <span>{daysLeft} يوم متبقي</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {formatDateArabic(new Date(subscription.endDate), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
