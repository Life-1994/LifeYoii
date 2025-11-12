import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

/**
 * Layout لصفحات المصادقة
 * يتحقق من عدم وجود جلسة نشطة
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // إذا كان المستخدم مسجل دخول بالفعل، أعد توجيهه للصفحة الرئيسية
  const session = await getSession()
  
  if (session?.user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
