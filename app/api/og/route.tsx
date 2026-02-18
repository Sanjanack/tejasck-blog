import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') || 'Letters from Schmalkalden').slice(0, 120)

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(135deg, #faf9f7 0%, #eef2ff 45%, #f0f4f0 100%)',
          color: '#0f172a',
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7 }}>
          Tejas C.K Studio
        </div>
        <div style={{ height: 18 }} />
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
        <div style={{ height: 28 }} />
        <div style={{ fontSize: 30, opacity: 0.8 }}>Letters from Schmalkalden</div>
        <div style={{ height: 38 }} />
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: '#6b8e6b' }} />
          <div style={{ width: 14, height: 14, borderRadius: 999, background: '#5b7c99' }} />
          <div style={{ width: 14, height: 14, borderRadius: 999, background: '#111827' }} />
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

