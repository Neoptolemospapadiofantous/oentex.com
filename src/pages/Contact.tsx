import React, { useState } from 'react'
import { Mail, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react'
import { emailService } from '../lib/email'
import toast from 'react-hot-toast'

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
      toast.error('Please fill in all fields')
      return
    }

    setIsSubmitting(true)

    try {
      await emailService.sendContactEmail(formData)
      setIsSubmitted(true)
      toast.success('Message sent successfully!')
      
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
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChatBotClick = () => {
    // This could scroll to chatbot or highlight it
    toast.success('Look for the chat icon on the bottom-right corner!')
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'support@oentex.com',
      link: 'mailto:support@oentex.com'
    },
    {
      icon: MapPin,
      title: 'Office',
      content: 'San Francisco, CA',
      link: '#'
    }
  ]

  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-text mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Have questions about our platform or need assistance? We're here to help you navigate your investment journey.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-text mb-6">Contact Information</h2>
              <p className="text-textSecondary mb-8">
                Reach out to us through any of the following channels. We typically respond within 24 hours.
              </p>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className="flex items-start group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text mb-1">{item.title}</h3>
                      <p className="text-textSecondary group-hover:text-primary transition-colors duration-300">
                        {item.content}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-12 p-6 bg-surface/50 rounded-2xl border border-border">
                <h3 className="font-semibold text-text mb-3">Response Times</h3>
                <div className="space-y-2 text-textSecondary text-sm">
                  <p>📧 Email: Within 24 hours</p>
                  <p>🕒 Business Hours: 9 AM - 6 PM PST</p>
                </div>
              </div>

              {/* Chatbot Promotion */}
              <div className="mt-6 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
                <div className="flex items-center mb-3">
                  <MessageCircle className="w-6 h-6 text-primary mr-2" />
                  <h3 className="font-semibold text-text">Quick Help</h3>
                </div>
                <p className="text-textSecondary text-sm mb-3">
                  Need instant answers? Our AI chatbot is available 24/7 on the bottom-right corner of every page.
                </p>
                <button 
                  onClick={handleChatBotClick}
                  className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                >
                  Try Live Chat →
                </button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-surface/50 rounded-2xl p-8 border border-border">
                <h2 className="text-2xl font-bold text-text mb-6">Send us a Message</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-text mb-2">Message Sent!</h3>
                    <p className="text-textSecondary">We'll get back to you as soon as possible.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:border-primary transition-colors duration-300"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:border-primary transition-colors duration-300"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-text mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:border-primary transition-colors duration-300"
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:border-primary transition-colors duration-300 resize-none"
                        placeholder="Tell us more about your inquiry..."
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact