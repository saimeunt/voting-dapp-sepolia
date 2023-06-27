import { ConnectButton } from '@rainbow-me/rainbowkit';
import { EnvelopeOpenIcon } from '@heroicons/react/24/outline';

const EmptyState = ({ address }: { address?: `0x${string}` }) => (
  <div className="text-center">
    <EnvelopeOpenIcon className="mx-auto mt-4 h-12 w-12 text-gray-400" aria-hidden="true" />
    <h3 className="mt-2 text-sm font-semibold text-gray-400">
      {address ? 'Guest' : 'Not connected'}
    </h3>
    <p className="mt-1 text-sm text-gray-400">
      {address
        ? 'You cannot take part in this vote.'
        : 'Connect your wallet to take part in the vote.'}
    </p>
    {!address && (
      <div className="flex justify-center py-4">
        <ConnectButton />
      </div>
    )}
  </div>
);

export default EmptyState;
