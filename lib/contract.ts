import { getContract } from 'viem';

import { abi } from './abi';
import publicClient from './public-client';
import { WorkflowStatus } from './types';

const contract = getContract({
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  abi,
  publicClient,
});

export const getStatus = async (): Promise<WorkflowStatus> => {
  const rawStatus = await contract.read.workflowStatus();
  return rawStatus as WorkflowStatus;
};

export default contract;
