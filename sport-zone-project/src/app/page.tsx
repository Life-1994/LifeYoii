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
  CheckCircle2,
  UserCheck,
  CalendarCheck,
  GraduationCap,
  Wallet,
  TrendingDown
} from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import MemberGrowthChart from '@/components/dashboard/MemberGrowthChart'
import RevenueChart from '@/components/dashboard/RevenueChart'
import SubscriptionPieChart from '@/components/dashboard/SubscriptionPieChart'
import AttendanceChart from '@/components/dashboard/AttendanceChart'
import RecentMembers from '@/components/dashboard/RecentMembers'
import ExpiringSubscriptions from '@/components/dashboard/ExpiringSubscriptions'
import ExportButtons from '@/components/dashboard/ExportButtons'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    todayAttendance: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
    todayBookings: 0,
    activeTrainers: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    netProfit: 0,
    expiringIn7Days: 0,
    revenueChange: 0,
    memberGrowthChange: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const dateRange = {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
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
                <p className="text-sm text-slate-600">لوحة التحكم الإحصائية المتقدمة</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <ExportButtons stats={stats} dateRange={dateRange} />
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
          <h2 className="text-xl font-bold text-slate-800 mb-4">نظرة عامة</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-slate-200 animate-pulse">
                  <div className="h-20"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="إجمالي الأعضاء"
                value={stats.totalMembers}
                icon={Users}
                color="blue"
                trend={{
                  value: stats.memberGrowthChange,
                  isPositive: stats.memberGrowthChange >= 0
                }}
                subtitle={`${stats.activeMembers} نشط`}
              />
              
              <StatsCard
                title="حضور اليوم"
                value={stats.todayAttendance}
                icon={UserCheck}
                color="green"
                subtitle="مشترك حضر اليوم"
              />
              
              <StatsCard
                title="الاشتراكات الفعالة"
                value={stats.activeSubscriptions}
                icon={CalendarCheck}
                color="purple"
                subtitle={`${stats.expiringIn7Days} ينتهي خلال 7 أيام`}
              />
              
              <StatsCard
                title="حجوزات اليوم"
                value={stats.todayBookings}
                icon={Calendar}
                color="orange"
                subtitle="حجز مؤكد"
              />
              
              <StatsCard
                title="إيرادات الشهر"
                value={`${stats.monthlyRevenue.toLocaleString('ar-SA')} ريال`}
                icon={DollarSign}
                color="green"
                trend={{
                  value: stats.revenueChange,
                  isPositive: stats.revenueChange >= 0
                }}
                subtitle="مقارنة بالشهر السابق"
              />
              
              <StatsCard
                title="المصروفات"
                value={`${stats.monthlyExpenses.toLocaleString('ar-SA')} ريال`}
                icon={Wallet}
                color="red"
                subtitle="مصروفات الشهر"
              />
              
              <StatsCard
                title="صافي الربح"
                value={`${stats.netProfit.toLocaleString('ar-SA')} ريال`}
                icon={TrendingUp}
                color={stats.netProfit >= 0 ? 'green' : 'red'}
                subtitle="الإيرادات - المصروفات"
              />
              
              <StatsCard
                title="المدربون النشطون"
                value={stats.activeTrainers}
                icon={GraduationCap}
                color="blue"
                subtitle="مدرب نشط"
              />
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">الرسوم البيانية</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <MemberGrowthChart />
            <RevenueChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceChart />
            <SubscriptionPieChart />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">النشاط الأخير</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentMembers />
            <ExpiringSubscriptions />
          </div>
        </div>
      </main>
    </div>
  )
}
