import clsx from 'clsx';

import { truncateAddress } from '../../lib/utils';
import { Proposal } from '../../lib/types';

const RoleBadge = ({ isOwner }: { isOwner: boolean }) => (
  <span
    className={clsx(
      'ml-4 mr-2 inline-flex items-center rounded-md px-2 py-1 font-medium ring-1 ring-inset',
      {
        'bg-green-500/10 text-green-400 ring-green-500/20': isOwner,
        'bg-blue-500/10 text-blue-400 ring-blue-500/20': !isOwner,
      },
    )}
  >
    {isOwner ? 'Owner' : 'Voter'}
  </span>
);

const Heading = ({
  address,
  isOwner,
  votedProposal,
}: {
  address?: `0x${string}`;
  isOwner: boolean;
  votedProposal?: Proposal;
}) => (
  <div className="px-4 pb-8 pt-4 sm:px-6 lg:px-8">
    <div className="flex min-w-0 flex-1 items-center">
      <h2 className="text-xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Address: {truncateAddress(address)}
      </h2>
      <RoleBadge isOwner={isOwner} />
      {votedProposal && (
        <span className="text-lg text-gray-400">
          voted on <span className="font-semibold text-white">{votedProposal.description}</span>
        </span>
      )}
    </div>
  </div>
);

export default Heading;
