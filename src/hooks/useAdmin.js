import { create } from "zustand"

export const useAdminStore = create((set, get) => ({
  pendingApprovals: [],
  stats: { totalUsers: 0, pendingApprovals: 0, openDisputes: 0 },
  isLoading: false,
  error: null,

  fetchPendingApprovals: async (token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("https://freelance-hub-backend.vercel.app/api/admin/approvals", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      set({ pendingApprovals: data.approvals, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchStats: async (token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("https://freelance-hub-backend.vercel.app/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      set({ stats: data.stats, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  approveFreelancer: async (userId, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://freelance-hub-backend.vercel.app/api/admin/approve/${userId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      set((state) => ({
        pendingApprovals: state.pendingApprovals.filter((u) => u._id !== userId),
        isLoading: false,
      }))
      return data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  rejectFreelancer: async (userId, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://freelance-hub-backend.vercel.app/api/admin/reject/${userId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      set((state) => ({
        pendingApprovals: state.pendingApprovals.filter((u) => u._id !== userId),
        isLoading: false,
      }))
      return data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },
}))