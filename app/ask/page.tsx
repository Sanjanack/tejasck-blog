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
    <div className="pt-24 pb-16 min-h-screen bg-[#faf9f7] dark:bg-[#1a1a1a]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#2d3748] dark:text-[#e5e7eb] mb-4">Ask & I'll reply on camera</h1>
          <p className="text-base sm:text-lg text-[#4a5568] dark:text-[#9ca3af] max-w-3xl mx-auto">
            Drop a question, request, or story idea. Your note lands straight in my inbox and in the private Ask dashboard so I can reply by email or turn it into a vlog segment.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <form onSubmit={onSubmit} className="bg-white dark:bg-[#252525] border border-[#e2e8f0] dark:border-[#4a5568] rounded-xl p-8 shadow-sm">
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-[#4a5568] dark:text-[#9ca3af] mb-2" htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
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
                  className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#1f1f1f] border border-[#e2e8f0] dark:border-[#4a5568] text-[#2d3748] dark:text-[#e5e7eb] placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#6b8e6b]"
                  placeholder="Write your question or comment..."
                ></textarea>
              </div>

              <div className="flex flex-wrap items-center gap-4 justify-between">
                <div className="text-xs text-[#718096] dark:text-[#9ca3af]">
                  <span className="font-semibold">Privacy:</span> email stays private, replies land in your inbox.
                </div>
                <button className="btn-primary" type="submit" disabled={status==='submitting'}>
                  {status==='submitting' ? 'Sending…' : 'Send'}
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

          <aside className="rounded-xl border border-[#e2e8f0] dark:border-[#4a5568] bg-white dark:bg-[#252525] p-6 flex flex-col gap-6 shadow-sm">
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


