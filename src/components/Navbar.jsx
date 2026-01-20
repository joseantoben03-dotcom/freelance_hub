import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuthStore } from "../hooks/useAuth"

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setIsOpen((prev) => !prev)

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/40 flex items-center justify-center text-slate-950 font-bold text-xs">
              FH
            </div>
            <span className="text-base md:text-lg font-semibold text-slate-50">
              Freelance
              <span className="text-emerald-400">Hub</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/jobs"
              className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                isActive("/jobs")
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-300 hover:text-slate-50 hover:bg-slate-800/70"
              }`}
            >
              Jobs
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                  isActive("/dashboard")
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10 border border-transparent"
                }`}
              >
                Dashboard
              </Link>
            )}

            {user ? (
              <button
                onClick={logout}
                className="text-xs md:text-sm font-semibold px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-500 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-slate-50 px-2 py-1 rounded-md hover:bg-slate-800/70 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs md:text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/40 hover:from-emerald-400 hover:to-cyan-400 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-slate-300 hover:text-emerald-300 hover:bg-slate-800/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1 max-w-6xl mx-auto">
            <Link
              to="/jobs"
              className={`block text-sm font-medium px-3 py-2 rounded-lg ${
                isActive("/jobs")
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-300 hover:text-slate-50 hover:bg-slate-800/80"
              }`}
              onClick={toggleMenu}
            >
              Jobs
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className={`block text-sm font-medium px-3 py-2 rounded-lg ${
                  isActive("/dashboard")
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/10"
                }`}
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  logout()
                  toggleMenu()
                }}
                className="w-full text-left text-sm font-semibold px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-500 transition-colors mt-1"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-sm font-medium text-slate-300 hover:text-slate-50 px-3 py-2 rounded-lg hover:bg-slate-800/80"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-sm font-semibold px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/40 hover:from-emerald-400 hover:to-cyan-400 mt-1 text-center"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
