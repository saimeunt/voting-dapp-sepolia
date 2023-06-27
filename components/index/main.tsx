'use client';
import { useIsClient } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import EmptyState from './empty-state';
import Heading from './heading';
import Steps from './steps';
import VotersTable from './voters-table';
import ProposalsTable from './proposals-table';
import { WorkflowStatus, Voter, Proposal, WorkflowStatuses } from '../../lib/types';

const Main = ({
  owner,
  status,
  voters,
  proposals,
}: {
  owner: `0x${string}`;
  status: WorkflowStatus;
  voters: Voter[];
  proposals: Proposal[];
}) => {
  const isClient = useIsClient();
  const { address } = useAccount();
  const isOwner = address === owner;
  const isVoter = voters.find((voter) => voter.address === address) !== undefined;
  const showEmptyState = !address || (!isOwner && !isVoter);
  const showHeading = isOwner || isVoter;
  const showProposals =
    isVoter &&
    (status === WorkflowStatuses.ProposalsRegistrationStarted ||
      status === WorkflowStatuses.ProposalsRegistrationEnded ||
      status === WorkflowStatuses.VotingSessionStarted);
  return (
    isClient && (
      <main className="py-4">
        {showEmptyState && <EmptyState address={address} />}
        {showHeading && <Heading address={address} isOwner={isOwner} />}
        {isOwner && (
          <>
            <Steps status={status} />
            <VotersTable status={status} voters={voters} proposals={proposals} />
          </>
        )}
        {showProposals && <ProposalsTable status={status} proposals={proposals} />}
      </main>
    )
  );
};

export default Main;
