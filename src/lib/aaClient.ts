import {
    createPublicClient,
    http,
} from "viem";
import { createBundlerClient } from "viem/account-abstraction";
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { monadTestnet } from "viem/chains";

const BUNDLER_RPC = import.meta.env.VITE_BUNDLER_URL || "";

export const publicClient = createPublicClient({ chain: monadTestnet, transport: http() });
export const bundlerClient = createBundlerClient({
    client: publicClient, transport: http(BUNDLER_RPC),
});

export const pimlicoClient = createPimlicoClient({ transport: http(BUNDLER_RPC) });