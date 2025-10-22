import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { isAddress, checksumAddress } from "viem";

// Small helper (optional pretty “0xABCD…1234”)
const short = (a: string) => a ? `${a.slice(0,6)}…${a.slice(-4)}` : "";

type Props = {
  /** The address you want to receive tips at (from your wallet / profile). */
  myAddress?: `0x${string}`;
  /** Optional campaign/ref (appears in TipJar event). */
  refTag?: string;
  /** Optional: override base URL (defaults to window.location.origin). */
  baseUrl?: string;
};

export default function ShareMyTip({ myAddress, refTag = "", baseUrl }: Props) {
  const origin = baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const validRecipient = useMemo(
    () => (myAddress && isAddress(myAddress)) ? checksumAddress(myAddress) : undefined,
    [myAddress]
  );

  const tipLink = useMemo(() => {
    const url = new URL("/tip", origin || "http://localhost");
    if (validRecipient) url.searchParams.set("to", validRecipient);
    if (refTag) url.searchParams.set("ref", refTag);
    return url.toString();
  }, [origin, validRecipient, refTag]);

  const [qrPng, setQrPng] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function gen() {
      if (!validRecipient) { setQrPng(""); return; }
      try {
        const png = await QRCode.toDataURL(tipLink, { width: 512, margin: 1 });
        if (!cancelled) setQrPng(png);
      } catch (e) { console.error(e); }
    }
    gen();
    return () => { cancelled = true; };
  }, [tipLink, validRecipient]);

  async function shareLink() {
    if (!validRecipient) return alert("Connect or provide your address first.");
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Tip me in MON",
          text: "Open this to tip me instantly:",
          url: tipLink,
        });
      } else {
        await navigator.clipboard.writeText(tipLink);
        alert("Link copied to clipboard!");
      }
    } catch (e) {
      // Fallback to copy
      await navigator.clipboard.writeText(tipLink);
      alert("Link copied to clipboard!");
    }
  }

  async function downloadQrPng() {
    if (!qrPng) return;
    const res = await fetch(qrPng);
    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `tip-${validRecipient?.slice(0,10)}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    
<div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-100">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Share Your Tip Page</h3>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Share your personalized link or QR code to receive tips effortlessly
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Wallet Address Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <label className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide mb-2 block">
              Your Wallet Address
            </label>
            <div className="text-xs sm:text-sm text-gray-900 break-all">
              {validRecipient ?? "—"}
            </div>
          </div>

          {/* Shareable Link Section */}
          <div className="space-y-3">
            <label className="text-sm sm:text-base font-semibold text-gray-900 block">
              Shareable Link
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                className="flex-1 border border-gray-300 rounded-xl p-3 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                readOnly 
                value={tipLink} 
              />
              <button 
                className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl px-4 sm:px-6 py-3 transition-colors shadow-sm hover:shadow-md whitespace-nowrap text-sm sm:text-base" 
                onClick={shareLink}
              >
                📋 Share / Copy
              </button>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Share this link with anyone who wants to tip you — your address is already included
            </p>
          </div>

          {/* QR Code Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-6 border border-gray-200">
            <label className="text-sm sm:text-base font-semibold text-gray-900 block mb-4">
              QR Code
            </label>
            
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* QR Code Display */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                {qrPng ? (
                  <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200">
                    <img 
                      src={qrPng} 
                      width={160} 
                      height={160} 
                      alt="Tip QR Code" 
                      className="rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-white rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center p-4">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      <p className="text-xs text-gray-500">QR code unavailable</p>
                    </div>
                  </div>
                )}
              </div>

              {/* QR Code Info */}
              <div className="flex-1 space-y-3 w-full">
                <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-700 mb-2">
                    <span className="font-semibold text-gray-900">Scan to tip:</span>
                  </p>
                  <code className="text-xs text-gray-600 break-all block bg-gray-50 p-2 rounded">
                    /tip?to={short(validRecipient || "")}{refTag ? `&ref=${refTag}` : ""}
                  </code>
                </div>
                
                <button
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl px-4 sm:px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md text-sm sm:text-base"
                  disabled={!qrPng}
                  onClick={downloadQrPng}
                >
                  ⬇️ Download QR Code
                </button>

                {!qrPng && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2">
                    Enter a valid wallet address to generate QR code
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-xs sm:text-sm text-blue-900">
                <p className="font-medium mb-1">How it works</p>
                <p className="text-blue-800">
                  When someone opens your link or scans your QR code, they'll see your wallet address already filled in. They just need to enter the tip amount and send!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
