"use client"

import { validatePasswordStrength } from "@/lib/auth-utils"

interface PasswordStrengthProps {
  password: string
}

/**
 * مكون عرض قوة كلمة المرور
 */
export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null

  const { strength, errors } = validatePasswordStrength(password)

  const strengthColors = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  }

  const strengthTexts = {
    weak: "ضعيفة",
    medium: "متوسطة",
    strong: "قوية",
  }

  const strengthWidth = {
    weak: "w-1/3",
    medium: "w-2/3",
    strong: "w-full",
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${strengthColors[strength]} ${strengthWidth[strength]} transition-all duration-300`}
          />
        </div>
        <span className={`text-sm font-medium ${
          strength === "strong" ? "text-green-600" : 
          strength === "medium" ? "text-yellow-600" : 
          "text-red-600"
        }`}>
          {strengthTexts[strength]}
        </span>
      </div>

      {errors.length > 0 && (
        <ul className="text-xs text-gray-600 space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="flex items-start gap-1">
              <span className="text-red-500 mt-0.5">•</span>
              <span>{error}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
