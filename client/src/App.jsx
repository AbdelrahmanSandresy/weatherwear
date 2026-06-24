import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { OutfitsProvider } from './contexts/OutfitsContext'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import ClosetPage from './pages/ClosetPage'
import ContactPage from './pages/ContactPage'
import ErrorPage from './pages/ErrorPage'

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OutfitsProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<Protected><HomePage /></Protected>} />
            <Route path="/closet" element={<Protected><ClosetPage /></Protected>} />
            <Route path="/contact" element={<Protected><ContactPage /></Protected>} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </OutfitsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
