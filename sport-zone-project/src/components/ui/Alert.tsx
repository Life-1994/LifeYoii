import React from "react"

interface AlertProps {
  variant?: "success" | "error" | "warning" | "info"
  title?: string
  children: React.ReactNode
  onClose?: () => void
  className?: string
}

/**
 * مكون التنبيه
 */
export function Alert({ 
  variant = "info", 
  title, 
  children, 
  onClose,
  className = ""
}: AlertProps) {
  const variants = {
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: "✓",
      iconBg: "bg-green-100",
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: "✕",
      iconBg: "bg-red-100",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: "!",
      iconBg: "bg-yellow-100",
    },
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: "ℹ",
      iconBg: "bg-blue-100",
    },
  }

  const style = variants[variant]

  return (
    <div className={`border rounded-lg p-4 ${style.container} ${className}`} role="alert">
      <div className="flex items-start">
        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${style.iconBg} font-bold`}>
          {style.icon}
        </div>
        <div className="mr-3 flex-1">
          {title && <h3 className="font-medium mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 mr-2 text-lg font-bold opacity-50 hover:opacity-100 transition-opacity"
            aria-label="إغلاق"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
