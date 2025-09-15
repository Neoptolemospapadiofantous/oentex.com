import React from 'react'
import { Button as HButton, type ButtonProps as HButtonProps, Spinner } from '@heroui/react'

export type UIButtonProps = HButtonProps & {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button: React.FC<UIButtonProps> = ({
  loading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className,
  ...props
}) => {
  return (
    <HButton
      {...props}
      isDisabled={disabled || loading}
      startContent={loading ? <Spinner size="sm" color="white" /> : leftIcon}
      endContent={!loading ? rightIcon : undefined}
      className={`${className || ''} ${
        props.color === 'primary' || !props.color 
          ? 'shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105' 
          : ''
      }`}
      classNames={{
        base: "font-semibold",
        ...props.classNames
      }}
    >
      {children}
    </HButton>
  )
}

export default Button
