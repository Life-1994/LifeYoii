'use client'

import { useState, useEffect } from 'react'
import { QrCode, X, CheckCircle2 } from 'lucide-react'

interface QRScannerProps {
  onScan: (memberId: string) => void
  onClose: () => void
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [error, setError] = useState('')

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!manualCode) {
      setError('الرجاء إدخال رمز QR')
      return
    }

    try {
      const response = await fetch('/api/members/[id]/qrcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: manualCode }),
      })

      const data = await response.json()

      if (response.ok && data.member) {
        onScan(data.member.id)
      } else {
        setError(data.error || 'رمز QR غير صحيح')
      }
    } catch (error) {
      setError('حدث خطأ أثناء المسح')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <QrCode className="w-6 h-6" />
            مسح QR Code
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manual Input */}
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              أدخل رمز QR يدوياً
            </label>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => {
                setManualCode(e.target.value)
                setError('')
              }}
              placeholder="MEMBER:M1001:xxxxx"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            تأكيد
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
          <p>امسح رمز QR الموجود على بطاقة العضو</p>
        </div>
      </div>
    </div>
  )
}
