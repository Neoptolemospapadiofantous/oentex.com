import React, { useState } from 'react'
import { Icons } from '@components/icons'
import { emailService } from '../../lib/email'
import { showErrorToast, showSuccessToast } from '../../components/ui/AppToast'
import { Button, Input } from '@components/ui-kit'
import SEO from '@components/SEO'
import { seoData } from '@lib/seoData'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showErrorToast('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      await emailService.sendContactEmail(formData)
      setIsSubmitted(true)
      showSuccessToast('Message sent successfully!')
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
        setIsSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error('Contact form error:', error)
      showErrorToast('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChatBotClick = () => {
    // This could scroll to chatbot or highlight it
    showSuccessToast('Look for the chat icon on the bottom-right corner!')
  }

  const contactInfo = [
    {
      icon: Icons.mail,
      title: 'Email Support',
      content: 'support@oentex.com',
      description: 'Get help with your account and investments',
      link: 'mailto:support@oentex.com',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Icons.mapPin,
      title: 'Headquarters',
      content: 'San Francisco, CA',
      description: 'Visit our main office',
      link: '#',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Icons.phone,
      title: 'Phone Support',
      content: '+1 (555) 123-4567',
      description: 'Speak with our investment specialists',
      link: 'tel:+15551234567',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Icons.time,
      title: 'Business Hours',
      content: '9 AM - 6 PM PST',
      description: 'Monday through Friday',
      link: '#',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const features = [
    {
      icon: Icons.shield,
      title: 'Secure Communication',
      description: 'All messages are encrypted and secure'
    },
    {
      icon: Icons.time,
      title: 'Quick Response',
      description: 'We respond within 24 hours'
    },
    {
      icon: Icons.users,
      title: 'Expert Support',
      description: 'Get help from investment professionals'
    }
  ]

  return (
    <>
      <SEO 
        title="Contact Oentex - Get Crypto Investment Platform Support & Expert Advice"
        description="Contact Oentex for expert advice on cryptocurrency exchanges, crypto investment platforms, and trading strategies. Get support with platform recommendations, affiliate deals, and crypto investment guidance from our experienced team."
        keywords="crypto investment support, cryptocurrency platform help, crypto exchange customer service, crypto investment advice, cryptocurrency trading support, crypto platform recommendations, crypto affiliate support, cryptocurrency investment guidance"
        url="https://oentex.com/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact Oentex",
          "url": "https://oentex.com/contact",
          "description": "Get support and expert advice on cryptocurrency investments and platform recommendations",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@oentex.com",
            "availableLanguage": "English"
          }
        }}
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section-py-3xl relative">
          {/* Component-specific accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/4 to-primary/8 accent-transition" />
          
          <div className="container-page relative z-10 flex flex-col items-center justify-center">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground my-lg text-center">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Get in Touch
                </span>
              </h1>
              <p className="text-xl text-foreground/70 max-w-3xl mx-auto text-center">
                Have questions about our platform or need assistance? We're here to help you navigate your investment journey with expert guidance and support.
              </p>
            </div>
          </div>
        </section>

        <div className="container-page section-py-2xl text-center">
          {/* Features Section */}
          <div className="my-2xl text-center">
            <div className="flex flex-col items-center my-3xl">
              <h2 className="text-3xl font-bold text-foreground my-md">Why Choose Our Support?</h2>
              <p className="text-foreground/70 max-w-2xl text-center">
                Experience world-class customer service with our dedicated support team
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-xl max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="text-center bg-content1/50 rounded-2xl p-lg border border-divider hover:bg-content1/70 transition-all duration-300 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center my-md mx-auto">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground my-sm text-center">{feature.title}</h3>
                  <p className="text-foreground/70 my-md text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="my-2xl">
            <div className="flex flex-col items-center my-3xl">
              <h2 className="text-3xl font-bold text-foreground my-md">Contact Information</h2>
              <p className="text-foreground/70 max-w-2xl text-center">
                Choose your preferred way to reach us. Our team is ready to help with any questions or concerns.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-xl my-2xl max-w-6xl mx-auto">
              {contactInfo.map((item, index) => (
                <div key={index} className="text-center p-lg bg-content1/50 rounded-2xl border border-divider hover:bg-content1/70 transition-all duration-300 flex flex-col items-center justify-center">
                  <a href={item.link} className="block w-full flex flex-col items-center justify-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center my-md`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-foreground my-sm text-center">{item.title}</h3>
                    <p className="text-foreground/70 text-sm my-sm text-center">{item.content}</p>
                    <p className="text-foreground/50 text-xs text-center">{item.description}</p>
                  </a>
                </div>
              ))}
            </div>

            {/* Response Times and Chatbot Cards */}
            <div className="flex flex-col lg:flex-row gap-xl my-2xl max-w-6xl mx-auto">
              {/* Response Times Card */}
              <div className="flex-1 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-lg">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3 mb-md">
                    <Icons.time className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-foreground">Response Times</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md text-center">
                    <div className="text-sm text-foreground/70">
                      <span className="font-medium block">📧 Email Support</span>
                      <span>Within 24 hours</span>
                    </div>
                      <div className="text-sm text-foreground/70">
                        <span className="font-medium block">📞 Phone Support</span>
                        <span>9 AM - 6 PM PST</span>
                      </div>
                    <div className="text-sm text-foreground/70">
                      <span className="font-medium block">💬 Live Chat</span>
                      <span>24/7 Available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chatbot Promotion */}
              <div className="flex-1 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-lg">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3 mb-md">
                    <Icons.chatBubble className="w-6 h-6 text-primary" />
                    <h3 className="font-semibold text-foreground">Need Instant Help?</h3>
                  </div>
                  <p className="text-foreground/70 text-center my-sm">
                    Our AI chatbot is available 24/7 to answer your questions instantly.
                  </p>
                  <button 
                    onClick={handleChatBotClick}
                    className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                  >
                    Try Live Chat →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="my-2xl">
            <div className="flex flex-col items-center my-3xl">
              <h2 className="text-3xl font-bold text-foreground my-md">Send us a Message</h2>
              <p className="text-foreground/70 max-w-2xl text-center">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>
            
            <div className="flex justify-center">
              {isSubmitted ? (
                <div className="text-center container-py-3xl container-px-2xl bg-content1/40 backdrop-blur-md rounded-3xl border border-divider/50 container-p-2xl max-w-md mx-auto shadow-large">
                  <div className="my-lg">
                    <Icons.success className="w-16 h-16 text-success mx-auto drop-shadow-lg" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground my-md">Message Sent Successfully!</h3>
                  <p className="text-foreground/70 my-xl text-base">We'll get back to you as soon as possible.</p>
                  <div className="flex items-center justify-center gap-2 text-sm text-foreground/60">
                    <Icons.time className="w-4 h-4" />
                    <span>Expected response time: 24 hours</span>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-3xl">
                  <form onSubmit={handleSubmit} className="bg-content1/40 backdrop-blur-md rounded-3xl border border-content1/40 container-p-2xl shadow-large hover:shadow-large hover:border-primary/30 transition-all duration-500">
                    <div className="space-y-xl">
                      {/* Name and Email Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                        <div className="space-y-md">
                          <label htmlFor="name" className="block text-sm font-semibold text-foreground">
                            Your Name <span className="text-danger">*</span>
                          </label>
                          <Input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            isRequired
                            className="w-full"
                            classNames={{
                              input: "text-center container-py-md text-base",
                              inputWrapper: "bg-background/60 border-background/60 focus-within:border-primary shadow-medium transition-all duration-300"
                            }}
                          />
                        </div>
                        
                        <div className="space-y-md">
                          <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                            Email Address <span className="text-danger">*</span>
                          </label>
                          <Input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            isRequired
                            className="w-full"
                            classNames={{
                              input: "text-center container-py-md text-base",
                              inputWrapper: "bg-background/60 border-background/60 focus-within:border-primary shadow-medium transition-all duration-300"
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Subject Row */}
                      <div className="space-y-md">
                        <label htmlFor="subject" className="block text-sm font-semibold text-foreground">
                          Subject <span className="text-danger">*</span>
                        </label>
                        <Input
                          id="subject"
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What's this about?"
                          isRequired
                          className="w-full"
                          classNames={{
                            input: "text-center container-py-md text-base",
                            inputWrapper: "bg-background/60 border-border/60 focus-within:border-primary shadow-medium transition-all duration-300"
                          }}
                        />
                      </div>
                      
                      {/* Message Row */}
                      <div className="space-y-md">
                        <label htmlFor="message" className="block text-sm font-semibold text-foreground">
                          Message <span className="text-danger">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          className="w-full container-px-lg container-py-md bg-background/60 border border-background/60 rounded-large text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary shadow-medium transition-all duration-300 resize-none text-center text-base"
                          placeholder="Tell us more about your inquiry..."
                          required
                        />
                      </div>
                      
                      {/* Submit Button */}
                      <div className="flex justify-center my-xl">
                        <Button
                          type="submit"
                          color="primary"
                          loading={isSubmitting}
                          rightIcon={!isSubmitting ? <Icons.paperAirplane className="w-5 h-5" /> : undefined}
                          className="container-px-2xl container-py-lg text-lg font-bold shadow-large hover:shadow-large transform hover:scale-105 transition-all duration-300"
                          size="lg"
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </div>
                      
                      {/* Privacy Notice */}
                      <div className="text-sm text-foreground/60 text-center my-lg flex items-center justify-center gap-2">
                        <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                          <Icons.document className="w-3 h-3 text-primary" />
                        </div>
                        By submitting this form, you agree to our 
                        <a href="/terms" className="text-primary hover:text-primary/80 underline font-medium">privacy policy</a> 
                        and 
                        <a href="/terms" className="text-primary hover:text-primary/80 underline font-medium">terms of service</a>.
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="my-2xl text-center">
            <div className="flex flex-col items-center my-3xl">
              <h2 className="text-3xl font-bold text-foreground my-md">Frequently Asked Questions</h2>
              <p className="text-foreground/70 max-w-2xl text-center">
                Find quick answers to common questions about our platform and services
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-xl max-w-6xl mx-auto">
              {[
                {
                  question: "How quickly do you respond to inquiries?",
                  answer: "We typically respond to all inquiries within 24 hours during business days."
                },
                {
                  question: "Is my information secure?",
                  answer: "Yes, all communications are encrypted and we follow strict security protocols."
                },
                {
                  question: "Can I schedule a call?",
                  answer: "Absolutely! Contact us to schedule a personalized consultation with our experts."
                },
                {
                  question: "What support channels are available?",
                  answer: "We offer email, phone, live chat, and our AI chatbot for 24/7 assistance."
                },
                {
                  question: "Do you offer investment advice?",
                  answer: "We provide educational resources and platform guidance, not personalized investment advice."
                },
                {
                  question: "How can I get started?",
                  answer: "Simply create an account and complete our onboarding process to begin investing."
                }
              ].map((faq, index) => (
                <div key={index} className="text-center bg-content1/50 rounded-2xl p-lg border border-divider hover:bg-content1/70 transition-all duration-300 flex flex-col items-center justify-center">
                  <h3 className="font-semibold text-foreground my-sm text-center">{faq.question}</h3>
                  <p className="text-foreground/70 text-sm my-md text-center">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact