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
  const a = [
    'RegisteringVoters',
    'ProposalsRegistrationStarted',
    'ProposalsRegistrationEnded',
    'VotingSessionStarted',
    'VotingSessionEnded',
    'VotesTallied',
  ] as const;
  return a[status];
};
