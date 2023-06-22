'use client';
import { ReactNode } from 'react';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import wagmiConfig, { chains } from '../../lib/wagmi-config';
import ContextProvider from './context/provider';
// import Web3Modal from './web3modal';

const Providers = ({ children }: { children: ReactNode }) => (
  <WagmiConfig config={wagmiConfig()}>
    <RainbowKitProvider chains={chains}>
      <ContextProvider>
        {children}
        {/* <Web3Modal /> */}
      </ContextProvider>
    </RainbowKitProvider>
  </WagmiConfig>
);

export default Providers;
