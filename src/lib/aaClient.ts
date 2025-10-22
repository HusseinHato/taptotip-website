import {
    createPublicClient,
    http,
} from "viem";
import { createBundlerClient } from "viem/account-abstraction";
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { monadTestnet } from "viem/chains";

const BUNDLER_RPC = import.meta.env.VITE_BUNDLER_URL || "";
const RPC_URL = import.meta.env.VITE_RPC_URL || "https://testnet-rpc.monad.xyz";

export const publicClient = createPublicClient({ chain: monadTestnet, transport: http(RPC_URL) });
export const bundlerClient = createBundlerClient({
    client: publicClient, transport: http(BUNDLER_RPC),
});

export const pimlicoClient = createPimlicoClient({ transport: http(BUNDLER_RPC) });