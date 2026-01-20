import { create } from "zustand"

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("https://freelance-hub-backend.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Login failed")

      set({ user: data.user, token: data.token, isLoading: false })
      localStorage.setItem("token", data.token)
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  register: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("https://freelance-hub-backend.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Registration failed")

      set({ user: data.user, token: data.token, isLoading: false })
      localStorage.setItem("token", data.token)
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // 🔹 NEW: checkAuth for existing token
  checkAuth: async (token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch("https://freelance-hub-backend.vercel.app/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Auth check failed")

      set({ user: data.user, token, isLoading: false })
      return data.user
    } catch (error) {
      set({ user: null, token: null, error: error.message, isLoading: false })
      localStorage.removeItem("token")
      throw error
    }
  },

  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem("token")
  },

  setUser: (userData) => set({ user: userData }),
}))
