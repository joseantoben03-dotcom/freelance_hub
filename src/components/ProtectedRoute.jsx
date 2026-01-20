"use client"

import { useAuthStore } from "../hooks/useAuth"
import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoading, checkAuth } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Ensure auth state is fully checked on mount
    if (!user && !isLoading) {
      checkAuth()
    }
    
    const timeout = setTimeout(() => {
      setIsChecking(false)
    }, 1000) // Max 1s check to prevent infinite loading

    return () => clearTimeout(timeout)
  }, [user, isLoading, checkAuth])

  // Show loading spinner while checking auth
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />
  }

  // Role check with hierarchy support
  const hasRequiredRole = (userRole, requiredRole) => {
    if (!requiredRole) return true
    
    // Role hierarchy: admin > freelancer > client
    const roleHierarchy = {
      admin: ['admin', 'freelancer', 'client'],
      freelancer: ['freelancer', 'client'],
      client: ['client']
    }
    
    const userRoles = roleHierarchy[userRole] || [userRole]
    return userRoles.includes(requiredRole)
  }

  if (!hasRequiredRole(user.role, requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your account ({user.role}) doesn't have permission to access this page.
            <br />
            <span className="font-semibold text-indigo-600">
              Required: {requiredRole || 'Any authenticated user'}
            </span>
          </p>
          <div className="space-y-3">
            <a
              href="/dashboard"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-center"
            >
              Go to Dashboard
            </a>
            <button
              onClick={() => window.history.back()}
              className="w-full text-gray-600 hover:text-gray-900 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-gray-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return children
}
