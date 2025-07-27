import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

interface Subscriber {
  email: string
  status: string
}

const Unsubscribe = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [reason, setReason] = useState('1') // Use numeric values
  // Remove feedback since column doesn't exist

  useEffect(() => {
    if (!token) {
      setError('Invalid unsubscribe link - missing token')
      setLoading(false)
      return
    }
    fetchSubscriber()
  }, [token])

  const fetchSubscriber = async () => {
    try {
      console.log('🔍 Fetching subscriber for token:', token)
      
      // Query the database directly for the subscriber
      const { data, error } = await supabase
        .from('email_subscribers')
        .select('email, status')
        .eq('unsubscribe_token', token)
        .single()

      if (error) {
        console.error('Error fetching subscriber:', error)
        setError('Invalid unsubscribe link')
        return
      }

      if (!data) {
        setError('Subscriber not found')
        return
      }

      console.log('✅ Found subscriber:', data)
      setSubscriber(data)

      if (data.status === 'unsubscribed') {
        setSuccess(true)
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to load unsubscribe page')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      console.log('📧 Processing unsubscribe for token:', token, 'reason:', reason)
      
      // Check if already unsubscribed
      if (subscriber?.status === 'unsubscribed') {
        setSuccess(true)
        toast.success('Already unsubscribed')
        return
      }

      // Update the subscriber status directly in the database
      const { error: updateError } = await supabase
        .from('email_subscribers')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: Math.floor(Date.now() / 1000), // Unix timestamp as Float
          unsubscribe_reason: parseInt(reason), // Convert to number
          updated_at: new Date().toISOString()
        })
        .eq('unsubscribe_token', token)

      if (updateError) {
        console.error('Unsubscribe error:', updateError)
        setError('Failed to unsubscribe. Please try again.')
        return
      }

      console.log('✅ Unsubscribe successful')
      setSuccess(true)
      toast.success('Successfully unsubscribed from newsletter')

      // Optional: Remove from external services like Resend
      try {
        // You can add logic here to remove from Resend audience if needed
        // For now, we'll just handle the database update
      } catch (externalError) {
        console.error('External service removal failed:', externalError)
        // Don't fail the whole operation if external service fails
      }

    } catch (err) {
      console.error('Unsubscribe error:', err)
      setError('Failed to unsubscribe. Please try again.')
      toast.error('Failed to unsubscribe. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-textSecondary">Loading unsubscribe page...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text mb-4">Error</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
            <p className="text-textSecondary mb-6">
              Please contact our support team if you continue to experience issues.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Oentex
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-text mb-4">Successfully Unsubscribed</h1>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-700 font-medium">
                You have been removed from our newsletter list
              </p>
            </div>
            <p className="text-textSecondary mb-4">
              We're sorry to see you go! If you change your mind, you can always 
              resubscribe on our website.
            </p>
            <p className="text-sm text-textSecondary mb-6">
              <strong>Email:</strong> {subscriber?.email}
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Oentex
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-lg max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text mb-2">Unsubscribe from Newsletter</h1>
          <p className="text-textSecondary">We're sorry to see you go!</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-textSecondary">
            <strong>Email:</strong> {subscriber?.email}
          </p>
        </div>

        <form onSubmit={handleUnsubscribe} className="space-y-6">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-text mb-2">
              Why are you unsubscribing? (Optional)
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="1">Too many emails</option>
              <option value="2">Content not relevant</option>
              <option value="3">Never signed up</option>
              <option value="4">Received spam</option>
              <option value="5">Other reason</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                🗑️ Unsubscribe Me
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Oentex
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Unsubscribe