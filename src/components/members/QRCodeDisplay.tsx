'use client'

import { useState, useEffect } from 'react'
import { Download, Loader } from 'lucide-react'

interface QRCodeDisplayProps {
  memberId: string
  memberName: string
  memberNumber: string
}

export default function QRCodeDisplay({ memberId, memberName, memberNumber }: QRCodeDisplayProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQRCode()
  }, [memberId])

  const fetchQRCode = async () => {
    try {
      const response = await fetch(`/api/members/${memberId}/qrcode`)
      const data = await response.json()
      setQrCodeImage(data.qrCodeImage)
    } catch (error) {
      console.error('Error fetching QR code:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeImage) return

    const link = document.createElement('a')
    link.href = qrCodeImage
    link.download = `qr-${memberNumber}.png`
    link.click()
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">QR Code</h3>
        {qrCodeImage && (
          <button
            onClick={downloadQRCode}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            تحميل
          </button>
        )}
      </div>

      <div className="flex flex-col items-center">
        {loading ? (
          <div className="w-64 h-64 flex items-center justify-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : qrCodeImage ? (
          <>
            <img 
              src={qrCodeImage} 
              alt="QR Code" 
              className="w-64 h-64 border-2 border-slate-200 rounded-lg"
            />
            <div className="mt-4 text-center">
              <p className="font-semibold text-slate-800">{memberName}</p>
              <p className="text-sm text-slate-600">رقم العضوية: {memberNumber}</p>
            </div>
          </>
        ) : (
          <div className="w-64 h-64 flex items-center justify-center text-slate-500">
            فشل تحميل QR Code
          </div>
        )}
      </div>
    </div>
  )
}
