import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prepareSubscriptionDistribution } from '@/lib/chart-data'

export async function GET() {
  try {
    // Get active subscriptions with package info
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'active',
      },
      include: {
        package: {
          select: {
            name: true,
          },
        },
      },
    })

    const chartData = prepareSubscriptionDistribution(subscriptions)

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching subscription data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    )
  }
}
