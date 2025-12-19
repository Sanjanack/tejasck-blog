import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/app/lib/auth'

export async function POST(request: Request) {
  // Check authentication
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ ok: false, error: 'Invalid file type' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ ok: false, error: 'File too large (max 5MB)' }, { status: 400 })
    }

    // Upload to Cloudinary using unsigned upload preset
    const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET
    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME

    if (!cloudinaryUploadPreset || !cloudinaryCloudName) {
      return NextResponse.json({ ok: false, error: 'Cloudinary not configured' }, { status: 500 })
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`

    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64}`

    // Create form data for Cloudinary (using base64 data URI)
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', dataUri)
    cloudinaryFormData.append('upload_preset', cloudinaryUploadPreset)

    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    })

    if (!cloudinaryResponse.ok) {
      const error = await cloudinaryResponse.text()
      console.error('Cloudinary upload error:', error)
      return NextResponse.json({ ok: false, error: 'Upload failed' }, { status: 500 })
    }

    const cloudinaryData = await cloudinaryResponse.json()

    return NextResponse.json({
      ok: true,
      url: cloudinaryData.secure_url,
      publicId: cloudinaryData.public_id,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ ok: false, error: 'Upload failed' }, { status: 500 })
  }
}

