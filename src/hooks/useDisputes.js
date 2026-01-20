import { create } from "zustand"

const API_BASE = "https://freelance-hub-backend.vercel.app"

export const useDisputesStore = create((set, get) => ({
  disputes: [],
  currentDispute: null,
  isLoading: false,
  error: null,

  fetchDisputes: async (token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/api/disputes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to fetch disputes")
      set({ disputes: data.disputes, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  createDispute: async (disputeData, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/api/disputes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(disputeData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to create dispute")
      set((state) => ({
        disputes: [...state.disputes, data.dispute],
        isLoading: false,
      }))
      return data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  resolveDispute: async (disputeId, resolution, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(
        `${API_BASE}/api/disputes/${disputeId}/resolve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ resolution }),
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to resolve dispute")
      set((state) => ({
        disputes: state.disputes.map((d) =>
          d._id === disputeId ? data.dispute : d
        ),
        isLoading: false,
      }))
      return data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },
}))
