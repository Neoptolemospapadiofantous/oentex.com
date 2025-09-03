import React from 'react'
import {
  Modal as HModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button as HButton
} from '@heroui/react'

export interface UIModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  hideCloseButton?: boolean
  showDefaultFooter?: boolean
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
}

export const Modal: React.FC<UIModalProps> = ({
  isOpen,
  onClose,
  title,
  footer,
  children,
  size = 'md',
  hideCloseButton,
  showDefaultFooter,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm
}) => {
  return (
    <HModal isOpen={isOpen} onClose={onClose} size={size} hideCloseButton={hideCloseButton}>
      <ModalContent>
        <>
          {title ? <ModalHeader>{title}</ModalHeader> : null}
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            {footer ? footer : showDefaultFooter ? (
              <>
                <HButton variant="light" onPress={onClose}>{cancelLabel}</HButton>
                <HButton color="primary" onPress={onConfirm}>{confirmLabel}</HButton>
              </>
            ) : null}
          </ModalFooter>
        </>
      </ModalContent>
    </HModal>
  )
}

export default Modal
