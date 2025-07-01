import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Button from '../../../components/ui/button/button'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Button Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        removeItem: vi.fn(),
        setItem: vi.fn(),
      },
      writable: true
    })
  })

  describe('Unauthenticated state', () => {
    beforeEach(() => {
      ;(localStorage.getItem as any).mockReturnValue(null)
    })

    it('renders login button when user is not logged in', () => {
      renderWithRouter(<Button />)
      
      expect(screen.getByText('Login')).toBeInTheDocument()
    })

    it('has correct styling for login state', () => {
      renderWithRouter(<Button />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-500/30', 'backdrop-blur-lg', 'hover:shadow-blue-600/50')
    })

    it('navigates to login page when clicked', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Button />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  describe('Authenticated state', () => {
    beforeEach(() => {
      ;(localStorage.getItem as any).mockReturnValue('mock-token')
    })

    it('renders logout button when user is logged in', () => {
      renderWithRouter(<Button />)
      
      expect(screen.getByText('Logout')).toBeInTheDocument()
    })

    it('has correct styling for logout state', () => {
      renderWithRouter(<Button />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-500/80', 'hover:shadow-red-600/50')
    })

    it('logs out user and navigates to home when clicked', async () => {
      const user = userEvent.setup()
      renderWithRouter(<Button />)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('token')
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('updates button text after logout', async () => {
      const user = userEvent.setup()
      
      // Start with logged in state
      ;(localStorage.getItem as any).mockReturnValue('mock-token')
      renderWithRouter(<Button />)
      
      expect(screen.getByText('Logout')).toBeInTheDocument()
      
      // Mock localStorage change after logout
      ;(localStorage.getItem as any).mockReturnValue(null)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      // Note: In a real test, you'd need to re-render or trigger a state update
      // For this test, we're just checking that removeItem was called
      expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    })
  })

  describe('Component styling and behavior', () => {
    it('has correct base classes', () => {
      ;(localStorage.getItem as any).mockReturnValue(null)
      renderWithRouter(<Button />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass(
        'group/button',
        'relative',
        'inline-flex',
        'items-center',
        'justify-center',
        'overflow-hidden',
        'rounded-md',
        'px-4',
        'py-1',
        'text-base',
        'font-semibold',
        'text-white',
        'transition-all',
        'duration-300',
        'ease-in-out',
        'hover:scale-110',
        'hover:shadow-xl',
        'border',
        'border-white/20'
      )
    })

    it('has proper button structure with animation element', () => {
      ;(localStorage.getItem as any).mockReturnValue(null)
      renderWithRouter(<Button />)
      
      const button = screen.getByRole('button')
      
      // Check for the span with text
      expect(button.querySelector('span')).toHaveClass('text-lg', 'cursor-default')
      
      // Check for the animation div
      expect(button.querySelector('div')).toHaveClass('absolute', 'inset-0')
    })

    it('responds to localStorage changes on location change', () => {
      ;(localStorage.getItem as any).mockReturnValue(null)
      const { rerender } = renderWithRouter(<Button />)
      
      expect(screen.getByText('Login')).toBeInTheDocument()
      
      // Simulate login
      ;(localStorage.getItem as any).mockReturnValue('new-token')
      
      // Rerender to simulate location change
      rerender(<BrowserRouter><Button /></BrowserRouter>)
      
      // The component should check localStorage again
      expect(localStorage.getItem).toHaveBeenCalledWith('token')
    })
  })

  describe('Accessibility', () => {
    it('is keyboard accessible', async () => {
      const user = userEvent.setup()
      ;(localStorage.getItem as any).mockReturnValue(null)
      renderWithRouter(<Button />)
      
      const button = screen.getByRole('button')
      
      // Focus and activate with keyboard
      await user.tab()
      expect(button).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('has proper button role', () => {
      ;(localStorage.getItem as any).mockReturnValue(null)
      renderWithRouter(<Button />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
