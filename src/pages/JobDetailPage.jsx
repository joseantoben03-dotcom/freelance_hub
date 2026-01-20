import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuthStore } from "../hooks/useAuth"

export default function JobDetailPage() {
  const { id } = useParams()
  const { user } = useAuthStore()
  const [job, setJob] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [bids, setBids] = useState([])
  const [bidLoading, setBidLoading] = useState(false)
  const [bidListError, setBidListError] = useState("")
  const [actionMsg, setActionMsg] = useState("")
  const [bidAmount, setBidAmount] = useState("")
  const [bidCoverLetter, setBidCoverLetter] = useState("")
  const [bidError, setBidError] = useState("")
  const [bidSuccess, setBidSuccess] = useState(false)

  function safeDisplay(val, fallback = "Not specified") {
    if (Array.isArray(val)) return val.filter(v => typeof v === "string").join(", ") || fallback
    if (typeof val === "string" || typeof val === "number") return val
    return fallback
  }

  useEffect(() => {
    setIsLoading(true)
    fetch(`https://freelance-hub-backend.vercel.app/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setJob(data)
        setIsLoading(false)
      })
      .catch(() => {
        setError("Failed to load job.")
        setIsLoading(false)
      })
  }, [id])

  const fetchBids = () => {
    setBidLoading(true)
    fetch(`https://freelance-hub-backend.vercel.app/api/bids/job/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBids(Array.isArray(data) ? data : data.bids || [])
        setBidLoading(false)
      })
      .catch(() => {
        setBidListError("Failed to load bids.")
        setBidLoading(false)
      })
  }

  useEffect(() => {
    if (job && user) fetchBids()
    // eslint-disable-next-line
  }, [job, user])

  const approveBid = async (bidId) => {
    setActionMsg("")
    try {
      const res = await fetch(`https://freelance-hub-backend.vercel.app/api/bids/${bidId}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to approve")
      setActionMsg("Bid approved!")
      fetchBids()
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  const payBid = async (bidId) => {
    setActionMsg("")
    try {
      const res = await fetch(`https://freelance-hub-backend.vercel.app/api/bids/${bidId}/pay`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to pay for bid")
      setActionMsg("Bid paid successfully!")
      fetchBids()
    } catch (err) {
      setActionMsg(err.message)
    }
  }

  const handlePlaceBid = async (e) => {
    e.preventDefault()
    setBidError("")
    setBidSuccess(false)
    try {
      const res = await fetch(`https://freelance-hub-backend.vercel.app/api/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          jobId: job._id,
          amount: bidAmount,
          coverLetter: bidCoverLetter,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to submit bid")
      setBidAmount("")
      setBidCoverLetter("")
      setBidSuccess(true)
      fetchBids()
    } catch (err) {
      setBidError(err.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-3" />
          <p className="text-slate-300 text-sm">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-950">
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-4 shadow-xl">
          <p className="text-red-100 text-sm font-semibold">
            {error || "Job not found"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-400 mb-2">
            Job details
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-50 mb-3">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            {job.category && (
              <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-200 border border-blue-500/40 px-3 py-1">
                {job.category}
              </span>
            )}
            <span>
              Posted on{" "}
              {job.createdAt
                ? new Date(job.createdAt).toLocaleDateString()
                : "Unknown"}
            </span>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[2fr,1.3fr] items-start">
          {/* Left column */}
          <div className="space-y-6">
            {/* Overview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-slate-50 mb-3">
                Overview
              </h2>
              <p className="text-sm md:text-[15px] text-slate-200 leading-relaxed mb-5">
                {job.description}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 text-xs md:text-sm">
                <div className="space-y-1">
                  <p className="text-slate-400">Budget</p>
                  <p className="font-semibold text-slate-50">
                    {job.budget
                      ? `$${job.budget.min} - $${job.budget.max}`
                      : "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">Deadline</p>
                  <p className="font-semibold text-slate-50">
                    {job.deadline
                      ? new Date(job.deadline).toLocaleDateString()
                      : "No deadline"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">Skills required</p>
                  <p className="font-semibold text-slate-50">
                    {safeDisplay(job.skillsRequired)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">Status</p>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300 border border-emerald-500/40">
                    {job.status || "Open"}
                  </span>
                </div>
              </div>
            </div>

            {/* Client: bids list */}
            {user &&
              user.role === "client" &&
              String(job.clientId?._id || job.clientId) === String(user.id) && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-50">
                      Bids for this job
                    </h2>
                    <span className="text-[11px] text-slate-400">
                      {bids.length} {bids.length === 1 ? "bid" : "bids"}
                    </span>
                  </div>

                  {actionMsg && (
                    <div
                      className={`mb-4 rounded-lg px-4 py-2 text-xs ${
                        actionMsg.toLowerCase().includes("success") ||
                        actionMsg.toLowerCase().includes("approved")
                          ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/40"
                          : "bg-red-500/10 text-red-200 border border-red-500/40"
                      }`}
                    >
                      {actionMsg}
                    </div>
                  )}

                  {bidLoading ? (
                    <div className="py-6 text-center text-slate-400 text-sm">
                      Loading bids...
                    </div>
                  ) : bids.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 py-7 text-center">
                      <p className="text-slate-400 text-sm">
                        No bids received yet. Freelancers will appear here once
                        they apply.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bids.map((bid) => {
                        const freelancer = bid.freelancerId
                        return (
                          <div
                            key={bid._id}
                            className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg shadow-black/40 hover:border-blue-500/50 transition"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
                              <div>
                                <div className="text-sm font-semibold text-slate-50">
                                  {freelancer?.firstName} {freelancer?.lastName}{" "}
                                  <span className="text-[11px] text-slate-400">
                                    ({freelancer?.email})
                                  </span>
                                </div>
                                <div className="mt-1 text-2xl font-bold text-emerald-400">
                                  ${safeDisplay(bid.amount, "N/A")}
                                </div>
                                <div className="mt-3 text-sm text-slate-200">
                                  <span className="font-semibold">
                                    Cover letter:
                                  </span>{" "}
                                  {safeDisplay(bid.coverLetter)}
                                </div>
                                <div className="mt-3 flex items-center flex-wrap gap-2">
                                  <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                                      bid.status === "approved"
                                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                                        : bid.status === "rejected"
                                        ? "bg-red-500/10 text-red-300 border border-red-500/40"
                                        : "bg-amber-500/10 text-amber-300 border border-amber-500/40"
                                    }`}
                                  >
                                    {typeof bid.status === "string"
                                      ? bid.status.charAt(0).toUpperCase() +
                                        bid.status.slice(1)
                                      : ""}
                                  </span>
                                  {bid.paymentStatus && (
                                    <span className="text-[11px] text-slate-400">
                                      •{" "}
                                      {bid.paymentStatus === "paid"
                                        ? "Paid"
                                        : "Unpaid"}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-stretch gap-2 min-w-[180px]">
                                {bid.status === "pending" && (
                                  <button
                                    onClick={() => approveBid(bid._id)}
                                    className="inline-flex justify-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition"
                                  >
                                    Accept bid
                                  </button>
                                )}
                                {bid.status === "approved" &&
                                  bid.paymentStatus === "unpaid" && (
                                    <button
                                      onClick={() => payBid(bid._id)}
                                      className="inline-flex justify-center rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition"
                                    >
                                      Pay bid
                                    </button>
                                  )}
                                {bid.status === "approved" &&
                                  bid.paymentStatus === "paid" && (
                                    <div className="inline-flex justify-center rounded-lg bg-purple-500/10 px-4 py-2 text-[11px] font-semibold text-purple-200 border border-purple-500/40">
                                      Paid
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {bidListError && (
                    <div className="mt-3 rounded-lg bg-red-500/10 px-4 py-2 text-xs text-red-200 border border-red-500/40">
                      {bidListError}
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Right column: freelancer bid form */}
          {user && user.role === "freelancer" && (
            <aside className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sticky top-24 h-fit">
              <h3 className="text-lg font-semibold text-slate-50 mb-2">
                Place a bid
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">
                Stand out with a clear price and a concise, professional message.
              </p>
              <form onSubmit={handlePlaceBid} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Bid amount (USD)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="e.g. 250"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Cover letter
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Explain why you're a good fit for this project..."
                    value={bidCoverLetter}
                    onChange={(e) => setBidCoverLetter(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 outline-none resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:-translate-y-0.5 transition"
                >
                  Submit bid
                </button>
                {bidError && (
                  <div className="rounded-lg bg-red-500/10 px-3 py-2 text-[11px] text-red-200 border border-red-500/40">
                    {bidError}
                  </div>
                )}
                {bidSuccess && (
                  <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-200 border border-emerald-500/40">
                    Bid submitted successfully!
                  </div>
                )}
              </form>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
