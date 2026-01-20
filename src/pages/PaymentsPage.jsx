import { useState, useEffect } from "react"
import { useAuthStore } from "../hooks/useAuth"
import { Link } from "react-router-dom"
import {
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Eye,
} from "lucide-react"

export default function PaymentsPage() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState([])
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalSpent: 0,
    pending: 0,
    completed: 0,
  })

  useEffect(() => {
    fetchPayments()
    // eslint-disable-next-line
  }, [])

  function safeDisplay(val, fallback = "Not specified") {
    if (Array.isArray(val)) return val.filter(v => typeof v === "string").join(", ") || fallback
    if (typeof val === "string" || typeof val === "number") return val
    return fallback
  }

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Failed to fetch payments")
      }

      const data = await res.json()
      const list = data.payments || []
      setPayments(list)

      const totalEarnings =
        list
          ?.filter(p => p.status === "released" && p.freelancer_id === user?._id)
          .reduce((sum, p) => sum + (p.freelancerAmount || 0), 0) || 0

      const totalSpent =
        list
          ?.filter(p => p.status === "released" && p.client_id === user?._id)
          .reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      const pending = list?.filter(p => p.status === "held").length || 0
      const completed = list?.filter(p => p.status === "released").length || 0

      setStats({ totalEarnings, totalSpent, pending, completed })
      setError(null)
    } catch (err) {
      console.error("Error fetching payments:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "released":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case "held":
        return <Clock className="w-4 h-4 text-amber-400" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-sky-400" />
      case "refunded":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "released":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40"
      case "held":
        return "bg-amber-500/10 text-amber-300 border-amber-500/40"
      case "pending":
        return "bg-sky-500/10 text-sky-300 border-sky-500/40"
      case "refunded":
        return "bg-red-500/10 text-red-300 border-red-500/40"
      default:
        return "bg-slate-800/70 text-slate-200 border-slate-700"
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      released: "Completed",
      held: "In escrow",
      pending: "Pending",
      refunded: "Refunded",
    }
    return labels[status] || status
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-3" />
          <p className="text-sm text-slate-300">Loading payments...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <p className="text-sm text-red-300 mb-3">
            Please log in to view payments.
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

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Payments & escrow
            </p>
            <h1 className="mt-1 text-3xl md:text-4xl font-semibold text-slate-50">
              Payments
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              View your earnings, spending, and escrow activity.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-slate-300 shadow-sm">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span>{user?.email}</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/40">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-1">
              {user.role === "freelancer" ? "Total earnings" : "Total spent"}
            </p>
            <p className="text-2xl font-semibold text-slate-50">
              $
              {(user.role === "freelancer"
                ? stats.totalEarnings
                : stats.totalSpent
              ).toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/40">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-1">In escrow</p>
            <p className="text-2xl font-semibold text-slate-50">{stats.pending}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/40">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-1">Completed</p>
            <p className="text-2xl font-semibold text-slate-50">
              {stats.completed}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/40">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-1">Total transactions</p>
            <p className="text-2xl font-semibold text-slate-50">
              {payments.length}
            </p>
          </div>
        </div>

        {/* History */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl shadow-black/40 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
            <h2 className="text-sm font-semibold text-slate-100">
              Payment history
            </h2>
            <span className="text-[11px] text-slate-500">
              {payments.length} record{payments.length !== 1 ? "s" : ""}
            </span>
          </div>

          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-200">
                <thead className="bg-slate-900 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-slate-400 uppercase tracking-wide">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-400 uppercase tracking-wide">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-400 uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-400 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-400 uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-400 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-slate-900/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(payment.status)}
                          <div>
                            <p className="text-xs font-semibold text-slate-50">
                              {safeDisplay(
                                payment.transactionId,
                                `PAY-${payment._id?.slice(-6)?.toUpperCase()}`
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {safeDisplay(payment.method)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/jobs/${
                            typeof payment.job_id === "object"
                              ? payment.job_id?._id || ""
                              : safeDisplay(payment.job_id)
                          }`}
                          className="text-xs text-blue-300 hover:text-blue-200 hover:underline"
                        >
                          {safeDisplay(payment.job_id?.title, "View job")}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-xs font-semibold text-slate-50">
                            ${safeDisplay(payment.amount, "N/A")}
                          </p>
                          {payment.platformFee > 0 && (
                            <p className="text-[11px] text-slate-400">
                              Fee: $
                              {safeDisplay(
                                payment.platformFee.toFixed(2),
                                "0.00"
                              )}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold border " +
                            getStatusStyle(payment.status)
                          }
                        >
                          {getStatusLabel(payment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-[11px] text-slate-300">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          {payment.createdAt
                            ? new Date(payment.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-300 hover:text-blue-200">
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <CreditCard className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-50 mb-1">
                No payments yet
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Your payment history will appear here once transactions are
                processed.
              </p>
              {user.role === "client" && (
                <Link
                  to="/jobs"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition"
                >
                  Browse jobs
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="mt-8 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-6 py-5 text-xs text-blue-100 shadow-lg shadow-blue-500/20">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-blue-50 mb-1">
                Payment information
              </h3>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-200" />
                  <span>
                    All payments are processed securely through our escrow
                    system.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-200" />
                  <span>
                    Funds are held in escrow until the client approves the
                    delivered work.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-200" />
                  <span>
                    Completed payouts typically settle within 2–3 business days.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-200" />
                  <span>Platform fee: 10% on all transactions.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
