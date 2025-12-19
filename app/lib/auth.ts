import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123' // Change this in production!

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  
  if (!session) {
    return false
  }

  // Verify session token matches expected value
  // In production, you'd verify against a database or JWT
  const expectedToken = process.env.ADMIN_SESSION_SECRET || 'change-me-in-production'
  return session.value === expectedToken
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value || null
}

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export function generateSessionToken(): string {
  // Simple token generation - in production, use proper JWT or session management
  return process.env.ADMIN_SESSION_SECRET || 'change-me-in-production'
}

