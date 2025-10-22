import { createConfig, http } from 'wagmi'
import { monadTestnet } from 'wagmi/chains'

const VITE_RPC_URL = import.meta.env.VITE_RPC_URL || "https://testnet-rpc.monad.xyz";

export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(VITE_RPC_URL),
  },
})