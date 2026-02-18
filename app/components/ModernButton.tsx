'use client'

import { ReactNode } from 'react'

interface ModernButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  href?: string
}

export default function ModernButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  href,
}: ModernButtonProps) {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group'
  
  const variantClasses = {
    primary: 'bg-[#6b8e6b] text-white hover:bg-[#5a7a5a] dark:bg-[#7a9a7a] dark:hover:bg-[#6b8e6b] focus:ring-[#6b8e6b] shadow-lg hover:shadow-xl',
    secondary: 'border-2 border-[#6b8e6b] text-[#6b8e6b] dark:text-[#7a9a7a] hover:bg-[#6b8e6b]/10 dark:hover:bg-[#7a9a7a]/10 focus:ring-[#6b8e6b]',
    ghost: 'text-[#4a5568] dark:text-[#9ca3af] hover:bg-[#f7fafc] dark:hover:bg-[#252525] focus:ring-[#6b8e6b]',
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        <span className="relative z-10">{children}</span>
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#5a7a5a] to-[#6b8e6b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </a>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#5a7a5a] to-[#6b8e6b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  )
}




