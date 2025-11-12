'use client'

import { useState } from 'react'
import { Download, X, Loader } from 'lucide-react'

interface ExportDialogProps {
  onClose: () => void
  filters?: any
}

export default function ExportDialog({ onClose, filters }: ExportDialogProps) {
  const [format, setFormat] = useState<'xlsx' | 'csv' | 'json'>('xlsx')
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        format,
        ...(filters?.status !== 'all' && { status: filters.status }),
      })

      const response = await fetch(`/api/members/export?${params}`)
      
      if (format === 'json') {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `members-${Date.now()}.json`
        link.click()
      } else {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `members-${Date.now()}.${format}`
        link.click()
      }

      onClose()
    } catch (error) {
      console.error('Error exporting:', error)
      alert('حدث خطأ أثناء التصدير')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Download className="w-6 h-6" />
            تصدير البيانات
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              اختر صيغة التصدير
            </label>
            <div className="space-y-2">
              {[
                { value: 'xlsx', label: 'Excel (.xlsx)', desc: 'ملف Excel للتحليل والتعديل' },
                { value: 'csv', label: 'CSV (.csv)', desc: 'ملف CSV للاستيراد في برامج أخرى' },
                { value: 'json', label: 'JSON (.json)', desc: 'ملف JSON للمطورين' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    format === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={option.value}
                    checked={format === option.value}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="mt-1 ml-3"
                  />
                  <div>
                    <div className="font-semibold text-slate-800">{option.label}</div>
                    <div className="text-sm text-slate-600">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
            >
              إلغاء
            </button>
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  جاري التصدير...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  تصدير
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
