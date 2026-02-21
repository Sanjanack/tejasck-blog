'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CMS_PATH } from '@/app/lib/cms-constants'

export default function CMSLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/cms-x8k2/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.ok) {
        router.push(CMS_PATH)
        router.refresh()
      } else {
        setError(data.error || 'Invalid username or password')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-2">
              Sign in
            </h1>
            <p className="text-[#718096] dark:text-[#9ca3af] text-sm">
              Username and password required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#4a5568] dark:text-[#9ca3af] mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
                placeholder="Username"
                required
                autoFocus
                autoComplete="username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#4a5568] dark:text-[#9ca3af] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
                placeholder="Password"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-[#fef2f2] dark:bg-[#2e1a1a] text-[#991b1b] dark:text-[#fca5a5] px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#718096] dark:text-[#9ca3af]">
            This URL is not linked from any public page.
          </p>
        </div>
      </div>
    </div>
  )
}
