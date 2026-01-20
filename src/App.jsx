"use client"


import React, { useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "./components/theme-provider"
import { useAuthStore } from "./hooks/useAuth"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import JobsPage from "./pages/JobsPage"
import JobDetailPage from "./pages/JobDetailPage"
import PostJobPage from "./pages/PostJobPage"
import DashboardPage from "./pages/DashboardPage"
import AdminDashboard from "./pages/AdminDashboard"
import PaymentsPage from "./pages/PaymentsPage"
import DisputesPage from "./pages/DisputesPage"
import MyBidsPage from "./pages/MyBidsPage"


// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  
  return null
}

// Error boundary component
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
          <div className="max-w-md w-full text-center p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-8">Please refresh the page or try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function AppContent() {
  const { setUser, checkAuth } = useAuthStore()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      checkAuth(token).catch((err) => {
        console.error('Auth check failed:', err)
        localStorage.removeItem("token")
      })
    }
  }, [checkAuth])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased">
      <Helmet>
        <title>FreelanceHub - Find & Post Freelance Jobs</title>
        <meta name="description" content="Connect freelancers with clients. Post jobs, bid on projects, manage payments securely." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <Navbar />
      
      <main className="flex-1 relative z-10">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          
          <Route
            path="/post-job"
            element={
              <ProtectedRoute requiredRole="client">
                <PostJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disputes"
            element={
              <ProtectedRoute>
                <DisputesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bids"
            element={
              <ProtectedRoute requiredRole="freelancer">
                <MyBidsPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Router>
        <AppErrorBoundary>
          <AppContent />
        </AppErrorBoundary>
      </Router>
    </ThemeProvider>
  )
}

export default App
