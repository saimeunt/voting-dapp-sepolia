'use client';
import { useIsClient } from 'usehooks-ts';
import { useAccount } from 'wagmi';

import { Proposal, WorkflowStatus, WorkflowStatuses } from '../../lib/types';
import useContext from '../lib/context/hook';

const ProposalsTable = ({
  proposals,
  status,
}: {
  proposals: Proposal[];
  status: WorkflowStatus;
}) => {
  const { openAddProposalModal } = useContext();
  const isClient = useIsClient();
  const { isConnected } = useAccount();
  return (
    <div className="bg-gray-900 py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-white">Proposals</h1>
            <p className="mt-2 text-sm text-gray-300">
              A list of all the proposals proposed for the current vote.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            {status === WorkflowStatuses.ProposalsRegistrationStarted &&
              isClient &&
              isConnected && (
                <button
                  type="button"
                  className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  onClick={openAddProposalModal}
                >
                  Add proposal
                </button>
              )}
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {proposals.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Vote count
                      </th>
                      {status === WorkflowStatuses.VotingSessionStarted && (
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                          <span className="sr-only">Vote</span>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {proposals.map((proposal) => (
                      <tr key={proposal.id.toString()}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                          {proposal.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          {proposal.voteCount.toString()}
                        </td>
                        {status === WorkflowStatuses.VotingSessionStarted && (
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <button
                              className="text-indigo-400 hover:text-indigo-300"
                              // onClick={setVote}
                            >
                              Vote<span className="sr-only">on {proposal.description}</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-white">There&apos;s no proposals yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalsTable;
