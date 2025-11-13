'use client'

import { useEffect, useState } from 'react'
import { UserPlus, Calendar } from 'lucide-react'
import { formatDateArabic } from '@/lib/dashboard-utils'
import Link from 'next/link'

interface Member {
  id: string
  fullName: string
  memberNumber: string
  phone: string
  joinDate: string
  photo?: string
}

export default function RecentMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/members?limit=10&sortBy=joinDate&order=desc')
      const result = await response.json()
      setMembers(result.members || [])
    } catch (error) {
      console.error('Error fetching recent members:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">آخر الأعضاء المسجلين</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (members.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">آخر الأعضاء المسجلين</h3>
        <div className="h-64 flex items-center justify-center text-slate-500">
          لا يوجد أعضاء مسجلين حتى الآن
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">آخر الأعضاء المسجلين</h3>
        <Link href="/members" className="text-sm text-blue-600 hover:text-blue-700">
          عرض الكل
        </Link>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {members.map((member) => (
          <Link 
            key={member.id}
            href={`/members/${member.id}`}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {member.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">{member.fullName}</p>
              <p className="text-sm text-slate-600">رقم العضوية: {member.memberNumber}</p>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>{formatDateArabic(new Date(member.joinDate), 'dd/MM/yyyy')}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
