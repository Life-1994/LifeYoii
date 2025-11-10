'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, Save, User, Phone, Mail, Calendar, MapPin, AlertCircle, CreditCard } from 'lucide-react'

interface Package {
  id: string
  name: string
  duration: number
  price: number
  description: string
}

export default function AddMemberPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [packages, setPackages] = useState<Package[]>([])
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    nationalId: '',
    dateOfBirth: '',
    gender: 'male',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: '',
    packageId: '',
    paymentMethod: 'cash',
  })

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages')
      const data = await response.json()
      setPackages(data)
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`تم تسجيل المشترك بنجاح!\nرقم العضوية: ${data.member.memberNumber}`)
        router.push('/members')
      } else {
        alert('حدث خطأ أثناء التسجيل')
      }
    } catch (error) {
      console.error('Error creating member:', error)
      alert('حدث خطأ أثناء التسجيل')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">تسجيل مشترك جديد</h1>
                <p className="text-sm text-slate-600">أدخل بيانات العضو الجديد</p>
              </div>
            </div>
            
            <div className="relative w-12 h-12">
              <Image src="/logo.png" alt="Sport Zone" fill className="object-contain" />
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              المعلومات الشخصية
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="أدخل الاسم الكامل"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  رقم الجوال <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full pr-12 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="05xxxxxxxx"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pr-12 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* National ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  رقم الهوية
                </label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="1xxxxxxxxx"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  تاريخ الميلاد
                </label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full pr-12 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  الجنس <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  العنوان
                </label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pr-12 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="الحي، الشارع، المدينة"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              معلومات الطوارئ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emergency Contact Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  اسم جهة الاتصال
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="اسم الشخص للتواصل في الطوارئ"
                />
              </div>

              {/* Emergency Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  رقم الطوارئ
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="05xxxxxxxx"
                />
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              الاشتراك
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Package */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  الباقة
                </label>
                <select
                  name="packageId"
                  value={formData.packageId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                >
                  <option value="">بدون اشتراك الآن</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - {pkg.price} ريال ({pkg.duration} يوم)
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              {formData.packageId && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    طريقة الدفع
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  >
                    <option value="cash">نقدي</option>
                    <option value="card">بطاقة</option>
                    <option value="transfer">تحويل بنكي</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              ملاحظات
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="أي ملاحظات إضافية عن المشترك..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 px-6 py-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {loading ? 'جاري الحفظ...' : 'حفظ المشترك'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
