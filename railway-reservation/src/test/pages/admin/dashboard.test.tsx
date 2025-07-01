import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from '../../../pages/admindashboard/dashboard'

// Mock all child components
vi.mock('../../../components/layout/sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}))

vi.mock('../../../components/amdin/dashboard/card/revenuecard', () => ({
  default: () => <div data-testid="revenue-card">Revenue Card</div>
}))

vi.mock('../../../components/amdin/dashboard/Carousel', () => ({
  default: () => <div data-testid="carousel">Carousel</div>
}))

vi.mock('../../../components/amdin/dashboard/card/dashboardcardgrid', () => ({
  default: () => <div data-testid="dashboard-cards-grid">Dashboard Cards Grid</div>
}))

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

describe('DashboardPage Component', () => {
  it('renders all dashboard components', () => {
    renderWithRouter(<DashboardPage />)
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('revenue-card')).toBeInTheDocument()
    expect(screen.getByTestId('carousel')).toBeInTheDocument()
    expect(screen.getByTestId('dashboard-cards-grid')).toBeInTheDocument()
  })

  it('renders dashboard title', () => {
    renderWithRouter(<DashboardPage />)
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
  })

  it('has correct layout structure', () => {
    renderWithRouter(<DashboardPage />)
    
    const container = screen.getByText('Admin Dashboard').closest('.min-h-screen')
    expect(container).toHaveClass(
      'min-h-screen',
      'bg-gradient-to-br',
      'from-blue-100',
      'via-white',
      'to-blue-200',
      'flex',
      'py-16'
    )
  })

  it('has proper main content area styling', () => {
    renderWithRouter(<DashboardPage />)
    
    const main = screen.getByRole('main')
    expect(main).toHaveClass('flex-1', 'ml-56', 'px-6', 'py-10')
  })

  it('has correct grid layout for dashboard components', () => {
    renderWithRouter(<DashboardPage />)
    
    // Find the grid container by looking for a div with grid classes
    const gridContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3')
    expect(gridContainer).toBeInTheDocument()
    expect(gridContainer).toHaveClass(
      'grid',
      'grid-cols-1',
      'lg:grid-cols-3',
      'gap-8',
      'mb-8'
    )
  })

  it('positions revenue card in correct grid column', () => {
    renderWithRouter(<DashboardPage />)
    
    const revenueCardContainer = screen.getByTestId('revenue-card').parentElement
    expect(revenueCardContainer).toHaveClass('lg:col-span-1')
  })

  it('positions carousel in correct grid column', () => {
    renderWithRouter(<DashboardPage />)
    
    const carouselContainer = screen.getByTestId('carousel').parentElement
    expect(carouselContainer).toHaveClass('lg:col-span-2')
  })

  it('displays dashboard cards grid at the bottom', () => {
    renderWithRouter(<DashboardPage />)
    
    const dashboardGrid = screen.getByTestId('dashboard-cards-grid')
    expect(dashboardGrid).toBeInTheDocument()
  })

  it('has proper title styling', () => {
    renderWithRouter(<DashboardPage />)
    
    const title = screen.getByText('Admin Dashboard')
    expect(title).toHaveClass('text-3xl', 'font-bold', 'mb-8', 'text-blue-900')
  })

  describe('Responsive design', () => {
    it('has responsive grid classes', () => {
      renderWithRouter(<DashboardPage />)
      
      const gridContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3')
      expect(gridContainer).toBeInTheDocument()
      expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-3')
    })

    it('has proper sidebar margin for desktop layout', () => {
      renderWithRouter(<DashboardPage />)
      
      const main = screen.getByRole('main')
      expect(main).toHaveClass('ml-56')
    })
  })

  describe('Component integration', () => {
    it('renders sidebar for navigation', () => {
      renderWithRouter(<DashboardPage />)
      
      expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    })

    it('renders revenue metrics', () => {
      renderWithRouter(<DashboardPage />)
      
      expect(screen.getByTestId('revenue-card')).toBeInTheDocument()
    })

    it('renders image carousel', () => {
      renderWithRouter(<DashboardPage />)
      
      expect(screen.getByTestId('carousel')).toBeInTheDocument()
    })

    it('renders dashboard action cards', () => {
      renderWithRouter(<DashboardPage />)
      
      expect(screen.getByTestId('dashboard-cards-grid')).toBeInTheDocument()
    })
  })
})
