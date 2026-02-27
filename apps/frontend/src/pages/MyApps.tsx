import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'

interface App {
  id: string
  name: string
  description: string
  category: string
  installs: number
  rating: number
}

function MyApps() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      navigate('/auth/login')
      return
    }
    
    setUser(JSON.parse(userData))

    fetch('http://localhost:3003/api/user/installations', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setApps(data.apps || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        showToast('Failed to load your apps', 'error')
      })
  }, [navigate, showToast])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    showToast('Logged out successfully', 'success')
    navigate('/auth/login')
  }

  const handleUninstall = async (appId: string, appName: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`http://localhost:3003/api/user/installations/${appId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (res.ok) {
        setApps(apps.filter(app => app.id !== appId))
        showToast(`${appName} uninstalled successfully`, 'success')
      } else {
        showToast('Failed to uninstall app', 'error')
      }
    } catch (error) {
      console.error('Failed to uninstall app:', error)
      showToast('An error occurred', 'error')
    }
  }

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '40px', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '10px', background: 'linear-gradient(135deg, #0070f3, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>My Apps</h1>
          </Link>
          <p style={{ color: '#666', fontSize: '18px' }}>Manage your installed applications</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/profile" style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '8px', textDecoration: 'none', color: '#333', cursor: 'pointer' }}>
            👤 Profile
          </Link>
          <button onClick={handleLogout} style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '8px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0070f3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          <p style={{ marginTop: '15px', color: '#666' }}>Loading your apps...</p>
        </div>
      ) : apps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
          <h2 style={{ marginBottom: '10px', color: '#333' }}>No apps installed yet</h2>
          <p style={{ color: '#666', marginBottom: '25px' }}>Browse the marketplace to find useful apps for your team</p>
          <Link to="/" style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #0070f3, #0051d4)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '500', display: 'inline-block' }}>
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '20px', color: '#666' }}>You have {apps.length} installed app{apps.length !== 1 ? 's' : ''}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {apps.map(app => (
              <div
                key={app.id}
                className="app-card"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  background: 'white',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{app.name}</h3>
                  <span style={{ color: '#ffa500', fontSize: '18px' }}>★ {app.rating}</span>
                </div>
                <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>{app.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #e8f4ff, #d0e8ff)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', color: '#0070f3', fontWeight: '500' }}>
                    {app.category}
                  </span>
                  <span style={{ color: '#999', fontSize: '13px' }}>{app.installs.toLocaleString()} installs</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    to={`/app/${app.id}`}
                    style={{ flex: 1, padding: '10px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px', textDecoration: 'none', color: '#333', fontWeight: '500' }}
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleUninstall(app.id, app.name)}
                    style={{ flex: 1, padding: '10px', border: '1px solid #ff4d4f', background: 'white', borderRadius: '8px', color: '#ff4d4f', fontWeight: '500', cursor: 'pointer' }}
                  >
                    Uninstall
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MyApps
