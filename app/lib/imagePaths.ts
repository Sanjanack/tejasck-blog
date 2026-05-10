export function isValidImagePath(value: string | undefined | null): boolean {
  if (!value) return true
  if (/^https?:\/\//i.test(value)) return true
  return value.startsWith('/')
}

export function normalizeImageSrc(value: string | undefined | null): string | undefined {
  if (!value) return undefined
  const trimmed = String(value).trim()
  if (!trimmed) return undefined
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return trimmed.startsWith('/') ? trimmed : `/${trimmed.replace(/^\/+/, '')}`
}

