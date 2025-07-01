import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loginUser, registerUser } from '../../services/authService'

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  }
}))

// Import after mocking
import axios from 'axios'
const mockedAxios = axios as any

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loginUser', () => {
    it('successfully logs in user with valid credentials', async () => {
      const mockToken = 'mock-jwt-token'
      const mockLoginResponse = {
        data: { token: mockToken }
      }
      const mockUsersResponse = {
        data: [{ id: 1, email: 'test@example.com' }]
      }

      mockedAxios.post.mockResolvedValueOnce(mockLoginResponse)
      mockedAxios.get.mockResolvedValueOnce(mockUsersResponse)

      const result = await loginUser('test@example.com', 'password')

      expect(result).toBe(mockToken)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:6111/api/users/login',
        { email: 'test@example.com', password: 'password' }
      )
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:6111/api/users',
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
            webCredentials: true
          }
        }
      )
    })

    it('throws error for invalid credentials', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid credentials' }
        }
      }

      mockedAxios.post.mockRejectedValueOnce(mockError)

      await expect(loginUser('invalid@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials')
    })

    it('throws generic error when no specific error message', async () => {
      const mockError = {
        response: { data: {} }
      }

      mockedAxios.post.mockRejectedValueOnce(mockError)

      await expect(loginUser('test@example.com', 'password'))
        .rejects.toThrow('Login failed')
    })

    it('throws generic error when no response data', async () => {
      const mockError = new Error('Network error')

      mockedAxios.post.mockRejectedValueOnce(mockError)

      await expect(loginUser('test@example.com', 'password'))
        .rejects.toThrow('Login failed')
    })
  })

  describe('registerUser', () => {
    beforeEach(() => {
      // Mock fetch globally
      global.fetch = vi.fn()
    })

    it('successfully registers user with valid data', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          message: 'User registered successfully',
          user: {
            id: 1,
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            role: 'USER'
          }
        })
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const result = await registerUser(
        'Test User',
        'test@example.com',
        '1234567890',
        'password123'
      )

      expect(result.message).toBe('User registered successfully')
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:6111/api/users/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            password: 'password123',
            role: 'USER'
          })
        }
      )
    })

    it('successfully registers user with custom role', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          message: 'Admin registered successfully',
          user: {
            id: 2,
            fullName: 'Admin User',
            email: 'admin@example.com',
            phone: '0987654321',
            role: 'ADMIN'
          }
        })
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const result = await registerUser(
        'Admin User',
        'admin@example.com',
        '0987654321',
        'adminpass',
        'ADMIN'
      )

      expect(result.user.role).toBe('ADMIN')
    })

    it('throws validation error with specific message', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({
          errors: [{ defaultMessage: 'Email already exists' }]
        })
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await expect(registerUser(
        'Test User',
        'existing@example.com',
        '1234567890',
        'password123'
      )).rejects.toThrow('Email already exists')
    })

    it('throws generic error message when no validation errors', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({
          message: 'Registration failed'
        })
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await expect(registerUser(
        'Test User',
        'test@example.com',
        '1234567890',
        'password123'
      )).rejects.toThrow('Registration failed')
    })

    it('throws default error message when no error details', async () => {
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({})
      }

      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      await expect(registerUser(
        'Test User',
        'test@example.com',
        '1234567890',
        'password123'
      )).rejects.toThrow('Signup failed. Please try again.')
    })
  })
})
