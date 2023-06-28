import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { getContract, isAddress } from 'viem';

import { abi } from './abi';
import publicClient from './public-client';
import { WorkflowStatus } from './types';
import { ZeroAddress } from './utils';
import { Voter, Proposal } from './types';

const contract = getContract({
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  abi,
  publicClient,
});

export const getOwner = () => contract.read.owner();

export const getStatus = async (): Promise<WorkflowStatus> => {
  const rawStatus = await contract.read.workflowStatus();
  return rawStatus as WorkflowStatus;
};

export const getVoters = async (): Promise<Voter[]> => {
  const [voterRegisteredLogs, votedLogs] = await Promise.all([
    publicClient.getLogs({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      event: {
        type: 'event',
        name: 'VoterRegistered',
        inputs: [{ type: 'address', name: 'voterAddress' }],
      },
      fromBlock: BigInt(0),
    }),
    publicClient.getLogs({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      event: {
        type: 'event',
        name: 'Voted',
        inputs: [
          { type: 'address', name: 'voter' },
          { type: 'uint256', name: 'proposalId' },
        ],
      },
      fromBlock: BigInt(0),
    }),
  ]);
  const voterAddresses = voterRegisteredLogs.map(({ args }) => args.voterAddress || ZeroAddress);
  return voterAddresses.map((voterAddress) => {
    const voted = votedLogs.find(({ args }) => args.voter === voterAddress);
    return {
      address: voterAddress,
      isRegistered: true,
      hasVoted: voted !== undefined,
      votedProposalId: voted ? voted.args.proposalId || BigInt(0) : BigInt(0),
    };
  });
};

export const getProposals = async (): Promise<Proposal[]> => {
  const [proposalRegisteredLogs, voterRegisteredLogs] = await Promise.all([
    publicClient.getLogs({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      event: {
        type: 'event',
        name: 'ProposalRegistered',
        inputs: [{ type: 'uint256', name: 'proposalId' }],
      },
      fromBlock: BigInt(0),
    }),
    publicClient.getLogs({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      event: {
        type: 'event',
        name: 'VoterRegistered',
        inputs: [{ type: 'address', name: 'voterAddress' }],
      },
      fromBlock: BigInt(0),
    }),
  ]);
  const firstVoter = voterRegisteredLogs[0] || { args: {} };
  const account = firstVoter.args.voterAddress;
  if (!account) {
    return [];
  }
  const proposalIds = proposalRegisteredLogs.map(({ args }) => args.proposalId || BigInt(0));
  return Promise.all(
    proposalIds.map(async (id) => {
      const { description, voteCount } = await contract.read.getOneProposal([id], { account });
      return { id, description, voteCount };
    }),
  );
};

export const getWinningProposalId = () => contract.read.winningProposalID();

export const useAddVoter = (voterAddress: `0x${string}`, onError: () => void) => {
  const { config, isError: isPrepareError } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi,
    functionName: 'addVoter',
    args: [voterAddress],
    enabled: isAddress(voterAddress),
    onError,
  });
  const {
    data,
    write: addVoter,
    isError,
  } = useContractWrite({
    ...config,
    onError,
  });
  return { data, addVoter, isPrepareError, isError };
};

export const useSetVote = (votedProposalId: bigint) => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi,
    functionName: 'setVote',
    args: [votedProposalId],
  });
  const { data, write: setVote } = useContractWrite(config);
  return { data, setVote };
};

export const useAddProposal = (proposal: string, onError: () => void) => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi,
    functionName: 'addProposal',
    args: [proposal],
    onError,
  });
  const { data, write: addProposal } = useContractWrite({ ...config, onError });
  return { data, addProposal };
};

export const useStartProposalsRegistering = () => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi,
    functionName: 'startProposalsRegistering',
  });
  const { data, write: startProposalsRegistering } = useContractWrite(config);
  return { data, startProposalsRegistering };
};

export const useEndProposalsRegistering = () => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi,
    functionName: 'endProposalsRegistering',
  });
  const { data, write: endProposalsRegistering } = useContractWrite(config);
  return { data, endProposalsRegistering };
};

export const useStartVotingSession = () => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi,
    functionName: 'startVotingSession',
  });
  const { data, write: startVotingSession } = useContractWrite(config);
  return { data, startVotingSession };
};

export const useEndVotingSession = () => {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi,
    functionName: 'endVotingSession',
  });
  const { data, write: endVotingSession } = useContractWrite(config);
  return { data, endVotingSession };
};

export default contract;
