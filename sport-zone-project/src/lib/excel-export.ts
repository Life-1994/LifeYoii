import * as XLSX from 'xlsx'
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

export function exportDashboardToExcel(
  stats: DashboardStats,
  dateRange: { start: Date; end: Date },
  additionalData?: {
    recentMembers?: any[]
    expiringSubscriptions?: any[]
    recentBookings?: any[]
  }
) {
  const workbook = XLSX.utils.book_new()
  
  // Statistics Sheet
  const statsData = [
    ['تقرير لوحة التحكم - Sport Zone'],
    [`الفترة: ${formatDateArabic(dateRange.start)} - ${formatDateArabic(dateRange.end)}`],
    [],
    ['الإحصائيات العامة'],
    ['البيان', 'القيمة'],
    ['إجمالي الأعضاء', stats.totalMembers],
    ['الأعضاء النشطون', stats.activeMembers],
    ['حضور اليوم', stats.todayAttendance],
    ['الاشتراكات الفعالة', stats.activeSubscriptions],
    ['الاشتراكات المنتهية', stats.expiredSubscriptions],
    ['حجوزات اليوم', stats.todayBookings],
    ['المدربون النشطون', stats.activeTrainers],
    [],
    ['الإحصائيات المالية'],
    ['البيان', 'المبلغ'],
    ['إيرادات الشهر', stats.monthlyRevenue],
    ['مصروفات الشهر', stats.monthlyExpenses],
    ['صافي الربح', stats.netProfit],
  ]
  
  const statsSheet = XLSX.utils.aoa_to_sheet(statsData)
  XLSX.utils.book_append_sheet(workbook, statsSheet, 'الإحصائيات')
  
  // Recent Members Sheet
  if (additionalData?.recentMembers && additionalData.recentMembers.length > 0) {
    const membersData = [
      ['آخر الأعضاء المسجلين'],
      ['الاسم', 'رقم الهاتف', 'تاريخ التسجيل', 'الحالة'],
      ...additionalData.recentMembers.map(member => [
        member.fullName,
        member.phone,
        formatDateArabic(new Date(member.joinDate)),
        member.status === 'active' ? 'نشط' : 'غير نشط'
      ])
    ]
    const membersSheet = XLSX.utils.aoa_to_sheet(membersData)
    XLSX.utils.book_append_sheet(workbook, membersSheet, 'الأعضاء الجدد')
  }
  
  // Expiring Subscriptions Sheet
  if (additionalData?.expiringSubscriptions && additionalData.expiringSubscriptions.length > 0) {
    const subscriptionsData = [
      ['الاشتراكات المنتهية قريباً'],
      ['اسم العضو', 'الباقة', 'تاريخ الانتهاء', 'الحالة'],
      ...additionalData.expiringSubscriptions.map(sub => [
        sub.member.fullName,
        sub.package.name,
        formatDateArabic(new Date(sub.endDate)),
        sub.status === 'active' ? 'فعال' : 'منتهي'
      ])
    ]
    const subscriptionsSheet = XLSX.utils.aoa_to_sheet(subscriptionsData)
    XLSX.utils.book_append_sheet(workbook, subscriptionsSheet, 'الاشتراكات')
  }
  
  return workbook
}

export function downloadExcel(workbook: XLSX.WorkBook, filename: string = 'dashboard-report.xlsx') {
  XLSX.writeFile(workbook, filename)
}
