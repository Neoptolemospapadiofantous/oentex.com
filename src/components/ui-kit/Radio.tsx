import React from 'react'
import { Radio, RadioGroup, type RadioGroupProps } from '@heroui/react'

export interface UIRadioOption {
  value: string
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}

export type UIRadioGroupProps = RadioGroupProps & {
  options?: UIRadioOption[]
}

export const RadioGroupField: React.FC<UIRadioGroupProps> = ({ options, children, ...props }) => {
  return (
    <RadioGroup {...props}>
      {children || (options || []).map((opt) => (
        <Radio key={opt.value} value={opt.value} description={opt.description} isDisabled={opt.disabled}>
          {opt.label}
        </Radio>
      ))}
    </RadioGroup>
  )
}

export default RadioGroupField
