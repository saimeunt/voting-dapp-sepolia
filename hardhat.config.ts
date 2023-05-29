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
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
} satisfies HardhatUserConfig;

export default config;
