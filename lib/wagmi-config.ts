import { createConfig, configureChains } from 'wagmi';
import { hardhat, sepolia } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { alchemyProvider } from 'wagmi/providers/alchemy';
// import { w3mConnectors } from '@web3modal/ethereum';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

const developmentChains = [hardhat];
const productionChains = [sepolia];

export const chains = process.env.NODE_ENV !== 'production' ? developmentChains : productionChains;

/* const connectors = w3mConnectors({
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  version: 2,
  chains,
}); */
const { connectors } = getDefaultWallets({
  appName: 'Voting dApp',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chains,
});

const developmentWagmiConfig = () => {
  const { publicClient } = configureChains(developmentChains, [
    jsonRpcProvider({ rpc: () => ({ http: hardhat.rpcUrls.default.http[0] }) }),
  ]);
  return createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });
};

const productionWagmiConfig = () => {
  const { publicClient } = configureChains(productionChains, [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  ]);
  return createConfig({
    connectors,
    publicClient,
  });
};

const wagmiConfig = () =>
  process.env.NODE_ENV !== 'production' ? developmentWagmiConfig() : productionWagmiConfig();

export default wagmiConfig;
