import { createFileRoute } from '@tanstack/react-router'
import { useWeb3AuthConnect } from '@web3auth/modal/react';
import LandingPage from '../components/LandingPage';
import Dashboard from '../components/Dashboard';


export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {

  const { connect, isConnected, connectorName, loading: connectLoading, error: connectError } = useWeb3AuthConnect();

  return (
    <div className='min-h-[75vh]'>
      <div>
        {
          isConnected ? (
            <div>
              <Dashboard />
            </div>
          ) : (
            <div>
              <LandingPage />
            </div>
          )
        }
      </div>
    </div>
  )
}