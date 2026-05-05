'use client'

import { cn } from '@/lib/utils'

interface LogoITCProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const LOGO_URL = 'https://i.postimg.cc/W16HkQ1P/logo-1-1.png'

const sizeMap = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-36 h-36',
}

export function LogoITC({ variant = 'dark', size = 'md', className }: LogoITCProps) {
  return (
    <div className={cn('inline-flex items-center justify-center flex-shrink-0', sizeMap[size], className)}>
      <img
        src={LOGO_URL}
        alt="ITC Argentina"
        className={cn(
          'w-full h-full object-contain',
          variant === 'light' && 'brightness-0 invert'
        )}
      />
    </div>
  )
}
