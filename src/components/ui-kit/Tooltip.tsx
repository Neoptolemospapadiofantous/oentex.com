import React from 'react'
import { Tooltip as HTooltip, type TooltipProps as HTooltipProps } from '@heroui/react'

export type UITooltipProps = HTooltipProps

export const Tooltip: React.FC<UITooltipProps> = ({ children, ...props }) => {
  return <HTooltip {...props}>{children}</HTooltip>
}

export default Tooltip
