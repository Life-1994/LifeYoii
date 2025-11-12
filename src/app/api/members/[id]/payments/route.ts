import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payments = await prisma.payment.findMany({
      where: { memberId: params.id },
      orderBy: { paymentDate: 'desc' },
    })

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)

    return NextResponse.json({ 
      payments,
      totalPaid,
      count: payments.length,
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
