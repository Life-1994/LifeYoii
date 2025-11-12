'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  ArrowRight, 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'

interface Member {
  id: string
  memberNumber: string
  fullName: string
  phone: string
  email: string
  gender: string
  status: string
  joinDate: string
  subscriptions: any[]
  _count: {
    attendance: number
    payments: number
  }
}

export default function MembersPage() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchMembers()
  }, [search, statusFilter, pagination.page])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })

      const response = await fetch(`/api/members?${params}`)
      const data = await response.json()
      
      setMembers(data.members)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف ${name}؟`)) return

    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('تم حذف المشترك بنجاح')
        fetchMembers()
      } else {
        alert('حدث خطأ أثناء الحذف')
      }
    } catch (error) {
      console.error('Error deleting member:', error)
      alert('حدث خطأ أثناء الحذف')
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200',
      suspended: 'bg-orange-100 text-orange-800 border-orange-200',
    }

    const icons = {
      active: <CheckCircle2 className="w-4 h-4" />,
      inactive: <XCircle className="w-4 h-4" />,
      suspended: <Clock className="w-4 h-4" />,
    }

    const labels = {
      active: 'نشط',
      inactive: 'غير نشط',
      suspended: 'موقوف',
    }

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const hasActiveSubscription = (member: Member) => {
    return member.subscriptions.length > 0 && member.subscriptions[0].status === 'active'
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
                <h1 className="text-2xl font-bold text-slate-800">المشتركين</h1>
                <p className="text-sm text-slate-600">إدارة جميع المشتركين</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/members/new')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                مشترك جديد
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
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPagination({ ...pagination, page: 1 })
                  }}
                  placeholder="ابحث بالاسم، رقم العضوية، الجوال..."
                  className="w-full pr-12 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <div className="relative">
                <Filter className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setPagination({ ...pagination, page: 1 })
                  }}
                  className="w-full pr-12 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="suspended">موقوف</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
            <span>إجمالي المشتركين: <strong className="text-slate-800">{pagination.total}</strong></span>
            <span>•</span>
            <span>الصفحة: <strong className="text-slate-800">{pagination.page} من {pagination.totalPages}</strong></span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-slate-600">جاري التحميل...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-600">لا توجد نتائج</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">رقم العضوية</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">الاسم</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">الجوال</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">الحالة</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">الاشتراك</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">تاريخ التسجيل</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono font-semibold text-blue-600">{member.memberNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-800">{member.fullName}</p>
                            <p className="text-sm text-slate-500">{member.email || 'لا يوجد بريد'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{member.phone}</td>
                        <td className="px-6 py-4">{getStatusBadge(member.status)}</td>
                        <td className="px-6 py-4">
                          {hasActiveSubscription(member) ? (
                            <span className="text-green-600 font-semibold">✓ نشط</span>
                          ) : (
                            <span className="text-red-600">✗ منتهي</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm">
                          {format(new Date(member.joinDate), 'yyyy-MM-dd')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/members/${member.id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="عرض"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => router.push(`/members/${member.id}/edit`)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(member.id, member.fullName)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    السابق
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setPagination({ ...pagination, page })}
                        className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                          pagination.page === page
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    التالي
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
