# Railway Reservation System - Testing Documentation

## Overview

This document outlines the comprehensive testing setup for the Railway Reservation System frontend application built with React, TypeScript, and Vite.

## Testing Stack

- **Testing Framework**: Vitest
- **Testing Library**: React Testing Library
- **Mock Service Worker**: MSW for API mocking
- **UI Testing**: @vitest/ui for visual test runner
- **Coverage**: V8 coverage provider

## Test Structure

```
src/test/
├── setup.ts                 # Test setup and global mocks
├── mocks/
│   ├── server.ts            # MSW server setup
│   └── handlers.ts          # API mock handlers
├── utils/
│   ├── test-utils.tsx       # Custom render utilities
│   └── helpers.test.ts      # Utility function tests
├── components/
│   ├── App.test.tsx         # Main App component tests
│   ├── navbar.test.tsx      # Navigation component tests
│   └── ui/
│       └── button.test.tsx  # UI component tests
├── pages/
│   ├── login.test.tsx       # Login page tests
│   └── admin/
│       └── dashboard.test.tsx # Admin dashboard tests
├── services/
│   ├── authService.test.ts  # Authentication service tests
│   └── trainService.test.ts # Train service tests
├── integration/
│   ├── auth-flow.test.tsx   # Authentication flow tests
│   └── train-booking.test.tsx # Booking flow tests
└── e2e/
    └── user-flows.test.tsx  # End-to-end user journey tests
```

## Test Categories

### 1. Unit Tests
- **Components**: Individual React component functionality
- **Services**: API service methods and error handling
- **Utilities**: Helper functions and data transformations
- **Hooks**: Custom React hooks (if any)

### 2. Integration Tests
- **Authentication Flow**: Login/logout workflows
- **Booking Flow**: Train search and ticket booking
- **Navigation**: Route protection and redirects
- **State Management**: Component state interactions

### 3. End-to-End Tests
- **Complete User Journeys**: Full application workflows
- **Cross-component Interactions**: Multi-step processes
- **Error Scenarios**: Error handling across the application

## Key Test Utilities

### Custom Render Function
```typescript
// Wraps components with necessary providers
import { render } from '../utils/test-utils'
```

### Mock Data
```typescript
// Predefined mock objects for consistent testing
import { mockUser, mockTrain, mockTicket } from '../utils/test-utils'
```

### Authentication Helpers
```typescript
// Setup authenticated/unauthenticated states
import { setupAuthenticatedUser, setupUnauthenticatedUser } from '../utils/test-utils'
```

## Running Tests

### Available Scripts

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test login.test.tsx

# Run tests matching pattern
npm test auth

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Coverage Exclusions
- `node_modules/`
- `src/test/`
- `**/*.d.ts`
- `**/*.config.*`
- `dist/`
- `public/`

## Mock API Endpoints

The MSW setup provides mocked endpoints for:

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `GET /api/users` - Get users list

### Trains
- `GET /api/trains` - Get all trains
- `GET /api/trains/:id` - Get specific train
- `POST /api/trains` - Create new train
- `GET /api/trains/search` - Search trains

### Tickets
- `GET /api/tickets` - Get all tickets
- `POST /api/tickets/book` - Book a ticket

## Testing Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow AAA pattern: Arrange, Act, Assert

### 2. Component Testing
```typescript
describe('Component Name', () => {
  beforeEach(() => {
    // Setup common test state
  })

  it('should render expected elements', () => {
    // Test component rendering
  })

  it('should handle user interactions', () => {
    // Test user events
  })
})
```

### 3. Service Testing
```typescript
describe('Service Name', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle successful responses', () => {
    // Test success cases
  })

  it('should handle error responses', () => {
    // Test error cases
  })
})
```

### 4. Integration Testing
```typescript
describe('Feature Flow', () => {
  it('should complete end-to-end workflow', () => {
    // Test complete user journeys
  })
})
```

## Common Test Patterns

### 1. Testing User Interactions
```typescript
const user = userEvent.setup()
await user.click(screen.getByRole('button'))
await user.type(screen.getByLabelText('Email'), 'test@example.com')
```

### 2. Testing Async Operations
```typescript
await waitFor(() => {
  expect(screen.getByText('Success message')).toBeInTheDocument()
})
```

### 3. Testing Form Submissions
```typescript
const form = screen.getByRole('form')
fireEvent.submit(form)
```

### 4. Testing Navigation
```typescript
expect(mockNavigate).toHaveBeenCalledWith('/expected-route')
```

## Debugging Tests

### 1. Debug Output
```typescript
import { screen } from '@testing-library/react'
screen.debug() // Prints current DOM structure
```

### 2. VS Code Debugging
- Set breakpoints in test files
- Use "Debug Test" option in VS Code
- Inspect component state and props

### 3. Test Isolation
- Each test should be independent
- Use `beforeEach` for setup
- Mock external dependencies

## Continuous Integration

### GitHub Actions (Example)
```yaml
- name: Run Tests
  run: npm run test:run

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v1
```

## Performance Testing

### Bundle Size Testing
```typescript
// Test that components don't import unnecessary dependencies
it('should not import heavy libraries', () => {
  // Check import statements
})
```

### Rendering Performance
```typescript
// Test component rendering time
it('should render quickly', () => {
  const start = performance.now()
  render(<Component />)
  const end = performance.now()
  expect(end - start).toBeLessThan(100) // ms
})
```

## Accessibility Testing

### Basic A11y Tests
```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should have no accessibility violations', async () => {
  const { container } = render(<Component />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Maintenance

### Regular Tasks
1. Update test dependencies monthly
2. Review and update mock data
3. Add tests for new features
4. Remove tests for deprecated features
5. Monitor test performance

### Code Quality
- Use ESLint for test files
- Follow consistent naming conventions
- Document complex test scenarios
- Regular code reviews for test code

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
