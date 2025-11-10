"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"
import { SocialButtons } from "./SocialButtons"

/**
 * Schema للتحقق من بيانات تسجيل الدخول
 */
const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
})

type LoginFormData = z.infer<typeof loginSchema>

/**
 * نموذج تسجيل الدخول
 */
export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة")
        return
      }

      if (result?.ok) {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تسجيل الدخول
          </h1>
          <p className="text-gray-600">
            مرحباً بك في Sport Zone
          </p>
        </div>

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

          <Input
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
            disabled={isLoading}
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="ml-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              تذكرني
            </label>
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full"
          >
            {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <div className="mt-6">
          <SocialButtons disabled={isLoading} />
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">ليس لديك حساب؟</span>{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            سجل الآن
          </Link>
        </div>
      </div>
    </div>
  )
}
