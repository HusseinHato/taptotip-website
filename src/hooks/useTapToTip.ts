"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
    parseEther,
    encodeFunctionData,
    pad
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { publicClient } from "../lib/aaClient";
import { useHybridSmartAccount } from "./useHybridSmartAccount";
import {
    createDelegation,
    createExecution,
    ExecutionMode,
    getDeleGatorEnvironment,
} from "@metamask/delegation-toolkit";
import { DelegationManager } from "@metamask/delegation-toolkit/contracts";
import { createWalletClient, http } from "viem";
import { monadTestnet } from "viem/chains";
import { useWalletClient } from 'wagmi'

const TIPJAR_ADDRESS = "0xd0C2Dd16fd7692A0d550d108ef0d928CD7091E8C" as const;
const TIPJAR_ABI = [
    {
        type: "function",
        name: "tipTo",
        stateMutability: "payable",
        inputs: [
            { name: "to", type: "address" },
            { name: "ref", type: "string" },
        ],
        outputs: [],
    },
] as const;

// Minimal ABI for NonceEnforcer.incrementNonce(address)
const NONCE_ENFORCER_ABI = [
    {
        type: "function",
        name: "incrementNonce",
        stateMutability: "nonpayable",
        inputs: [{ name: "delegationManager", type: "address" }],
        outputs: [],
    },
] as const;

const BUNDLER_RPC = import.meta.env.VITE_BUNDLER_URL || ""; // required for smart-account delegate path
const env = getDeleGatorEnvironment(monadTestnet.id);
const NONCE_ENFORCER_ADDR = import.meta.env.VITE_NONCE_ENFORCER as `0x${string}` | undefined;

function cacheKey({ chainId, delegator, delegate, tipjar }: { chainId: number; delegator: string; delegate: string; tipjar: string; }) {
    return `tapToTip:delegation:v1:${chainId}:${delegator}:${delegate}:${tipjar}`;
}

function saveDelegation(key: string, payload: any) { localStorage.setItem(key, JSON.stringify(payload)); }
function loadDelegation(key: string) { const s = localStorage.getItem(key); return s ? JSON.parse(s) : null; }
function clearDelegation(key: string) { localStorage.removeItem(key); }

