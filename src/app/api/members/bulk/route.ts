import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, memberIds, data } = body

    if (!action || !memberIds || !Array.isArray(memberIds)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'updateStatus':
        if (!data?.status) {
          return NextResponse.json(
            { error: 'Status is required' },
            { status: 400 }
          )
        }
        result = await prisma.member.updateMany({
          where: { id: { in: memberIds } },
          data: { status: data.status },
        })
        break

      case 'delete':
        // Soft delete
        result = await prisma.member.updateMany({
          where: { id: { in: memberIds } },
          data: { 
            deletedAt: new Date(),
            status: 'inactive',
          },
        })
        break

      case 'hardDelete':
        // Hard delete (admin only)
        result = await prisma.member.deleteMany({
          where: { id: { in: memberIds } },
        })
        break

      case 'sendNotification':
        // Create notifications for selected members
        const notifications = memberIds.map((memberId) => ({
          type: 'bulk_message',
          title: data?.title || 'إشعار جماعي',
          message: data?.message || '',
          recipientId: memberId,
        }))
        
        result = await prisma.notification.createMany({
          data: notifications,
        })
        break

      case 'renewSubscription':
        if (!data?.packageId) {
          return NextResponse.json(
            { error: 'Package ID is required' },
            { status: 400 }
          )
        }

        const pkg = await prisma.package.findUnique({
          where: { id: data.packageId },
        })

        if (!pkg) {
          return NextResponse.json(
            { error: 'Package not found' },
            { status: 404 }
          )
        }

        const subscriptions = []
        for (const memberId of memberIds) {
          const startDate = new Date()
          const endDate = new Date()
          endDate.setDate(endDate.getDate() + pkg.duration)

          subscriptions.push({
            memberId,
            packageId: pkg.id,
            startDate,
            endDate,
            amount: data.amount || pkg.price,
            discount: data.discount || 0,
            status: 'active',
          })
        }

        result = await prisma.subscription.createMany({
          data: subscriptions,
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ 
      success: true,
      result,
      count: result.count || memberIds.length,
    })
  } catch (error) {
    console.error('Error performing bulk operation:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    )
  }
}
