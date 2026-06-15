import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { I18nProvider } from './context/I18nContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Trips from './pages/Trips'
import TripDetail from './pages/TripDetail'
import TripForm from './pages/TripForm'
import Settings from './pages/Settings'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Trips />} />
              <Route path="trips/new" element={<TripForm />} />
              <Route path="trips/:id" element={<TripDetail />} />
              <Route path="trips/:id/edit" element={<TripForm />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}

export default App
