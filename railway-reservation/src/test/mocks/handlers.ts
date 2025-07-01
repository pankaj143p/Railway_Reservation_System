import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock API handlers will go here
  http.get('/api/trains/all', () => {
    return HttpResponse.json([])
  }),
  
  http.post('/api/users/login', () => {
    return HttpResponse.json({ token: 'mock-token' })
  }),
  
  http.get('/api/tickets/user', () => {
    return HttpResponse.json([])
  })
]