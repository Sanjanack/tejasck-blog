import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/app/lib/prisma'
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateAsk(body: any) {
  const errors: Record<string, string[]> = {}
  const data = {
    name: String(body?.name || '').trim(),
    email: String(body?.email || '').trim(),
    subject: String(body?.subject || '').trim(),
    message: String(body?.message || '').trim(),
    ref: body?.ref ? String(body.ref).trim() : undefined,
  }

  if (!data.subject || data.subject.length < 3 || data.subject.length > 200) {
    errors.subject = ['Subject must be between 3 and 200 chars']
  }
  if (!data.message || data.message.length < 10 || data.message.length > 5000) {
    errors.message = ['Message must be between 10 and 5000 chars']
  }
  if (data.email && !isValidEmail(data.email)) {
    errors.email = ['Invalid email']
  }

  return { ok: Object.keys(errors).length === 0, data, errors }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''
    let payload: Record<string, unknown>
    if (contentType.includes('application/json')) {
      payload = await request.json()
    } else {
      const fd = await request.formData()
      payload = Object.fromEntries(fd.entries())
    }

    const parsed = validateAsk(payload)
    if (!parsed.ok) {
      return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 })
    }

    const { name = '', email = '', subject, message, ref } = parsed.data

    // Store in DB first
    const saved = await prisma.askSubmission.create({
      data: { name: name || null, email: email || null, subject, message, ref: ref || null },
    })

    // Email recipients via env, not exposed in client
    const toRecipients = [
      process.env.ASK_RECIPIENT_1,
      process.env.ASK_RECIPIENT_2,
    ].filter(Boolean) as string[]

    if (toRecipients.length > 0 && process.env.RESEND_API_KEY) {
      await resend?.emails.send({
        from: 'Ask Bot <noreply@yourdomain.dev>',
        to: toRecipients,
        subject: `New Ask submission: ${subject}`,
        text: `New Ask submission\n\nSubject: ${subject}\nFrom: ${name || 'Anonymous'}${email ? ` <${email}>` : ''}\nRef: ${ref || '-'}\n\n${message}\n\nID: ${saved.id} | ${saved.createdAt.toISOString()}`,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error handling ask submission', error)
    return NextResponse.json({ ok: false, error: 'Failed to submit' }, { status: 500 })
  }
}


