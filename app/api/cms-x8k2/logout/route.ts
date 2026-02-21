import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { CMS_LOGIN_PATH, getSessionCookieName } from '@/app/lib/auth'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(getSessionCookieName())

    const url = new URL(request.url)
    return NextResponse.redirect(new URL(CMS_LOGIN_PATH, url.origin))
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ ok: false, error: 'Logout failed' }, { status: 500 })
  }
}
