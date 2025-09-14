import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icons } from '@components/icons'
import { supabase } from '../../lib/supabase'
import { Link } from 'react-router-dom'
import { showErrorToast, showSuccessToast } from '../../components/ui/AppToast'
 

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
  const [reason, setReason] = useState('1')

  useEffect(() => {
    if (!token) {
      setError('Invalid unsubscribe link - missing token')
      setLoading(false)
      return
    }
    // Fetch is best-effort: we still allow proceeding even if this fails
    fetchSubscriber()
  }, [token])

  const fetchSubscriber = async () => {
    try {
      console.log('🔍 Fetching subscriber for token:', token)
      
      const { data, error } = await supabase
        .from('email_subscribers')
        .select('email, status, unsubscribe_token')
        .eq('unsubscribe_token', token)
        .single()

      console.log('📋 Database query result:', { data, error, token })

      if (error) {
        console.warn('⚠️ Error fetching subscriber (non-blocking):', error)
        // Don't block the page; allow user to attempt unsubscribe via edge function
        return
      }

      if (!data) {
        console.warn('⚠️ No subscriber found for token (non-blocking):', token)
        // Keep subscriber null, user can still try to unsubscribe
        return
      }

      console.log('✅ Found subscriber:', data)
      setSubscriber(data)

      if (data.status === 'unsubscribed') {
        console.log('ℹ️ Subscriber already unsubscribed')
        setSuccess(true)
      }
    } catch (err) {
      console.error('❌ Fetch error:', err)
      console.warn('⚠️ Non-fatal fetch error; proceeding without subscriber context')
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      console.log('📧 Processing unsubscribe for token:', token, 'reason:', reason)
      
      if (subscriber?.status === 'unsubscribed') {
        setSuccess(true)
        showSuccessToast('Already unsubscribed')
        return
      }

      // Try calling the edge function with correct name
      console.log('🔄 Attempting edge function call...')
      try {
        const { data, error } = await supabase.functions.invoke('newsletter-unsubscribe', {
          body: {
            token,
            reason
          }
        })

        console.log('📨 Edge function response:', { data, error })

        if (error) {
          console.error('Edge function error:', error)
          throw new Error('Edge function failed')
        }

        if (data?.success) {
          console.log('✅ Edge function unsubscribe successful')
          setSuccess(true)
          showSuccessToast('Successfully unsubscribed from newsletter')
          return
        } else {
          throw new Error(data?.error || 'Edge function returned unsuccessful')
        }
      } catch (edgeFunctionError) {
        console.warn('⚠️ Edge function failed, trying direct database update:', edgeFunctionError)
        
        // Fallback to direct database update
        console.log('🔄 Attempting direct database update...')
        
        const { data: tokenCheck, error: tokenError } = await supabase
          .from('email_subscribers')
          .select('id, email, status, unsubscribe_token')
          .eq('unsubscribe_token', token)

        console.log('🔍 Token verification:', { token, tokenCheck, tokenError })

        if (!tokenCheck || tokenCheck.length === 0) {
          throw new Error(`No subscriber found with unsubscribe_token: ${token}`)
        }

        const subscriberRecord = tokenCheck[0]
        console.log('📋 Record to update:', subscriberRecord)
        
        const { data: updateByIdResult, error: updateByIdError } = await supabase
          .from('email_subscribers')
          .update({
            status: 'unsubscribed',
            unsubscribed_at: new Date().toISOString(),
            unsubscribe_reason: reason,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscriberRecord.id)
          .select()

        console.log('📝 Update by ID result:', { updateByIdResult, updateByIdError })

        if (updateByIdError) {
          console.error('❌ Database update by ID error:', updateByIdError)
          throw updateByIdError
        }

        if (!updateByIdResult || updateByIdResult.length === 0) {
          console.error('❌ No records were updated by ID. This suggests RLS/permissions issue')
          throw new Error('Update blocked - likely Row Level Security or permissions issue')
        }

        console.log('✅ Direct database update successful - Updated records:', updateByIdResult.length)
        setSuccess(true)
        showSuccessToast('Successfully unsubscribed from newsletter')
      }

    } catch (err) {
      console.error('❌ Complete unsubscribe failure:', err)
      setError('Failed to unsubscribe. Please try again.')
      showErrorToast('Failed to unsubscribe. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
        <div className="bg-content1 rounded-2xl container-p-2xl shadow-lg max-w-md w-full container-p-md">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-6 text-foreground/70">Loading unsubscribe page...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
        <div className="bg-content1 rounded-2xl container-p-2xl shadow-lg max-w-md w-full container-p-md">
          <div className="text-center">
            <Icons.warning className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-6">Error</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg container-p-md mb-8">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
            <p className="text-foreground/70 mb-8">
              Please contact our support team if you continue to experience issues.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-primary text-white container-px-lg container-py-sm rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Icons.arrowLeft className="w-4 h-4" />
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
        <div className="bg-content1 rounded-2xl container-p-2xl shadow-lg max-w-md w-full container-p-md">
          <div className="text-center">
            <Icons.success className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground mb-6">Successfully Unsubscribed</h1>
            <div className="bg-green-50 border border-green-200 rounded-lg container-p-md mb-8">
              <p className="text-green-700 font-medium">
                You have been removed from our newsletter list
              </p>
            </div>
            <p className="text-foreground/70 mb-6">
              We're sorry to see you go! If you change your mind, you can always 
              resubscribe on our website.
            </p>
            <p className="text-sm text-foreground/70 mb-8">
              <strong>Email:</strong> {subscriber?.email}
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-primary text-white container-px-lg container-py-sm rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Icons.arrowLeft className="w-4 h-4" />
              Return to Oentex
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
      <div className="bg-content1 rounded-2xl container-p-2xl shadow-lg max-w-md w-full container-p-md">
        <div className="text-center mb-8">
          <Icons.mail className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-3">Unsubscribe from Newsletter</h1>
          <p className="text-foreground/70">We're sorry to see you go!</p>
        </div>

        <div className="bg-content2 rounded-lg container-p-md mb-8">
          <p className="text-sm text-foreground/70">
            <strong>Email:</strong> {subscriber?.email}
          </p>
        </div>

        <form onSubmit={handleUnsubscribe} className="space-y-8">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-foreground mb-3">
              Why are you unsubscribing? (Optional)
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full container-px-md container-py-sm border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
            className="w-full bg-red-500 text-white container-py-sm container-px-lg rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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

        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1"
          >
            <Icons.arrowLeft className="w-4 h-4" />
            Return to Oentex
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Unsubscribe