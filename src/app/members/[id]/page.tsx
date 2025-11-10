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
  CheckCircle2
} from 'lucide-react'
import { format } from 'date-fns'

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
  subscriptions: any[]
  attendance: any[]
  payments: any[]
}

export default function MemberDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMember()
  }, [])

  const fetchMember = async () => {
    try {
      const response = await fetch(`/api/members/${params.id}`)
      const data = await response.json()
      setMember(data)
    } catch (error) {
      console.error('Error fetching member:', error)
    } finally {
      setLoading(false)
    }
  }

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
          <p className="text-red-600 text-xl">المشترك غير موجود</p>
          <button
            onClick={() => router.push('/members')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            العودة للمشتركين
          </button>
        </div>
      </div>
    )
  }

  const activeSubscription = member.subscriptions.find(sub => sub.status === 'active')

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
                onClick={() => router.push(`/members/${member.id}/edit`)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                تعديل
              </button>
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="Sport Zone" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                المعلومات الشخصية
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-600">الاسم الكامل</label>
                  <p className="text-slate-800 mt-1">{member.fullName}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-600">رقم الجوال</label>
                  <p className="text-slate-800 mt-1 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {member.phone}
                  </p>
                </div>

                {member.email && (
                  <div>
                    <label className="text-sm font-semibold text-slate-600">البريد الإلكتروني</label>
                    <p className="text-slate-800 mt-1 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {member.email}
                    </p>
                  </div>
                )}

                {member.nationalId && (
                  <div>
                    <label className="text-sm font-semibold text-slate-600">رقم الهوية</label>
                    <p className="text-slate-800 mt-1">{member.nationalId}</p>
                  </div>
                )}

                {member.dateOfBirth && (
                  <div>
                    <label className="text-sm font-semibold text-slate-600">تاريخ الميلاد</label>
                    <p className="text-slate-800 mt-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {format(new Date(member.dateOfBirth), 'yyyy-MM-dd')}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-slate-600">الجنس</label>
                  <p className="text-slate-800 mt-1">{member.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                </div>

                {member.address && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-600">العنوان</label>
                    <p className="text-slate-800 mt-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {member.address}
                    </p>
                  </div>
                )}

                {member.emergencyContact && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-slate-600">جهة الاتصال للطوارئ</label>
                      <p className="text-slate-800 mt-1">{member.emergencyContact}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-600">رقم الطوارئ</label>
                      <p className="text-slate-800 mt-1">{member.emergencyPhone}</p>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-sm font-semibold text-slate-600">تاريخ التسجيل</label>
                  <p className="text-slate-800 mt-1">{format(new Date(member.joinDate), 'yyyy-MM-dd')}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-600">الحالة</label>
                  <p className="mt-1">
                    {member.status === 'active' ? (
                      <span className="text-green-600 font-semibold">✓ نشط</span>
                    ) : (
                      <span className="text-red-600 font-semibold">✗ غير نشط</span>
                    )}
                  </p>
                </div>

                {member.notes && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-600">ملاحظات</label>
                    <p className="text-slate-800 mt-1">{member.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Subscriptions History */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                سجل الاشتراكات
              </h2>

              {member.subscriptions.length === 0 ? (
                <p className="text-slate-600 text-center py-8">لا توجد اشتراكات</p>
              ) : (
                <div className="space-y-4">
                  {member.subscriptions.map((sub) => (
                    <div key={sub.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{sub.package.name}</p>
                          <p className="text-sm text-slate-600 mt-1">
                            من {format(new Date(sub.startDate), 'yyyy-MM-dd')} 
                            إلى {format(new Date(sub.endDate), 'yyyy-MM-dd')}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            المبلغ: {sub.amount} ريال
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sub.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sub.status === 'active' ? 'نشط' : 'منتهي'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attendance History */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                سجل الحضور (آخر 10)
              </h2>

              {member.attendance.length === 0 ? (
                <p className="text-slate-600 text-center py-8">لا يوجد سجل حضور</p>
              ) : (
                <div className="space-y-2">
                  {member.attendance.map((att) => (
                    <div key={att.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-semibold text-slate-800">{att.date}</p>
                          <p className="text-sm text-slate-600">
                            دخول: {format(new Date(att.checkIn), 'HH:mm')}
                            {att.checkOut && ` - خروج: ${format(new Date(att.checkOut), 'HH:mm')}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Current Subscription */}
            {activeSubscription && (
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">الاشتراك الحالي</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-purple-100 text-sm">الباقة</p>
                    <p className="font-semibold text-xl">{activeSubscription.package.name}</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm">تاريخ الانتهاء</p>
                    <p className="font-semibold">{format(new Date(activeSubscription.endDate), 'yyyy-MM-dd')}</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-sm">الأيام المتبقية</p>
                    <p className="font-semibold text-2xl">
                      {Math.ceil((new Date(activeSubscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} يوم
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">إحصائيات سريعة</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-slate-700">مرات الحضور</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{member.attendance.length}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700">المدفوعات</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{member.payments.length}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-slate-700">الاشتراكات</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{member.subscriptions.length}</span>
                </div>
              </div>
            </div>

            {/* Payments History */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                آخر المدفوعات
              </h3>

              {member.payments.length === 0 ? (
                <p className="text-slate-600 text-center py-4 text-sm">لا توجد مدفوعات</p>
              ) : (
                <div className="space-y-2">
                  {member.payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-slate-800">{payment.amount} ريال</p>
                          <p className="text-xs text-slate-600 mt-1">
                            {format(new Date(payment.createdAt), 'yyyy-MM-dd')}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {payment.method === 'CASH' ? 'نقدي' : payment.method === 'CARD' ? 'بطاقة' : 'تحويل'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
