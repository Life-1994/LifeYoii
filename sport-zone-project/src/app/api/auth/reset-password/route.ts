import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashPassword, validatePasswordStrength } from "@/lib/auth-utils"
import { verifyPasswordResetToken, deletePasswordResetToken } from "@/lib/tokens"

/**
 * Schema للتحقق من بيانات إعادة التعيين
 */
const resetPasswordSchema = z.object({
  token: z.string().min(1, "التوكن مطلوب"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
})

/**
 * POST /api/auth/reset-password
 * إعادة تعيين كلمة المرور
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // التحقق من البيانات
    const { token, password } = resetPasswordSchema.parse(body)

    // التحقق من قوة كلمة المرور
    const passwordValidation = validatePasswordStrength(password)
    
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: "كلمة المرور ضعيفة", details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // التحقق من صلاحية التوكن
    const verification = await verifyPasswordResetToken(token)

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور الجديدة
    const hashedPassword = await hashPassword(password)

    // تحديث كلمة المرور
    await prisma.user.update({
      where: { email: verification.email },
      data: { password: hashedPassword },
    })

    // حذف التوكن المستخدم
    await deletePasswordResetToken(token)

    return NextResponse.json(
      { message: "تم تغيير كلمة المرور بنجاح" },
      { status: 200 }
    )
  } catch (error) {
    console.error("خطأ في إعادة تعيين كلمة المرور:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "حدث خطأ أثناء إعادة تعيين كلمة المرور" },
      { status: 500 }
    )
  }
}
