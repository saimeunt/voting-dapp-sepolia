import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
require('hardhat-gas-reporter');

dotenv.config({ path: '.env.local' });

const config = {
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
  gasReporter: {
    enabled: true,
  },

  /* etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  }, */
} satisfies HardhatUserConfig;

export default config;
