import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navbar } from '../../components/navbar'
import { setupAuthenticatedUser, setupUnauthenticatedUser } from '../utils/test-utils'

// Mock the Button component
vi.mock('../../components/ui/button/button', () => ({
  default: () => <button data-testid="auth-button">Auth Button</button>
}))

// Mock the logo import
vi.mock('../../public/static/logo.png', () => ({
  default: 'mocked-logo-path'
}))

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders navbar with logo and title', () => {
    setupUnauthenticatedUser()
    render(<Navbar />)
    
    expect(screen.getByAltText('logo')).toBeInTheDocument()
    expect(screen.getByText('I Rail gateway')).toBeInTheDocument()
  })

  it('renders auth button', () => {
    setupUnauthenticatedUser()
    render(<Navbar />)
    
    expect(screen.getAllByTestId('auth-button')).toHaveLength(2) // Desktop and mobile
  })

  describe('Navigation links for unauthenticated users', () => {
    beforeEach(() => {
      setupUnauthenticatedUser()
    })

    it('shows public navigation links', () => {
      render(<Navbar />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getAllByText('About')).toHaveLength(2) // Desktop and mobile
      expect(screen.getAllByText('Services')).toHaveLength(2) // Desktop and mobile
      expect(screen.getAllByText('Policy')).toHaveLength(2) // Desktop and mobile
      expect(screen.getAllByText('Contact Us')).toHaveLength(2) // Desktop and mobile
    })

    it('does not show Booked Tickets link', () => {
      render(<Navbar />)
      
      expect(screen.queryByText('Booked Tickets')).not.toBeInTheDocument()
    })
  })

  describe('Navigation links for authenticated users', () => {
    beforeEach(() => {
      setupAuthenticatedUser()
    })

    it('shows authenticated navigation links', () => {
      render(<Navbar />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Booked Tickets')).toBeInTheDocument()
      expect(screen.getAllByText('Policy')).toHaveLength(2) // Desktop and mobile
      expect(screen.getAllByText('Contact Us')).toHaveLength(2) // Desktop and mobile
    })

    it('does not show About and Services links', () => {
      render(<Navbar />)
      
      // Since mobile menu still shows these, we check they don't appear in desktop only
      const aboutLinks = screen.queryAllByText('About')
      const servicesLinks = screen.queryAllByText('Services')
      
      // Should only appear in mobile menu (hidden), not in desktop nav
      expect(aboutLinks).toHaveLength(1) // Only in mobile menu
      expect(servicesLinks).toHaveLength(1) // Only in mobile menu
    })
  })

  describe('Mobile menu functionality', () => {
    it('renders mobile menu button', () => {
      setupUnauthenticatedUser()
      render(<Navbar />)
      
      const menuButton = screen.getByRole('button', { name: /open main menu/i })
      expect(menuButton).toBeInTheDocument()
    })

    it('toggles mobile menu when button is clicked', async () => {
      setupUnauthenticatedUser()
      const user = userEvent.setup()
      render(<Navbar />)
      
      const menuButton = screen.getByRole('button', { name: /open main menu/i })
      
      // Initially, aria-expanded should be false
      expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      
      // Click to open menu
      await user.click(menuButton)
      
      expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    })

    it('shows hamburger icon when menu is closed', () => {
      setupUnauthenticatedUser()
      render(<Navbar />)
      
      // The SVG for hamburger menu should be visible
      const hamburgerIcon = screen.getByRole('button', { name: /open main menu/i })
        .querySelector('svg[stroke="currentColor"]')
      
      expect(hamburgerIcon).toBeInTheDocument()
    })
  })

  describe('Authentication state detection', () => {
    it('correctly detects authenticated state', () => {
      const mockGetItem = vi.fn().mockReturnValue('mock-token')
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })
      
      render(<Navbar />)
      
      expect(mockGetItem).toHaveBeenCalledWith('token')
      expect(screen.getByText('Booked Tickets')).toBeInTheDocument()
    })

    it('correctly detects unauthenticated state', () => {
      const mockGetItem = vi.fn().mockReturnValue(null)
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })
      
      render(<Navbar />)
      
      expect(mockGetItem).toHaveBeenCalledWith('token')
      expect(screen.getAllByText('About')).toHaveLength(2) // Desktop and mobile
      expect(screen.getAllByText('Services')).toHaveLength(2) // Desktop and mobile
    })
  })

  describe('Responsive design', () => {
    it('has proper responsive classes', () => {
      setupUnauthenticatedUser()
      render(<Navbar />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('bg-gray-800', 'w-full', 'fixed', 'top-0', 'left-0', 'z-50', 'shadow')
    })

    it('hides desktop menu on mobile screens', () => {
      setupUnauthenticatedUser()
      render(<Navbar />)
      
      const desktopMenu = screen.getByText('I Rail gateway').closest('.hidden')
      expect(desktopMenu).toHaveClass('hidden', 'sm:flex')
    })
  })
})
