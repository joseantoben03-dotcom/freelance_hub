import { create } from "zustand"

export const useBidsStore = create((set, get) => ({
  bids: [],
  isLoading: false,
  error: null,

  fetchBids: async (jobId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://freelance-hub-backend.vercel.app/api/bids/job/${jobId}`)
      // Defensive: check for HTML instead of JSON
      let data
      try {
        data = await response.json()
      } catch (e) {
        const text = await response.text()
        throw new Error("Server error: " + text.slice(0, 100))
      }
      if (!response.ok) throw new Error(data.error)
      set({ bids: data.bids, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  submitBid: async (bidData, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("https://freelance-hub-backend.vercel.app/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bidData),
      })
      let data
      try {
        data = await response.json()
      } catch (e) {
        const text = await response.text()
        throw new Error("Server error: " + text.slice(0, 100))
      }
      if (!response.ok) throw new Error(data.error)
      set((state) => ({ bids: [...state.bids, data.bid], isLoading: false }))
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  // Corrected: use /approve route!
  approveBid: async (bidId, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://freelance-hub-backend.vercel.app/api/bids/${bidId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      let data
      try {
        data = await response.json()
      } catch (e) {
        const text = await response.text()
        throw new Error("Server error: " + text.slice(0, 100))
      }
      if (!response.ok) throw new Error(data.error)
      set((state) => ({
        bids: state.bids.map((b) => (b._id === bidId ? data.bid : b)),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  // Payment for bid (added for completeness)
  payBid: async (bidId, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://freelance-hub-backend.vercel.app/api/bids/${bidId}/pay`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      let data
      try {
        data = await response.json()
      } catch (e) {
        const text = await response.text()
        throw new Error("Server error: " + text.slice(0, 100))
      }
      if (!response.ok) throw new Error(data.error)
      set((state) => ({
        bids: state.bids.map((b) => (b._id === bidId ? data.bid : b)),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },
}))
