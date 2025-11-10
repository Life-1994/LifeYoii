'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Users, 
  UserPlus, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    todayAttendance: 0,
    expiringToday: 0,
    monthlyRevenue: 0,
    pendingPayments: 0
  })

  useEffect(() => {
    // جلب الإحصائيات من API
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <Image
                  src="/logo.png"
                  alt="Sport Zone Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Sport Zone</h1>
                <p className="text-sm text-slate-600">المنطقة الرياضية</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">مرحباً</p>
                <p className="font-semibold text-slate-800">المدير</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">الإجراءات السريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a href="/members/new" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 block">
              <UserPlus className="w-8 h-8 mb-2" />
              <p className="font-semibold">تسجيل مشترك جديد</p>
            </a>
            
            <a href="/members" className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 block">
              <Users className="w-8 h-8 mb-2" />
              <p className="font-semibold">إدارة المشتركين</p>
            </a>
            
            <button className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <CheckCircle2 className="w-8 h-8 mb-2" />
              <p className="font-semibold">تسجيل حضور</p>
            </button>
            
            <button className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Calendar className="w-8 h-8 mb-2" />
              <p className="font-semibold">التقارير</p>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">الإحصائيات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Members */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-slate-600">إجمالي المشتركين</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.totalMembers}</p>
              <p className="text-sm text-green-600 mt-2">
                <TrendingUp className="w-4 h-4 inline ml-1" />
                {stats.activeMembers} نشط
              </p>
            </div>

            {/* Today's Attendance */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-slate-600">حضور اليوم</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.todayAttendance}</p>
              <p className="text-sm text-slate-600 mt-2">مشترك حضر اليوم</p>
            </div>

            {/* Expiring Today */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm text-slate-600">اشتراكات منتهية</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.expiringToday}</p>
              <p className="text-sm text-orange-600 mt-2">يحتاج تجديد</p>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-slate-600">إيرادات الشهر</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.monthlyRevenue.toLocaleString()} ريال</p>
              <p className="text-sm text-slate-600 mt-2">هذا الشهر</p>
            </div>

            {/* Pending Payments */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm text-slate-600">مدفوعات معلقة</span>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stats.pendingPayments}</p>
              <p className="text-sm text-red-600 mt-2">يحتاج متابعة</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">النشاط الأخير</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">مشترك جديد</p>
                <p className="text-sm text-slate-600">أحمد محمد - رقم العضوية: 1001</p>
              </div>
              <span className="text-sm text-slate-500">منذ 5 دقائق</span>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">تسجيل حضور</p>
                <p className="text-sm text-slate-600">خالد عبدالله - الساعة 10:30 صباحاً</p>
              </div>
              <span className="text-sm text-slate-500">منذ 15 دقيقة</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
