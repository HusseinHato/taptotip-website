import { Link } from "@tanstack/react-router";

export default function NotFound404() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-2"></div>
          
          <div className="p-8 sm:p-12 text-center">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="relative inline-block">
                <div className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  404
                </div>
                <div className="absolute inset-0 text-8xl sm:text-9xl font-black text-green-200 blur-2xl opacity-50">
                  404
                </div>
              </div>
              
              {/* Animated Icon */}
              <div className="mt-6 flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center animate-pulse">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
                Oops! Page Not Found
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
                The page you're looking for seems to have wandered off. Don't worry, we'll help you get back on track.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                to="/"
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </Link>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                Need help? Here are some useful links:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/tip" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                  Send a Tip
                </Link>
                <span className="text-gray-300">•</span>
                <Link to="/profile" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                  My Profile
                </Link>
                <span className="text-gray-300">•</span>
                <Link to="/earnings" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                  My Earnings
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}