'use client'

import { useState } from 'react'
import { MoreVertical, Mail, UserCheck, UserX, Trash2, RefreshCw, Loader } from 'lucide-react'

interface BulkActionsMenuProps {
  selectedIds: string[]
  onComplete: () => void
}

export default function BulkActionsMenu({ selectedIds, onComplete }: BulkActionsMenuProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleBulkAction = async (action: string, data?: any) => {
    if (selectedIds.length === 0) {
      alert('الرجاء اختيار أعضاء أولاً')
      return
    }

    const confirmMessage = {
      updateStatus: `هل أنت متأكد من تغيير حالة ${selectedIds.length} عضو؟`,
      delete: `هل أنت متأكد من حذف ${selectedIds.length} عضو؟`,
      sendNotification: `هل تريد إرسال إشعار لـ ${selectedIds.length} عضو؟`,
    }[action]

    if (confirmMessage && !confirm(confirmMessage)) return

    setLoading(true)
    try {
      const response = await fetch('/api/members/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          memberIds: selectedIds,
          data,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert(`تم تنفيذ العملية على ${result.count} عضو بنجاح`)
        onComplete()
      } else {
        alert(result.error || 'حدث خطأ')
      }
    } catch (error) {
      console.error('Error performing bulk action:', error)
      alert('حدث خطأ أثناء تنفيذ العملية')
    } finally {
      setLoading(false)
      setShowMenu(false)
    }
  }

  const handleStatusChange = (status: string) => {
    handleBulkAction('updateStatus', { status })
  }

  const handleSendNotification = () => {
    const title = prompt('عنوان الإشعار:')
    const message = prompt('نص الإشعار:')
    
    if (title && message) {
      handleBulkAction('sendNotification', { title, message })
    }
  }

  if (selectedIds.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-500 p-4 min-w-[300px]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-700">
            تم اختيار {selectedIds.length} عضو
          </span>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {showMenu && (
          <div className="space-y-2">
            <button
              onClick={handleSendNotification}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-2 text-right hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              <span>إرسال إشعار جماعي</span>
            </button>

            <button
              onClick={() => handleStatusChange('active')}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-2 text-right hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>تفعيل الكل</span>
            </button>

            <button
              onClick={() => handleStatusChange('suspended')}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-2 text-right hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <UserX className="w-4 h-4" />
              <span>إيقاف الكل</span>
            </button>

            <button
              onClick={() => handleBulkAction('delete')}
              disabled={loading}
              className="w-full flex items-center gap-3 px-4 py-2 text-right hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف الكل</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 mt-3 text-blue-600">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">جاري التنفيذ...</span>
          </div>
        )}
      </div>
    </div>
  )
}
