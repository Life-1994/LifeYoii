'use client'

import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'

interface MemberFiltersProps {
  onSearch: (value: string) => void
  onFilterChange: (filters: any) => void
  totalMembers: number
}

export default function MemberFilters({ 
  onSearch, 
  onFilterChange, 
  totalMembers 
}: MemberFiltersProps) {
  const [search, setSearch] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    gender: 'all',
    subscriptionStatus: 'all',
  })

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearch(value)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      status: 'all',
      gender: 'all',
      subscriptionStatus: 'all',
    })
    setSearch('')
    onSearch('')
    onFilterChange({
      status: 'all',
      gender: 'all',
      subscriptionStatus: 'all',
    })
  }

  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.gender !== 'all' || 
    filters.subscriptionStatus !== 'all' ||
    search !== ''

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">البحث والتصفية</h2>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          {showAdvanced ? 'إخفاء الفلاتر المتقدمة' : 'إظهار الفلاتر المتقدمة'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="ابحث بالاسم، رقم العضوية، الجوال، البريد..."
              className="w-full pr-12 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="suspended">موقوف</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                الجنس
              </label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">الكل</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            {/* Subscription Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                حالة الاشتراك
              </label>
              <select
                value={filters.subscriptionStatus}
                onChange={(e) => handleFilterChange('subscriptionStatus', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">الكل</option>
                <option value="active">نشط</option>
                <option value="expired">منتهي</option>
                <option value="expiring">ينتهي قريباً</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  مسح الفلاتر
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-4 text-sm text-slate-600">
        <span>إجمالي المشتركين: <strong className="text-slate-800">{totalMembers}</strong></span>
        {hasActiveFilters && (
          <>
            <span>•</span>
            <span className="text-blue-600">فلاتر نشطة</span>
          </>
        )}
      </div>
    </div>
  )
}
