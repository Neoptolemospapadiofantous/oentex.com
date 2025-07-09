// src/lib/validation/schemas.ts
import { z } from 'zod'

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')

export const authLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

export const authRegisterSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const forgotPasswordSchema = z.object({
  email: emailSchema
})

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export const ratingSchema = z.object({
  overall_rating: z.number().min(1, 'Overall rating is required').max(5),
  platform_usability: z.number().min(0).max(5).optional(),
  customer_support: z.number().min(0).max(5).optional(),
  fees_commissions: z.number().min(0).max(5).optional(),
  security_trust: z.number().min(0).max(5).optional(),
  educational_resources: z.number().min(0).max(5).optional(),
  mobile_app: z.number().min(0).max(5).optional()
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

export type AuthLoginData = z.infer<typeof authLoginSchema>
export type AuthRegisterData = z.infer<typeof authRegisterSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type RatingData = z.infer<typeof ratingSchema>
export type ContactData = z.infer<typeof contactSchema>