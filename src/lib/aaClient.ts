import {
    createPublicClient,
    http,
} from "viem";

import { monadTestnet } from "viem/chains";

const RPC_URL = import.meta.env.VITE_RPC_URL || "https://testnet-rpc.monad.xyz";

export const publicClient = createPublicClient({ chain: monadTestnet, transport: http(RPC_URL) });
