import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prepareTrainerPerformanceData } from '@/lib/chart-data'

export async function GET() {
  try {
    // Get bookings with trainer info
    const bookings = await prisma.booking.findMany({
      where: {
        status: 'completed',
      },
      include: {
        class: {
          include: {
            trainer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }).catch(() => []) // Return empty if Booking model doesn't exist

    const chartData = prepareTrainerPerformanceData(bookings)

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching trainer performance data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trainer performance data' },
      { status: 500 }
    )
  }
}
