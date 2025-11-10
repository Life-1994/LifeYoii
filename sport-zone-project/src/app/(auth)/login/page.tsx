import { Metadata } from "next"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = {
  title: "تسجيل الدخول - Sport Zone",
  description: "سجل دخولك إلى حسابك في Sport Zone",
}

/**
 * صفحة تسجيل الدخول
 */
export default function LoginPage() {
  return <LoginForm />
}
