import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

/**
 * المسارات العامة التي لا تحتاج مصادقة
 */
const publicPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
]

/**
 * مسارات API العامة
 */
const publicApiPaths = [
  "/api/auth",
]

/**
 * المسارات المحمية حسب الدور
 */
const protectedPaths = {
  ADMIN: ["/admin", "/settings"],
  MANAGER: ["/dashboard", "/members", "/packages"],
  TRAINER: ["/members", "/attendance"],
}

/**
 * Middleware للتحقق من المصادقة والصلاحيات
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // السماح بالوصول للملفات الثابتة
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/logo.png") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // السماح بالوصول لمسارات API العامة
  if (publicApiPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // السماح بالوصول للمسارات العامة
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // الحصول على الجلسة
  const session = await auth()

  // إذا كان المسار عام والمستخدم مسجل دخول، أعد توجيهه للصفحة الرئيسية
  if (isPublicPath && session?.user) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // إذا كان المسار محمي والمستخدم غير مسجل دخول، أعد توجيهه لصفحة تسجيل الدخول
  if (!isPublicPath && !session?.user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // التحقق من صلاحيات الوصول حسب الدور
  if (session?.user) {
    const userRole = session.user.role
    
    // التحقق من الوصول لمسارات الأدمن
    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/403", request.url))
    }

    // التحقق من الوصول لمسارات المدير
    if (pathname.startsWith("/dashboard")) {
      if (!["ADMIN", "MANAGER"].includes(userRole)) {
        return NextResponse.redirect(new URL("/403", request.url))
      }
    }
  }

  return NextResponse.next()
}

/**
 * تكوين المسارات التي يعمل عليها الـ middleware
 */
export const config = {
  matcher: [
    /*
     * مطابقة جميع المسارات ما عدا:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
