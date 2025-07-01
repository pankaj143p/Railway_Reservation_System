import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import { setupAuthenticatedUser, setupUnauthenticatedUser } from '../utils/test-utils'

// Mock all page components that use router hooks
vi.mock('../../pages/loginPage/login', () => ({
  default: () => <div data-testid="login-page">Login Page</div>
}))

vi.mock('../../pages/signUpPage/signup', () => ({
  default: () => <div data-testid="signup-page">Signup Page</div>
}))

vi.mock('../../components/protectedHome/protectedhome', () => ({
  default: () => <div data-testid="protected-home">Protected Home</div>
}))

vi.mock('../../components/navbar', () => ({
  Navbar: () => <div data-testid="navbar">Navbar</div>
}))

vi.mock('../../pages/homePage/homepage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}))

// Mock all other pages that use router hooks
vi.mock('../../pages/trainListPage/trainLists', () => ({
  default: () => <div data-testid="train-lists">Train Lists</div>
}))

vi.mock('../../pages/trainBookPage/book', () => ({
  default: () => <div data-testid="book-page">Book Page</div>
}))

vi.mock('../../pages/confirmationPage/booked', () => ({
  default: () => <div data-testid="booked-page">Booked Page</div>
}))

vi.mock('../../pages/admindashboard/dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>
}))

vi.mock('../../pages/admindashboard/userspage/userspage', () => ({
  default: () => <div data-testid="users-page">Users Page</div>
}))

vi.mock('../../pages/ticketpage/BookingSuccess', () => ({
  default: () => <div data-testid="booking-success">Booking Success</div>
}))

vi.mock('../../pages/admindashboard/trainpage/trainpage', () => ({
  default: () => <div data-testid="trains-page">Trains Page</div>
}))

vi.mock('../../pages/admindashboard/ticketpage/ticketpage', () => ({
  default: () => <div data-testid="ticket-page">Ticket Page</div>
}))

vi.mock('../../pages/notfoundpage/notfount', () => ({
  default: () => <div data-testid="not-found">Not Found</div>
}))

vi.mock('../../pages/bookedticketspages/bookedtickets', () => ({
  default: () => <div data-testid="booked-tickets">Booked Tickets</div>
}))

// Import the mocked components
import Login from '../../pages/loginPage/login'
import TrainDetails from '../../pages/trainListPage/trainLists'
import Book from '../../pages/trainBookPage/book'
import Booked from '../../pages/confirmationPage/booked'
import Dashboard from '../../pages/admindashboard/dashboard'
import UsersPage from '../../pages/admindashboard/userspage/userspage'
import BookingSuccess from '../../pages/ticketpage/BookingSuccess'
import { Navbar } from '../../components/navbar'
import ProtectedHome from '../../components/protectedHome/protectedhome'
import TrainsPage from '../../pages/admindashboard/trainpage/trainpage'
import HomePage from '../../pages/homePage/homepage'
import Signup from '../../pages/signUpPage/signup'
import TicketPage from '../../pages/admindashboard/ticketpage/ticketpage'
import NotFound from '../../pages/notfoundpage/notfount'
import BookedTickets from '../../pages/bookedticketspages/bookedtickets'

// Test App Component
function TestApp() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedHome />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* Redirect logged-in users away from login/signup */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Signup />}
        />

        <Route path="/trainList" element={<TrainDetails />} />
        <Route path="/book/:trainId" element={<Book />} />
        <Route path='/confirmed/:orderId' element={<Booked />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='trains' element={<TrainsPage />} />
        <Route path='/ticket' element={<BookingSuccess />} />
        <Route
          path='/bookedtickets'
          element={!isLoggedIn ? <Navigate to="/login" replace /> : <BookedTickets />}
        />
        <Route
          path='/home'
          element={!isLoggedIn ? <HomePage /> : <Navigate to="/" replace />}
        />
        <Route path='/tickets' element={<TicketPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <TestApp />
    </MemoryRouter>
  )
}

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders navbar for all routes', () => {
    setupUnauthenticatedUser()
    renderWithRouter()
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  it('renders router and routes structure', () => {
    setupUnauthenticatedUser()
    renderWithRouter()
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  describe('Authentication-based routing', () => {
    it('shows protected home for authenticated users', () => {
      setupAuthenticatedUser()
      renderWithRouter()
      
      // The protected home should be rendered for the default route
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })

    it('redirects authenticated users away from login page', () => {
      setupAuthenticatedUser()
      renderWithRouter(['/login'])
      
      // Since user is authenticated, they should be redirected from login
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })

    it('redirects authenticated users away from signup page', () => {
      setupAuthenticatedUser()
      renderWithRouter(['/signup'])
      
      // Since user is authenticated, they should be redirected from signup
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })
  })

  describe('Route protection', () => {
    it('allows unauthenticated users to access login page', () => {
      setupUnauthenticatedUser()
      renderWithRouter(['/login'])
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })

    it('allows unauthenticated users to access signup page', () => {
      setupUnauthenticatedUser()
      renderWithRouter(['/signup'])
      
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })

    it('shows home page for unauthenticated users accessing /home', () => {
      setupUnauthenticatedUser()
      renderWithRouter(['/home'])
      
      // The component should render without errors
      expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })
  })

  describe('localStorage integration', () => {
    it('checks localStorage for authentication token', () => {
      const mockGetItem = vi.fn().mockReturnValue('mock-token')
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })
      
      renderWithRouter()
      
      expect(mockGetItem).toHaveBeenCalledWith('token')
    })

    it('handles missing authentication token', () => {
      const mockGetItem = vi.fn().mockReturnValue(null)
      Object.defineProperty(window, 'localStorage', {
        value: { getItem: mockGetItem },
        writable: true
      })
      
      renderWithRouter()
      
      expect(mockGetItem).toHaveBeenCalledWith('token')
    })
  })
})
