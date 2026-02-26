import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

interface Profile {
  email: string
  name: string
  bio: string
  notifications: boolean
}

function Profile() {
  const [profile, setProfile] = useState<Profile>({
    email: '',
    name: 'User',
    bio: '',
    notifications: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (!userData || !token) {
      navigate('/auth/login')
      return
    }
    
    const user = JSON.parse(userData)
    setProfile(prev => ({ ...prev, email: user.email }))

    fetch('http://localhost:3001/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setProfile({
          email: data.email || user.email,
          name: data.name || 'User',
          bio: data.bio || '',
          notifications: data.notifications !== undefined ? data.notifications : true
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/auth/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/auth/login')
      return
    }

    try {
      const res = await fetch('http://localhost:3001/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          notifications: profile.notifications
        })
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        
        // Update localStorage
        const userData = localStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          localStorage.setItem('user', JSON.stringify({ ...user, name: profile.name }))
        }
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' })
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #0070f3', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
          <p style={{ marginTop: '15px', color: '#666' }}>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '40px', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '10px', background: 'linear-gradient(135deg, #0070f3, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Profile</h1>
          </Link>
          <p style={{ color: '#666', fontSize: '18px' }}>Manage your account settings</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/my-apps" style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '8px', textDecoration: 'none', color: '#333', cursor: 'pointer' }}>
            📦 My Apps
          </Link>
          <button onClick={handleLogout} style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '8px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid #eee' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #0070f3, #00d4ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            color: 'white',
            fontWeight: '600'
          }}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ marginBottom: '5px' }}>{profile.name || 'User'}</h2>
            <p style={{ color: '#666' }}>{profile.email}</p>
          </div>
        </div>

        {message && (
          <div style={{ 
            padding: '15px 20px', 
            borderRadius: '8px', 
            marginBottom: '25px',
            background: message.type === 'success' ? '#f6ffed' : '#fff2f0',
            border: `1px solid ${message.type === 'success' ? '#b7eb8f' : '#ffccc7'}`,
            color: message.type === 'success' ? '#52c41a' : '#ff4d4f'
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Display Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="form-input"
              placeholder="Enter your name"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="form-input"
              style={{ background: '#f5f5f5', cursor: 'not-allowed' }}
            />
            <p style={{ fontSize: '13px', color: '#999', marginTop: '5px' }}>Email cannot be changed</p>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
              Bio
            </label>
            <textarea
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              className="form-input"
              rows={4}
              placeholder="Tell us about yourself..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={profile.notifications}
                onChange={e => setProfile({ ...profile, notifications: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: '500', color: '#333' }}>Enable email notifications</span>
            </label>
            <p style={{ fontSize: '13px', color: '#999', marginTop: '5px', marginLeft: '32px' }}>
              Receive updates about new apps and important announcements
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '14px 32px',
              background: saving ? '#ccc' : 'linear-gradient(135deg, #0070f3, #0051d4)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p style={{ color: '#999', fontSize: '14px' }}>
          ONES Marketplace v1.0.0 • © 2024 ONES
        </p>
      </div>
    </div>
  )
}

export default Profile
