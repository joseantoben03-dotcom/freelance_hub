import { useState, useEffect } from "react"
import { useAuthStore } from "../hooks/useAuth"
import { Briefcase, DollarSign, Clock, CheckCircle2, XCircle } from "lucide-react"

export default function MyBidsPage() {
  const { user } = useAuthStore()
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyBids = async () => {
      setLoading(true)
      const response = await fetch("http://localhost:5000/api/bids/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      setBids(Array.isArray(data) ? data : data.bids || [])
      setLoading(false)
    }
    fetchMyBids()
  }, [])

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  }

  const paymentStyles = {
    unpaid: "text-amber-500",
    paid: "text-emerald-500",
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-3" />
          <p className="text-sm text-slate-300">Loading your bids...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Bidding activity
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 mt-1">
              My bids
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              You have placed {bids.length} bid{bids.length !== 1 ? "s" : ""} so far.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-slate-300 shadow-sm">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>{user?.email}</span>
          </div>
        </div>

        {/* Empty state */}
        {bids.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-6 py-10 text-center shadow-xl shadow-black/40">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-50 mb-1">
              No bids yet
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Once you start applying to jobs, all of your bids and their status
              will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/40 hover:border-blue-400/60 transition"
              >
                <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-start">
                  {/* Left */}
                  <div className="flex-1">
                    <h3 className="text-base md:text-lg font-semibold text-slate-50 mb-1 line-clamp-2">
                      {bid.jobId?.title || "Untitled job"}
                    </h3>
                    <p className="text-xs text-slate-500 mb-3">
                      {bid.jobId?.category && (
                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-200 border border-blue-500/30 mr-2">
                          {bid.jobId.category}
                        </span>
                      )}
                      Placed on{" "}
                      {bid.createdAt
                        ? new Date(bid.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs md:text-sm text-slate-300 mb-3">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-emerald-300">
                          ${bid.amount}
                        </span>
                      </div>
                      {bid.jobId?.budget && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="text-[11px] uppercase tracking-wide">
                            Job budget:
                          </span>
                          <span className="font-medium text-slate-200">
                            ${bid.jobId.budget.min} - ${bid.jobId.budget.max}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs md:text-sm text-slate-300">
                      <span className="font-semibold text-slate-100">
                        Your cover letter:
                      </span>{" "}
                      <span className="text-slate-300">
                        {bid.coverLetter || "No message provided."}
                      </span>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="mt-3 md:mt-0 flex flex-col items-stretch gap-2 min-w-[160px]">
                    <div
                      className={
                        "inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold " +
                        (statusStyles[bid.status] ||
                          "bg-slate-800 text-slate-200 border-slate-700")
                      }
                    >
                      {bid.status === "approved" && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {bid.status === "rejected" && (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {bid.status
                          ? bid.status.charAt(0).toUpperCase() +
                            bid.status.slice(1)
                          : "Unknown"}
                      </span>
                    </div>

                    <div className="inline-flex items-center justify-center gap-1 rounded-lg bg-slate-800/80 px-3 py-1.5 text-[11px] font-medium text-slate-200">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span
                        className={
                          paymentStyles[bid.paymentStatus] || "text-slate-300"
                        }
                      >
                        {bid.paymentStatus === "paid"
                          ? "Payment received"
                          : bid.paymentStatus === "unpaid"
                          ? "Payment pending"
                          : "Payment status: N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
