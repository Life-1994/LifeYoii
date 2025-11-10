import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency, formatDateArabic } from './dashboard-utils'

export interface DashboardStats {
  totalMembers: number
  activeMembers: number
  todayAttendance: number
  activeSubscriptions: number
  expiredSubscriptions: number
  todayBookings: number
  activeTrainers: number
  monthlyRevenue: number
  monthlyExpenses: number
  netProfit: number
}

export function exportDashboardToPDF(stats: DashboardStats, dateRange: { start: Date; end: Date }) {
  const doc = new jsPDF()
  
  // Set font for Arabic support (using Arial Unicode MS as fallback)
  doc.setLanguage('ar')
  
  // Header
  doc.setFontSize(20)
  doc.text('Sport Zone - تقرير لوحة التحكم', doc.internal.pageSize.width / 2, 20, { align: 'center' })
  
  doc.setFontSize(12)
  doc.text(
    `الفترة: ${formatDateArabic(dateRange.start)} - ${formatDateArabic(dateRange.end)}`,
    doc.internal.pageSize.width / 2,
    30,
    { align: 'center' }
  )
  
  // Statistics Section
  doc.setFontSize(14)
  doc.text('الإحصائيات العامة', 20, 45)
  
  const statsData = [
    ['إجمالي الأعضاء', stats.totalMembers.toString()],
    ['الأعضاء النشطون', stats.activeMembers.toString()],
    ['حضور اليوم', stats.todayAttendance.toString()],
    ['الاشتراكات الفعالة', stats.activeSubscriptions.toString()],
    ['الاشتراكات المنتهية', stats.expiredSubscriptions.toString()],
    ['حجوزات اليوم', stats.todayBookings.toString()],
    ['المدربون النشطون', stats.activeTrainers.toString()],
  ]
  
  autoTable(doc, {
    startY: 50,
    head: [['البيان', 'القيمة']],
    body: statsData,
    styles: { font: 'helvetica', halign: 'right' },
    headStyles: { fillColor: [59, 130, 246] },
  })
  
  // Financial Section
  const finalY = (doc as any).lastAutoTable.finalY + 15
  doc.setFontSize(14)
  doc.text('الإحصائيات المالية', 20, finalY)
  
  const financialData = [
    ['إيرادات الشهر', formatCurrency(stats.monthlyRevenue)],
    ['مصروفات الشهر', formatCurrency(stats.monthlyExpenses)],
    ['صافي الربح', formatCurrency(stats.netProfit)],
  ]
  
  autoTable(doc, {
    startY: finalY + 5,
    head: [['البيان', 'المبلغ']],
    body: financialData,
    styles: { font: 'helvetica', halign: 'right' },
    headStyles: { fillColor: [16, 185, 129] },
  })
  
  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(
      `صفحة ${i} من ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
    doc.text(
      `تاريخ الطباعة: ${formatDateArabic(new Date(), 'dd/MM/yyyy HH:mm')}`,
      20,
      doc.internal.pageSize.height - 10
    )
  }
  
  return doc
}

export function downloadPDF(doc: jsPDF, filename: string = 'dashboard-report.pdf') {
  doc.save(filename)
}
