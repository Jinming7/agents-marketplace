import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

interface AppDetail {
  id: string
  name: string
  description: string
  category: string
  installs: number
  rating: number
  version: string
  developer: string
  lastUpdated: string
}

function AppDetail() {
  const { appId } = useParams<{ appId: string }>()
  const [app, setApp] = useState<AppDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:3001/api/apps/${appId}`)
      .then(res => res.json())
      .then(data => {
        setApp(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [appId])

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
  }

  if (!app || app.error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>App not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <Link to="/" style={{ color: '#0070f3', textDecoration: 'none' }}>← Back to Apps</Link>
      
      <div style={{ marginTop: '30px', background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>{app.name}</h1>
            <p style={{ color: '#666', fontSize: '18px', marginBottom: '20px' }}>{app.description}</p>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <span style={{ background: '#e0f0ff', padding: '6px 14px', borderRadius: '16px', fontSize: '14px' }}>
                {app.category}
              </span>
              <span style={{ color: '#ffa500' }}>★ {app.rating}</span>
              <span style={{ color: '#666' }}>{app.installs.toLocaleString()} installs</span>
            </div>
          </div>
          <button style={{
            padding: '15px 30px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            Install
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div>
            <h3 style={{ marginBottom: '15px' }}>Details</h3>
            <p><strong>Version:</strong> {app.version}</p>
            <p><strong>Developer:</strong> {app.developer}</p>
            <p><strong>Last Updated:</strong> {app.lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppDetail
