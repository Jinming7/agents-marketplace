import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AppDetail from './pages/AppDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import MyApps from './pages/MyApps'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app/:appId" element={<AppDetail />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/my-apps" element={<MyApps />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
