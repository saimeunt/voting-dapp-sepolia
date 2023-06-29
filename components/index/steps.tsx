import { CheckIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useWaitForTransaction } from 'wagmi';

import { WorkflowStatus, WorkflowStatuses } from '../../lib/types';
import {
  useStartProposalsRegistering,
  useEndProposalsRegistering,
  useStartVotingSession,
  useEndVotingSession,
} from '../../lib/contract';
import useContext from '../lib/context/hook';

const Step = ({
  id,
  name,
  type,
  onClick,
}: {
  id: WorkflowStatus;
  name: string;
  type: 'complete' | 'current' | 'next' | 'upcoming';
  onClick?: () => void;
}) => (
  <a
    className={clsx('group flex w-full items-center', { 'cursor-pointer': type === 'next' })}
    onClick={type === 'next' ? onClick : undefined}
  >
    <span
      className="flex items-center px-6 py-4 text-sm font-medium"
      aria-current={type === 'current' ? 'step' : undefined}
    >
      <span
        className={clsx('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full', {
          'bg-indigo-500': type === 'complete',
          'border-2 border-indigo-500': type === 'current',
          'border-2 border-gray-400 group-hover:border-white': type === 'next',
          'border-2 border-gray-400': type === 'upcoming',
        })}
      >
        {type === 'complete' ? (
          <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
        ) : (
          <span
            className={clsx({
              'text-indigo-500': type === 'current',
              'text-gray-400 group-hover:text-white': type === 'next',
              'text-gray-400': type === 'upcoming',
            })}
          >
            {id + 1}
          </span>
        )}
      </span>
      <span
        className={clsx('ml-4 text-sm font-medium', {
          'text-white': type === 'complete',
          'text-indigo-500': type === 'current',
          'text-gray-400 group-hover:text-white': type === 'next',
          'text-gray-400': type === 'upcoming',
        })}
      >
        {name}
      </span>
    </span>
  </a>
);

const Steps = ({ status, isOwner }: { status: WorkflowStatus; isOwner: boolean }) => {
  const router = useRouter();
  const { openNotification } = useContext();
  const onError = () => openNotification(false);
  const { data: startProposalsRegisteringData, startProposalsRegistering } =
    useStartProposalsRegistering(onError);
  const { data: endProposalsRegisteringData, endProposalsRegistering } =
    useEndProposalsRegistering(onError);
  const { data: startVotingSessionData, startVotingSession } = useStartVotingSession(onError);
  const { data: endVotingSessionData, endVotingSession } = useEndVotingSession(onError);
  const { isLoading } = useWaitForTransaction({
    hash:
      startProposalsRegisteringData?.hash ||
      endProposalsRegisteringData?.hash ||
      startVotingSessionData?.hash ||
      endVotingSessionData?.hash,
    onSuccess: () => router.refresh(),
  });
  const steps = [
    {
      id: WorkflowStatuses.RegisteringVoters,
      name: 'Registering voters',
    },
    {
      id: WorkflowStatuses.ProposalsRegistrationStarted,
      name: `Start${isLoading ? 'ing' : ''} proposals registering${isLoading ? '…' : ''}`,
      onClick: startProposalsRegistering,
    },
    {
      id: WorkflowStatuses.ProposalsRegistrationEnded,
      name: `End${isLoading ? 'ing' : ''} proposals registering${isLoading ? '…' : ''}`,
      onClick: endProposalsRegistering,
    },
    {
      id: WorkflowStatuses.VotingSessionStarted,
      name: `Start${isLoading ? 'ing' : ''} voting session${isLoading ? '…' : ''}`,
      onClick: startVotingSession,
    },
    {
      id: WorkflowStatuses.VotingSessionEnded,
      name: `End${isLoading ? 'ing' : ''} voting session${isLoading ? '…' : ''}`,
      onClick: endVotingSession,
    },
  ];
  const getType = (id: WorkflowStatus) => {
    if (id < status || status === WorkflowStatuses.VotingSessionEnded) {
      return 'complete';
    } else if (id === status) {
      return 'current';
    } else if (id === status + 1 && isOwner) {
      return 'next';
    } else {
      return 'upcoming';
    }
  };
  return (
    <nav aria-label="Progress" className="px-4 sm:px-6 lg:px-8">
      <ol
        role="list"
        className="divide-y divide-gray-300 rounded-md border border-gray-300 lg:flex lg:divide-y-0"
      >
        {steps.map((step) => (
          <li key={step.id} className="mg:flex relative lg:flex-1">
            <Step id={step.id} name={step.name} type={getType(step.id)} onClick={step.onClick} />
            {step.id !== WorkflowStatuses.VotingSessionEnded && (
              <div className="absolute right-0 top-0 hidden h-full w-5 lg:block" aria-hidden="true">
                <svg
                  className="h-full w-full text-gray-300"
                  viewBox="0 0 22 80"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 -2L20 40L0 82"
                    vectorEffect="non-scaling-stroke"
                    stroke="currentcolor"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Steps;
