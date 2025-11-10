import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    trend: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
    trend: 'text-green-600'
  },
  purple: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
    trend: 'text-purple-600'
  },
  orange: {
    bg: 'bg-orange-100',
    icon: 'text-orange-600',
    trend: 'text-orange-600'
  },
  red: {
    bg: 'bg-red-100',
    icon: 'text-red-600',
    trend: 'text-red-600'
  },
  yellow: {
    bg: 'bg-yellow-100',
    icon: 'text-yellow-600',
    trend: 'text-yellow-600'
  }
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  subtitle,
  color = 'blue' 
}: StatsCardProps) {
  const colors = colorClasses[color]
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colors.bg} rounded-lg`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <span className="text-sm text-slate-600 font-medium">{title}</span>
      </div>
      
      <div className="space-y-2">
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        
        {trend && (
          <div className="flex items-center gap-1">
            {trend.isPositive ? (
              <TrendingUp className={`w-4 h-4 ${trend.value > 0 ? 'text-green-600' : 'text-slate-400'}`} />
            ) : (
              <TrendingDown className={`w-4 h-4 ${trend.value < 0 ? 'text-red-600' : 'text-slate-400'}`} />
            )}
            <span className={`text-sm font-medium ${
              trend.isPositive 
                ? trend.value > 0 ? 'text-green-600' : 'text-slate-400'
                : trend.value < 0 ? 'text-red-600' : 'text-slate-400'
            }`}>
              {Math.abs(trend.value).toFixed(1)}%
            </span>
          </div>
        )}
        
        {subtitle && (
          <p className="text-sm text-slate-600">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
