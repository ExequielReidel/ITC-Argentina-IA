'use client'

import { cn } from '@/lib/utils'

interface LogoITCProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LogoITC({ variant = 'dark', size = 'md', className }: LogoITCProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  }

  const textColor = variant === 'light' ? 'text-white' : 'text-slate-900'

  return (
    <div className={cn('flex flex-col items-start', className)}>
      <div className={cn('font-heading font-bold tracking-tight', sizeClasses[size], textColor)}>
        <span className="font-black">ITC</span>
        <span className="font-normal ml-1">Argentina</span>
      </div>
    </div>
  )
}
