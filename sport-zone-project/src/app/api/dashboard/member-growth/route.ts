import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prepareMemberGrowthData } from '@/lib/chart-data'

export async function GET() {
  try {
    // Get all members with joinDate
    const members = await prisma.member.findMany({
      select: {
        joinDate: true,
      },
    })

    const chartData = prepareMemberGrowthData(members)

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Error fetching member growth data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch member growth data' },
      { status: 500 }
    )
  }
}
