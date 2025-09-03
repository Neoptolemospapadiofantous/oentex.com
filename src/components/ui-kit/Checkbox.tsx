import React from 'react'
import { Checkbox as HCheckbox, type CheckboxProps as HCheckboxProps } from '@heroui/react'

export type UICheckboxProps = HCheckboxProps

export const Checkbox: React.FC<UICheckboxProps> = (props) => {
  return <HCheckbox {...props} />
}

export default Checkbox
