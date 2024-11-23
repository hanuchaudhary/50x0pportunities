import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { ThemeProvider } from './providers/ThemeProvider'
import { Toaster } from './components/ui/toaster'
import Navbar from './components/Navbar'

import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import FullViewJob from './pages/FullViewJob'
import Profile from './pages/Profile'
import SignupPage from './pages/Signup'
import SigninPage from './pages/Signin'
import EditUserDetails from './pages/EditUserDetails'

type Role = 'Candidate' | 'Employer' | null

const getUserRole = (): Role => {
  return localStorage.getItem('role') as Role
}

interface PrivateRouteProps {
  children: React.ReactNode
  restrictedRole: Role
  redirectPath: string
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, restrictedRole, redirectPath }) => {
  const role = getUserRole()
  return role === restrictedRole ? <Navigate to={redirectPath} replace /> : <>{children}</>
}

interface PageTransitionProps {
  children: React.ReactNode
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(20px)' }}
    animate={{ opacity: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, filter: 'blur(20px)' }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
)

const App: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const pathsToRedirect = ['/', '/signup', '/signin']
    if (token && pathsToRedirect.includes(location.pathname)) {
      navigate('/jobs')
    }
  }, [token, location.pathname, navigate])

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <SignupPage />
            </PageTransition>
          }
        />
        <Route
          path="/signin"
          element={
            <PageTransition>
              <SigninPage />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute restrictedRole="Candidate" redirectPath="/jobs">
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
          }
        />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/edit" element={<EditUserDetails />} />
        <Route path="/jobs/:id" element={<FullViewJob />} />
      </Routes>
    </AnimatePresence>
  )
}

const WrappedApp: React.FC = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Navbar />
      <App />
      <Toaster />
    </BrowserRouter>
  </ThemeProvider>
)

export default WrappedApp