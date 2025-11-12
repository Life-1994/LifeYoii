'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  ArrowRight, 
  Edit, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  DollarSign,
  CheckCircle2,
  QrCode,
  Activity,
  FileText,
  Package
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import QRCodeDisplay from '@/components/members/QRCodeDisplay'
import SubscriptionCard from '@/components/subscriptions/SubscriptionCard'

interface Member {
  id: string
  memberNumber: string
  fullName: string
  phone: string
  email: string
  nationalId: string
  dateOfBirth: string
  gender: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  status: string
  notes: string
  joinDate: string
  photo: string
}

export default function MemberDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [params.id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [memberRes, subsRes, attendanceRes, paymentsRes] = await Promise.all([
        fetch(`/api/members/${params.id}`),
        fetch(`/api/members/${params.id}/subscriptions`),
        fetch(`/api/members/${params.id}/attendance?days=30`),
        fetch(`/api/members/${params.id}/payments`),
      ])

      const memberData = await memberRes.json()
      const subsData = await subsRes.json()
      const attendanceData = await attendanceRes.json()
      const paymentsData = await paymentsRes.json()

      setMember(memberData.member)
      setSubscriptions(subsData.subscriptions || [])
      setAttendance(attendanceData.attendance || [])
      setPayments(paymentsData.payments || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
      suspended: 'bg-orange-100 text-orange-800 border-orange-200',
    }

    const labels: Record<string, string> = {
      active: 'نشط',
      inactive: 'غير نشط',
      suspended: 'موقوف',
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const currentSubscription = subscriptions.find(s => s.status === 'active')
  const daysRemaining = currentSubscription 
    ? differenceInDays(new Date(currentSubscription.endDate), new Date())
    : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">العضو غير موجود</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/members')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{member.fullName}</h1>
                <p className="text-sm text-slate-600">رقم العضوية: {member.memberNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/members/${params.id}/edit`)}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                تعديل
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">المعلومات الأساسية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600">الاسم الكامل</p>
                    <p className="font-semibold text-slate-800">{member.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600">الجوال</p>
                    <p className="font-semibold text-slate-800" dir="ltr">{member.phone}</p>
                  </div>
                </div>

                {member.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">البريد الإلكتروني</p>
                      <p className="font-semibold text-slate-800">{member.email}</p>
                    </div>
                  </div>
                )}

                {member.dateOfBirth && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">تاريخ الميلاد</p>
                      <p className="font-semibold text-slate-800">
                        {format(new Date(member.dateOfBirth), 'yyyy-MM-dd')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600">الجنس</p>
                    <p className="font-semibold text-slate-800">
                      {member.gender === 'male' ? 'ذكر' : 'أنثى'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-600">الحالة</p>
                    <div>{getStatusBadge(member.status)}</div>
                  </div>
                </div>

                {member.address && (
                  <div className="flex items-center gap-3 md:col-span-2">
                    <MapPin className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">العنوان</p>
                      <p className="font-semibold text-slate-800">{member.address}</p>
                    </div>
                  </div>
                )}

                {member.emergencyContact && (
                  <>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">جهة اتصال طوارئ</p>
                        <p className="font-semibold text-slate-800">{member.emergencyContact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">رقم الطوارئ</p>
                        <p className="font-semibold text-slate-800" dir="ltr">{member.emergencyPhone}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200">
              <div className="border-b border-slate-200">
                <div className="flex gap-4 px-6">
                  {[
                    { id: 'overview', label: 'نظرة عامة', icon: Activity },
                    { id: 'subscriptions', label: 'الاشتراكات', icon: Package },
                    { id: 'attendance', label: 'الحضور', icon: Clock },
                    { id: 'payments', label: 'المدفوعات', icon: DollarSign },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600 font-semibold'
                          : 'border-transparent text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600 mb-1">إجمالي الاشتراكات</p>
                        <p className="text-2xl font-bold text-blue-800">{subscriptions.length}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-600 mb-1">عدد الحضور</p>
                        <p className="text-2xl font-bold text-green-800">{attendance.length}</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-purple-600 mb-1">إجمالي المدفوعات</p>
                        <p className="text-2xl font-bold text-purple-800">
                          {payments.reduce((sum, p) => sum + p.amount, 0)} ر.س
                        </p>
                      </div>
                    </div>
                    
                    {currentSubscription && (
                      <div className="mt-6">
                        <h3 className="font-bold text-slate-800 mb-3">الاشتراك الحالي</h3>
                        <SubscriptionCard subscription={currentSubscription} />
                      </div>
                    )}
                  </div>
                )}

                {/* Subscriptions Tab */}
                {activeTab === 'subscriptions' && (
                  <div className="space-y-4">
                    {subscriptions.length > 0 ? (
                      subscriptions.map((subscription) => (
                        <SubscriptionCard
                          key={subscription.id}
                          subscription={subscription}
                        />
                      ))
                    ) : (
                      <p className="text-center text-slate-500 py-8">لا توجد اشتراكات</p>
                    )}
                  </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-4">سجل الحضور (آخر 30 يوم)</h3>
                    {attendance.length > 0 ? (
                      <div className="space-y-2">
                        {attendance.map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div>
                              <p className="font-semibold text-slate-800">{record.date}</p>
                              <p className="text-sm text-slate-600">
                                دخول: {format(new Date(record.checkIn), 'HH:mm')}
                              </p>
                            </div>
                            {record.checkOut && (
                              <p className="text-sm text-slate-600">
                                خروج: {format(new Date(record.checkOut), 'HH:mm')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-500 py-8">لا يوجد سجل حضور</p>
                    )}
                  </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                  <div>
                    <h3 className="font-bold text-slate-800 mb-4">سجل المدفوعات</h3>
                    {payments.length > 0 ? (
                      <div className="space-y-2">
                        {payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div>
                              <p className="font-semibold text-slate-800">{payment.description}</p>
                              <p className="text-sm text-slate-600">
                                {format(new Date(payment.paymentDate), 'yyyy-MM-dd')}
                              </p>
                              <p className="text-xs text-slate-500">
                                {payment.paymentMethod === 'cash' ? 'نقدي' : 
                                 payment.paymentMethod === 'card' ? 'بطاقة' : 'تحويل'}
                              </p>
                            </div>
                            <div className="text-left">
                              <p className="text-lg font-bold text-green-600">
                                {payment.amount} ر.س
                              </p>
                              {payment.receiptNumber && (
                                <p className="text-xs text-slate-500">#{payment.receiptNumber}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-slate-500 py-8">لا توجد مدفوعات</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - QR Code & Quick Info */}
          <div className="space-y-6">
            <QRCodeDisplay
              memberId={params.id}
              memberName={member.fullName}
              memberNumber={member.memberNumber}
            />

            {/* Membership Info */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">معلومات العضوية</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">رقم العضوية</span>
                  <span className="font-semibold text-slate-800 font-mono">{member.memberNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">تاريخ الانضمام</span>
                  <span className="font-semibold text-slate-800">
                    {format(new Date(member.joinDate), 'yyyy-MM-dd')}
                  </span>
                </div>
                {currentSubscription && (
                  <>
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">الاشتراك الحالي</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">نشط</span>
                      </div>
                      <p className="font-semibold text-slate-800">{currentSubscription.package?.name}</p>
                    </div>
                    {daysRemaining !== null && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">الأيام المتبقية</span>
                        <span className={`font-bold ${
                          daysRemaining <= 7 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {daysRemaining} يوم
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Notes */}
            {member.notes && (
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  ملاحظات
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">{member.notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
