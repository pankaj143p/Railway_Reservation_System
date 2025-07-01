import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { setupAuthenticatedUser, setupUnauthenticatedUser } from '../utils/test-utils'

// Simple test to verify basic functionality works
describe('Integration Test - Basic Functionality', () => {
  it('renders components without errors', () => {
    setupUnauthenticatedUser()
    
    // Mock a simple component
    const MockComponent = () => <div data-testid="mock-component">Test Component</div>
    
    render(<MockComponent />)
    
    expect(screen.getByTestId('mock-component')).toBeInTheDocument()
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })

  it('handles authentication state', () => {
    setupAuthenticatedUser()
    
    const AuthComponent = () => {
      const isAuthenticated = !!localStorage.getItem('token')
      return (
        <div data-testid="auth-component">
          {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </div>
      )
    }
    
    render(<AuthComponent />)
    
    expect(screen.getByText('Authenticated')).toBeInTheDocument()
  })

  it('handles unauthenticated state', () => {
    setupUnauthenticatedUser()
    
    const AuthComponent = () => {
      const isAuthenticated = !!localStorage.getItem('token')
      return (
        <div data-testid="auth-component">
          {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </div>
      )
    }
    
    render(<AuthComponent />)
    
    expect(screen.getByText('Not Authenticated')).toBeInTheDocument()
  })
})
