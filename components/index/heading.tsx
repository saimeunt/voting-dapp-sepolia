'use client';
import { useRouter } from 'next/navigation';
import { useIsClient } from 'usehooks-ts';
import { useAccount } from 'wagmi';
import { useWaitForTransaction } from 'wagmi';
import clsx from 'clsx';

import { WorkflowStatus, WorkflowStatuses, statusToString } from '../../lib/types';
import { useStartProposalsRegistering, useEndProposalsRegistering, useStartVoting, useEndVoting } from '../../lib/contract';

const WorkflowStatusBadge = ({ status }: { status: WorkflowStatus }) => (
  <span
    className={clsx(
      'ml-4 inline-flex items-center rounded-md px-2 py-1 font-medium ring-1 ring-inset',
      {
        'bg-green-500/10 text-green-400 ring-green-500/20':
          status === WorkflowStatuses.RegisteringVoters,
        'bg-blue-500/10 text-blue-400 ring-blue-500/20':
          status === WorkflowStatuses.ProposalsRegistrationStarted,
        'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20':
          status === WorkflowStatuses.ProposalsRegistrationEnded,
        'bg-purple-500/10 text-purple-400 ring-purple-500/20':
          status === WorkflowStatuses.VotingSessionStarted,
        'bg-pink-500/10 text-pink-400 ring-pink-500/20':
          status === WorkflowStatuses.VotingSessionEnded,
        'bg-red-500/10 text-red-400 ring-red-500/20': status === WorkflowStatuses.VotesTallied,
      },
    )}
  >
    {statusToString(status)}
  </span>
);

const ChangeWorkflowStatusButton = ({
  text,
  onClick,
  isLoading,
}: {
  text: string;
  onClick?: () => void;
  isLoading: boolean;
}) => (
  <button
    type="button"
    className={clsx(
      'ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
      { 'bg-indigo-300': isLoading, 'bg-indigo-500': !isLoading },
    )}
    onClick={onClick}
  >
    {text}
  </button>
);

const StartProposalsRegisteringButton = () => {
  const router = useRouter();
  const { data, startProposalsRegistering } = useStartProposalsRegistering();
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => router.refresh(),
  });
  return (
    <ChangeWorkflowStatusButton
      text={`Start${isLoading ? 'ing' : ''} proposals registering${isLoading ? '…' : ''}`}
      onClick={startProposalsRegistering}
      isLoading={isLoading}
    />
  );
};

const EndProposalsRegisteringButton = () => {
  const router = useRouter();
  const { data, endProposalsRegistering } = useEndProposalsRegistering();
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => router.refresh(),
  });
  return (
    <ChangeWorkflowStatusButton
      text={`End${isLoading ? 'ing' : ''} proposals registering${isLoading ? '…' : ''}`}
      onClick={endProposalsRegistering}
      isLoading={isLoading}
    />
  );
};

const StartVotingButton = () => {
  const router = useRouter();
  const { data, startVoting } = useStartVoting();
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => router.refresh(),
  });
  return (
    <ChangeWorkflowStatusButton
      text={`Start${isLoading ? 'ing' : ''} voting${isLoading ? '…' : ''}`}
      onClick={startVoting}
      isLoading={isLoading}
    />
  );
};

const EndVotingButton = () => {
  const router = useRouter();
  const { data, endVoting } = useEndVoting();
  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => router.refresh(),
  });
  return (
    <ChangeWorkflowStatusButton
      text={`End${isLoading ? 'ing' : ''} voting${isLoading ? '…' : ''}`}
      onClick={endVoting}
      isLoading={isLoading}
    />
  );
};

const Heading = ({ status }: { status: WorkflowStatus }) => {
  const isClient = useIsClient();
  const { isConnected } = useAccount();
  return (
    <div className="px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
      <div className="flex min-w-0 flex-1 items-center">
        <h2 className="text-xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Workflow status:
        </h2>
        <WorkflowStatusBadge status={status} />
      </div>
      {isClient && isConnected && (
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {status === WorkflowStatuses.RegisteringVoters && <StartProposalsRegisteringButton />}
          {status === WorkflowStatuses.ProposalsRegistrationStarted && (
            <EndProposalsRegisteringButton />
          )}
          {status === WorkflowStatuses.ProposalsRegistrationEnded && (
            <StartVotingButton />
          )}
          {status === WorkflowStatuses.VotingSessionStarted && (
            <EndVotingButton />
          )}
        </div>
      )}
    </div>
  );
};

export default Heading;
