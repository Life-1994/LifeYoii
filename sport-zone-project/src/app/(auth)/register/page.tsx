import { Metadata } from "next"
import { RegisterForm } from "@/components/auth/RegisterForm"

export const metadata: Metadata = {
  title: "إنشاء حساب - Sport Zone",
  description: "أنشئ حسابك الجديد في Sport Zone",
}

/**
 * صفحة التسجيل
 */
export default function RegisterPage() {
  return <RegisterForm />
}
