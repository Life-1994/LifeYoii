import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface InvoiceData {
  invoiceNumber: string
  memberName: string
  memberEmail?: string
  memberPhone: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  discount: number
  tax: number
  total: number
  dueDate: Date
  createdAt: Date
  notes?: string
}

export async function generateInvoicePDF(invoice: InvoiceData): Promise<Buffer> {
  const doc = new jsPDF()

  // Add header
  doc.setFontSize(20)
  doc.text('فاتورة', 105, 20, { align: 'center' })
  doc.setFontSize(12)
  doc.text('INVOICE', 105, 28, { align: 'center' })

  // Invoice details
  doc.setFontSize(10)
  doc.text(`رقم الفاتورة / Invoice #: ${invoice.invoiceNumber}`, 20, 45)
  doc.text(`التاريخ / Date: ${invoice.createdAt.toLocaleDateString('ar-SA')}`, 20, 52)
  doc.text(`تاريخ الاستحقاق / Due Date: ${invoice.dueDate.toLocaleDateString('ar-SA')}`, 20, 59)

  // Member details
  doc.text('بيانات العميل / Customer Information:', 20, 70)
  doc.text(`الاسم / Name: ${invoice.memberName}`, 20, 77)
  doc.text(`الهاتف / Phone: ${invoice.memberPhone}`, 20, 84)
  if (invoice.memberEmail) {
    doc.text(`البريد / Email: ${invoice.memberEmail}`, 20, 91)
  }

  // Items table
  const tableData = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    item.unitPrice.toFixed(2),
    item.total.toFixed(2),
  ])

  autoTable(doc, {
    head: [['البند / Item', 'الكمية / Qty', 'السعر / Price', 'المجموع / Total']],
    body: tableData,
    startY: invoice.memberEmail ? 98 : 91,
    styles: { font: 'helvetica', fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] },
  })

  // Get final Y position after table
  const finalY = (doc as any).lastAutoTable.finalY + 10

  // Summary
  doc.text(`المجموع الفرعي / Subtotal: ${invoice.subtotal.toFixed(2)} SAR`, 120, finalY)
  doc.text(`الخصم / Discount: ${invoice.discount.toFixed(2)} SAR`, 120, finalY + 7)
  doc.text(`الضريبة / Tax: ${invoice.tax.toFixed(2)} SAR`, 120, finalY + 14)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`المجموع الإجمالي / Total: ${invoice.total.toFixed(2)} SAR`, 120, finalY + 24)

  // Notes
  if (invoice.notes) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('ملاحظات / Notes:', 20, finalY + 35)
    doc.text(invoice.notes, 20, finalY + 42)
  }

  // Footer
  doc.setFontSize(8)
  doc.text('شكراً لتعاملكم معنا / Thank you for your business', 105, 280, { align: 'center' })

  // Return PDF as buffer
  return Buffer.from(doc.output('arraybuffer'))
}
