import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startParam = searchParams.get('start')
    const endParam = searchParams.get('end')
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59)
    
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59)

    // Date range for filtering
    const startDate = startParam ? new Date(startParam) : startOfMonth
    const endDate = endParam ? new Date(endParam) : endOfMonth

    // Get all stats in parallel
    const [
      totalMembers,
      activeMembers,
      todayAttendance,
      activeSubscriptions,
      expiredSubscriptions,
      todayBookings,
      activeTrainers,
      monthlyPayments,
      lastMonthPayments,
      monthlyExpenses,
      expiringIn7Days,
      lastMonthMembers,
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
      
      // Active subscriptions
      prisma.subscription.count({
        where: {
          status: 'active',
          endDate: {
            gte: today,
          },
        },
      }),
      
      // Expired subscriptions
      prisma.subscription.count({
        where: {
          OR: [
            { status: 'expired' },
            {
              status: 'active',
              endDate: {
                lt: today,
              },
            },
          ],
        },
      }),
      
      // Today's bookings
      prisma.booking.count({
        where: {
          date: {
            gte: today,
            lt: tomorrow,
          },
          status: 'confirmed',
        },
      }).catch(() => 0), // Return 0 if Booking model doesn't exist yet
      
      // Active trainers
      prisma.trainer.count({
        where: { status: 'active' },
      }).catch(() => 0), // Return 0 if Trainer model doesn't exist yet
      
      // Monthly revenue
      prisma.payment.aggregate({
        where: {
          paymentDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      
      // Last month revenue
      prisma.payment.aggregate({
        where: {
          paymentDate: {
            gte: lastMonth,
            lte: lastMonthEnd,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      
      // Monthly expenses
      prisma.expense.aggregate({
        where: {
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }).catch(() => ({ _sum: { amount: 0 } })), // Return 0 if Expense model doesn't exist yet
      
      // Subscriptions expiring in 7 days
      prisma.subscription.count({
        where: {
          status: 'active',
          endDate: {
            gte: today,
            lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      
      // Last month members
      prisma.member.count({
        where: {
          joinDate: {
            lt: startOfMonth,
          },
        },
      }),
    ])

    const monthlyRevenue = monthlyPayments._sum.amount || 0
    const lastMonthRevenue = lastMonthPayments._sum.amount || 0
    const monthlyExpensesAmount = monthlyExpenses._sum.amount || 0
    const netProfit = monthlyRevenue - monthlyExpensesAmount
    
    // Calculate percentage changes
    const revenueChange = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0
    
    const memberGrowthChange = lastMonthMembers > 0
      ? ((totalMembers - lastMonthMembers) / lastMonthMembers) * 100
      : 0

    return NextResponse.json({
      totalMembers,
      activeMembers,
      todayAttendance,
      activeSubscriptions,
      expiredSubscriptions,
      todayBookings,
      activeTrainers,
      monthlyRevenue,
      monthlyExpenses: monthlyExpensesAmount,
      netProfit,
      expiringIn7Days,
      revenueChange,
      memberGrowthChange,
      lastMonthRevenue,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
