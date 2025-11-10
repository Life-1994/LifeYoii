import { randomBytes } from "crypto"
import { prisma } from "./prisma"

/**
 * توليد توكن عشوائي آمن
 */
export function generateToken(): string {
  return randomBytes(32).toString("hex")
}

/**
 * إنشاء توكن إعادة تعيين كلمة المرور
 */
export async function createPasswordResetToken(email: string) {
  const token = generateToken()
  const expires = new Date(Date.now() + 3600000) // ساعة واحدة

  // حذف أي توكنات قديمة لنفس البريد
  await prisma.passwordResetToken.deleteMany({
    where: { email }
  })

  // إنشاء توكن جديد
  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  })

  return passwordResetToken
}

/**
 * التحقق من صلاحية توكن إعادة تعيين كلمة المرور
 */
export async function verifyPasswordResetToken(token: string) {
  const passwordResetToken = await prisma.passwordResetToken.findUnique({
    where: { token }
  })

  if (!passwordResetToken) {
    return { valid: false, error: "التوكن غير صالح" }
  }

  const isExpired = new Date() > passwordResetToken.expires

  if (isExpired) {
    // حذف التوكن المنتهي
    await prisma.passwordResetToken.delete({
      where: { token }
    })
    return { valid: false, error: "انتهت صلاحية الرابط" }
  }

  return { valid: true, email: passwordResetToken.email }
}

/**
 * حذف توكن إعادة التعيين بعد الاستخدام
 */
export async function deletePasswordResetToken(token: string) {
  await prisma.passwordResetToken.delete({
    where: { token }
  }).catch(() => {
    // تجاهل الخطأ إذا كان التوكن محذوف مسبقاً
  })
}

/**
 * إنشاء توكن التحقق من البريد الإلكتروني
 */
export async function createVerificationToken(identifier: string) {
  const token = generateToken()
  const expires = new Date(Date.now() + 86400000) // 24 ساعة

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  })

  return verificationToken
}

/**
 * التحقق من توكن البريد الإلكتروني
 */
export async function verifyEmailToken(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token }
  })

  if (!verificationToken) {
    return { valid: false, error: "التوكن غير صالح" }
  }

  const isExpired = new Date() > verificationToken.expires

  if (isExpired) {
    await prisma.verificationToken.delete({
      where: { token }
    })
    return { valid: false, error: "انتهت صلاحية الرابط" }
  }

  return { valid: true, identifier: verificationToken.identifier }
}
