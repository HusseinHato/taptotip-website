import { createConfig, http } from 'wagmi'
import { monadTestnet } from 'wagmi/chains'

const VITE_RPC_URL = import.meta.env.VITE_RPC_URL as string;

export const config = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(VITE_RPC_URL),
  },
})