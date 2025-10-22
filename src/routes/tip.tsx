import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "@tanstack/react-router";
import { isAddress, checksumAddress } from "viem";
import QRCode from "qrcode";
import { createFileRoute } from '@tanstack/react-router'
import { useTapToTip } from "../hooks/useTapToTip";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { Button } from "../components/ui/button";

export const Route = createFileRoute('/tip')({
  component: TipPage,
})

function buildTipLink(origin: string, to?: string, ref?: string) {
  const url = new URL("/tip", origin);
  if (to) url.searchParams.set("to", to);
  if (ref) url.searchParams.set("ref", ref);
  return url.toString();
}

export default function TipPage() {
  const location = useLocation(); // gives you .search as a Record (for typed routes you can also use useSearch)
  // When using useLocation, search is in location.search as an object for TanStack Router v1
  // Fallback in case your setup isn't typed: parse from window.location
  const search = (location as any).search ?? Object.fromEntries(new URLSearchParams(window.location.search).entries());
  const prefilledTo = typeof search.to === "string" ? search.to : undefined;
  const prefilledRef = typeof search.ref === "string" ? search.ref : "";

  const { isConnected } = useAccount();

  if (!isConnected) {
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

  const [recipient, setRecipient] = useState<string>(prefilledTo ?? "");
  const [amount, setAmount] = useState<string>("0.001");
  const [message, setMessage] = useState<string>(prefilledRef ?? "");
  const [lockRecipient, setLockRecipient] = useState<boolean>(!!prefilledTo);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [link, setLink] = useState<string>("");

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const isRecipientValid = useMemo(() => isAddress(recipient as `0x${string}`), [recipient]);

  const DECIMAL_PLACES = 6;

  // Sync state if URL has ?to= on first load
  useEffect(() => {
    if (prefilledTo && isAddress(prefilledTo as `0x${string}`)) {
      setRecipient(checksumAddress(prefilledTo as `0x${string}`));
      setLockRecipient(true);
    }
    if (prefilledRef) setMessage(prefilledRef);
  }, []); // run once

  // Build share link & QR whenever recipient/ref change and address is valid
  useEffect(() => {
    const nextLink = buildTipLink(origin, isRecipientValid ? recipient : undefined, message || undefined);
    setLink(nextLink);
    if (isRecipientValid) {
      QRCode.toDataURL(nextLink, { width: 256, margin: 1 }).then(setQrDataUrl).catch(() => setQrDataUrl(""));
    } else {
      setQrDataUrl("");
    }
  }, [origin, recipient, message, isRecipientValid]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      alert("Copy failed");
    }
  }

  const {
    authorizeTip,
    redeemTip,
    txStatus,
    revokeAll,
    hasValidDelegation,
    expiresAt,
  } = useTapToTip();

  const canSend = isConnected && recipient && Number(amount) > 0;

  const onAuthorize = useCallback(async () => {
    await authorizeTip();
    toast("Authorization successful! You can now send tips.");
  }, [authorizeTip, recipient, amount]);


  const onSend = useCallback(async () => {
    const uo = await redeemTip(recipient as `0x${string}`, amount, message);
    toast(`Submitted: ${uo}`);
  }, [redeemTip, recipient, amount]);

  const expiresHuman = useMemo(() => (expiresAt ? new Date(expiresAt * 1000).toLocaleString() : ""), [expiresAt]);

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

    setAmount(v);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 sm:px-6 py-6 sm:py-8 border-b border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Send a Tip</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Support your favorite creators with MON</p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Delegation Status Card */}
          <div className={`rounded-xl p-4 border-2 ${hasValidDelegation ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${hasValidDelegation ? 'bg-green-500' : 'bg-amber-500'}`}>
                {hasValidDelegation ? (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${hasValidDelegation ? 'text-green-900' : 'text-amber-900'}`}>
                  {hasValidDelegation ? 'Authorization Active' : 'Authorization Required'}
                </p>
                <p className={`text-xs mt-1 ${hasValidDelegation ? 'text-green-700' : 'text-amber-700'}`}>
                  {hasValidDelegation ? `Valid until ${expiresHuman}` : 'Please authorize to send tips'}
                </p>
              </div>
            </div>
            
            {!hasValidDelegation && isConnected && (
              <div className="mt-3 pt-3 border-t border-amber-300">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm text-sm sm:text-base" 
                  onClick={onAuthorize}
                >
                  Authorize Now
                </Button>
                <p className="text-xs text-amber-700 mt-2 text-center">Authorization lasts for 30 days</p>
              </div>
            )}
            
            {hasValidDelegation && isConnected && (
              <div className="mt-3 pt-3 border-t border-green-300">
                <Button 
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors text-sm" 
                  onClick={revokeAll}
                >
                  Revoke All Delegations
                </Button>
              </div>
            )}
          </div>

          {/* Tip Form */}
          <div className="space-y-4">
            {/* Recipient Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 block">Recipient Address</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-gray-300 rounded-xl p-3 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  readOnly={lockRecipient}
                />
                {prefilledTo && (
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl px-3 sm:px-4 transition-colors flex-shrink-0 text-sm"
                    onClick={() => setLockRecipient((v) => !v)}
                    title={lockRecipient ? "Unlock to edit" : "Lock"}
                  >
                    {lockRecipient ? '🔒' : '🔓'}
                  </button>
                )}
              </div>
              {!isRecipientValid && recipient && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Invalid wallet address
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 block">Amount (MON)</label>
              <input
                className="w-full border border-gray-300 rounded-xl p-3 text-base sm:text-lg font-medium bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                value={amount}
                onChange={onAmountChange}
                placeholder="0.001"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 block">
                Message <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                className="w-full border border-gray-300 rounded-xl p-3 text-sm sm:text-base bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="Thanks for the great content!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Send Button */}
            <button
              className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 sm:py-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg text-base sm:text-lg"
              disabled={!canSend}
              onClick={onSend}
            >
              {isRecipientValid 
                ? `💸 Send Tip to ${recipient.slice(0, 6)}…${recipient.slice(-4)}` 
                : '💸 Send Tip'}
            </button>

            {txStatus && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs sm:text-sm text-blue-900">{txStatus}</p>
              </div>
            )}
          </div>

          {/* Share Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 sm:p-5 border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Share This Tip Page</h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Share a link with your address pre-filled — others just add the amount
            </p>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  className="flex-1 border border-gray-300 rounded-xl p-3 text-xs bg-white" 
                  readOnly 
                  value={link} 
                />
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl px-4 py-3 transition-colors whitespace-nowrap text-sm" 
                  onClick={() => copy(link)}
                >
                  📋 Copy Link
                </button>
              </div>

              {qrDataUrl ? (
                <div className="flex flex-col sm:flex-row items-start gap-4 bg-white rounded-xl p-4 border border-gray-200">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 mx-auto sm:mx-0 flex-shrink-0">
                    <img src={qrDataUrl} width={140} height={140} alt="Tip QR Code" className="rounded" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs sm:text-sm text-gray-700">
                      Scan this QR code to open the tip page with your address pre-filled
                    </p>
                    <a 
                      className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium underline" 
                      href={qrDataUrl} 
                      download="tip-qr.png"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download QR Code
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800">
                    Enter a valid wallet address to generate shareable link & QR code
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

