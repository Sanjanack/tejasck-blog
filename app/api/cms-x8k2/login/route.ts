import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyCredentials, generateSessionToken, getSessionCookieName } from '@/app/lib/auth'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ ok: false, error: 'Username and password required' }, { status: 400 })
    }

    if (!verifyCredentials(username, password)) {
      return NextResponse.json({ ok: false, error: 'Invalid username or password' }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set(getSessionCookieName(), generateSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ ok: false, error: 'Login failed' }, { status: 500 })
  }
}
