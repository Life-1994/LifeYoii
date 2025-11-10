import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DiscountType } from '@/lib/types'

// GET - List all coupons
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (isActive !== null) {
      where.isActive = isActive === 'true'
    }

    const coupons = await prisma.coupon.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ coupons })
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    )
  }
}

// POST - Create new coupon
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      code,
      type,
      value,
      minAmount,
      maxUses,
      validFrom,
      validUntil,
    } = body

    // Validate discount type
    if (!Object.values(DiscountType).includes(type)) {
      return NextResponse.json(
        { error: 'Invalid discount type' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code },
    })

    if (existingCoupon) {
      return NextResponse.json(
        { error: 'Coupon code already exists' },
        { status: 400 }
      )
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value,
        minAmount: minAmount || null,
        maxUses: maxUses || null,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      coupon,
    })
  } catch (error) {
    console.error('Error creating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    )
  }
}
