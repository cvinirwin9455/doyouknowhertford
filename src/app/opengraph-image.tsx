import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Do You Know Hertford? - The Ultimate Hertford Quiz'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '30px',
            boxShadow: '0 20px 40px rgba(5, 150, 105, 0.3)',
          }}
        >
          <span style={{ color: 'white', fontSize: '40px', fontWeight: 'bold' }}>H</span>
        </div>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            marginBottom: '10px',
          }}
        >
          Do You Know Hertford?
        </div>
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          The Ultimate Hertford Quiz
        </div>
        <div
          style={{
            display: 'flex',
            gap: '40px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>10</span>
            <span style={{ fontSize: '16px', color: '#64748b' }}>Questions</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b' }}>20s</span>
            <span style={{ fontSize: '16px', color: '#64748b' }}>Per Question</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6' }}>Free</span>
            <span style={{ fontSize: '16px', color: '#64748b' }}>To Play</span>
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            fontSize: '18px',
            color: '#475569',
          }}
        >
          doyouknowhertford.com
        </div>
      </div>
    ),
    { ...size }
  )
}
