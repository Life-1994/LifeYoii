import NextAuth, { type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth-utils"
import { z } from "zod"

// توسيع نوع Session لإضافة الدور
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      twoFactorEnabled?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    twoFactorEnabled?: boolean
  }
}

// Schema للتحقق من بيانات تسجيل الدخول
const credentialsSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // تسجيل الدخول عبر Google
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    
    // تسجيل الدخول عبر Facebook
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    // تسجيل الدخول بالبريد وكلمة المرور
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials) {
        try {
          // التحقق من البيانات المدخلة
          const { email, password } = credentialsSchema.parse(credentials)

          // البحث عن المستخدم
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة")
          }

          // التحقق من كلمة المرور
          const isValid = await verifyPassword(password, user.password)

          if (!isValid) {
            throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة")
          }

          // إرجاع بيانات المستخدم
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            twoFactorEnabled: user.twoFactorEnabled,
          }
        } catch (error) {
          console.error("خطأ في المصادقة:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // السماح بتسجيل الدخول عبر OAuth بدون التحقق من البريد
      if (account?.provider !== "credentials") {
        return true
      }

      // يمكن إضافة فحص التحقق من البريد هنا إذا لزم الأمر
      // if (!user.emailVerified) {
      //   return false
      // }

      return true
    },

    async jwt({ token, user, trigger }) {
      // عند تسجيل الدخول، إضافة بيانات المستخدم للتوكن
      if (user) {
        token.id = user.id
        token.role = user.role
        token.twoFactorEnabled = user.twoFactorEnabled
      }

      // عند تحديث الجلسة
      if (trigger === "update") {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        })
        
        if (updatedUser) {
          token.role = updatedUser.role
          token.name = updatedUser.name
          token.email = updatedUser.email
          token.image = updatedUser.image
          token.twoFactorEnabled = updatedUser.twoFactorEnabled
        }
      }

      return token
    },

    async session({ session, token }) {
      // إضافة بيانات إضافية للجلسة
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean
      }

      return session
    },
  },
  events: {
    async linkAccount({ user }) {
      // تحديث تاريخ التحقق من البريد عند ربط حساب OAuth
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
})

/**
 * الحصول على الجلسة الحالية من جهة الخادم
 */
export async function getSession() {
  return await auth()
}

/**
 * الحصول على المستخدم الحالي
 */
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

/**
 * التحقق من تسجيل الدخول
 */
export async function requireAuth() {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error("غير مصرح")
  }
  
  return session.user
}

/**
 * التحقق من الصلاحيات
 */
export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error("غير مصرح - صلاحيات غير كافية")
  }
  
  return user
}
