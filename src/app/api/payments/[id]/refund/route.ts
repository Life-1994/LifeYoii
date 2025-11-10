import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { PaymentStatus, PaymentMethod } from '@/lib/types'

// POST - Refund payment
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { reason } = body

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: { member: true },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    if (payment.status === PaymentStatus.REFUNDED) {
      return NextResponse.json(
        { error: 'Payment already refunded' },
        { status: 400 }
      )
    }

    // Process refund based on payment method
    if (payment.method === PaymentMethod.STRIPE && payment.transactionId) {
      try {
        // Refund via Stripe
        await stripe.refunds.create({
          payment_intent: payment.transactionId,
          reason: 'requested_by_customer',
        })
      } catch (stripeError) {
        console.error('Stripe refund error:', stripeError)
        return NextResponse.json(
          { error: 'Failed to process Stripe refund' },
          { status: 500 }
        )
      }
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: params.id },
      data: {
        status: PaymentStatus.REFUNDED,
        description: payment.description
          ? `${payment.description} - Refunded: ${reason || 'No reason provided'}`
          : `Refunded: ${reason || 'No reason provided'}`,
      },
    })

    // Create refund transaction
    await prisma.transaction.create({
      data: {
        type: 'REFUND',
        amount: payment.amount,
        memberId: payment.memberId,
        description: `Refund for payment ${payment.receiptNumber}`,
        reference: payment.receiptNumber || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
    })
  } catch (error) {
    console.error('Error processing refund:', error)
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}
