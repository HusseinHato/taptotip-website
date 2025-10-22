import { useWeb3AuthConnect } from "@web3auth/modal/react";
import { Link } from '@tanstack/react-router'
import { Button } from "@/components/ui/button";

export default function NavBar() {

    const { connect, isConnected, loading: connectLoading, error: connectError } = useWeb3AuthConnect();

    if (connectError) {
        console.error("Web3Auth Connection Error:", connectError);
    }

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 rounded-xl mt-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="relative">
                            <img
                                src="/logo.png"
                                alt="TapToTip Logo"
                                className="w-10 h-10 sm:w-12 sm:h-12 transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity"></div>
                        </div>
                        <div>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">
                                TapToTip
                            </p>
                            <p className="text-xs text-gray-500 hidden sm:block">Send tips instantly</p>
                        </div>
                    </Link>

                    {/* Navigation Links / Connect Button */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        {isConnected ? (
                            <>
                                <Link
                                    to="/profile"
                                    className="px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all [&.active]:text-green-600 [&.active]:bg-green-50 [&.active]:font-semibold"
                                >
                                    <span className="hidden sm:inline">Profile</span>
                                    <span className="sm:hidden">👤</span>
                                </Link>
                                <Link
                                    to="/tip"
                                    className="px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all [&.active]:text-green-600 [&.active]:bg-green-50 [&.active]:font-semibold"
                                >
                                    <span className="hidden sm:inline">Tip</span>
                                    <span className="sm:hidden">💸</span>
                                </Link>
                                <Link
                                    to="/earnings"
                                    className="px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all [&.active]:text-green-600 [&.active]:bg-green-50 [&.active]:font-semibold"
                                >
                                    <span className="hidden sm:inline">Earnings</span>
                                    <span className="sm:hidden">💰</span>
                                </Link>
                            </>
                        ) : (
                            <Button
                                onClick={() => connect()}
                                disabled={connectLoading}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                {connectLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="hidden sm:inline">Connecting...</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Launch App
                                    </span>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}