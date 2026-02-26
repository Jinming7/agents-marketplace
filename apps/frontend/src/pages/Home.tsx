import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../components/Toast'
import { Loading, AppGridSkeleton } from '../components/Loading'

interface App {
  id: string
  name: string
  description: string
  category: string
  installs: number
  rating: number
}

function Home() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [user, setUser] = useState<any>(null)
  const { showToast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetch('http://localhost:3001/api/apps')
      .then(res => res.json())
      .then(data => {
        setApps(data.apps || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setError(true)
        showToast('Failed to load apps', 'error')
      })
  }, [showToast])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    showToast('Logged out successfully', 'success')
  }

  const filteredApps = apps.filter(app => {
    const matchSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !category || app.category === category
    return matchSearch && matchCategory
  })

  const categories = [...new Set(apps.map(a => a.category))]

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '40px', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '48px', marginBottom: '10px', background: 'linear-gradient(135deg, #0070f3, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Marketplace</h1>
          <p style={{ color: '#666', fontSize: '18px' }}>Discover and install apps for your team</p>
        </div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to="/my-apps" style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '8px', textDecoration: 'none', color: '#333', cursor: 'pointer' }}>
                📦 My Apps
              </Link>
              <Link to="/profile" style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '8px', textDecoration: 'none', color: '#333', cursor: 'pointer' }}>
                👤 Profile
              </Link>
              <button onClick={handleLogout} style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth/login" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #0070f3, #0051d4)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}>
              Login
            </Link>
          )}
        </div>
      </header>

      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="🔍 Search apps..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input"
          style={{ marginBottom: '20px', fontSize: '16px' }}
        />
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCategory('')}
            style={{
              padding: '8px 20px',
              border: !category ? 'none' : '1px solid #ddd',
              background: !category ? 'linear-gradient(135deg, #0070f3, #0051d4)' : 'white',
              color: !category ? 'white' : '#333',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '8px 20px',
                border: category === cat ? 'none' : '1px solid #ddd',
                background: category === cat ? 'linear-gradient(135deg, #0070f3, #0051d4)' : 'white',
                color: category === cat ? 'white' : '#333',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <AppGridSkeleton count={6} />
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
          <h2 style={{ marginBottom: '10px', color: '#333' }}>Unable to load apps</h2>
          <p style={{ color: '#666', marginBottom: '25px' }}>Please check your connection and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #0070f3, #0051d4)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '500', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      ) : filteredApps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
          <h2 style={{ marginBottom: '10px', color: '#333' }}>No apps found</h2>
          <p style={{ color: '#666', marginBottom: '25px' }}>Try adjusting your search or filters.</p>
          <button 
            onClick={() => { setSearch(''); setCategory('') }}
            style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #0070f3, #0051d4)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '500', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: '20px', color: '#666' }}>Showing {filteredApps.length} apps</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {filteredApps.map(app => (
              <Link
                key={app.id}
                to={`/app/${app.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="app-card" style={{
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  background: 'white',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '600' }}>{app.name}</h3>
                    <span style={{ color: '#ffa500', fontSize: '18px' }}>★ {app.rating}</span>
                  </div>
                  <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>{app.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: 'linear-gradient(135deg, #e8f4ff, #d0e8ff)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', color: '#0070f3', fontWeight: '500' }}>
                      {app.category}
                    </span>
                    <span style={{ color: '#999', fontSize: '13px' }}>{app.installs.toLocaleString()} installs</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Home
