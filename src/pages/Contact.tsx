import React, { useState } from 'react'
import { 
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Button,
  Chip
} from '@heroui/react'
import { Mail, MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'support@oentex.com',
      link: 'mailto:support@oentex.com',
      color: 'primary'
    },
    {
      icon: MapPin,
      title: 'Office',
      content: 'San Francisco, CA',
      link: '#',
      color: 'secondary'
    }
  ]

  return (
    <motion.div 
      className="min-h-screen pt-20 pb-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-background to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-default-600 max-w-3xl mx-auto">
              Have questions about our platform or need assistance? We're here to help you navigate your investment journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-default-600 mb-8">
                Reach out to us through any of the following channels. We typically respond within 24 hours.
              </p>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="card-hover">
                      <CardBody className="p-4">
                        <div className="flex items-start">
                          <Avatar
                            icon={<item.icon className="w-6 h-6" />}
                            className={`bg-${item.color} text-${item.color}-foreground mr-4`}
                          />
                          <div>
                            <h3 className="font-semibold mb-1">{item.title}</h3>
                            <p className="text-default-600">
                              {item.content}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="mt-12">
                <CardHeader>
                  <h3 className="font-semibold">Response Times</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2 text-default-600 text-small">
                    <p>📧 Email: Within 24 hours</p>
                    <p>🕒 Business Hours: 9 AM - 6 PM PST</p>
                  </div>
                </CardBody>
              </Card>

              {/* Chatbot Promotion */}
              <Card className="mt-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
                <CardBody className="p-6">
                  <div className="flex items-center mb-3">
                    <MessageCircle className="w-6 h-6 text-primary mr-2" />
                    <h3 className="font-semibold">Quick Help</h3>
                  </div>
                  <p className="text-default-600 text-small mb-3">
                    Need instant answers? Our AI chatbot is available 24/7 on the bottom-right corner of every page.
                  </p>
                  <Button 
                    variant="light"
                    color="primary"
                    size="sm"
                    onPress={() => toast.success('Look for the chat icon on the bottom-right corner!')}
                  >
                    Try Live Chat →
                  </Button>
                </CardBody>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold">Send us a Message</h2>
                </CardHeader>
                <CardBody className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                      <p className="text-default-600">We'll get back to you as soon as possible.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Your Name"
                          placeholder="John Doe"
                          value={formData.name}
                          onValueChange={(value) => handleChange('name', value)}
                          variant="bordered"
                          isRequired
                        />
                        
                        <Input
                          type="email"
                          label="Email Address"
                          placeholder="john@example.com"
                          value={formData.email}
                          onValueChange={(value) => handleChange('email', value)}
                          variant="bordered"
                          isRequired
                        />
                      </div>
                      
                      <Input
                        label="Subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onValueChange={(value) => handleChange('subject', value)}
                        variant="bordered"
                        isRequired
                      />
                      
                      <Textarea
                        label="Message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onValueChange={(value) => handleChange('message', value)}
                        variant="bordered"
                        minRows={6}
                        isRequired
                      />
                      
                      <Button
                        type="submit"
                        color="primary"
                        size="lg"
                        className="w-full"
                        isLoading={isSubmitting}
                        endContent={!isSubmitting && <Send className="w-5 h-5" />}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default Contact