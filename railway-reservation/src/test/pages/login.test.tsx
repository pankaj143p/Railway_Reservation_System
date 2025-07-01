import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Login from '../../pages/loginPage/login'

// Mock the LoginForm component
vi.mock('../../components/ui/loginform/form', () => ({
  default: () => <div data-testid="login-form">Login Form</div>
}))

describe('Login Page', () => {
  it('renders login page with proper layout', () => {
    render(<Login />)
    
    const loginContainer = screen.getByTestId('login-form').parentElement
    expect(loginContainer).toHaveClass('my-24')
  })

  it('renders login form component', () => {
    render(<Login />)
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
  })

  it('has proper spacing from top', () => {
    render(<Login />)
    
    const container = screen.getByTestId('login-form').parentElement
    expect(container).toHaveClass('my-24')
  })
})
