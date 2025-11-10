import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prepareAttendanceData } from '@/lib/chart-data'

export async function GET() {
  try {
    // Get last 7 days attendance
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const attendance = await prisma.attendance.findMany({
      where: {
        checkIn: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        checkIn: true,
      },
    })

    const chartData = prepareAttendanceData(attendance)

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching attendance data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance data' },
      { status: 500 }
    )
  }
}
