import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prepareRevenueData } from '@/lib/chart-data'

export async function GET() {
  try {
    // Get all payments
    const payments = await prisma.payment.findMany({
      select: {
        paymentDate: true,
        amount: true,
      },
    })

    const chartData = prepareRevenueData(payments)

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching revenue data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
}
