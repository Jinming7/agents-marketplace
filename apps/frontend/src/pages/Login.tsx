import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h1>
      
      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #ddd', borderRadius: '6px' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don't have an account? <Link to="/auth/register">Register</Link>
      </p>
    </div>
  )
}

export default Login
