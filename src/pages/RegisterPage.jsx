import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useAuthStore } from "../hooks/useAuth"
import { Mail, Lock, User, Eye, EyeOff, Briefcase, Users } from "lucide-react"

export default function RegisterPage() {
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: searchParams.get("role") || "client",
    bio: "",
    skills: "",
    hourlyRate: "",
    profileImage: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.firstName || !formData.lastName) {
      setError("First and last name are required!")
      setLoading(false)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!")
      setLoading(false)
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters!")
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, skills, hourlyRate, ...rest } = formData
      let registerData = { ...rest }
      if (formData.role === "freelancer") {
        registerData.skills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
        registerData.hourlyRate = Number(hourlyRate) || undefined
      }
      await register(registerData)
      navigate("/dashboard")
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again."
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

      <div className="relative max-w-5xl w-full grid gap-10 lg:grid-cols-[1.1fr,1fr] items-start">
        {/* Left: brand / marketing */}
        <div className="hidden lg:block text-slate-50">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold bg-gradient-to-r from-blue-300 to-indigo-200 bg-clip-text text-transparent">
              FreelanceHub
            </span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-semibold mb-3">
            Join a trusted freelance marketplace
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-md">
            Create your account as a client or freelancer, post projects, and
            collaborate with verified professionals worldwide.
          </p>

          <div className="mt-8 grid gap-4 text-sm text-slate-200">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
              <div>
                <p className="font-semibold">For clients</p>
                <p className="text-slate-400">
                  Post jobs, review proposals, and pay securely through escrow.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
              <div>
                <p className="font-semibold">For freelancers</p>
                <p className="text-slate-400">
                  Build a profile, showcase your skills, and get paid on time.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: register card */}
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

            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-slate-50 mb-1">
                Create account
              </h2>
              <p className="text-xs text-slate-400">
                Choose your role and fill in the details to get started.
              </p>
            </div>

            {/* Role selection */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-200 mb-2">
                I want to...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: "client" })
                  }
                  className={
                    "rounded-xl border px-3 py-3 text-xs transition-all " +
                    (formData.role === "client"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-900/60 hover:border-slate-500")
                  }
                >
                  <Briefcase
                    className={
                      "w-6 h-6 mx-auto mb-1.5 " +
                      (formData.role === "client"
                        ? "text-blue-400"
                        : "text-slate-500")
                    }
                  />
                  <p
                    className={
                      "font-semibold " +
                      (formData.role === "client"
                        ? "text-blue-200"
                        : "text-slate-100")
                    }
                  >
                    Hire talent
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    I&apos;m a client
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: "freelancer" })
                  }
                  className={
                    "rounded-xl border px-3 py-3 text-xs transition-all " +
                    (formData.role === "freelancer"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-900/60 hover:border-slate-500")
                  }
                >
                  <Users
                    className={
                      "w-6 h-6 mx-auto mb-1.5 " +
                      (formData.role === "freelancer"
                        ? "text-blue-400"
                        : "text-slate-500")
                    }
                  />
                  <p
                    className={
                      "font-semibold " +
                      (formData.role === "freelancer"
                        ? "text-blue-200"
                        : "text-slate-100")
                    }
                  >
                    Find work
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    I&apos;m a freelancer
                  </p>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                  {error}
                </div>
              )}

              {/* First name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    autoComplete="given-name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 pl-9 pr-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                    placeholder="First name"
                  />
                </div>
              </div>

              {/* Last name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  Last name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    autoComplete="family-name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 pl-9 pr-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                    placeholder="Last name"
                  />
                </div>
              </div>

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
                    autoComplete="email"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 pl-9 pr-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                    placeholder="you@example.com"
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
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 pl-9 pr-10 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                    placeholder="At least 6 characters"
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

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 pl-9 pr-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>

              {/* Freelancer-only fields */}
              {formData.role === "freelancer" && (
                <>
                  <div className="mt-2 rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                    <p className="text-[11px] font-semibold text-slate-200 mb-1">
                      Freelancer profile
                    </p>
                    <p className="text-[11px] text-slate-500">
                      These details help clients discover and evaluate your
                      expertise.
                    </p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-xs font-semibold text-slate-200 mb-1.5"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none resize-y"
                      placeholder="Briefly describe your experience and what you offer."
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label
                      htmlFor="skills"
                      className="block text-xs font-semibold text-slate-200 mb-1.5"
                    >
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                      placeholder="e.g. React, Node.js, MongoDB"
                    />
                  </div>

                  {/* Hourly rate */}
                  <div>
                    <label
                      htmlFor="hourlyRate"
                      className="block text-xs font-semibold text-slate-200 mb-1.5"
                    >
                      Hourly rate (USD / hr)
                    </label>
                    <input
                      type="number"
                      id="hourlyRate"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleChange}
                      required
                      min={1}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                      placeholder="e.g. 30"
                    />
                  </div>

                  {/* Profile image */}
                  <div>
                    <label
                      htmlFor="profileImage"
                      className="block text-xs font-semibold text-slate-200 mb-1.5"
                    >
                      Profile image URL
                    </label>
                    <input
                      type="url"
                      id="profileImage"
                      name="profileImage"
                      value={formData.profileImage}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </>
              )}

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  required
                  id="terms"
                  className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
                />
                <label
                  htmlFor="terms"
                  className="text-[11px] text-slate-400 leading-relaxed"
                >
                  I agree to the{" "}
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
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-900/80 px-3 text-[11px] text-slate-500">
                  Or sign up with
                </span>
              </div>
            </div>

            {/* Social buttons (UI only) */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-xs font-medium text-slate-100 hover:border-blue-400 hover:bg-slate-900 transition"
              >
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-xs font-medium text-slate-100 hover:border-slate-400 hover:bg-slate-900 transition"
              >
                GitHub
              </button>
            </div>

            {/* Login link */}
            <p className="mt-4 text-center text-[11px] text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-300 hover:text-blue-200"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
