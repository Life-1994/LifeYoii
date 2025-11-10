import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prepareHeatmapData } from '@/lib/chart-data'

export async function GET() {
  try {
    // Get last 30 days attendance for heatmap
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const attendance = await prisma.attendance.findMany({
      where: {
        checkIn: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        checkIn: true,
      },
    })

    const heatmapData = prepareHeatmapData(attendance)

    return NextResponse.json(heatmapData)
  } catch (error) {
    console.error('Error fetching heatmap data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch heatmap data' },
      { status: 500 }
    )
  }
}
