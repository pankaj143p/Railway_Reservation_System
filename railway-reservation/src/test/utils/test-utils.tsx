import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from testing-library
export * from '@testing-library/react'
export { customRender as render }

// Helper functions for tests
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

export const mockNavigate = vi.fn()

// Mock user data
export const mockUser = {
  id: 1,
  fullName: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  role: 'USER'
}

export const mockAdmin = {
  id: 2,
  fullName: 'Admin User',
  email: 'admin@example.com',
  phone: '0987654321',
  role: 'ADMIN'
}

export const mockTrain = {
  trainId: 1,
  trainName: 'Express 101',
  source: 'Mumbai',
  destination: 'Delhi',
  totalSeats: 100,
  amount: 1500,
  status: 'ACTIVE',
  departureTime: '08:00',
  arrivalTime: '20:00',
  date: '2025-07-01',
  routes: ['Mumbai', 'Pune', 'Nagpur', 'Delhi']
}

export const mockTicket = {
  ticketId: 1,
  trainId: 1,
  userId: 1,
  passengerName: 'John Doe',
  age: 30,
  gender: 'MALE',
  seatNumber: 'A1',
  bookingDate: '2025-06-27',
  travelDate: '2025-07-01',
  amount: 1500,
  status: 'CONFIRMED'
}

// Helper to setup authenticated state
export const setupAuthenticatedUser = (isAdmin = false) => {
  const token = isAdmin ? 'mock-admin-token' : 'mock-jwt-token'
  mockLocalStorage.getItem.mockReturnValue(token)
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  })
}

// Helper to setup unauthenticated state
export const setupUnauthenticatedUser = () => {
  mockLocalStorage.getItem.mockReturnValue(null)
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  })
}
