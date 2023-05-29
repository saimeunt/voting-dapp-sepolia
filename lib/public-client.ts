import { createPublicClient, http } from 'viem';

const hardhat = {
  id: 311337,
  name: 'Hardhat',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
};

const sepolia = {
  id: 11155111,
  network: 'sepolia',
  name: 'Sepolia',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'SEP',
    decimals: 18,
  },
  rpcUrls: {
    alchemy: {
      http: ['https://eth-sepolia.g.alchemy.com/v2'],
      webSocket: ['wss://eth-sepolia.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://sepolia.infura.io/v3'],
      webSocket: ['wss://sepolia.infura.io/ws/v3'],
    },
    default: {
      http: ['https://rpc.sepolia.org'],
    },
    public: {
      http: ['https://rpc.sepolia.org'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11' as `0x${string}`,
      blockCreated: 6507670,
    },
  },
  testnet: true,
};

const developmentPublicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

const productionPublicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL),
});

const publicClient =
  process.env.NODE_ENV !== 'production' ? developmentPublicClient : productionPublicClient;

export default publicClient;
