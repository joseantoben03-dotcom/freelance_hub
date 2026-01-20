import { Link } from "react-router-dom"
import { useAuthStore } from "../hooks/useAuth"
import {
  Briefcase,
  Users,
  Star,
  Shield,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight
} from "lucide-react"

export default function HomePage() {
  const { user } = useAuthStore()

  const features = [
    { icon: <Shield className="w-8 h-8" />, title: "Secure Payments", description: "Escrow system protects both parties until project completion" },
    { icon: <Users className="w-8 h-8" />, title: "Verified Profiles", description: "Admin-approved freelancers with verified skills" },
    { icon: <Star className="w-8 h-8" />, title: "Rating System", description: "Transparent ratings help you make informed decisions" },
    { icon: <Award className="w-8 h-8" />, title: "Quality Work", description: "Connect with top-rated professionals worldwide" }
  ]

  const stats = [
    { label: "Active Jobs", value: "10K+", icon: <Briefcase className="w-6 h-6" /> },
    { label: "Freelancers", value: "50K+", icon: <Users className="w-6 h-6" /> },
    { label: "Projects Done", value: "100K+", icon: <TrendingUp className="w-6 h-6" /> },
    { label: "Avg Rating", value: "4.9/5", icon: <Star className="w-6 h-6" /> }
  ]

  const categories = [
    "Web Development",
    "Mobile Apps",
    "Design",
    "Writing",
    "Marketing",
    "Data Science",
    "Video Editing",
    "Consulting"
  ]

  const howItWorks = [
    { step: "1", title: "Post Your Job", description: "Describe your project and budget", color: "from-blue-500 to-indigo-500" },
    { step: "2", title: "Review Proposals", description: "Get bids from qualified freelancers", color: "from-emerald-500 to-teal-500" },
    { step: "3", title: "Work & Pay", description: "Collaborate and release payment upon completion", color: "from-purple-500 to-pink-500" }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-32 h-80 w-80 bg-blue-500/30 blur-3xl rounded-full" />
          <div className="absolute -bottom-40 -right-24 h-96 w-96 bg-purple-500/30 blur-3xl rounded-full" />
        </div>

        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20 pt-24">
          <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 lg:flex-row lg:items-center">
            {/* Left: text */}
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-200 shadow-sm mb-6">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Built for clients & freelancers</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-4">
                Find the{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  perfect freelancer
                </span>{" "}
                for your next project.
              </h1>

              <p className="mt-3 text-lg md:text-xl text-slate-300/90 max-w-xl mx-auto lg:mx-0">
                Post jobs, receive proposals, and pay securely with an escrow that protects both sides.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-start sm:items-center">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/jobs"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-50/90 hover:border-slate-300 hover:bg-slate-800/80 transition"
                    >
                      Browse Jobs
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600/80 bg-slate-900/60 px-7 py-3 text-base font-semibold text-slate-50/90 hover:border-slate-300 hover:bg-slate-800/80 transition"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Secure escrow payments</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Verified freelancers</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>

            {/* Right: glass card with stats & categories */}
            <div className="flex-1">
              <div className="mx-auto max-w-md rounded-3xl border border-slate-700/60 bg-slate-900/60 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Trusted network
                      </p>
                      <p className="text-sm font-semibold text-slate-50">
                        50,000+ professionals
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/40">
                    4.9 / 5 rating
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 text-left hover:border-emerald-400/60 transition"
                    >
                      <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                        <span className="rounded-md bg-slate-800/80 p-1 text-emerald-300">
                          {stat.icon}
                        </span>
                        <span>{stat.label}</span>
                      </div>
                      <div className="text-xl font-semibold text-slate-50">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Popular categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 6).map((category, idx) => (
                      <Link
                        key={idx}
                        to={`/jobs?category=${category}`}
                        className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs text-slate-200 hover:border-emerald-400/70 hover:text-emerald-200 transition"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-950 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Platform features
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-50">
              Everything you need to collaborate with confidence.
            </h2>
            <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
              Designed for both clients and freelancers, with security and clarity at the core.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/30 hover:-translate-y-1 hover:border-emerald-400/70 transition-all"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300 group-hover:bg-emerald-500/20">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-50 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-950 py-16 border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Simple process
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-50">
              How FreelanceHub works.
            </h2>
            <p className="mt-3 text-slate-400">
              Get from idea to completed project in three clear steps.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((item, idx) => (
              <div key={idx} className="relative">
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-slate-950 text-2xl font-bold shadow-xl`}
                >
                  {item.step}
                </div>
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center shadow-lg">
                  <h3 className="text-lg font-semibold text-slate-50 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-800 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-slate-950">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Ready to start your next project?
          </h2>
          <p className="text-base md:text-lg text-slate-900/80 mb-8">
            Join a trusted network of clients and freelancers working together every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 py-3 text-sm md:text-base font-semibold text-slate-50 shadow-lg hover:bg-slate-900 transition"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-900/50 bg-white/60 px-7 py-3 text-sm md:text-base font-semibold text-slate-900 hover:bg-white transition"
                >
                  Browse Jobs
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 py-3 text-sm md:text-base font-semibold text-slate-50 shadow-lg hover:bg-slate-900 transition"
                >
                  Join as Freelancer
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-900/50 bg-white/60 px-7 py-3 text-sm md:text-base font-semibold text-slate-900 hover:bg-white transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-6 text-xs text-slate-900/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>No long-term contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Only pay for completed work</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Dedicated support team</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
