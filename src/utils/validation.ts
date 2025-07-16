// src/utils/validation.ts - FIXED: Now matches schema requirements
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// ✅ FIXED: Now matches the schema passwordSchema requirements
export const validatePassword = (password: string): boolean => {
  if (password.length < 8) {
    return false
  }
  
  // Must contain at least one uppercase letter, one lowercase letter, and one number
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  
  return hasUppercase && hasLowercase && hasNumber
}

// ✅ NEW: Helper function to get detailed password validation errors
export const getPasswordValidationErrors = (password: string): string[] => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return errors
}

// ✅ NEW: Helper function to get single error message (matches schema)
export const getPasswordValidationError = (password: string): string | null => {
  const errors = getPasswordValidationErrors(password)
  if (errors.length === 0) return null
  
  // Return the schema's error message format
  return 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}