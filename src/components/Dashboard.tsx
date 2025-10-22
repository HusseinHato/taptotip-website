import { useTapToTip } from "@/hooks/useTapToTip";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCallback, useMemo } from "react";
import { Link } from "@tanstack/react-router";

export default function Dashboard() {

    const {
        authorizeTip,
        txStatus,
        revokeAll,
        hasValidDelegation,
        expiresAt,
      } = useTapToTip();

      const onAuthorize = useCallback(async () => {
          await authorizeTip();
          toast("Authorization successful! You can now send tips.");
        }, [authorizeTip]);

        const expiresHuman = useMemo(() => (expiresAt ? new Date(expiresAt * 1000).toLocaleString() : ""), [expiresAt]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Let's Get Started 🚀
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Set up your account and start tipping in seconds
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Authorization Status Card - Full Width */}
        <div className={`sm:col-span-2 lg:col-span-3 rounded-2xl p-6 sm:p-8 border-2 transition-all ${
          hasValidDelegation 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg shadow-green-100' 
            : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 shadow-lg shadow-amber-100'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                hasValidDelegation ? 'bg-green-500' : 'bg-amber-500'
              }`}>
                {hasValidDelegation ? (
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold mb-1 ${
                  hasValidDelegation ? 'text-green-900' : 'text-amber-900'
                }`}>
                  {hasValidDelegation ? 'Authorization Active' : 'Authorization Required'}
                </h2>
                <p className={`text-sm sm:text-base ${
                  hasValidDelegation ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {hasValidDelegation 
                    ? `Your delegation expires on ${expiresHuman}` 
                    : 'Authorize the app to start sending tips effortlessly'}
                </p>
              </div>
            </div>
            
            {!hasValidDelegation && (
              <Button 
                onClick={onAuthorize} 
                disabled={txStatus === "pending"}
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-sm sm:text-base flex-shrink-0"
              >
                {txStatus === "pending" ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Authorizing...
                  </span>
                ) : (
                  '🔐 Authorize Now'
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Start Tipping Card */}
        <Link to="/tip" className="group block">
          <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all cursor-pointer">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-2">
                  Start Tipping
                </h3>
                <p className="text-sm sm:text-base text-green-700">
                  Send tips to your favorite creators instantly
                </p>
              </div>
              <div className="mt-4 flex items-center text-green-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                Get started
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Share Tip Card */}
        <Link to="/sharetip" className="group block">
          <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">
                  Share My Tip
                </h3>
                <p className="text-sm sm:text-base text-blue-700">
                  Generate your personalized tip link and QR code
                </p>
              </div>
              <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                Share now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Revoke Authorization Card */}
        <div className={`bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border-2 transition-all ${
          hasValidDelegation 
            ? 'border-red-200 hover:border-red-400 hover:shadow-xl cursor-pointer' 
            : 'border-red-200 opacity-60 cursor-not-allowed'
        }`}>
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 ${
                hasValidDelegation 
                  ? 'bg-gradient-to-br from-red-500 to-rose-600' 
                  : 'bg-red-300'
              }`}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${
                hasValidDelegation ? 'text-gray-900' : 'text-gray-500'
              }`}>
                Revoke Access
              </h3>
              <p className={`text-sm sm:text-base ${
                hasValidDelegation ? 'text-gray-700' : 'text-gray-500'
              }`}>
                {hasValidDelegation 
                  ? 'Remove authorization and deactivate delegation' 
                  : 'Authorization required to revoke'}
              </p>
            </div>
            <Button 
              disabled={!hasValidDelegation || txStatus === "pending"} 
              onClick={revokeAll}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {txStatus === "pending" ? 'Processing...' : '🔒 Revoke Authorization'}
            </Button>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 sm:p-6 border-2 border-blue-200">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">Quick Tip</h4>
            <p className="text-xs sm:text-sm text-blue-800">
              Authorization allows the app to send tips on your behalf for 30 days. You can revoke access anytime. Your funds remain secure in your wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
    );
}