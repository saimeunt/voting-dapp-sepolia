export type Voter = {
  address: `0x${string}`;
  isRegistered: boolean;
  hasVoted: boolean;
  votedProposalId: bigint;
};

export type Proposal = {
  id: bigint;
  description: string;
  voteCount: bigint;
};

type ObjectValues<T> = T[keyof T];

export const WorkflowStatuses = {
  RegisteringVoters: 0,
  ProposalsRegistrationStarted: 1,
  ProposalsRegistrationEnded: 2,
  VotingSessionStarted: 3,
  VotingSessionEnded: 4,
  VotesTallied: 5,
} as const;

export type WorkflowStatus = ObjectValues<typeof WorkflowStatuses>;

export const statusToString = (status: WorkflowStatus) => {
  const statuses = [
    'RegisteringVoters',
    'ProposalsRegistrationStarted',
    'ProposalsRegistrationEnded',
    'VotingSessionStarted',
    'VotingSessionEnded',
    'VotesTallied',
  ] as const;
  return statuses[status];
};
