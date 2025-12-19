'use client'

export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-[#6b8e6b]/20 border-t-[#6b8e6b] dark:border-[#7a9a7a]/20 dark:border-t-[#7a9a7a]`} />
  )
}

