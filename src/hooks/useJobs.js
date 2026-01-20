import { create } from "zustand"

const API_BASE = "https://freelance-hub-backend.vercel.app"

export const useJobsStore = create((set, get) => ({
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,

  // Fetch all jobs
  fetchJobs: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/api/jobs`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to fetch jobs")
      set({ jobs: data.jobs, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  // Fetch a single job by ID
  fetchJobById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/api/jobs/${id}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to fetch job")
      // adjust if backend returns { job } instead of full object
      set({ currentJob: data.job ?? data, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
    }
  },

  // Create a new job
  createJob: async (jobData, token) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to create job")
      set((state) => ({
        jobs: [...state.jobs, data.job],
        isLoading: false,
      }))
      return data.job
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },
}))
