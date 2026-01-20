// src/pages/LoginPage.jsx
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../hooks/useAuth"
import { Mail, Lock, Eye, EyeOff, Briefcase } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await login(formData)
      navigate("/dashboard")
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-80px] h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />
      </div>

      <div className="relative max-w-5xl w-full grid gap-10 lg:grid-cols-[1.1fr,1fr] items-center">
        {/* Left: brand / marketing */}
        <div className="hidden lg:block text-slate-50">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              FreelanceHub
            </span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-semibold mb-3">
            Welcome back to your freelance dashboard
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-md">
            Track proposals, manage payments, and collaborate with clients and freelancers in one secure place.
          </p>

          <div className="mt-8 grid gap-4 text-sm text-slate-200">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
              <div>
                <p className="font-semibold">Secure escrow payments</p>
                <p className="text-slate-400">
                  Funds are held safely until work is completed and approved.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
              <div>
                <p className="font-semibold">Verified talent</p>
                <p className="text-slate-400">
                  Work with vetted freelancers and build long-term partnerships.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: login card */}
        <div className="w-full">
          <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/50 backdrop-blur-xl p-7">
            {/* Mobile logo */}
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <Link to="/" className="inline-flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/40">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-300 to-indigo-200 bg-clip-text text-transparent">
                  FreelanceHub
                </span>
              </Link>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-50 mb-1">
                Sign in
              </h2>
              <p className="text-sm text-slate-400">
                Enter your email and password to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 pl-9 pr-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 pl-9 pr-10 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember / forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-300 hover:text-blue-200"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900/80 px-3 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-xs font-medium text-slate-100 hover:border-blue-400 hover:bg-slate-900 transition"
              >
                {/* Google icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-xs font-medium text-slate-100 hover:border-slate-400 hover:bg-slate-900 transition"
              >
                {/* GitHub icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.31-5.48-1.34-5.48-5.93 0-1.31.47-2.38 1.24-3.21-.13-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 0 1 6.02 0c2.3-1.55 3.31-1.23 3.31-1.23.66 1.65.25 2.87.12 3.17.77.83 1.24 1.9 1.24 3.21 0 4.61-2.81 5.62-5.49 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.19.7.8.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Register link */}
            <p className="mt-5 text-center text-xs text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-300 hover:text-blue-200"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-4 text-center text-[11px] text-slate-500">
            By logging in, you agree to our{" "}
            <Link
              to="/terms"
              className="text-blue-300 hover:text-blue-200 underline-offset-2 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-blue-300 hover:text-blue-200 underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
