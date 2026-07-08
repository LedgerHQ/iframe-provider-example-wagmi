# Ledger EVM iframe-provider example with wagmi

This template provides a minimal example to get wagmi working with Ledger iframe-provider in the dApp-browser v2.

We need to create an EIP-1193 compatible provider from the iframe-provider, you can do it this way

```ts
import {
  IFrameEthereumProvider as IFrameEthereumProviderClass,
  type IFrameEthereumProviderEventTypes,
} from "@ledgerhq/iframe-provider";
import { custom, type EIP1193EventMap } from "viem";

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
```

Then we can use this provider and the transport created with viem to create the wagmi config

```ts
import { createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const config = createConfig({
  chains: [mainnet],
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
```

## DeFi Oracle Meta Mainnet (Chain ID 138)

`src/chains.ts` defines **DeFi Oracle Meta Mainnet** (chain ID 138). It is registered in the wagmi `chains` array alongside `mainnet` so dApps can target Chain 138 metadata when using the Ledger iframe provider.
