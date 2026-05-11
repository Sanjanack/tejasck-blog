import type { NextResponse } from 'next/server'

type RateLimitOptions = {
  windowMs: number
  max: number
}

const buckets = new Map<string, { resetAt: number; count: number }>()

export function getClientIp(request: Request): string {
  // Vercel/Proxies: first entry is original client.
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

export function rateLimit(key: string, { windowMs, max }: RateLimitOptions): { ok: true } | { ok: false; retryAfterMs: number } {
  const now = Date.now()
  const cur = buckets.get(key)
  if (!cur || now >= cur.resetAt) {
    buckets.set(key, { resetAt: now + windowMs, count: 1 })
    return { ok: true }
  }
  if (cur.count >= max) return { ok: false, retryAfterMs: cur.resetAt - now }
  cur.count += 1
  return { ok: true }
}

export function applyBasicCors(response: NextResponse, request: Request) {
  // CORS matters only when a browser calls your API from another origin.
  // By default we only reflect allowed origins.
  const origin = request.headers.get('origin')
  if (!origin) return response

  const site = process.env.NEXT_PUBLIC_SITE_URL
  const allow = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const allowed = new Set<string>([...(site ? [site] : []), ...allow])
  if (!allowed.has(origin)) return response

  response.headers.set('Access-Control-Allow-Origin', origin)
  response.headers.set('Vary', 'Origin')
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

