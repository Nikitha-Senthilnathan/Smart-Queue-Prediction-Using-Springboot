import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

export const queueAPI = {
  getStats:   (branch) => api.get(`/queue/stats?branch=${branch}`),
  getWaiting: (branch) => api.get(`/queue/waiting?branch=${branch}`),
  getServing: (branch) => api.get(`/queue/serving?branch=${branch}`),

  checkIn: (customerName, serviceType, branchCode, customerPhone, customerEmail) =>
    api.post('/queue/checkin', { customerName, serviceType, branchCode, customerPhone, customerEmail }),

  serveNext:       (branch) => api.post(`/queue/serve-next?branch=${branch}`),
  completeService: (id)     => api.put(`/queue/complete/${id}`),
  cancelByToken:   (token)  => api.put(`/queue/cancel/${token}`),
  checkStatus:     (token)  => api.get(`/queue/status/${token}`),
}

export const branchAPI = {
  getAll:     ()     => api.get('/branches'),
  getAllAdmin: ()     => api.get('/branches/all'),
  create:     (data) => api.post('/branches', data),
  toggle:     (id)   => api.put(`/branches/${id}/toggle`),
  delete:     (id)   => api.delete(`/branches/${id}`),
}

export default api