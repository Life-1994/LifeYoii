"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"
import { PasswordStrength } from "@/components/auth/PasswordStrength"

/**
 * Schema للتحقق من بيانات إعادة التعيين
 */
const resetPasswordSchema = z.object({
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

/**
 * صفحة إعادة تعيين كلمة المرور
 */
export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const token = params?.token as string

  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch("password", "")

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "حدث خطأ أثناء إعادة تعيين كلمة المرور")
        return
      }

      setSuccess(true)
      
      // الانتقال إلى صفحة تسجيل الدخول بعد 2 ثانية
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError("حدث خطأ أثناء إعادة تعيين كلمة المرور")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <Alert variant="error">
          رابط غير صالح. الرجاء طلب رابط جديد.
        </Alert>
        <div className="mt-6 text-center">
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            طلب رابط جديد
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <Alert variant="success" title="تم تغيير كلمة المرور!">
          تم تغيير كلمة المرور بنجاح. جاري تحويلك إلى صفحة تسجيل الدخول...
        </Alert>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          إعادة تعيين كلمة المرور
        </h1>
        <p className="text-gray-600">
          أدخل كلمة المرور الجديدة الخاصة بك
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            label="كلمة المرور الجديدة"
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

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full"
        >
          {isLoading ? "جاري تغيير كلمة المرور..." : "تغيير كلمة المرور"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← العودة إلى تسجيل الدخول
        </Link>
      </div>
    </div>
  )
}
