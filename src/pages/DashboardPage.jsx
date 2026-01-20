import { useState, useEffect } from "react"
import { useAuthStore } from "../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [jobs, setJobs] = useState([])
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    pendingBids: 0,
    totalJobs: 0,
  })

  // Extra safety (ProtectedRoute should already guard this)
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true })
    }
  }, [user, navigate])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")

      // Use only existing routes:
      // client -> /api/jobs/my-jobs
      // freelancer/admin -> /api/jobs
      const endpoint =
        user.role === "client" ? "/api/jobs/my-jobs" : "/api/jobs"

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const debugBody = await res.text()
        console.error(
          "Dashboard fetch failed:",
          res.status,
          res.statusText,
          debugBody
        )
        throw new Error("Failed to fetch dashboard data")
      }

      const data = await res.json()
      const jobsArr = data.jobs || data.myJobs || []

      setJobs(jobsArr)

      if (user.role === "client") {
        const myJobs = jobsArr.filter(
          (j) => String(j.clientId?._id || j.clientId) === String(user.id)
        )
        const active = myJobs.filter((j) => j.status === "active")
        const completed = myJobs.filter((j) => j.status === "completed")
        setStats({
          activeJobs: active.length,
          completedJobs: completed.length,
          totalEarnings: data.totalSpent || data.total_spent || 0,
          pendingBids: 0,
          totalJobs: myJobs.length,
        })
      } else if (user.role === "freelancer") {
        setStats({
          activeJobs: jobsArr.filter((j) => j.status === "active").length,
          completedJobs: jobsArr.filter((j) => j.status === "completed").length,
          totalEarnings: 0,
          pendingBids: 0,
          totalJobs: jobsArr.length,
        })
      } else if (user.role === "admin") {
        setStats({
          activeJobs: jobsArr.filter((j) => j.status === "active").length,
          completedJobs: jobsArr.filter((j) => j.status === "completed").length,
          totalEarnings: 0,
          pendingBids: 0,
          totalJobs: jobsArr.length,
        })
      }

      setError(null)
    } catch (err) {
      console.error("Dashboard error:", err)
      setError("Failed to load dashboard. Please refresh.")
      toast.error("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const deleteJob = async (jobId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    )
      return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId))
        toast.success("Job deleted successfully")
      } else {
        const err = await res.json()
        toast.error(err.error || "Failed to delete job.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Network error. Please try again.")
    }
  }

  const SkeletonCard = () => (
    <div className="animate-pulse bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="h-6 bg-slate-800 rounded w-3/4 mb-4" />
      <div className="h-4 bg-slate-800 rounded w-1/2 mb-2" />
      <div className="h-4 bg-slate-800 rounded w-1/3" />
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4" />
            <p className="text-lg text-slate-200 font-medium">
              Loading your dashboard...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-800 animate-pulse"
                >
                  <div className="h-5 bg-slate-800 rounded w-24 mb-2" />
                  <div className="h-10 bg-slate-800 rounded-lg" />
                </div>
              ))}
          </div>

          <div className="grid gap-6">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={i} />
              ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-50 mb-3">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-slate-300">
            Welcome back,{" "}
            <span className="font-semibold text-emerald-300">
              {user?.name || "User"}
            </span>
            <span className="ml-2 inline-flex items-center rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-slate-400">
              {user?.role || "role"}
            </span>
          </p>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 shadow-lg">
            <p className="text-sm text-red-100">{error}</p>
          </div>
        )}

        {/* Stats Section */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Active Jobs */}
            <div className="group bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-800 hover:border-emerald-500/50 hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Active Jobs
                  </p>
                  <p className="text-3xl font-semibold text-emerald-300">
                    {stats.activeJobs}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="group bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-800 hover:border-blue-500/50 hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Completed
                  </p>
                  <p className="text-3xl font-semibold text-blue-300">
                    {stats.completedJobs}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Earnings / Spent */}
            <div className="group bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-800 hover:border-purple-500/50 hover:shadow-purple-500/30 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    {user?.role === "freelancer" ? "Earnings" : "Spent"}
                  </p>
                  <p className="text-3xl font-semibold text-purple-300">
                    ${stats.totalEarnings.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Items */}
            <div className="group bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-800 hover:border-cyan-500/50 hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    Total Items
                  </p>
                  <p className="text-3xl font-semibold text-cyan-300">
                    {stats.totalJobs}
                  </p>
                </div>
                <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                  <svg
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions (unchanged, from your version) */}
        {/* ... keep your Quick Actions section as is ... */}

        {/* Client Jobs List */}
        {user?.role === "client" && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-100">
                Your Posted Jobs
              </h2>
              <Link
                to="/jobs"
                className="text-xs font-medium text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              {jobs.filter(
                (job) =>
                  String(job.clientId?._id || job.clientId) ===
                  String(user.id)
              ).length === 0 ? (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center shadow-lg">
                  <p className="text-slate-300 mb-2 text-sm">
                    You have not posted any jobs yet.
                  </p>
                  <Link
                    to="/post-job"
                    className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
                  >
                    Post your first job
                  </Link>
                </div>
              ) : (
                jobs
                  .filter(
                    (job) =>
                      String(job.clientId?._id || job.clientId) ===
                      String(user.id)
                  )
                  .map((job) => (
                    <div
                      key={job._id}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-blue-500/50 hover:shadow-blue-500/20 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base md:text-lg font-semibold text-slate-50 mb-1.5">
                            {job.title}
                          </h3>
                          <p className="text-xs md:text-sm text-slate-300 mb-3 line-clamp-2">
                            {job.description}
                          </p>
                          <div className="flex flex-wrap gap-3 text-[11px] md:text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <span className="font-medium text-slate-300">
                                Budget:
                              </span>
                              <span>
                                ${job.budget?.min} - ${job.budget?.max}
                              </span>
                            </span>
                            {job.deadline && (
                              <span className="flex items-center gap-1">
                                <span className="font-medium text-slate-300">
                                  Deadline:
                                </span>
                                <span>
                                  {new Date(
                                    job.deadline
                                  ).toLocaleDateString()}
                                </span>
                              </span>
                            )}
                            {job.category && (
                              <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-200 border border-blue-500/40 text-[11px]">
                                {job.category}
                              </span>
                            )}
                            {job.status && (
                              <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700 text-[11px]">
                                {job.status}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-xs md:text-sm font-semibold text-white hover:bg-blue-500 transition-colors whitespace-nowrap"
                          >
                            View details
                          </Link>
                          <button
                            onClick={() => deleteJob(job._id)}
                            className="px-3 py-2 rounded-lg bg-red-600 text-[11px] md:text-xs font-semibold text-white hover:bg-red-500 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
