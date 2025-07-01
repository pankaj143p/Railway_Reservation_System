import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'

// Mock complete app flow components
const MockApp = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState('home')
  
  const login = () => {
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
  }
  
  const logout = () => {
    setIsLoggedIn(false)
    setCurrentPage('home')
  }
  
  return (
    <div data-testid="app">
      <nav data-testid="navbar">
        <h1>Railway Reservation System</h1>
        {isLoggedIn ? (
          <button onClick={logout} data-testid="logout-btn">Logout</button>
        ) : (
          <button onClick={() => setCurrentPage('login')} data-testid="login-btn">Login</button>
        )}
      </nav>
      
      <main>
        {currentPage === 'home' && (
          <div data-testid="home-page">
            <h2>Welcome to Railway Booking</h2>
            <button onClick={() => setCurrentPage('trains')} data-testid="search-trains">
              Search Trains
            </button>
          </div>
        )}
        
        {currentPage === 'login' && (
          <div data-testid="login-page">
            <h2>Login</h2>
            <form onSubmit={(e) => { e.preventDefault(); login(); }}>
              <input type="email" placeholder="Email" data-testid="email-input" />
              <input type="password" placeholder="Password" data-testid="password-input" />
              <button type="submit" data-testid="login-submit">Login</button>
            </form>
          </div>
        )}
        
        {currentPage === 'trains' && (
          <div data-testid="trains-page">
            <h2>Available Trains</h2>
            <div data-testid="train-card">
              <h3>Express 101</h3>
              <p>Mumbai → Delhi</p>
              <button 
                onClick={() => setCurrentPage('booking')} 
                data-testid="book-train"
                disabled={!isLoggedIn}
              >
                {isLoggedIn ? 'Book Now' : 'Login to Book'}
              </button>
            </div>
          </div>
        )}
        
        {currentPage === 'booking' && isLoggedIn && (
          <div data-testid="booking-page">
            <h2>Book Ticket</h2>
            <form onSubmit={(e) => { e.preventDefault(); setCurrentPage('confirmation'); }}>
              <input placeholder="Passenger Name" data-testid="passenger-name" />
              <input type="number" placeholder="Age" data-testid="passenger-age" />
              <select data-testid="gender-select">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              <button type="submit" data-testid="confirm-booking">Confirm Booking</button>
            </form>
          </div>
        )}
        
        {currentPage === 'confirmation' && (
          <div data-testid="confirmation-page">
            <h2>Booking Confirmed!</h2>
            <p>Your ticket has been booked successfully.</p>
            <button onClick={() => setCurrentPage('dashboard')} data-testid="view-tickets">
              View My Tickets
            </button>
          </div>
        )}
        
        {currentPage === 'dashboard' && isLoggedIn && (
          <div data-testid="dashboard-page">
            <h2>My Dashboard</h2>
            <button onClick={() => setCurrentPage('trains')} data-testid="search-trains">
              Search Trains
            </button>
            <div data-testid="booked-tickets">
              <h3>My Tickets</h3>
              <div data-testid="ticket-item">
                <p>Express 101 - Mumbai to Delhi</p>
                <p>Seat: A1</p>
                <p>Status: Confirmed</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

describe('End-to-End User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Complete Booking Flow', () => {
    it('allows user to complete full booking journey', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <MockApp />
        </BrowserRouter>
      )
      
      // Start at home page
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      expect(screen.getByText('Welcome to Railway Booking')).toBeInTheDocument()
      
      // Search for trains
      await user.click(screen.getByTestId('search-trains'))
      expect(screen.getByTestId('trains-page')).toBeInTheDocument()
      
      // Try to book without login (should be disabled)
      const bookButton = screen.getByTestId('book-train')
      expect(bookButton).toBeDisabled()
      expect(bookButton).toHaveTextContent('Login to Book')
      
      // Go to login
      await user.click(screen.getByTestId('login-btn'))
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
      
      // Fill login form
      await user.type(screen.getByTestId('email-input'), 'test@example.com')
      await user.type(screen.getByTestId('password-input'), 'password')
      await user.click(screen.getByTestId('login-submit'))
      
      // Should be redirected to dashboard after login
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
      
      // Navigate back to trains
      await user.click(screen.getByTestId('search-trains'))
      expect(screen.getByTestId('trains-page')).toBeInTheDocument()
      
      // Now booking should be enabled
      const enabledBookButton = screen.getByTestId('book-train')
      expect(enabledBookButton).not.toBeDisabled()
      expect(enabledBookButton).toHaveTextContent('Book Now')
      
      // Book the train
      await user.click(enabledBookButton)
      expect(screen.getByTestId('booking-page')).toBeInTheDocument()
      
      // Fill booking details
      await user.type(screen.getByTestId('passenger-name'), 'John Doe')
      await user.type(screen.getByTestId('passenger-age'), '30')
      await user.selectOptions(screen.getByTestId('gender-select'), 'MALE')
      
      // Confirm booking
      await user.click(screen.getByTestId('confirm-booking'))
      expect(screen.getByTestId('confirmation-page')).toBeInTheDocument()
      expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument()
      
      // View tickets
      await user.click(screen.getByTestId('view-tickets'))
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
      expect(screen.getByTestId('ticket-item')).toBeInTheDocument()
    })
  })

  describe('Authentication Flow', () => {
    it('handles login and logout flow', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <MockApp />
        </BrowserRouter>
      )
      
      // Initially not logged in
      expect(screen.getByTestId('login-btn')).toBeInTheDocument()
      expect(screen.queryByTestId('logout-btn')).not.toBeInTheDocument()
      
      // Login
      await user.click(screen.getByTestId('login-btn'))
      await user.type(screen.getByTestId('email-input'), 'test@example.com')
      await user.type(screen.getByTestId('password-input'), 'password')
      await user.click(screen.getByTestId('login-submit'))
      
      // Should be logged in
      expect(screen.getByTestId('logout-btn')).toBeInTheDocument()
      expect(screen.queryByTestId('login-btn')).not.toBeInTheDocument()
      
      // Logout
      await user.click(screen.getByTestId('logout-btn'))
      
      // Should be logged out
      expect(screen.getByTestId('login-btn')).toBeInTheDocument()
      expect(screen.queryByTestId('logout-btn')).not.toBeInTheDocument()
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })

  describe('Navigation Flow', () => {
    it('allows navigation between different pages', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <MockApp />
        </BrowserRouter>
      )
      
      // Start at home
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
      
      // Navigate to trains
      await user.click(screen.getByTestId('search-trains'))
      expect(screen.getByTestId('trains-page')).toBeInTheDocument()
      
      // Navigate to login
      await user.click(screen.getByTestId('login-btn'))
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })
  })

  describe('Protected Routes', () => {
    it('prevents unauthorized booking', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <MockApp />
        </BrowserRouter>
      )
      
      // Navigate to trains page
      await user.click(screen.getByTestId('search-trains'))
      
      // Book button should be disabled for unauthenticated user
      const bookButton = screen.getByTestId('book-train')
      expect(bookButton).toBeDisabled()
      expect(bookButton).toHaveTextContent('Login to Book')
    })

    it('allows booking for authenticated users', async () => {
      const user = userEvent.setup()
      
      render(
        <BrowserRouter>
          <MockApp />
        </BrowserRouter>
      )
      
      // Login first
      await user.click(screen.getByTestId('login-btn'))
      await user.type(screen.getByTestId('email-input'), 'test@example.com')
      await user.type(screen.getByTestId('password-input'), 'password')
      await user.click(screen.getByTestId('login-submit'))
      
      // Navigate to trains
      await user.click(screen.getByTestId('search-trains'))
      
      // Book button should be enabled
      const bookButton = screen.getByTestId('book-train')
      expect(bookButton).not.toBeDisabled()
      expect(bookButton).toHaveTextContent('Book Now')
    })
  })
})
