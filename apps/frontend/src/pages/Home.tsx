import { useState, useEffect } from 'react'

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

  useEffect(() => {
    fetch('http://localhost:3001/api/apps')
      .then(res => res.json())
      .then(data => {
        setApps(data.apps || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>Marketplace</h1>
        <p style={{ color: '#666', fontSize: '18px' }}>Discover and install apps for your team</p>
      </header>

      <div style={{ marginBottom: '30px' }}>
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
            borderRadius: '8px'
          }}
        />
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredApps.map(app => (
            <div key={app.id} style={{
              border: '1px solid #eee',
              borderRadius: '12px',
              padding: '20px',
              background: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
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
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
