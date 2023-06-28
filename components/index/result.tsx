import { TrophyIcon } from '@heroicons/react/24/outline';

import { Proposal } from '../../lib/types';

const Result = ({ winningProposal }: { winningProposal: Proposal }) => (
  <div className="py-4 text-center">
    <TrophyIcon className="mx-auto mt-4 h-12 w-12 text-gray-400" aria-hidden="true" />
    <h3 className="mt-2 text-sm font-semibold text-gray-400">Voting session ended</h3>
    <p className="mt-1 text-sm text-gray-400">
      The vote is now over, the winning proposal is{' '}
      <span className="font-semibold text-white">{winningProposal.description}</span> with{' '}
      <span className="font-semibold text-white">{winningProposal.voteCount.toString()}</span> vote
      {winningProposal.voteCount === BigInt(1) ? '' : 's'}.
    </p>
  </div>
);

export default Result;
