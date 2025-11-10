import { generateMonthsArray, groupByDate, WEEK_DAYS_AR, generateHoursArray } from './dashboard-utils'

// Prepare member growth chart data
export function prepareMemberGrowthData(membersData: { joinDate: Date }[]) {
  const months = generateMonthsArray(12)
  
  return months.map(({ month, monthNum, year }) => {
    const count = membersData.filter(member => {
      const memberDate = new Date(member.joinDate)
      return memberDate.getMonth() + 1 === monthNum && memberDate.getFullYear() === year
    }).length
    
    return {
      month,
      members: count
    }
  })
}

// Prepare subscription distribution data
export function prepareSubscriptionDistribution(subscriptions: { package: { name: string } }[]) {
  const distribution: Record<string, number> = {}
  
  subscriptions.forEach(sub => {
    const packageName = sub.package.name
    distribution[packageName] = (distribution[packageName] || 0) + 1
  })
  
  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
    percentage: (value / subscriptions.length * 100).toFixed(1)
  }))
}

// Prepare revenue chart data
export function prepareRevenueData(paymentsData: { paymentDate: Date; amount: number }[]) {
  const months = generateMonthsArray(12)
  
  return months.map(({ month, monthNum, year }) => {
    const revenue = paymentsData
      .filter(payment => {
        const paymentDate = new Date(payment.paymentDate)
        return paymentDate.getMonth() + 1 === monthNum && paymentDate.getFullYear() === year
      })
      .reduce((sum, payment) => sum + payment.amount, 0)
    
    return {
      month,
      revenue
    }
  })
}

// Prepare attendance chart data (weekly)
export function prepareAttendanceData(attendanceData: { checkIn: Date }[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date
  })
  
  return last7Days.map(date => {
    const dayName = WEEK_DAYS_AR[date.getDay()]
    const dateStr = date.toISOString().split('T')[0]
    
    const count = attendanceData.filter(att => {
      const attDate = new Date(att.checkIn).toISOString().split('T')[0]
      return attDate === dateStr
    }).length
    
    return {
      day: dayName,
      attendance: count
    }
  })
}

// Prepare heatmap data
export function prepareHeatmapData(attendanceData: { checkIn: Date }[]) {
  const hours = generateHoursArray()
  const days = WEEK_DAYS_AR
  
  const heatmapData = days.map((day, dayIndex) => {
    const dayData: Record<string, any> = { day }
    
    hours.forEach((hour, hourIndex) => {
      const count = attendanceData.filter(att => {
        const attDate = new Date(att.checkIn)
        return attDate.getDay() === dayIndex && attDate.getHours() === hourIndex
      }).length
      
      dayData[hour] = count
    })
    
    return dayData
  })
  
  return { data: heatmapData, hours }
}

// Prepare trainer performance data
export function prepareTrainerPerformanceData(
  bookingsData: { class: { trainer: { name: string } } }[]
) {
  const trainerStats: Record<string, number> = {}
  
  bookingsData.forEach(booking => {
    const trainerName = booking.class.trainer.name
    trainerStats[trainerName] = (trainerStats[trainerName] || 0) + 1
  })
  
  return Object.entries(trainerStats)
    .map(([name, sessions]) => ({ name, sessions }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10)
}

// Prepare age distribution data
export function prepareAgeDistribution(members: { dateOfBirth: Date | null }[]) {
  const ageGroups = {
    '18-25': 0,
    '26-35': 0,
    '36-45': 0,
    '46-55': 0,
    '56+': 0
  }
  
  members.forEach(member => {
    if (member.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()
      if (age >= 18 && age <= 25) ageGroups['18-25']++
      else if (age >= 26 && age <= 35) ageGroups['26-35']++
      else if (age >= 36 && age <= 45) ageGroups['36-45']++
      else if (age >= 46 && age <= 55) ageGroups['46-55']++
      else if (age >= 56) ageGroups['56+']++
    }
  })
  
  return Object.entries(ageGroups).map(([range, count]) => ({
    range,
    count
  }))
}

// Prepare gender distribution data
export function prepareGenderDistribution(members: { gender: string }[]) {
  const genderCount = {
    male: 0,
    female: 0
  }
  
  members.forEach(member => {
    if (member.gender === 'male') genderCount.male++
    else if (member.gender === 'female') genderCount.female++
  })
  
  return [
    { name: 'ذكور', value: genderCount.male },
    { name: 'إناث', value: genderCount.female }
  ]
}
