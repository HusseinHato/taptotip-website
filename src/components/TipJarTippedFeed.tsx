// src/components/MyTips.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import { useAccount } from "wagmi"; // or wagmi's useAccount
import { gql } from "@/lib/envioClient";
import { TIPPED_RECEIVED } from "@/queries/tipped";
import { useAllTimeEarnings } from "@/hooks/useAllTimeEarnings";

type Tip = { id: string; from: string; to: string; amount: string; fee: string; ref?: string | null };

function short(a: string) { return `${a.slice(0, 6)}…${a.slice(-4)}`; }

export default function MyTips() {
  const { address } = useAccount();
  const [pageR, setPageR] = useState(0);
  const limit = 10;

  const { data: received, isLoading: loadingR, error: errR } = useQuery({
    enabled: !!address,
    queryKey: ["TipJar_Tipped", "received", address, pageR],
    queryFn: () => gql<{ TipJar_Tipped: Tip[] }>(TIPPED_RECEIVED, { to: address, limit, offset: pageR * limit }),
  });

  if (!address) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Please Connect Your Wallet</h2>
            <p className="text-gray-600">You need to connect your wallet to send tips.</p>
          </div>
        </div>
      </div>
    );
  }

  const recRows = received?.TipJar_Tipped ?? [];

  const sum = (rows: Tip[], f: (t: Tip) => bigint) => rows.reduce((acc, t) => acc + f(t), 0n);

  const totalReceivedGross = sum(recRows, (t) => BigInt(t.amount));
  const totalReceivedFee = sum(recRows, (t) => BigInt(t.fee || "0"));
  const totalReceivedNet = totalReceivedGross - totalReceivedFee;

  // Check if there are more records (if we got less than limit, we're at the end)
  const hasMore = recRows.length === limit;

  const { data: totals, isLoading: loadingTotals, error: errTotals, refetch: refetchTotals } =
    useAllTimeEarnings(address);

  return (

    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <div className="space-y-4 sm:space-y-6">
        {/* ALL-TIME EARNINGS */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 sm:px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">All-Time Earnings</h2>
          </div>

          <div className="p-4 sm:p-6">
            {loadingTotals ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600">Calculating earnings...</p>
              </div>
            ) : errTotals ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {(errTotals as Error).message}
                </p>
              </div>
            ) : totals ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Net Card */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <p className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">Net Earnings</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-900">
                      {Number(formatEther(totals.net)).toLocaleString()}
                    </p>
                    <p className="text-sm text-green-700 mt-0.5">MON</p>
                  </div>

                  {/* Gross Card */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Gross Earnings</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {Number(formatEther(totals.gross)).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">MON</p>
                  </div>

                  {/* Fees Card */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total Fees</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {Number(formatEther(totals.fee)).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">MON</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm sm:text-base font-medium">{totals.count} tips received</span>
                  </div>
                  <button
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl px-4 py-2 transition-colors shadow-sm text-sm"
                    onClick={() => refetchTotals()}
                  >
                    🔄 Refresh
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* RECEIVED TIPS */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Received Tips</h2>
          </div>

          <div className="p-4 sm:p-6">
            {/* Summary Stats */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
              <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
                <div>
                  <span className="text-gray-600">Net:</span>
                  <span className="font-semibold text-gray-900 ml-1">
                    {Number(formatEther(totalReceivedNet)).toPrecision(4)} MON
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Gross:</span>
                  <span className="font-semibold text-gray-900 ml-1">
                    {Number(formatEther(totalReceivedGross)).toPrecision(4)} MON
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Fees:</span>
                  <span className="font-semibold text-gray-900 ml-1">
                    {Number(formatEther(totalReceivedFee)).toPrecision(4)} MON
                  </span>
                </div>
              </div>
            </div>

            {/* Table */}
            {loadingR ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600">Loading tips...</p>
                </div>
              </div>
            ) : errR ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {(errR as Error).message}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-2 sm:px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                          <th className="py-3 px-2 sm:px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gross</th>
                          <th className="py-3 px-2 sm:px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fee</th>
                          <th className="py-3 px-2 sm:px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Net</th>
                          <th className="py-3 px-2 sm:px-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {recRows.map((t) => {
                          const gross = BigInt(t.amount), fee = BigInt(t.fee || "0"), net = gross - fee;
                          return (
                            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-2 sm:px-3 text-xs text-gray-700">{short(t.id)}</td>
                              <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-900 whitespace-nowrap font-medium">
                                {Number(formatEther(gross)).toPrecision(4)}
                              </td>
                              <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                                {Number(formatEther(fee)).toPrecision(4)}
                              </td>
                              <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-green-700 whitespace-nowrap font-semibold">
                                {Number(formatEther(net)).toPrecision(4)}
                              </td>
                              <td className="py-3 px-2 sm:px-3 text-xs sm:text-sm text-gray-600 max-w-[100px] sm:max-w-[200px] truncate">
                                {t.ref || <span className="text-gray-400">—</span>}
                              </td>
                            </tr>
                          );
                        })}
                        {!recRows.length && (
                          <tr>
                            <td colSpan={5} className="py-12 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-gray-500 text-sm">No tips received yet</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <button
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg px-3 sm:px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
                    disabled={pageR === 0}
                    onClick={() => setPageR(p => Math.max(0, p - 1))}
                  >
                    ← Previous
                  </button>
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">
                    Page {pageR + 1}
                  </span>
                  <button
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg px-3 sm:px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
                    disabled={!hasMore}
                    onClick={() => setPageR(p => p + 1)}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}