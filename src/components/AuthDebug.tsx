// src/components/AuthDebug.tsx
import { useAuth } from '../lib/authContext'

export const AuthDebug = () => {
  const { user, session, loading } = useAuth()

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debug Info:</h3>
      <div className="space-y-1">
        <p>Loading: {loading ? '✅ Yes' : '❌ No'}</p>
        <p>User: {user ? '✅ Logged in' : '❌ Not logged in'}</p>
        <p>Session: {session ? '✅ Active' : '❌ None'}</p>
        {user && (
          <div className="mt-2">
            <p>Email: {user.email}</p>
            <p>ID: {user.id?.substring(0, 8)}...</p>
            <p>Provider: {user.app_metadata?.provider}</p>
          </div>
        )}
        {session && (
          <div className="mt-2">
            <p>Expires: {new Date(session.expires_at! * 1000).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  )
}