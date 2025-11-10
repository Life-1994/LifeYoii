import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createPasswordResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/email"

/**
 * Schema للتحقق من البريد الإلكتروني
 */
const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
})

/**
 * POST /api/auth/forgot-password
 * طلب إعادة تعيين كلمة المرور
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // التحقق من البيانات
    const { email } = forgotPasswordSchema.parse(body)

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // لا نكشف ما إذا كان البريد موجود أم لا لأسباب أمنية
    // نرسل نفس الرسالة في كلتا الحالتين
    if (!user) {
      return NextResponse.json(
        { message: "إذا كان البريد الإلكتروني موجوداً، سيتم إرسال رابط إعادة التعيين" },
        { status: 200 }
      )
    }

    // إنشاء توكن إعادة التعيين
    const resetToken = await createPasswordResetToken(email)

    // إرسال البريد
    try {
      await sendPasswordResetEmail(email, resetToken.token)
    } catch (emailError) {
      console.error("خطأ في إرسال البريد:", emailError)
      return NextResponse.json(
        { error: "فشل إرسال البريد الإلكتروني" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "إذا كان البريد الإلكتروني موجوداً، سيتم إرسال رابط إعادة التعيين" },
      { status: 200 }
    )
  } catch (error) {
    console.error("خطأ في طلب إعادة التعيين:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "حدث خطأ أثناء المعالجة" },
      { status: 500 }
    )
  }
}
