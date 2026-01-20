import { create } from "zustand"

export const usePaymentsStore = create((set, get) => ({
  payments: [],
  currentPayment: null,
  isLoading: false,
  error: null,

  fetchPayments: async (token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("https://freelance-hub-backend.vercel.app/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      set({ payments: data.payments, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  fetchPaymentById: async (paymentId, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://freelance-hub-backend.vercel.app/api/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      set({ currentPayment: data.payment, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  createPayment: async (paymentData, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("https://freelance-hub-backend.vercel.app/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      set((state) => ({ payments: [...state.payments, data.payment], isLoading: false }))
      return data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  releasePayment: async (paymentId, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://freelance-hub-backend.vercel.app/api/payments/${paymentId}/release`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      set((state) => ({
        payments: state.payments.map((p) => (p._id === paymentId ? data.payment : p)),
        isLoading: false,
      }))
      return data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  refundPayment: async (paymentId, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`https://freelance-hub-backend.vercel.app/api/payments/${paymentId}/refund`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      set((state) => ({
        payments: state.payments.map((p) => (p._id === paymentId ? data.payment : p)),
        isLoading: false,
      }))
      return data
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },
}))