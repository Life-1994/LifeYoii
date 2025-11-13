import { format, subMonths, startOfMonth, endOfMonth, subDays, startOfDay, endOfDay } from 'date-fns'
import { ar } from 'date-fns/locale'

// Calculate percentage change between two values
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Format currency in SAR
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ريال`
}

// Get date range based on period
export function getDateRange(period: 'today' | 'week' | 'month' | 'year' | 'custom', customStart?: Date, customEnd?: Date) {
  const now = new Date()
  
  switch (period) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now)
      }
    case 'week':
      return {
        start: startOfDay(subDays(now, 7)),
        end: endOfDay(now)
      }
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      }
    case 'year':
      return {
        start: startOfMonth(subMonths(now, 11)),
        end: endOfMonth(now)
      }
    case 'custom':
      return {
        start: customStart || startOfMonth(now),
        end: customEnd || endOfDay(now)
      }
    default:
      return {
        start: startOfMonth(now),
        end: endOfMonth(now)
      }
  }
}

// Format date in Arabic
export function formatDateArabic(date: Date, formatStr: string = 'dd/MM/yyyy'): string {
  return format(date, formatStr, { locale: ar })
}

// Generate months array for charts
export function generateMonthsArray(count: number = 12): { month: string; monthNum: number; year: number }[] {
  const months = []
  const now = new Date()
  
  for (let i = count - 1; i >= 0; i--) {
    const date = subMonths(now, i)
    months.push({
      month: format(date, 'MMM yyyy', { locale: ar }),
      monthNum: date.getMonth() + 1,
      year: date.getFullYear()
    })
  }
  
  return months
}

// Calculate growth rate
export function calculateGrowthRate(data: number[]): number {
  if (data.length < 2) return 0
  const firstValue = data[0]
  const lastValue = data[data.length - 1]
  return calculatePercentageChange(lastValue, firstValue)
}

// Group data by date
export function groupByDate<T>(items: T[], dateField: keyof T): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const date = format(new Date(item[dateField] as any), 'yyyy-MM-dd')
    if (!acc[date]) acc[date] = []
    acc[date].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

// Calculate average
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

// Get week days in Arabic
export const WEEK_DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

// Get hours for heatmap
export function generateHoursArray(): string[] {
  return Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)
}
