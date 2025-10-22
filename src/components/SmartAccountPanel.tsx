import { useHybridSmartAccount } from "@/hooks/useHybridSmartAccount";
import { publicClient } from "@/lib/aaClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatEther, parseEther } from "viem";
import { useWalletClient } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

export default function SmartAccountPanel() {
  const [balance, setBalance] = useState<number>(0);
  const [amountToFund, setAmountToFund] = useState<string>('0.05');
  const { data: wallet } = useWalletClient()

  const DECIMAL_PLACES = 6;

  const st = useHybridSmartAccount();

  // single source of truth for fetching
  async function refreshBalance(addr?: `0x${string}`) {
    if (!addr) return;
    const bal = await publicClient.getBalance({ address: addr });
    setBalance(Number(formatEther(bal)));
  }

  const fundFromEOA = async () => {
    if (!wallet || !readyAddress) return;
    try {
      const hash = await wallet.sendTransaction({
        to: readyAddress,
        value: parseEther(amountToFund),
      });
      toast.message("Transaction sent", { description: hash });

      // wait for it to be mined, then refresh
      await publicClient.waitForTransactionReceipt({ hash });
      await refreshBalance(readyAddress);
      toast.success("Funds received by Smart Account ✅");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.shortMessage ?? e?.message ?? "Failed to fund");
    }
  };

  const readyAddress = st.state === "ready" ? st.smartAccount.address : undefined;

  useEffect(() => {
    if (!readyAddress) return;
    let active = true;

    (async () => {
      if (!active) return;
      await refreshBalance(readyAddress);
    })();

    // Subscribe to new blocks and refresh on each block
    const unwatch = publicClient.watchBlocks({
      poll: true,                // works with HTTP transport
      pollingInterval: 4000,     // ~4s; tweak to taste
      onBlock: async () => {
        if (!active) return;
        await refreshBalance(readyAddress);
      },
      onError: (err) => console.error("watchBlocks error:", err),
    });

    return () => {
      active = false;
      unwatch?.();
    };
  }, [readyAddress]);

  if (st.state !== "ready") {
    return (
      <div className="p-4 border rounded-md">
        <h2 className="text-lg font-semibold mb-4">Smart Account</h2>
        <p>Loading smart account details...</p>
      </div>
    );
  }

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;

    // 1) normalize & sanitize ----------------------------------------------
    v = v.trim()
      .replace(",", ".")           // allow comma decimals from some keyboards
      .replace(/[^0-9.]/g, "");    // whitelist digits + one dot only

    // collapse multiple dots to a single dot (keep first)
    const parts = v.split(".");
    if (parts.length > 2) v = parts[0] + "." + parts.slice(1).join("");

    // limit decimal places
    if (v.includes(".")) {
      const [i, d] = v.split(".");
      v = i + "." + (d ?? "").slice(0, DECIMAL_PLACES);
    }

    // avoid "00…" integers (but keep "0.x")
    if (!v.includes(".")) v = v.replace(/^0+(?=\d)/, "0");

    setAmountToFund(v);
  }

  return (
    <div className="mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 sm:px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Smart Account</h2>
              <p className="text-xs sm:text-sm text-gray-600">Manage your smart contract wallet</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {st.state === "ready" ? (
            <>
              {/* Account Details */}
              <div className="space-y-3">
                {/* Address Card */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                    Smart Account Address
                  </label>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm text-gray-900 truncate flex-1">
                      {st.address}
                    </p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(st.address)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex-shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Deployment Status */}
                  <div className={`rounded-xl p-4 border-2 ${
                    st.deployed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${
                        st.deployed ? 'bg-green-500' : 'bg-amber-500'
                      }`}></div>
                      <label className="text-xs font-semibold uppercase tracking-wide ${
                        st.deployed ? 'text-green-700' : 'text-amber-700'
                      }">
                        Status
                      </label>
                    </div>
                    <p className={`text-base sm:text-lg font-bold ${
                      st.deployed ? 'text-green-900' : 'text-amber-900'
                    }`}>
                      {st.deployed ? 'Deployed' : 'Not Deployed'}
                    </p>
                  </div>

                  {/* Balance */}
                  <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-200">
                    <label className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1 block">
                      Balance
                    </label>
                    <p className="text-base sm:text-lg font-bold text-indigo-900">
                      {balance} <span className="text-sm text-indigo-700">MON</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              {!st.deployed && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm mb-1">Setup Required</h4>
                      <p className="text-xs sm:text-sm text-blue-800">
                        Your smart account isn't deployed yet. Follow these steps: <strong>1.</strong> Authorize → <strong>2.</strong> Fund Smart Account → <strong>3.</strong> Start Tipping
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Funding Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Fund Your Smart Account</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Amount to Fund (MON)
                    </label>
                    <Input
                      type="text"
                      value={amountToFund}
                      onChange={onAmountChange}
                      className="w-full border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 text-base outline-none transition-all"
                      placeholder="0.00"
                      inputMode="decimal"
                    />
                  </div>

                  <Button
                    onClick={fundFromEOA}
                    disabled={!wallet}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {wallet ? 'Fund from My Wallet' : 'Connect Wallet First'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Loading smart account details...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}