import { createFileRoute, useNavigate  } from '@tanstack/react-router'
import { useAccount, useBalance } from "wagmi";
import { Button } from '../components/ui/button';
import { toast } from "sonner"
import { useWeb3AuthDisconnect } from "@web3auth/modal/react";
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: Profile,
})

function Profile() {

  const navigate = useNavigate();

  const { address } = useAccount();
  const { data: balanceData, isLoading, error } = useBalance({ address: address });
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();

  const copyAddress = () => () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast("Address copied to clipboard!");
    }
  }

  function handleDisconnect() {
    disconnect();
    navigate({ to: '/' });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Account</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your wallet and earnings</p>
        </div>

        {address ? (
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Share Tip Link Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 sm:p-5 text-white shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1">Share Your Tip Link</h3>
                  <p className="text-xs sm:text-sm text-green-50 opacity-90">Let others send you tips easily</p>
                </div>
                <Link to='/sharetip' className="shrink-0">
                  <Button className="bg-white text-green-600 hover:bg-green-50 font-medium shadow-sm text-sm sm:text-base px-3 sm:px-4 py-2">
                    Share
                  </Button>
                </Link>
              </div>
            </div>

            {/* Wallet Information */}
            <div className="space-y-4">
              {/* Address Card */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <label className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-2 block">
                  Wallet Address
                </label>
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <p className="text-xs sm:text-sm text-gray-900 truncate flex-1">
                    {address}
                  </p>
                  <Button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 shrink-0 text-xs sm:text-sm px-3 py-2" 
                    onClick={copyAddress()}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              {/* Balance Card */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <label className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-2 block">
                  Balance
                </label>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-600">Loading balance...</p>
                  </div>
                ) : error ? (
                  <p className="text-red-600 text-sm">Error: {error.message}</p>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {balanceData?.formatted} <span className="text-base sm:text-lg text-gray-600">{balanceData?.symbol}</span>
                  </p>
                )}
              </div>

              {/* Faucet Link */}
              <a 
                href="https://faucet.monad.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white hover:shadow-md transition-all hover:scale-[1.02] duration-200">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base mb-1">Need testnet tokens?</h3>
                      <p className="text-xs text-indigo-50 opacity-90">Get MON from the faucet</p>
                    </div>
                    <Button className="bg-white text-indigo-600 hover:bg-indigo-50 font-medium shadow-sm text-sm px-3 sm:px-4 py-2 shrink-0">
                      Faucet →
                    </Button>
                  </div>
                </div>
              </a>
            </div>

            {/* Disconnect Button */}
            <div className="pt-2">
              <Button
                onClick={handleDisconnect}
                disabled={disconnectLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl py-2.5 sm:py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {disconnectLoading ? 'Disconnecting...' : 'Disconnect Wallet'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">Connect your wallet to view account information</p>
          </div>
        )}
      </div>
    </div>
  )
}