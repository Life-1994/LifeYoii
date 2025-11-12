import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashPassword, validatePasswordStrength } from "@/lib/auth-utils"
import { sendVerificationEmail } from "@/lib/email"
import { createVerificationToken } from "@/lib/tokens"

/**
 * Schema للتحقق من بيانات التسجيل
 */
const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
})

/**
 * POST /api/auth/register
 * تسجيل مستخدم جديد
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // التحقق من البيانات
    const validatedData = registerSchema.parse(body)
    const { name, email, password } = validatedData

    // التحقق من قوة كلمة المرور
    const passwordValidation = validatePasswordStrength(password)
    
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: "كلمة المرور ضعيفة", details: passwordValidation.errors },
        { status: 400 }
      )
    }

    // التحقق من عدم وجود المستخدم مسبقاً
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 }
      )
    }

    // تشفير كلمة المرور
    const hashedPassword = await hashPassword(password)

    // إنشاء المستخدم
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "MEMBER", // الدور الافتراضي
      },
    })

    // إنشاء توكن التحقق وإرسال بريد التحقق
    try {
      const verificationToken = await createVerificationToken(email)
      await sendVerificationEmail(email, verificationToken.token)
    } catch (emailError) {
      console.error("خطأ في إرسال بريد التحقق:", emailError)
      // لا نفشل التسجيل إذا فشل إرسال البريد
    }

    // إرجاع بيانات المستخدم (بدون كلمة المرور)
    return NextResponse.json(
      {
        message: "تم التسجيل بنجاح",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("خطأ في التسجيل:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "بيانات غير صالحة", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "حدث خطأ أثناء التسجيل" },
      { status: 500 }
    )
  }
}
