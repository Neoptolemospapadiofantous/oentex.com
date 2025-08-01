import toast from 'react-hot-toast'

// Email configuration for Oentex
export const EMAIL_CONFIG = {
  from: 'noreply@oentex.com',
  replyTo: 'contact@oentex.com',
  supportEmail: 'contact@oentex.com',
  domain: 'oentex.com'
}

// Email service interface
interface EmailData {
  to?: string
  subject: string
  html?: string
  text?: string
  templateId?: string
  templateData?: Record<string, any>
}

// Email service with actual Supabase integration
export class EmailService {
  private static instance: EmailService
  
  private constructor() {}
  
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      // For newsletter and deal alerts, we still use mock implementation
      // In production, integrate with your preferred email service for marketing emails
      console.log('Email Service: Sending email', {
        from: EMAIL_CONFIG.from,
        to: data.to || EMAIL_CONFIG.supportEmail,
        replyTo: EMAIL_CONFIG.replyTo,
        subject: data.subject,
        timestamp: new Date().toISOString()
      })

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      return true
    } catch (error) {
      console.error('Email Service Error:', error)
      throw new Error('Failed to send email')
    }
  }

  // ✅ UPDATED: Send contact form email via Supabase edge function
  async sendContactEmail(formData: {
    name: string
    email: string
    subject: string
    message: string
  }): Promise<boolean> {
    try {
      // Call your actual Supabase edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const result = await response.json()
      console.log('Contact email sent successfully:', result)
      return true
    } catch (error) {
      console.error('Contact form error:', error)
      throw new Error('Failed to send message. Please try again.')
    }
  }

  // ✅ KEPT: Send newsletter subscription confirmation
  async sendNewsletterWelcome(email: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; padding: 40px 0;">
          <h1 style="color: #1a365d; margin-bottom: 20px;">Welcome to Oentex!</h1>
          <p style="color: #4a5568; font-size: 18px; line-height: 1.6;">
            Thank you for subscribing to our newsletter.
          </p>
        </div>
        
        <div style="background-color: #f7fafc; padding: 30px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1a365d; margin-bottom: 20px;">What to Expect</h2>
          <ul style="color: #4a5568; line-height: 1.8;">
            <li>Weekly market analysis and insights</li>
            <li>Exclusive trading deals and bonuses</li>
            <li>Educational content and trading tips</li>
            <li>Early access to new features</li>
          </ul>
        </div>
        
        <div style="text-align: center; padding: 30px 0;">
          <a href="https://oentex.com/deals" style="display: inline-block; background-color: #38a169; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
            Explore Deals
          </a>
        </div>
        
        <p style="color: #718096; font-size: 14px; text-align: center;">
          You're receiving this email because you subscribed at oentex.com<br>
          <a href="https://oentex.com/unsubscribe" style="color: #1a365d;">Unsubscribe</a>
        </p>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Oentex Newsletter',
      html,
      text: 'Welcome to Oentex! Thank you for subscribing to our newsletter.'
    })
  }

  // ✅ KEPT: Send deal alert email (this was missing in the new version)
  async sendDealAlert(email: string, deal: {
    platform: string
    title: string
    description: string
    link: string
  }): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a365d; color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0;">New Deal Alert!</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #1a365d; margin-bottom: 10px;">${deal.platform}</h2>
          <h3 style="color: #38a169; margin-bottom: 20px;">${deal.title}</h3>
          <p style="color: #4a5568; line-height: 1.6; margin-bottom: 30px;">
            ${deal.description}
          </p>
          
          <div style="text-align: center;">
            <a href="${deal.link}" style="display: inline-block; background-color: #38a169; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">
              Claim This Deal
            </a>
          </div>
        </div>
        
        <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
          <p style="color: #718096; font-size: 14px; margin: 0;">
            Don't miss out on exclusive deals from Oentex<br>
            <a href="https://oentex.com" style="color: #1a365d;">Visit oentex.com</a>
          </p>
        </div>
      </div>
    `

    return this.sendEmail({
      to: email,
      subject: `Exclusive Deal: ${deal.title}`,
      html,
      text: `New deal from ${deal.platform}: ${deal.title}\n\n${deal.description}\n\nClaim this deal: ${deal.link}`
    })
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance()