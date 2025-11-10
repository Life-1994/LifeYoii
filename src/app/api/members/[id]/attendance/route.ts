import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const attendance = await prisma.attendance.findMany({
      where: {
        memberId: params.id,
        checkIn: { gte: startDate },
      },
      orderBy: { checkIn: 'desc' },
    })

    // Group by date for chart
    const groupedByDate: Record<string, number> = {}
    attendance.forEach((record) => {
      const date = record.date
      groupedByDate[date] = (groupedByDate[date] || 0) + 1
    })

    return NextResponse.json({ 
      attendance,
      groupedByDate,
      total: attendance.length,
    })
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const today = new Date().toISOString().split('T')[0]

    // Check if already checked in today
    const existingCheckIn = await prisma.attendance.findFirst({
      where: {
        memberId: params.id,
        date: today,
        checkOut: null,
      },
    })

    if (existingCheckIn && body.type === 'checkIn') {
      return NextResponse.json(
        { error: 'Already checked in today' },
        { status: 400 }
      )
    }

    if (body.type === 'checkIn') {
      const attendance = await prisma.attendance.create({
        data: {
          memberId: params.id,
          date: today,
        },
      })
      return NextResponse.json({ attendance })
    } else if (body.type === 'checkOut' && existingCheckIn) {
      const attendance = await prisma.attendance.update({
        where: { id: existingCheckIn.id },
        data: { checkOut: new Date() },
      })
      return NextResponse.json({ attendance })
    }

    return NextResponse.json(
      { error: 'Invalid operation' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error recording attendance:', error)
    return NextResponse.json(
      { error: 'Failed to record attendance' },
      { status: 500 }
    )
  }
}
