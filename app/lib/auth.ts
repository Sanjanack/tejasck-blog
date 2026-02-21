import { cookies } from 'next/headers'
import { CMS_PATH } from './cms-constants'

const SESSION_COOKIE = 'cms_session'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export { CMS_PATH }
export const CMS_LOGIN_PATH = CMS_PATH + '/login'

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  
  if (!session) {
    return false
  }

  const expectedToken = process.env.ADMIN_SESSION_SECRET || 'change-me-in-production'
  return session.value === expectedToken
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)
  return session?.value || null
}

export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

/** @deprecated Use verifyCredentials */
export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export function generateSessionToken(): string {
  return process.env.ADMIN_SESSION_SECRET || 'change-me-in-production'
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE
}

