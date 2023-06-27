'use client';

import { Voter, Proposal, WorkflowStatus, WorkflowStatuses } from '../../lib/types';
import { truncateAddress } from '../../lib/utils';
import useContext from '../lib/context/hook';

const VotersTable = ({
  status,
  voters,
  proposals,
}: {
  status: WorkflowStatus;
  voters: Voter[];
  proposals: Proposal[];
}) => {
  const { openAddVoterModal } = useContext();
  return (
    <div className="bg-gray-900 py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-white">Voters</h1>
            <p className="mt-2 text-sm text-gray-300">
              A list of all the voters registered for the current vote.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            {status === WorkflowStatuses.RegisteringVoters && (
              <button
                type="button"
                className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={openAddVoterModal}
              >
                Add voter
              </button>
            )}
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {voters.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Has voted?
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                      >
                        Voted proposal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {voters.map((voter) => {
                      const proposal = proposals.find(({ id }) => id === voter.votedProposalId);
                      return (
                        <tr key={voter.address}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                            {truncateAddress(voter.address)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                            {voter.hasVoted ? 'Yes' : 'No'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                            {proposal ? proposal.description : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-white">There&apos;s no registered voter yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotersTable;
