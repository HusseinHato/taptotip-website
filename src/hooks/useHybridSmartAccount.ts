// src/hooks/useHybridSmartAccount.ts
import { useEffect, useState } from 'react'
import { useWalletClient } from 'wagmi'
import { getAddress, type Hex } from 'viem'
import { Implementation, toMetaMaskSmartAccount } from '@metamask/delegation-toolkit'
import { publicClient } from '@/lib/aaClient'

type State =
  | { state: 'idle'; }
  | { state: 'ready'; address: `0x${string}`; deployed: boolean; smartAccount: any }
  | { state: 'error'; error: string }

export function useHybridSmartAccount(): State {
  const { data: walletClient } = useWalletClient()
  const [st, setSt] = useState<State>({ state: 'idle' })

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        if (!walletClient) return
        const [owner] = await walletClient.getAddresses()

        // Hybrid SA with the connected wallet as owner
        const smartAccount = await toMetaMaskSmartAccount({
          client: publicClient,
          implementation: Implementation.Hybrid,
          deployParams: [getAddress(owner), [], [], []], // [owner, passkeyIds, pubX, pubY]
          deploySalt: '0x',
          signer: { walletClient },
        })

        const address = smartAccount.address as `0x${string}`
        const code = (await publicClient.getCode({ address })) as Hex | undefined
        const deployed = !!code && code !== '0x'
        if (alive) setSt({ state: 'ready', address, deployed, smartAccount })
      } catch (e: any) {
        if (alive) setSt({ state: 'error', error: e?.message ?? 'Failed to create SA' })
      }
    })()
    return () => { alive = false }
  }, [walletClient])

  return st
}
