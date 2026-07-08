import { defineChain } from "viem";

/** DeFi Oracle Meta Mainnet — Chain ID 138 (EVM, EIP-155). */
export const defiOracleMetaMainnet = defineChain({
  id: 138,
  name: "DeFi Oracle Meta Mainnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.d-bis.org"] },
    public: { http: ["https://rpc.d-bis.org"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://blockscout.defi-oracle.io",
    },
  },
});
