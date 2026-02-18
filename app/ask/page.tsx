"use client"

import { useEffect, useMemo, useState } from 'react'

export default function AskPage() {
  const [status, setStatus] = useState<'idle'|'submitting'|'success'|'error'>('idle')
  const [error, setError] = useState<string>('')

  // Prefill from query params
  const params = useMemo(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''), [])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const qSubject = params.get('subject') || ''
    const ref = params.get('ref') || ''
    setSubject(qSubject)
    if (ref) {
      setMessage((m) => m || `Ref: ${ref}\n\n`)
    }
  }, [params])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, ref: params.get('ref') || undefined }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error('Failed to submit')
      }
      setStatus('success')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <div className="relative min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a] pt-24 pb-16">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6b8e6b]/5 blur-3xl dark:bg-[#7a9a7a]/5" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#5b7c99]/5 blur-3xl dark:bg-[#6b8e9f]/5" />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e0] bg-white/80 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#5b7c99] dark:border-[#4a5568] dark:bg-[#252525]/80 dark:text-[#9ca3af] mb-6">
            Ask Me Anything
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">
            <span className="bg-gradient-to-r from-[#2d3748] to-[#6b8e6b] dark:from-[#e5e7eb] dark:to-[#7a9a7a] bg-clip-text text-transparent">
              Ask & I&apos;ll Reply
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#4a5568] dark:text-[#9ca3af] max-w-2xl mx-auto">
            Drop a question or story idea. I&apos;ll reply by email or feature it in a vlog.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <form onSubmit={onSubmit} className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-[#4a5568] dark:text-[#9ca3af] mb-2" htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b] focus:border-transparent transition-all duration-200"
                  placeholder="Your name (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a5568] dark:text-[#9ca3af] mb-2" htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
                  placeholder="you@example.com (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a5568] dark:text-[#9ca3af] mb-2" htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e)=>setSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
                  placeholder="Topic or question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4a5568] dark:text-[#9ca3af] mb-2" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e)=>setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b] focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Write your question or comment..."
                ></textarea>
              </div>

              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div className="text-xs text-[#718096] dark:text-[#9ca3af]">
                  <span className="font-semibold">Privacy:</span> email stays private, replies land in your inbox.
                </div>
                <button 
                  className="relative px-8 py-3 rounded-xl bg-[#6b8e6b] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group" 
                  type="submit" 
                  disabled={status==='submitting'}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {status==='submitting' ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      'Send'
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#5a7a5a] to-[#6b8e6b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>

              {status==='success' && (
                <div className="rounded-lg bg-[#f0f9f0] text-[#2d5016] dark:bg-[#1a2e1a] dark:text-[#7a9a7a] px-4 py-3 text-sm">
                  Thanks! Your question has been sent.
                </div>
              )}
              {status==='error' && (
                <div className="rounded-lg bg-[#fef2f2] text-[#991b1b] dark:bg-[#2e1a1a] dark:text-[#fca5a5] px-4 py-3 text-sm">
                  {error || 'There was a problem submitting your question.'}
                </div>
              )}
            </div>
          </form>

          <aside className="rounded-2xl border border-[#e2e8f0] dark:border-[#4a5568] bg-white dark:bg-[#252525] p-6 flex flex-col gap-6 shadow-lg">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#718096] dark:text-[#9ca3af]">How it works</p>
              <ul className="mt-4 space-y-4 text-sm text-[#4a5568] dark:text-[#9ca3af]">
                <li>✉️ Fill the form — only subject & message are required.</li>
                <li>📬 I read submissions daily in my private dashboard.</li>
                <li>📹 Top questions become vlog or blog topics.</li>
                <li>📧 If you leave an email, I reply directly from my inbox.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-dashed border-[#cbd5e0] dark:border-[#4a5568] p-4 text-sm text-[#4a5568] dark:text-[#9ca3af]">
              <p className="font-semibold text-[#2d3748] dark:text-[#e5e7eb]">Want a shout-out?</p>
              <p>Add your first name + city in the message so I can credit you when answering!</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}


