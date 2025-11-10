import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subscriptionId, reason, days } = body

    if (!subscriptionId || !reason || !days) {
      return NextResponse.json(
        { error: 'Subscription ID, reason, and days are required' },
        { status: 400 }
      )
    }

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    if (subscription.status !== 'active') {
      return NextResponse.json(
        { error: 'Can only freeze active subscriptions' },
        { status: 400 }
      )
    }

    // Calculate freeze dates
    const freezeStartDate = new Date()
    const freezeEndDate = new Date()
    freezeEndDate.setDate(freezeEndDate.getDate() + days)

    // Extend end date by freeze duration
    const newEndDate = new Date(subscription.endDate)
    newEndDate.setDate(newEndDate.getDate() + days)

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'frozen',
        freezeReason: reason,
        freezeStartDate,
        freezeEndDate,
        endDate: newEndDate,
      },
      include: {
        member: true,
        package: true,
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'subscription_frozen',
        title: 'تم تجميد الاشتراك',
        message: `تم تجميد اشتراكك لمدة ${days} يوم. سبب التجميد: ${reason}`,
        recipientId: subscription.memberId,
      },
    })

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
    })
  } catch (error) {
    console.error('Error freezing subscription:', error)
    return NextResponse.json(
      { error: 'Failed to freeze subscription' },
      { status: 500 }
    )
  }
}

// Unfreeze subscription
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { subscriptionId } = body

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    // Get subscription
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    if (subscription.status !== 'frozen') {
      return NextResponse.json(
        { error: 'Subscription is not frozen' },
        { status: 400 }
      )
    }

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'active',
        freezeReason: null,
        freezeStartDate: null,
        freezeEndDate: null,
      },
      include: {
        member: true,
        package: true,
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'subscription_unfrozen',
        title: 'تم إلغاء تجميد الاشتراك',
        message: 'تم إلغاء تجميد اشتراكك وأصبح نشطاً مرة أخرى',
        recipientId: subscription.memberId,
      },
    })

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
    })
  } catch (error) {
    console.error('Error unfreezing subscription:', error)
    return NextResponse.json(
      { error: 'Failed to unfreeze subscription' },
      { status: 500 }
    )
  }
}
