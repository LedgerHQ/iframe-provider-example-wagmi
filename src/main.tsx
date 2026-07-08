/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IFrameEthereumProvider as IFrameEthereumProviderClass,
  type IFrameEthereumProviderEventTypes,
} from "@ledgerhq/iframe-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { custom, type EIP1193EventMap } from "viem";
import { createConfig, WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import App from "./App.tsx";
import { defiOracleMetaMainnet } from "./chains.ts";
import "./index.css";

class EIP1193Provider extends IFrameEthereumProviderClass {
  /**
   * EIP-1193 request interface to send request.
   * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#request
   * @param args request arguments
   * @param args.method method to send to the parent provider
   * @param args.params parameters to send
   */
  public async request<TParams = any[], TResult = any>({
    method,
    params,
  }: {
    method: string;
    params?: TParams;
  }): Promise<TResult> {
    return this.send<TParams, TResult>(method, params);
  }

  removeListener<
    T extends IFrameEthereumProviderEventTypes | keyof EIP1193EventMap
  >(
    event: T,
    fn?: ((...args: any[]) => void) | undefined,
    context?: any,
    once?: boolean
  ): this {
    return this.off(
      event as IFrameEthereumProviderEventTypes,
      fn,
      context,
      once
    );
  }
}

const provider = new EIP1193Provider();
const transport = custom(provider);

const config = createConfig({
  chains: [mainnet, defiOracleMetaMainnet],
  connectors: [
    injected({
      target() {
        return {
          id: "some random id, see docs",
          name: "some random name, see docs",
          provider: provider,
        };
      },
    }),
  ],
  transports: {
    [mainnet.id]: transport,
    [defiOracleMetaMainnet.id]: transport,
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
