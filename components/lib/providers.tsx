'use client';
import { ReactNode } from 'react';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { indigo } from 'tailwindcss/colors';

import wagmiConfig, { chains } from '../../lib/wagmi-config';
import ContextProvider from './context/provider';

const Providers = ({ children }: { children: ReactNode }) => (
  <WagmiConfig config={wagmiConfig()}>
    <RainbowKitProvider theme={darkTheme({ accentColor: indigo[500] })} chains={chains}>
      <ContextProvider>{children}</ContextProvider>
    </RainbowKitProvider>
  </WagmiConfig>
);

export default Providers;
