import React from 'react'
import { Select as HSelect, SelectItem, type SelectProps as HSelectProps } from '@heroui/react'

export interface Option<V extends React.Key = React.Key> {
  value: V
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
}

export type UISelectProps<V extends React.Key = React.Key> = Omit<HSelectProps, 'onChange'> & {
  options?: Option<V>[]
  value?: V
  onValueChange?: (value: V | null) => void
}

export function Select<V extends React.Key = React.Key>({
  options,
  value,
  onValueChange,
  children,
  ...props
}: UISelectProps<V>) {
  return (
    <HSelect
      {...props}
      selectedKeys={value != null ? new Set([value]) : new Set()}
      onSelectionChange={(keys) => {
        const v = Array.from(keys)[0] as V | undefined
        onValueChange?.(v ?? null)
      }}
    >
      {children || (options || []).map((opt) => (
        <SelectItem key={opt.value} textValue={String(opt.label)} isDisabled={opt.disabled} description={opt.description}>
          {opt.label}
        </SelectItem>
      ))}
    </HSelect>
  )
}

export default Select
