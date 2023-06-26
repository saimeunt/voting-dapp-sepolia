'use client';
import { useIsClient } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import Steps from './steps';
// import Heading from './heading';
import VotersTable from './voters-table';
import ProposalsTable from './proposals-table';
import { WorkflowStatus, Voter, Proposal } from '../../lib/types';

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
  return (
    <main className="py-4">
      {/* <Heading status={status} /> */}
      {isClient && isOwner && (
        <>
          <Steps status={status} />
          <VotersTable voters={voters} status={status} />
        </>
      )}
      {isClient && isVoter && <ProposalsTable proposals={proposals} status={status} />}
    </main>
  );
};

export default Main;
