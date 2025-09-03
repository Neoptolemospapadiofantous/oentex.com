import React from 'react'
import { Input as HInput, type InputProps as HInputProps } from '@heroui/react'

export type UIInputProps = HInputProps & {
  error?: string
  hint?: string
}

export const Input: React.FC<UIInputProps> = ({ error, hint, ...props }) => {
  const validationState = error ? 'invalid' : undefined
  return (
    <HInput
      {...props}
      validationState={validationState}
      errorMessage={error}
      description={hint}
    />
  )
}

export default Input