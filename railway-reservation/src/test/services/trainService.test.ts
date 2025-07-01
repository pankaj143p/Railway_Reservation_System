import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchTrainList } from '../../services/trainService'
import { mockTrain } from '../utils/test-utils'

describe('TrainService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock fetch globally
    global.fetch = vi.fn()
  })

  describe('fetchTrainList', () => {
    it('successfully fetches train list with valid token', async () => {
      const mockTrains = [mockTrain, { ...mockTrain, trainId: 2, trainName: 'Express 102' }]
      
      // Mock localStorage
      const mockGetItem = vi.fn().mockReturnValue('valid-token')
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })

      // Mock successful fetch response
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue(mockTrains)
      }
      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const result = await fetchTrainList()

      expect(result).toEqual(mockTrains)
      expect(mockGetItem).toHaveBeenCalledWith('token')
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:6111/trains/all',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid-token'
          }
        }
      )
    })

    it('throws error when no authentication token found', async () => {
      // Mock localStorage with no token
      const mockGetItem = vi.fn().mockReturnValue(null)
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })

      const result = await fetchTrainList()

      expect(result).toBeNull()
      expect(mockGetItem).toHaveBeenCalledWith('token')
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('handles HTTP error responses', async () => {
      // Mock localStorage with valid token
      const mockGetItem = vi.fn().mockReturnValue('valid-token')
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })

      // Mock failed fetch response
      const mockResponse = {
        ok: false,
        status: 401
      }
      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const result = await fetchTrainList()

      expect(result).toBeNull()
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:6111/trains/all',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer valid-token'
          }
        }
      )
    })

    it('handles network errors', async () => {
      // Mock localStorage with valid token
      const mockGetItem = vi.fn().mockReturnValue('valid-token')
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })

      // Mock network error
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      const result = await fetchTrainList()

      expect(result).toBeNull()
    })

    it('handles JSON parsing errors', async () => {
      // Mock localStorage with valid token
      const mockGetItem = vi.fn().mockReturnValue('valid-token')
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })

      // Mock response with invalid JSON
      const mockResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
      }
      ;(global.fetch as any).mockResolvedValueOnce(mockResponse)

      const result = await fetchTrainList()

      expect(result).toBeNull()
    })

    it('logs errors to console', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      // Mock localStorage with no token to trigger error
      const mockGetItem = vi.fn().mockReturnValue(null)
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })

      await fetchTrainList()

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching train list:',
        expect.any(Error)
      )
      
      consoleSpy.mockRestore()
    })
  })
})
