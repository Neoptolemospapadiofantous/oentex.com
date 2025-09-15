// src/components/icons/Icon.tsx
import React from 'react'
import { Icons, IconProps } from './index'

export const Icon: React.FC<IconProps> = ({ 
  name, 
  className = '', 
  size = 'md',
  color = 'default' 
}) => {
  const IconComponent = Icons[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }
  
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }
  
  const colorClasses = {
    default: 'text-gray-600 dark:text-gray-400',
    primary: 'text-blue-600 dark:text-blue-400',
    secondary: 'text-emerald-600 dark:text-emerald-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-amber-600 dark:text-amber-400',
    danger: 'text-red-600 dark:text-red-400'
  }
  
  return (
    <IconComponent 
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  )
}

