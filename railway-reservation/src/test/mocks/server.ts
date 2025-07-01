import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Setup MSW server for tests
export const server = setupServer(...handlers)
