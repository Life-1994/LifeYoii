import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    // Search filter
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { memberNumber: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ]
    }

    // Status filter
    if (status !== 'all') {
      where.status = status
    }

    // Get members with pagination
    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        include: {
          subscriptions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              attendance: true,
              payments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.member.count({ where }),
    ])

    return NextResponse.json({
      members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate unique member number
    const lastMember = await prisma.member.findFirst({
      orderBy: { memberNumber: 'desc' },
    })

    let memberNumber = 'M1001'
    if (lastMember) {
      const lastNumber = parseInt(lastMember.memberNumber.substring(1))
      memberNumber = `M${lastNumber + 1}`
    }

    // Create member
    const member = await prisma.member.create({
      data: {
        memberNumber,
        fullName: body.fullName,
        phone: body.phone,
        email: body.email || null,
        nationalId: body.nationalId || null,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        gender: body.gender,
        address: body.address || null,
        emergencyContact: body.emergencyContact || null,
        emergencyPhone: body.emergencyPhone || null,
        photo: body.photo || null,
        notes: body.notes || null,
        status: 'active',
      },
    })

    // Create subscription if package is selected
    if (body.packageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: body.packageId },
      })

      if (pkg) {
        const startDate = new Date()
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + pkg.duration)

        await prisma.subscription.create({
          data: {
            memberId: member.id,
            packageId: pkg.id,
            startDate,
            endDate,
            amount: pkg.price,
            status: 'active',
          },
        })

        // Create payment record
        await prisma.payment.create({
          data: {
            memberId: member.id,
            amount: pkg.price,
            paymentMethod: body.paymentMethod || 'cash',
            description: `اشتراك ${pkg.name}`,
            receiptNumber: `R${Date.now()}`,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      member,
    })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    )
  }
}
