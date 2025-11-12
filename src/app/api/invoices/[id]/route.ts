import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get invoice by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        member: true,
        items: true,
        payments: true,
      },
    })

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    )
  }
}

// PATCH - Update invoice
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, notes, discount, tax } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (discount !== undefined) {
      updateData.discount = discount
      // Recalculate total
      const invoice = await prisma.invoice.findUnique({
        where: { id: params.id },
      })
      if (invoice) {
        updateData.total = invoice.subtotal - discount + (tax ?? invoice.tax)
      }
    }
    if (tax !== undefined) {
      updateData.tax = tax
      // Recalculate total
      const invoice = await prisma.invoice.findUnique({
        where: { id: params.id },
      })
      if (invoice) {
        updateData.total = invoice.subtotal - (discount ?? invoice.discount) + tax
      }
    }

    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: updateData,
      include: {
        member: true,
        items: true,
        payments: true,
      },
    })

    return NextResponse.json({
      success: true,
      invoice,
    })
  } catch (error) {
    console.error('Error updating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    )
  }
}

// DELETE - Delete invoice
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.invoice.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Invoice deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting invoice:', error)
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    )
  }
}
