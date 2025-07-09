// src/hooks/useFormValidation.ts (Fixed)
import { useState, useCallback } from 'react'
import { z } from 'zod'

export interface FormErrors {
  [key: string]: string | undefined
}

export const useFormValidation = <T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  initialValues: T
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouchedState] = useState<Record<string, boolean>>({})

  const validateField = useCallback((name: string, value: any) => {
    try {
      // Create a partial schema for single field validation
      const fieldSchema = schema.pick({ [name]: true } as any)
      fieldSchema.parse({ [name]: value })
      
      setErrors(prev => ({ ...prev, [name]: undefined }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(e => e.path.includes(name))
        setErrors(prev => ({ ...prev, [name]: fieldError?.message }))
        return false
      }
    }
    return false
  }, [schema])

  const validateAll = useCallback(() => {
    try {
      schema.parse(values)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {}
        error.errors.forEach(err => {
          const field = err.path.join('.')
          newErrors[field] = err.message
        })
        setErrors(newErrors)
        return false
      }
    }
    return false
  }, [schema, values])

  const setValue = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Validate field if it has been touched
    if (touched[name]) {
      validateField(name, value)
    }
  }, [touched, validateField])

  const setFieldTouched = useCallback((name: string) => {
    setTouchedState(prev => ({ ...prev, [name]: true }))
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValue(name, value)
  }, [setValue])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFieldTouched(name)
    validateField(name, value)
  }, [validateField, setFieldTouched])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouchedState({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched: setFieldTouched,
    handleChange,
    handleBlur,
    validateField,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  }
}