// src/pages/PostJobPage.jsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../hooks/useAuth"
import { 
  Briefcase, 
  FileText, 
  DollarSign, 
  Calendar, 
  Tag, 
  Plus,
  X,
  ArrowLeft
} from "lucide-react"

export default function PostJobPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: {
      min: "",
      max: ""
    },
    duration: "",
    skillsRequired: [],
    deadline: ""
  })
  
  const [skillInput, setSkillInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const categories = [
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

  const durations = [
    "Less than 1 week",
    "1-2 weeks",
    "2-4 weeks",
    "1-3 months",
    "3-6 months",
    "6+ months"
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (parseFloat(formData.budget.min) > parseFloat(formData.budget.max)) {
      setError("Minimum budget cannot be greater than maximum budget")
      setLoading(false)
      return
    }

    if (formData.skillsRequired.length === 0) {
      setError("Please add at least one required skill")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: {
            min: parseFloat(formData.budget.min),
            max: parseFloat(formData.budget.max),
          },
          duration: formData.duration,
          skillsRequired: formData.skillsRequired,
          deadline: formData.deadline,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to post job")
      }

      const data = await res.json()
      alert("Job posted successfully!")
      navigate(`/jobs/${data.job._id}`)
    } catch (err) {
      console.error("Error posting job:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === "budgetMin" || name === "budgetMax") {
      setFormData({
        ...formData,
        budget: {
          ...formData.budget,
          [name === "budgetMin" ? "min" : "max"]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, skillInput.trim()],
      })
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(skill => skill !== skillToRemove),
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-300 mb-2">
            Please log in
          </h1>
          <p className="text-sm text-slate-400 mb-4">
            You need to be logged in to post a job.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition"
          >
            Go to login
          </Link>
        </div>
      </div>
    )
  }

  if (user.role !== "client") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="max-w-md w-full rounded-2xl border border-red-500/40 bg-slate-900/90 p-8 shadow-2xl shadow-black/50 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <X className="w-7 h-7 text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-red-100 mb-2">
            Access denied
          </h1>
          <p className="text-sm text-slate-300 mb-6">
            Only clients can post jobs. Please register or log in as a client to
            create new job listings.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            >
              Go back
            </button>
            <Link
              to="/dashboard"
              className="px-5 py-2 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/30 mb-3">
            <Briefcase className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-50 mb-1">
            Post a new job
          </h1>
          <p className="text-sm text-slate-400">
            Describe your project clearly to attract the best freelancers.
          </p>
        </div>
        
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-semibold text-slate-200 mb-1.5"
              >
                <FileText className="w-3.5 h-3.5 inline mr-1" />
                Job title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Build a React e-commerce website"
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
              />
            </div>
            
            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-xs font-semibold text-slate-200 mb-1.5"
              >
                <FileText className="w-3.5 h-3.5 inline mr-1" />
                Job description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project, deliverables, and expectations..."
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none resize-y"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                Be as detailed as possible to attract qualified freelancers.
              </p>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-xs font-semibold text-slate-200 mb-1.5"
              >
                <Tag className="w-3.5 h-3.5 inline mr-1" />
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="budgetMin"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                  Minimum budget (USD) *
                </label>
                <input
                  type="number"
                  id="budgetMin"
                  name="budgetMin"
                  required
                  min="0"
                  step="0.01"
                  value={formData.budget.min}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                />
              </div>
              
              <div>
                <label
                  htmlFor="budgetMax"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                  Maximum budget (USD) *
                </label>
                <input
                  type="number"
                  id="budgetMax"
                  name="budgetMax"
                  required
                  min="0"
                  step="0.01"
                  value={formData.budget.max}
                  onChange={handleChange}
                  placeholder="2000"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                />
              </div>
            </div>

            {/* Duration & deadline */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="duration"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  Project duration *
                </label>
                <select
                  id="duration"
                  name="duration"
                  required
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                >
                  <option value="">Select duration</option>
                  {durations.map((dur) => (
                    <option key={dur} value={dur} className="bg-slate-900">
                      {dur}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="deadline"
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  Deadline (optional)
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label
                htmlFor="skills"
                className="block text-xs font-semibold text-slate-200 mb-1.5"
              >
                Required skills *
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  id="skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., React, Node.js, MongoDB"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              
              {formData.skillsRequired.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.skillsRequired.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-[11px] font-medium text-blue-200 border border-blue-500/40"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="rounded-full p-0.5 hover:bg-blue-500/20"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-1 text-[11px] text-slate-500">
                Press Enter or click Add to save each skill.
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-lg bg-slate-800 px-6 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Posting..." : "Post job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
