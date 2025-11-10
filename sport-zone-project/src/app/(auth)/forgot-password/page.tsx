"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"

/**
 * Schema للتحقق من البريد الإلكتروني
 */
const forgotPasswordSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

/**
 * صفحة نسيت كلمة المرور
 */
export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "حدث خطأ أثناء إرسال الطلب")
        return
      }

      setSuccess(true)
    } catch (err) {
      setError("حدث خطأ أثناء إرسال الطلب")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          نسيت كلمة المرور؟
        </h1>
        <p className="text-gray-600">
          أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
        </p>
      </div>

      {success ? (
        <div>
          <Alert variant="success" title="تم الإرسال بنجاح!">
            إذا كان البريد الإلكتروني موجوداً في نظامنا، ستتلقى رسالة تحتوي على رابط
            إعادة تعيين كلمة المرور. الرجاء التحقق من بريدك الإلكتروني.
          </Alert>
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="example@domain.com"
              error={errors.email?.message}
              {...register("email")}
              disabled={isLoading}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
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
        </>
      )}
    </div>
  )
}
