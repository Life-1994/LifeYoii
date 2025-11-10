import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const status = searchParams.get('status') || 'all'

    // Build where clause
    const where: any = {}
    if (status !== 'all') {
      where.status = status
    }

    // Fetch members
    const members = await prisma.member.findMany({
      where,
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { package: true },
        },
        _count: {
          select: {
            attendance: true,
            payments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Prepare data for export
    const exportData = members.map((member) => ({
      'رقم العضوية': member.memberNumber,
      'الاسم الكامل': member.fullName,
      'الجوال': member.phone,
      'البريد': member.email || '',
      'الجنس': member.gender === 'male' ? 'ذكر' : 'أنثى',
      'تاريخ الانضمام': new Date(member.joinDate).toLocaleDateString('ar-SA'),
      'الحالة': member.status === 'active' ? 'نشط' : member.status === 'inactive' ? 'غير نشط' : 'موقوف',
      'الاشتراك الحالي': member.subscriptions[0]?.package.name || 'لا يوجد',
      'حالة الاشتراك': member.subscriptions[0]?.status === 'active' ? 'نشط' : 'منتهي',
      'عدد الحضور': member._count.attendance,
      'عدد المدفوعات': member._count.payments,
    }))

    if (format === 'xlsx' || format === 'csv') {
      // Create workbook
      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Members')

      // Generate buffer
      const buffer = XLSX.write(workbook, { 
        type: 'buffer', 
        bookType: format === 'xlsx' ? 'xlsx' : 'csv' 
      })

      // Return file
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': format === 'xlsx' 
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv',
          'Content-Disposition': `attachment; filename=members-${Date.now()}.${format}`,
        },
      })
    }

    // Return JSON by default
    return NextResponse.json({ 
      members: exportData,
      total: members.length,
    })
  } catch (error) {
    console.error('Error exporting members:', error)
    return NextResponse.json(
      { error: 'Failed to export members' },
      { status: 500 }
    )
  }
}
