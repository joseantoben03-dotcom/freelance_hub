// src/pages/JobsPage.jsx
import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useAuthStore } from "../hooks/useAuth"
import { 
  Search, 
  Filter, 
  Briefcase, 
  DollarSign, 
  Calendar,
  Eye,
  Clock
} from "lucide-react"

export default function JobsPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "")
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    "All Categories",
    "Web Development",
    "Mobile Apps",
    "Design",
    "Writing",
    "Marketing",
    "Data Science",
    "Video Editing",
    "Consulting",
    "Other"
  ]

  useEffect(() => {
    fetchJobs()
  }, [selectedCategory, searchTerm])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (selectedCategory && selectedCategory !== "All Categories") {
        params.append("category", selectedCategory)
      }
      if (searchTerm) {
        params.append("search", searchTerm)
      }
      params.append("status", "open")

      const res = await fetch(`http://localhost:5000/api/jobs?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch jobs")
      
      const data = await res.json()
      setJobs(data.jobs || [])
      setError(null)
    } catch (err) {
      console.error("Error fetching jobs:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs()
  }

  const StatusBadge = ({ status }) => {
    const styles = {
      open: "bg-emerald-50 text-emerald-700 border-emerald-200",
      in_progress: "bg-blue-50 text-blue-700 border-blue-200",
      completed: "bg-purple-50 text-purple-700 border-purple-200",
    }
    
    const labels = {
      open: "Open",
      in_progress: "In progress",
      completed: "Completed",
    }

    if (!status) return null

    return (
      <span
        className={
          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border " +
          (styles[status] || "bg-slate-100 text-slate-700 border-slate-200")
        }
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {labels[status] || status}
      </span>
    )
  }

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4" />
          <p className="text-sm font-medium text-slate-300">Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-1">
                Find work
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-slate-50 mb-1">
                Browse jobs
              </h1>
              <p className="text-sm text-slate-400">
                {jobs.length > 0
                  ? `Showing ${jobs.length} open job${jobs.length !== 1 ? "s" : ""}`
                  : "No open jobs match your current filters"}
              </p>
            </div>
            {user?.role === "client" && (
              <Link
                to="/post-job"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5 transition"
              >
                <Briefcase className="w-4 h-4" />
                Post a job
              </Link>
            )}
          </div>

          {/* Search + Filters */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/40 backdrop-blur-lg p-5">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search jobs by title, description, or skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 pl-9 pr-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                  />
                </div>

                {/* Category */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none min-w-[200px]"
                >
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat === "All Categories" ? "" : cat}
                      className="bg-slate-900 text-slate-50"
                    >
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-100 hover:border-blue-500 hover:bg-slate-900 transition"
                >
                  <Filter className="w-4 h-4" />
                  More filters
                </button>
              </div>

              {showFilters && (
                <div className="pt-3 border-t border-slate-800 text-xs text-slate-500">
                  Additional filters (budget, experience level, location) coming soon.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Jobs grid */}
        {jobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <article
                key={job._id}
                className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/40 backdrop-blur-lg hover:border-blue-400/70 hover:-translate-y-1 hover:shadow-blue-500/20 transition-all"
              >
                {/* Title + badge */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-slate-50 mb-1 line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {job.category && (
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-200 border border-blue-500/30">
                          {job.category}
                        </span>
                      )}
                      <StatusBadge status={job.status || "open"} />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-3 text-xs md:text-sm text-slate-300 line-clamp-3">
                  {job.description}
                </p>

                {/* Budget & meta */}
                <div className="mb-3 flex items-center justify-between gap-2 text-xs md:text-sm text-slate-300">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                      <DollarSign className="w-3 h-3" />
                      Budget
                    </span>
                    <span className="font-semibold text-emerald-300">
                      ${job.budget?.min?.toLocaleString()} - ${job.budget?.max?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {job.deadline && (
                      <div className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(job.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {job.duration && (
                      <div className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{job.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {job.skillsRequired.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-slate-800 px-2 py-1 text-[11px] text-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skillsRequired.length > 3 && (
                        <span className="rounded-full bg-slate-800 px-2 py-1 text-[11px] text-slate-300">
                          +{job.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View details
                  </button>
                  <span className="text-[11px] text-slate-500">
                    Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "recently"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/70 py-14 px-6 text-center shadow-xl shadow-black/40">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              No jobs found
            </h3>
            <p className="text-sm text-slate-400 mb-5">
              {searchTerm || selectedCategory
                ? "Try clearing or adjusting your search filters."
                : "There are no open jobs at the moment. Please check back soon."}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("")
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Small loading indicator when filters change */}
        {loading && jobs.length > 0 && (
          <div className="fixed bottom-4 right-4 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 shadow-xl shadow-black/40 flex items-center gap-2 text-xs text-slate-200">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <span>Updating results…</span>
          </div>
        )}
      </div>
    </div>
  )
}
