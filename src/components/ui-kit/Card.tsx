import React from 'react'
import { Card as HCard, CardHeader, CardBody, CardFooter, type CardProps as HCardProps } from '@heroui/react'

export type UICardProps = HCardProps & {
  header?: React.ReactNode
  footer?: React.ReactNode
}

export const Card: React.FC<UICardProps> = ({ header, footer, children, ...props }) => {
  return (
    <HCard {...props}>
      {header ? <CardHeader>{header}</CardHeader> : null}
      <CardBody>{children}</CardBody>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </HCard>
  )
}

export default Card
