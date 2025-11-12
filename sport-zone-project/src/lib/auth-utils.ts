import { hash, compare } from "bcryptjs"
import speakeasy from "speakeasy"

/**
 * تشفير كلمة المرور
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

/**
 * التحقق من كلمة المرور
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword)
}

/**
 * التحقق من قوة كلمة المرور
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  errors: string[]
  strength: "weak" | "medium" | "strong"
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push("يجب أن تكون كلمة المرور 8 أحرف على الأقل")
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("يجب أن تحتوي على حرف صغير واحد على الأقل")
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("يجب أن تحتوي على حرف كبير واحد على الأقل")
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("يجب أن تحتوي على رقم واحد على الأقل")
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("يجب أن تحتوي على رمز خاص واحد على الأقل")
  }

  // حساب قوة كلمة المرور
  let strength: "weak" | "medium" | "strong" = "weak"
  
  if (errors.length === 0) {
    strength = "strong"
  } else if (errors.length <= 2) {
    strength = "medium"
  }

  return {
    valid: errors.length === 0,
    errors,
    strength,
  }
}

/**
 * توليد سر 2FA
 */
export function generate2FASecret(email: string): {
  secret: string
  otpauthUrl: string
} {
  const secret = speakeasy.generateSecret({
    name: `Sport Zone (${email})`,
    issuer: "Sport Zone",
  })

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url || "",
  }
}

/**
 * التحقق من كود 2FA
 */
export function verify2FACode(secret: string, code: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: code,
    window: 2, // السماح بفارق زمني صغير
  })
}

/**
 * توليد كود 2FA مؤقت للبريد الإلكتروني
 */
export function generateEmailCode(): string {
  // توليد كود من 6 أرقام
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * التحقق من صلاحية البريد الإلكتروني
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * التحقق من الدور (Role)
 */
export function isValidRole(role: string): boolean {
  const validRoles = ["ADMIN", "MANAGER", "TRAINER", "MEMBER"]
  return validRoles.includes(role)
}

/**
 * التحقق من صلاحية المستخدم للوصول
 */
export function hasPermission(
  userRole: string,
  requiredRole: string | string[]
): boolean {
  const roleHierarchy: { [key: string]: number } = {
    MEMBER: 1,
    TRAINER: 2,
    MANAGER: 3,
    ADMIN: 4,
  }

  const userLevel = roleHierarchy[userRole] || 0
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(
      (role) => userLevel >= (roleHierarchy[role] || 999)
    )
  }
  
  const requiredLevel = roleHierarchy[requiredRole] || 999
  return userLevel >= requiredLevel
}

/**
 * تنظيف وتنسيق البيانات
 */
export function sanitizeUserData(user: any) {
  const { password, twoFactorSecret, ...safeUser } = user
  return safeUser
}

/**
 * إنشاء اسم مستخدم من البريد الإلكتروني
 */
export function generateUsernameFromEmail(email: string): string {
  return email.split("@")[0]
}
