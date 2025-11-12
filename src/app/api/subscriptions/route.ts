import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status !== 'all') {
      where.status = status
    }

    // Get subscriptions with pagination
    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          member: true,
          package: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.subscription.count({ where }),
    ])

    return NextResponse.json({
      subscriptions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.memberId || !body.packageId) {
      return NextResponse.json(
        { error: 'Member ID and Package ID are required' },
        { status: 400 }
      )
    }

    // Get package details
    const pkg = await prisma.package.findUnique({
      where: { id: body.packageId },
    })

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Calculate dates
    const startDate = body.startDate ? new Date(body.startDate) : new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + pkg.duration)

    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        memberId: body.memberId,
        packageId: body.packageId,
        startDate,
        endDate,
        amount: body.amount || pkg.price,
        discount: body.discount || 0,
        paymentStatus: body.paymentStatus || 'paid',
        paymentMethod: body.paymentMethod || 'cash',
        notes: body.notes || null,
        status: 'active',
      },
      include: {
        member: true,
        package: true,
      },
    })

    // Create payment record if paid
    if (body.paymentStatus === 'paid') {
      await prisma.payment.create({
        data: {
          memberId: body.memberId,
          amount: body.amount || pkg.price,
          paymentMethod: body.paymentMethod || 'cash',
          description: `اشتراك ${pkg.name}`,
          receiptNumber: `R${Date.now()}`,
        },
      })
    }

    return NextResponse.json({
      success: true,
      subscription,
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}
