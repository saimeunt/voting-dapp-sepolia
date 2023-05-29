declare namespace NodeJS {
  interface ProcessEnv {
    // system
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly VERCEL_ENV: 'development' | 'preview' | 'production';
    readonly VERCEL_URL: string;
    readonly VERCEL_GIT_COMMIT_REF: string;
    // private
    readonly ACCOUNT_PRIVATE_KEY: string;
    // public
    readonly NEXT_PUBLIC_ALCHEMY_API_KEY: string;
    readonly NEXT_PUBLIC_ALCHEMY_SEPOLIA_URL: string;
    readonly NEXT_PUBLIC_CONTRACT_ADDRESS: `0x${string}`;
    readonly NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: string;
  }
}
