import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const schema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters')
})

type FormData = yup.InferType<typeof schema>

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([data])

      if (error) throw error

      toast.success('Message sent successfully! We\'ll get back to you soon.')
      reset()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Get in Touch
            </span>
          </h1>
          <p className="text-xl text-textSecondary max-w-3xl mx-auto">
            Have questions about trading or need help with our platform? We're here to help you succeed.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-surface/50 rounded-3xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-text mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-text font-medium mb-2">First Name</label>
                  <input
                    {...register('first_name')}
                    type="text"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:border-primary"
                    placeholder="John"
                  />
                  {errors.first_name && (
                    <p className="text-error text-sm mt-1">{errors.first_name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-text font-medium mb-2">Last Name</label>
                  <input
                    {...register('last_name')}
                    type="text"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:border-primary"
                    placeholder="Doe"
                  />
                  {errors.last_name && (
                    <p className="text-error text-sm mt-1">{errors.last_name.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-text font-medium mb-2">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:border-primary"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-error text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-text font-medium mb-2">Subject</label>
                <select 
                  {...register('subject')}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Trading Support">Trading Support</option>
                  <option value="Platform Issues">Platform Issues</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
                {errors.subject && (
                  <p className="text-error text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-text font-medium mb-2">Message</label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:border-primary resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
                {errors.message && (
                  <p className="text-error text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
              
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-secondary px-6 py-4 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-surface/50 rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-text mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-text font-semibold mb-1">Email</h3>
                    <p className="text-textSecondary">support@cryptovault.com</p>
                    <p className="text-textSecondary text-sm">We'll respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-text font-semibold mb-1">Phone</h3>
                    <p className="text-textSecondary">+1 (555) 123-4567</p>
                    <p className="text-textSecondary text-sm">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-text font-semibold mb-1">Office</h3>
                    <p className="text-textSecondary">123 Financial District</p>
                    <p className="text-textSecondary">San Francisco, CA 94105</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-text font-semibold mb-1">Business Hours</h3>
                    <p className="text-textSecondary">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-textSecondary">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-surface/50 rounded-3xl p-8 border border-border">
              <h2 className="text-2xl font-bold text-text mb-6">Quick Help</h2>
              <div className="space-y-4">
                <a href="/faq" className="block p-4 bg-background/50 rounded-xl hover:bg-background/70 transition-all duration-300 group">
                  <h3 className="text-text font-medium group-hover:text-primary transition-colors">FAQ</h3>
                  <p className="text-textSecondary text-sm">Find answers to common questions</p>
                </a>
                <a href="/deals" className="block p-4 bg-background/50 rounded-xl hover:bg-background/70 transition-all duration-300 group">
                  <h3 className="text-text font-medium group-hover:text-primary transition-colors">Trading Deals</h3>
                  <p className="text-textSecondary text-sm">Explore exclusive offers and bonuses</p>
                </a>
                <a href="/about" className="block p-4 bg-background/50 rounded-xl hover:bg-background/70 transition-all duration-300 group">
                  <h3 className="text-text font-medium group-hover:text-primary transition-colors">About Us</h3>
                  <p className="text-textSecondary text-sm">Learn more about our platform</p>
                </a>
              </div>
            </div>

            {/* Live Chat Widget Placeholder */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 border border-primary/20">
              <h2 className="text-2xl font-bold text-text mb-4">Need Immediate Help?</h2>
              <p className="text-textSecondary mb-6">
                Chat with our support team for instant assistance with your trading questions.
              </p>
              <button className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105">
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact