'use client'

import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { exportDashboardToPDF, downloadPDF, DashboardStats } from '@/lib/pdf-export'
import { exportDashboardToExcel, downloadExcel } from '@/lib/excel-export'

interface ExportButtonsProps {
  stats: DashboardStats
  dateRange: { start: Date; end: Date }
}

export default function ExportButtons({ stats, dateRange }: ExportButtonsProps) {
  const handleExportPDF = () => {
    try {
      const doc = exportDashboardToPDF(stats, dateRange)
      downloadPDF(doc, `dashboard-report-${Date.now()}.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('حدث خطأ أثناء تصدير التقرير')
    }
  }

  const handleExportExcel = () => {
    try {
      const workbook = exportDashboardToExcel(stats, dateRange)
      downloadExcel(workbook, `dashboard-report-${Date.now()}.xlsx`)
    } catch (error) {
      console.error('Error exporting Excel:', error)
      alert('حدث خطأ أثناء تصدير التقرير')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleExportPDF}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <FileText className="w-5 h-5" />
        <span>تصدير PDF</span>
      </button>
      
      <button
        onClick={handleExportExcel}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <FileSpreadsheet className="w-5 h-5" />
        <span>تصدير Excel</span>
      </button>
      
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Download className="w-5 h-5" />
        <span>طباعة</span>
      </button>
    </div>
  )
}
