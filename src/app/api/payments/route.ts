import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PaymentMethod, PaymentStatus } from '@/lib/types'

// GET - List all payments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const status = searchParams.get('status')
    const method = searchParams.get('method')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (memberId) where.memberId = memberId
    if (status) where.status = status
    if (method) where.method = method

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          member: {
            select: {
              id: true,
              memberNumber: true,
              fullName: true,
              phone: true,
            },
          },
          invoice: {
            select: {
              id: true,
              invoiceNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ])

    return NextResponse.json({
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// POST - Create new payment
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      memberId,
      invoiceId,
      amount,
      currency = 'SAR',
      method,
      description,
    } = body

    // Validate payment method
    if (!Object.values(PaymentMethod).includes(method)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
    }

    // Generate receipt number
    const receiptNumber = `RCP${Date.now()}`

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        memberId,
        invoiceId: invoiceId || null,
        amount,
        currency,
        method,
        status: PaymentStatus.COMPLETED,
        description,
        receiptNumber,
      },
      include: {
        member: true,
        invoice: true,
      },
    })

    // Update invoice status if payment is linked to invoice
    if (invoiceId) {
      const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { payments: true },
      })

      if (invoice) {
        const totalPaid = invoice.payments.reduce((sum, p) => 
          p.status === PaymentStatus.COMPLETED ? sum + p.amount : sum, 0
        )

        if (totalPaid >= invoice.total) {
          await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
              status: 'PAID',
              paidDate: new Date(),
            },
          })
        }
      }
    }

    // Create transaction record
    await prisma.transaction.create({
      data: {
        type: 'INCOME',
        amount,
        memberId,
        description: description || `Payment - ${receiptNumber}`,
        reference: receiptNumber,
      },
    })

    return NextResponse.json({
      success: true,
      payment,
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