// ---- Core flow encapsulated in a single hook ----
export function useTapToTip() {
    const { address: eoaAddress, isConnected } = useAccount();
    const { data: wagmiWalletClient } = useWalletClient();

    const st = useHybridSmartAccount();
    const [signedDelegation, setSignedDelegation] = useState<any>();
    const [txStatus, setTxStatus] = useState<string>("");

    const [expiresAt, setExpiresAt] = useState<number>(0);
    const [nonceTag, setNonceTag] = useState<string>("0x01"); // bind delegations to this nonce tag

    const delegateAccount = privateKeyToAccount(import.meta.env.VITE_DELEGATE_PK as `0x${string}`);
    const delegateWallet = createWalletClient({
        account: delegateAccount,
        chain: monadTestnet,
        transport: http(), // uses your default RPC for 'chain'
    });

    useEffect(() => {
        const key = cacheKey({ chainId: monadTestnet.id, delegator: st?.address, delegate: delegateAccount.address, tipjar: TIPJAR_ADDRESS });
        const cached = loadDelegation(key);
        if (cached) {
            const now = Math.floor(Date.now() / 1000);
            if (cached.expiresAt && cached.expiresAt > now && cached.signedDelegation) {
                setSignedDelegation(cached.signedDelegation);
                setExpiresAt(cached.expiresAt);
                if (cached.nonceTag) setNonceTag(cached.nonceTag);
            } else {
                clearDelegation(key);
            }
        }
    }, [st]);


    // 3) Create & sign a strict delegation (nativeTokenTransferAmount + allowedTargets + short expiry)
    const authorizeTip = useCallback(
        async (ttlDays = 30) => {
            if (!st) throw new Error("Create delegator smart account first");

            const DAY = 24 * 60 * 60;
            const MAX_TS = 253402300799;    

            const nowSec = Math.floor(Date.now() / 1000); // SECONDS, not ms
            const ttlDaysNum = Number(ttlDays) || 30;     // default 30 days if missing/NaN
            const ttlSec = Math.max(1, Math.min(ttlDaysNum * DAY, MAX_TS - nowSec)); // clamp

            const afterThreshold  = Math.max(0, nowSec - 5);
            const beforeThreshold = Math.min(nowSec + ttlSec, MAX_TS);

            const caveats: any[] = [
                { type: "timestamp", afterThreshold: afterThreshold, beforeThreshold: beforeThreshold },
            ];

            const delegation = createDelegation({
                from: st?.address,
                to: delegateAccount.address,
                environment: st?.smartAccount?.environment,
                scope: {
                    type: "functionCall",
                    targets: [TIPJAR_ADDRESS],
                    selectors: ["tipTo(address,string)"],
                },
                caveats: caveats
            });


            const signature = await st?.smartAccount.signDelegation({ delegation });
            const signed = { ...delegation, signature };

            // Cache
            const key = cacheKey({ chainId: monadTestnet.id, delegator: st?.address, delegate: delegateAccount.address, tipjar: TIPJAR_ADDRESS });
            saveDelegation(key, { signedDelegation: signed, expiresAt: beforeThreshold, nonceTag });


            setSignedDelegation(signed);
            setExpiresAt(beforeThreshold);

            return signed;
        },
        [st, nonceTag]
    );

    // 4) Redeem: execute native MON transfer through the Delegation Manager
    const redeemTip = useCallback(
        async (recipient: `0x${string}`, amountEth: string, message: string) => {
            if (!signedDelegation) throw new Error("No signed delegation. Click Authorize Tip first.");
            if (!BUNDLER_RPC) throw new Error("VITE_BUNDLER_RPC missing.");


            const amountWei = parseEther(amountEth);
            const data = encodeFunctionData({
                abi: TIPJAR_ABI,
                functionName: "tipTo",
                args: [recipient, message],
            });


            const execution = createExecution({
                target: TIPJAR_ADDRESS,
                value: amountWei,
                callData: data,
            });


            const calldata = DelegationManager.encode.redeemDelegations({
                delegations: [[signedDelegation]],
                modes: [ExecutionMode.SingleDefault],
                executions: [[execution]],
            });

            setTxStatus("Submitting user operation…");

            const txHash = await delegateWallet.sendTransaction({
                to: env.DelegationManager,
                data: calldata,
                // DO NOT set `value` here — the tip value is inside `execution`.
            });


            setTxStatus(`UserOperation submitted: ${txHash}`);
            return txHash;
        },
        [signedDelegation, env.DelegationManager]
    );

    const revokeAll = useCallback(async () => {
        if (!eoaAddress) throw new Error("Sign in first");
        if (!NONCE_ENFORCER_ADDR) throw new Error("Set VITE_NONCE_ENFORCER");

        setTxStatus("Revoking…");
        const data = encodeFunctionData({ abi: NONCE_ENFORCER_ABI, functionName: "incrementNonce", args: [env.DelegationManager] });
        const txHash = await wagmiWalletClient.sendTransaction({ to: NONCE_ENFORCER_ADDR, data });
        await publicClient.waitForTransactionReceipt({ hash: txHash });


        // Clear cache for this delegator/delegate pair
        if (st) {
            const key = cacheKey({ chainId: monadTestnet.id, delegator: st?.address, delegate: delegateAccount.address, tipjar: TIPJAR_ADDRESS });
            clearDelegation(key);
            setSignedDelegation(undefined);
        }


        setTxStatus("Revoked (nonce incremented)");
        return txHash;
    }, [wagmiWalletClient, st, NONCE_ENFORCER_ADDR, env.DelegationManager]);


    const hasValidDelegation = !!signedDelegation && Math.floor(Date.now() / 1000) < (expiresAt || 0);

    return {
        isConnected,
        authorizeTip,
        redeemTip,
        revokeAll,
        hasValidDelegation,
        expiresAt,
        nonceTag,
        setNonceTag,
        txStatus,
    };
}