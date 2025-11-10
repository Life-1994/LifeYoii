"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"
import { PasswordStrength } from "./PasswordStrength"
import { SocialButtons } from "./SocialButtons"

/**
 * Schema للتحقق من بيانات التسجيل
 */
const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

/**
 * نموذج التسجيل
 */
export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch("password", "")

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "حدث خطأ أثناء التسجيل")
        return
      }

      setSuccess(true)
      
      // الانتقال إلى صفحة تسجيل الدخول بعد 2 ثانية
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError("حدث خطأ أثناء التسجيل")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Alert variant="success" title="تم التسجيل بنجاح!">
            تم إنشاء حسابك بنجاح. جاري تحويلك إلى صفحة تسجيل الدخول...
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إنشاء حساب جديد
          </h1>
          <p className="text-gray-600">
            انضم إلى Sport Zone اليوم
          </p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="الاسم الكامل"
            type="text"
            placeholder="أدخل اسمك الكامل"
            error={errors.name?.message}
            {...register("name")}
            disabled={isLoading}
            required
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@domain.com"
            error={errors.email?.message}
            {...register("email")}
            disabled={isLoading}
            required
          />

          <div>
            <Input
              label="كلمة المرور"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
              disabled={isLoading}
              required
            />
            <PasswordStrength password={password} />
          </div>

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
            disabled={isLoading}
            required
          />

          <div className="flex items-start">
            <input
              type="checkbox"
              required
              className="mt-1 ml-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm text-gray-600">
              أوافق على{" "}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                الشروط والأحكام
              </Link>{" "}
              و{" "}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                سياسة الخصوصية
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </Button>
        </form>

        <div className="mt-6">
          <SocialButtons disabled={isLoading} />
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">لديك حساب بالفعل؟</span>{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            سجل الدخول
          </Link>
        </div>
      </div>
    </div>
  )
}
