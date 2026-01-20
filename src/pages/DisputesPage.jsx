// src/pages/DisputesPage.jsx
import { useState, useEffect } from "react"
import { useAuthStore } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

export default function DisputesPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const [showForm, setShowForm] = useState(false)
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [jobs, setJobs] = useState([])

  const [formData, setFormData] = useState({
    job_id: "",
    reason: "",
    description: "",
  })

  const reasonOptions = [
    "Non-payment",
    "Incomplete work",
    "Quality issues",
    "Communication problems",
    "Scope disagreement",
    "Other",
  ]

  // Fetch user's jobs for dropdown
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const endpoint =
          user?.role === "client"
            ? "https://freelance-hub-backend.vercel.app/api/jobs/my-jobs"
            : "https://freelance-hub-backend.vercel.app/api/jobs/my-projects"

        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        if (!res.ok) return

        const data = await res.json()
        setJobs(data.jobs || [])
      } catch (err) {
        console.error("Error fetching jobs:", err)
      }
    }

    if (user) fetchJobs()
  }, [user])

  // Fetch disputes
  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await fetch("https://freelance-hub-backend.vercel.app/api/disputes", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        if (!res.ok) throw new Error("Failed to fetch disputes")

        const data = await res.json()
        setDisputes(data.disputes || [])
      } catch (err) {
        console.error("Error fetching disputes:", err)
        setError("Failed to load disputes")
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchDisputes()
  }, [user])

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmitDispute = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch("https://freelance-hub-backend.vercel.app/api/disputes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to submit dispute")
      }

      const data = await res.json()
      setDisputes((prev) => [data.dispute, ...prev])
      setFormData({ job_id: "", reason: "", description: "" })
      setShowForm(false)
      alert("Dispute submitted successfully! An admin will review it soon.")
    } catch (err) {
      setError(err.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "in_review":
        return "bg-blue-100 text-blue-800"
      case "open":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Please log in to view disputes.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent" />
          <p className="mt-4 text-gray-600">Loading disputes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disputes</h1>
          <p className="text-gray-600 mt-1">Manage your dispute cases</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {showForm ? "Cancel" : "+ New Dispute"}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm mt-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* New Dispute Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Submit New Dispute</h2>
          <form onSubmit={handleSubmitDispute}>
            <div className="space-y-4">
              {/* Job Selection */}
              <div>
                <label
                  htmlFor="job_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Job *
                </label>
                <select
                  id="job_id"
                  name="job_id"
                  value={formData.job_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a job...</option>
                  {jobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.title} - {job.status}
                    </option>
                  ))}
                </select>
                {jobs.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    No jobs available for dispute.
                  </p>
                )}
              </div>

              {/* Reason Selection */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reason for Dispute *
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a reason...</option>
                  {reasonOptions.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Provide detailed information about the dispute..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Be as detailed as possible. This will help admins resolve the
                  dispute faster.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Submit Dispute
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Disputes List */}
      <div className="space-y-4">
        {disputes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 mt-4">No disputes found.</p>
            <p className="text-gray-500 text-sm mt-2">
              You have not submitted any disputes yet.
            </p>
          </div>
        ) : (
          disputes.map((dispute) => (
            <div
              key={dispute._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {dispute.reason}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Job: {dispute.job_id?.title || "N/A"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    dispute.status
                  )}`}
                >
                  {dispute.status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {dispute.description}
              </p>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>
                    Submitted:{" "}
                    {new Date(dispute.createdAt).toLocaleDateString()}
                  </span>
                  {dispute.resolvedAt && (
                    <span>
                      Resolved:{" "}
                      {new Date(dispute.resolvedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/disputes/${dispute._id}`)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details →
                </button>
              </div>

              {dispute.status === "resolved" && dispute.resolution && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-1">
                    Admin Resolution:
                  </p>
                  <p className="text-sm text-green-800">
                    {dispute.resolution}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
