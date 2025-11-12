import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const member = await prisma.member.findUnique({
      where: { id: params.id },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Generate or retrieve QR code data
    let qrCodeData = member.qrCode
    
    if (!qrCodeData) {
      // Generate unique QR code data
      qrCodeData = `MEMBER:${member.memberNumber}:${member.id}`
      
      // Update member with QR code
      await prisma.member.update({
        where: { id: params.id },
        data: { qrCode: qrCodeData },
      })
    }

    // Generate QR code image
    const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    return NextResponse.json({ 
      qrCode: qrCodeData,
      qrCodeImage,
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

// Scan QR code and retrieve member info
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { qrCode } = body

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code is required' },
        { status: 400 }
      )
    }

    // Parse QR code data
    const parts = qrCode.split(':')
    if (parts.length < 3 || parts[0] !== 'MEMBER') {
      return NextResponse.json(
        { error: 'Invalid QR code' },
        { status: 400 }
      )
    }

    const memberId = parts[2]

    // Get member info
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { package: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error('Error scanning QR code:', error)
    return NextResponse.json(
      { error: 'Failed to scan QR code' },
      { status: 500 }
    )
  }
}
