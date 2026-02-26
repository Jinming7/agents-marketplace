import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

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
  const [user, setUser] = useState<any>(null)
  const [installing, setInstalling] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetch(`http://localhost:3001/api/apps/${appId}`)
      .then(res => res.json())
      .then(data => {
        setApp(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [appId])

  const handleInstall = async () => {
    if (!user) {
      navigate('/auth/login')
      return
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/auth/login')
      return
    }
    
    setInstalling(true)
    
    try {
      const res = await fetch('http://localhost:3001/api/user/installations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appId })
      })
      
      if (res.ok) {
        alert('App installed successfully!')
      } else {
        alert('Failed to install app')
      }
    } catch (error) {
      alert('An error occurred')
    }
    
    setInstalling(false)
  }

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#0070f3', textDecoration: 'none' }}>← Back to Apps</Link>
        {user && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/my-apps" style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '6px', textDecoration: 'none', color: '#333' }}>
              📦 My Apps
            </Link>
            <Link to="/profile" style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '6px', textDecoration: 'none', color: '#333' }}>
              👤 Profile
            </Link>
            <button onClick={handleLogout} style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        )}
      </div>
      
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
          <button 
            onClick={handleInstall}
            disabled={installing}
            style={{
              padding: '15px 30px',
              background: installing ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: installing ? 'not-allowed' : 'pointer'
            }}
          >
            {installing ? 'Installing...' : 'Install'}
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
