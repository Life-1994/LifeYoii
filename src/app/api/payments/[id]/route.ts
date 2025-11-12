import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get payment by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        member: true,
        invoice: true,
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment' },
      { status: 500 }
    )
  }
}

// PATCH - Update payment
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, description, receiptUrl } = body

    const payment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(description && { description }),
        ...(receiptUrl && { receiptUrl }),
      },
      include: {
        member: true,
        invoice: true,
      },
    })

    return NextResponse.json({
      success: true,
      payment,
    })
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    )
  }
}
