import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyPassword, generateSessionToken } from '@/app/lib/auth'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ ok: false, error: 'Password required' }, { status: 400 })
    }

    if (!verifyPassword(password)) {
      return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 })
    }

    // Set secure session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', generateSessionToken(), {
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

