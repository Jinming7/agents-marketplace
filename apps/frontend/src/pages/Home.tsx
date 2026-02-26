import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check login status
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
      .catch(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const filteredApps = apps.filter(app => {
    const matchSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !category || app.category === category
    return matchSearch && matchCategory
  })

  const categories = [...new Set(apps.map(a => a.category))]

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>Marketplace</h1>
          <p style={{ color: '#666', fontSize: '18px' }}>Discover and install apps for your team</p>
        </div>
        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>{user.email}</span>
              <button onClick={handleLogout} style={{ padding: '8px 16px', border: '1px solid #ddd', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/auth/login" style={{ padding: '8px 16px', background: '#0070f3', color: 'white', borderRadius: '6px', textDecoration: 'none' }}>
              Login
            </Link>
          )}
        </div>
      </header>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search apps..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '15px 20px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '15px'
          }}
        />
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setCategory('')}
            style={{
              padding: '8px 16px',
              border: !category ? '#0070f3' : '#ddd',
              background: !category ? '#0070f3' : 'white',
              color: !category ? 'white' : '#333',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '8px 16px',
                border: category === cat ? '#0070f3' : '#ddd',
                background: category === cat ? '#0070f3' : 'white',
                color: category === cat ? 'white' : '#333',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredApps.map(app => (
            <Link
              key={app.id}
              to={`/app/${app.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                border: '1px solid #eee',
                borderRadius: '12px',
                padding: '20px',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}>
                <h3 style={{ marginBottom: '8px' }}>{app.name}</h3>
                <p style={{ color: '#666', marginBottom: '12px' }}>{app.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: '#e0f0ff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
                    {app.category}
                  </span>
                  <span style={{ color: '#ffa500' }}>★ {app.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
