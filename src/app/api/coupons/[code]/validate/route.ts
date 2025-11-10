import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DiscountType } from '@/lib/types'

// POST - Validate and calculate coupon discount
export async function POST(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const body = await request.json()
    const { amount } = body

    const coupon = await prisma.coupon.findUnique({
      where: { code: params.code.toUpperCase() },
    })

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found', valid: false },
        { status: 404 }
      )
    }

    // Check if active
    if (!coupon.isActive) {
      return NextResponse.json({
        error: 'Coupon is not active',
        valid: false,
      })
    }

    // Check validity dates
    const now = new Date()
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return NextResponse.json({
        error: 'Coupon is not valid at this time',
        valid: false,
      })
    }

    // Check max uses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({
        error: 'Coupon has reached maximum usage',
        valid: false,
      })
    }

    // Check minimum amount
    if (coupon.minAmount && amount < coupon.minAmount) {
      return NextResponse.json({
        error: `Minimum amount required: ${coupon.minAmount} SAR`,
        valid: false,
      })
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.type === DiscountType.PERCENTAGE) {
      discountAmount = (amount * coupon.value) / 100
    } else if (coupon.type === DiscountType.FIXED_AMOUNT) {
      discountAmount = coupon.value
    }

    // Ensure discount doesn't exceed amount
    discountAmount = Math.min(discountAmount, amount)

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
      discountAmount,
      finalAmount: amount - discountAmount,
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return NextResponse.json(
      { error: 'Failed to validate coupon', valid: false },
      { status: 500 }
    )
  }
}
