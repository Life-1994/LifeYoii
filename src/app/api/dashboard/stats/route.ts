import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    // Get all stats in parallel
    const [
      totalMembers,
      activeMembers,
      todayAttendance,
      expiringToday,
      monthlyPayments,
    ] = await Promise.all([
      // Total members
      prisma.member.count(),
      
      // Active members
      prisma.member.count({
        where: { status: 'active' },
      }),
      
      // Today's attendance
      prisma.attendance.count({
        where: {
          checkIn: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      
      // Subscriptions expiring today
      prisma.subscription.count({
        where: {
          status: 'active',
          endDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      
      // Monthly revenue
      prisma.payment.aggregate({
        where: {
          paymentDate: {
            gte: startOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ])

    // Count members without active subscriptions
    const membersWithoutSubscription = await prisma.member.count({
      where: {
        status: 'active',
        subscriptions: {
          none: {
            status: 'active',
          },
        },
      },
    })

    return NextResponse.json({
      totalMembers,
      activeMembers,
      todayAttendance,
      expiringToday,
      monthlyRevenue: monthlyPayments._sum.amount || 0,
      pendingPayments: membersWithoutSubscription,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
