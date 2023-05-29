import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const config = {
  solidity: {
    version: '0.8.18',
  },
  networks: {
    sepolia: {
      url: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: 'FD6N49K9PV6E5W2481VMZJV9XW2HNS24FD',
  },
} satisfies HardhatUserConfig;

export default config;
