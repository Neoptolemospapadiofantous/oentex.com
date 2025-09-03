import React from 'react'
import {
  Accordion as HAccordion,
  AccordionItem as HAccordionItem,
  type AccordionProps as HAccordionProps
} from '@heroui/react'

export interface AccordionItem {
  key: string
  title: React.ReactNode
  content: React.ReactNode
}

export type UIAccordionProps = HAccordionProps & {
  items?: AccordionItem[]
  defaultOpenKeys?: string[]
}

export const Accordion: React.FC<UIAccordionProps> = ({ items, children, defaultOpenKeys, ...props }) => {
  if (children) {
    return <HAccordion {...props}>{children}</HAccordion>
  }

  return (
    <HAccordion defaultExpandedKeys={defaultOpenKeys as any} {...props}>
      {(items || []).map((item) => (
        <HAccordionItem key={item.key} aria-label={String(item.title)} title={item.title}>
          {item.content}
        </HAccordionItem>
      ))}
    </HAccordion>
  )
}

export default Accordion
