import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import './index.css'
import { Web3AuthProvider } from '@web3auth/modal/react'
import web3AuthContextConfig from './web3authContext'
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner"
import NotFound404 from './components/NotFound404'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound404 })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient();

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <Web3AuthProvider config={web3AuthContextConfig}>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider>
            <RouterProvider router={router} />
            <Toaster />
          </WagmiProvider>
        </QueryClientProvider>
      </Web3AuthProvider>
    </StrictMode>,
  )
}