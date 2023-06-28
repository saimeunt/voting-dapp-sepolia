'use client';
import { useIsClient } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import { WorkflowStatus, Voter, Proposal, WorkflowStatuses } from '../../lib/types';
import EmptyState from './empty-state';
import Heading from './heading';
import Steps from './steps';
import VotersTable from './voters-table';
import ProposalsTable from './proposals-table';
import Result from './result';

const Main = ({
  owner,
  status,
  voters,
  proposals,
  winningProposalId,
}: {
  owner: `0x${string}`;
  status: WorkflowStatus;
  voters: Voter[];
  proposals: Proposal[];
  winningProposalId: bigint;
}) => {
  const isClient = useIsClient();
  const { address } = useAccount();
  const isOwner = address === owner;
  const voter = voters.find((voter) => voter.address === address);
  const isVoter = voter !== undefined;
  const votedProposal = proposals.find(({ id }) => id === voter?.votedProposalId);
  const isOwnerOrIsVoter = isOwner || isVoter;
  const showEmptyState = !address || !isOwnerOrIsVoter;
  const showVoters = isOwner && status !== WorkflowStatuses.VotingSessionEnded;
  const showProposals =
    status === WorkflowStatuses.ProposalsRegistrationStarted ||
    status === WorkflowStatuses.ProposalsRegistrationEnded ||
    status === WorkflowStatuses.VotingSessionStarted;
  const winningProposal = proposals.find(({ id }) => id === winningProposalId);
  const showResult = status === WorkflowStatuses.VotingSessionEnded && winningProposal;
  return (
    isClient && (
      <main className="py-4">
        {showEmptyState ? (
          <EmptyState address={address} />
        ) : (
          <>
            <Heading address={address} isOwner={isOwner} votedProposal={votedProposal} />
            <Steps status={status} isOwner={isOwner} />
            {showVoters && <VotersTable status={status} voters={voters} proposals={proposals} />}
            {showProposals && (
              <ProposalsTable status={status} proposals={proposals} voter={voter} />
            )}
            {showResult && <Result winningProposal={winningProposal} />}
          </>
        )}
      </main>
    )
  );
};

export default Main;
