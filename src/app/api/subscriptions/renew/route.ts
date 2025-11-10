import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subscriptionId, packageId, discount, paymentMethod } = body

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    // Get current subscription
    const currentSubscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { package: true, member: true },
    })

    if (!currentSubscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Get package (use new package or same one)
    const pkg = packageId 
      ? await prisma.package.findUnique({ where: { id: packageId } })
      : currentSubscription.package

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Mark old subscription as expired
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'expired' },
    })

    // Calculate dates
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + pkg.duration)

    // Calculate amount with discount
    const discountAmount = discount || 0
    const finalAmount = pkg.price - discountAmount

    // Create new subscription
    const newSubscription = await prisma.subscription.create({
      data: {
        memberId: currentSubscription.memberId,
        packageId: pkg.id,
        startDate,
        endDate,
        amount: finalAmount,
        discount: discountAmount,
        paymentStatus: 'paid',
        paymentMethod: paymentMethod || 'cash',
        status: 'active',
        notes: `تجديد من الاشتراك ${currentSubscription.id}`,
      },
      include: {
        member: true,
        package: true,
      },
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        memberId: currentSubscription.memberId,
        amount: finalAmount,
        paymentMethod: paymentMethod || 'cash',
        description: `تجديد اشتراك ${pkg.name}`,
        receiptNumber: `R${Date.now()}`,
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'renewal',
        title: 'تم تجديد الاشتراك',
        message: `تم تجديد اشتراكك في ${pkg.name} بنجاح`,
        recipientId: currentSubscription.memberId,
      },
    })

    return NextResponse.json({
      success: true,
      subscription: newSubscription,
    })
  } catch (error) {
    console.error('Error renewing subscription:', error)
    return NextResponse.json(
      { error: 'Failed to renew subscription' },
      { status: 500 }
    )
  }
}
