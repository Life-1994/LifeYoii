import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { verify2FACode } from "@/lib/auth-utils"

/**
 * Schema للتحقق من كود 2FA
 */
const verify2FASchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  code: z.string().length(6, "الكود يجب أن يكون 6 أرقام"),
})

/**
 * POST /api/auth/verify-2fa
 * التحقق من كود 2FA
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // التحقق من البيانات
    const { email, code } = verify2FASchema.parse(body)

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "المستخدم غير موجود أو 2FA غير مفعل" },
        { status: 400 }
      )
    }

    // التحقق من الكود
    const isValid = verify2FACode(user.twoFactorSecret, code)

    if (!isValid) {
      return NextResponse.json(
        { error: "الكود غير صحيح" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        message: "تم التحقق بنجاح",
        verified: true,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("خطأ في التحقق من 2FA:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "حدث خطأ أثناء التحقق" },
      { status: 500 }
    )
  }
}
