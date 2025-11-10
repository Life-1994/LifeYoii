import Link from "next/link"
import { Button } from "@/components/ui/Button"

/**
 * صفحة 403 - غير مصرح بالوصول
 */
export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="text-6xl font-bold text-red-600 mb-2">403</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            غير مصرح بالوصول
          </h1>
          <p className="text-gray-600">
            عذراً، ليس لديك صلاحية الوصول إلى هذه الصفحة.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button variant="primary" className="w-full">
              العودة للصفحة الرئيسية
            </Button>
          </Link>
          
          <Link href="/login">
            <Button variant="outline" className="w-full">
              تسجيل الدخول بحساب آخر
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          إذا كنت تعتقد أن هذا خطأ، يرجى الاتصال بالمسؤول
        </div>
      </div>
    </div>
  )
}
