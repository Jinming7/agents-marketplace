import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'

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
  const [error, setError] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [installing, setInstalling] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetch(`http://localhost:3003/api/apps/${appId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(true)
        } else {
          setApp(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [appId])

  const handleInstall = async () => {
    if (!user) {
      navigate('/auth/login')
      showToast('Please login to install apps', 'warning')
      return
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/auth/login')
      return
    }
    
    setInstalling(true)
    
    try {
      const res = await fetch('http://localhost:3003/api/user/installations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ appId })
      })
      
      if (res.ok) {
        showToast(`${app?.name} installed successfully!`, 'success')
      } else {
        const data = await res.json()
        showToast(data.error || 'Failed to install app', 'error')
      }
    } catch (error) {
      showToast('An error occurred', 'error')
    }
    
    setInstalling(false)
  }

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0070f3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
        <p style={{ marginTop: '15px', color: '#666' }}>Loading app details...</p>
      </div>
    )
  }

  if (error || !app) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
        <h2 style={{ marginBottom: '10px', color: '#333' }}>App not found</h2>
        <p style={{ color: '#666', marginBottom: '25px' }}>The app you're looking for doesn't exist or has been removed.</p>
        <Link to="/" style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #0070f3, #0051d4)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', display: 'inline-block' }}>
          Back to Marketplace
        </Link>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    showToast('Logged out successfully', 'success')
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: '500' }}>← Back to Apps</Link>
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
      
      <div style={{ marginTop: '30px', background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '36px', marginBottom: '15px', color: '#333' }}>{app.name}</h1>
            <p style={{ color: '#666', fontSize: '18px', marginBottom: '25px', lineHeight: '1.6' }}>{app.description}</p>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
              <span style={{ background: 'linear-gradient(135deg, #e8f4ff, #d0e8ff)', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', color: '#0070f3', fontWeight: '500' }}>
                {app.category}
              </span>
              <span style={{ color: '#ffa500', fontWeight: '600' }}>★ {app.rating}</span>
              <span style={{ color: '#666' }}>{app.installs.toLocaleString()} installs</span>
            </div>
          </div>
          <button 
            onClick={handleInstall}
            disabled={installing}
            style={{
              padding: '16px 40px',
              background: installing ? '#ccc' : 'linear-gradient(135deg, #0070f3, #0051d4)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: installing ? 'not-allowed' : 'pointer',
              boxShadow: installing ? 'none' : '0 4px 14px rgba(0, 112, 243, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {installing ? 'Installing...' : 'Install App'}
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '35px 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
          <div>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Details</h3>
            <p style={{ marginBottom: '10px', color: '#666' }}><strong style={{ color: '#333' }}>Version:</strong> {app.version}</p>
            <p style={{ marginBottom: '10px', color: '#666' }}><strong style={{ color: '#333' }}>Developer:</strong> {app.developer}</p>
            <p style={{ marginBottom: '10px', color: '#666' }}><strong style={{ color: '#333' }}>Last Updated:</strong> {app.lastUpdated}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppDetail
