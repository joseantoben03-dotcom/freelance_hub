import { useState, useEffect } from "react"
import { useAuthStore } from "../hooks/useAuth"

export default function AdminDashboard() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState("freelancers") // "freelancers", "clients", "disputes"
  const [users, setUsers] = useState([])
  const [disputes, setDisputes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Only fetch if admin
    if (user?.role !== "admin") {
      setIsLoading(false); return;
    }
    // Fetch all users
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
    // Optionally fetch disputes
    const fetchDisputes = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/disputes", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        setDisputes(data.disputes || []);
      } catch {}
    }
    fetchDisputes();
  }, [user])

  if (user?.role !== "admin")
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">Only administrators can access this page.</p>
      </div>
    );

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

  const freelancers = users.filter(u => u.role === "freelancer")
  const clients = users.filter(u => u.role === "client")
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold ${tab === "freelancers" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => setTab("freelancers")}
        >
          Freelancers
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold ${tab === "clients" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => setTab("clients")}
        >
          Clients
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg font-semibold ${tab === "disputes" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"}`}
          onClick={() => setTab("disputes")}
        >
          Disputes
        </button>
      </div>

      {/* Tab Content */}
      {tab === "freelancers" && (
        <div>
          <h2 className="text-xl font-bold mb-4">All Freelancers</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Skills</th>
                  <th className="p-2 text-left">Hourly Rate</th>
                </tr>
              </thead>
              <tbody>
                {freelancers.map(f => (
                  <tr key={f._id}>
                    <td className="p-2">{f.firstName} {f.lastName}</td>
                    <td className="p-2">{f.email}</td>
                    <td className="p-2">{Array.isArray(f.skills) ? f.skills.join(", ") : ""}</td>
                    <td className="p-2">${f.hourlyRate || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "clients" && (
        <div>
          <h2 className="text-xl font-bold mb-4">All Clients</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c._id}>
                    <td className="p-2">{c.firstName} {c.lastName}</td>
                    <td className="p-2">{c.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "disputes" && (
        <div>
          <h2 className="text-xl font-bold mb-4">All Disputes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded">
              <thead>
                <tr>
                  <th className="p-2 text-left">Dispute ID</th>
                  <th className="p-2 text-left">Job</th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {disputes.length === 0 && user
                  ? <tr><td colSpan={4} className="p-2 text-center">No disputes found.</td></tr>
                  : disputes.map(d => (
                    <tr key={d._id}>
                      <td className="p-2">{d._id}</td>
                      <td className="p-2">{typeof d.job === "object" ? d.job.title : d.job}</td>
                      <td className="p-2">{typeof d.raisedBy === "object"
                          ? d.raisedBy.firstName + " " + d.raisedBy.lastName
                          : d.raisedBy}</td>
                      <td className="p-2">{d.status}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
