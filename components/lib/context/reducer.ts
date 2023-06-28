import { Proposal } from '../../../lib/types';

export type Action =
  | { type: 'OPEN_ADD_VOTER_MODAL' }
  | { type: 'CLOSE_ADD_VOTER_MODAL' }
  | { type: 'OPEN_ADD_PROPOSAL_MODAL' }
  | { type: 'CLOSE_ADD_PROPOSAL_MODAL' }
  | { type: 'OPEN_NOTIFICATION'; payload: { success: boolean } }
  | { type: 'CLOSE_NOTIFICATION' }
  | { type: 'CLOSE_ADD_PROPOSAL_MODAL' }
  | {
      type: 'OPEN_CONFIRM_VOTE_MODAL';
      payload: { votedProposal: Proposal };
    }
  | { type: 'CLOSE_CONFIRM_VOTE_MODAL' };

export type State = {
  notificationOpen: boolean;
  notificationSuccess: boolean;
  addVoterModalOpen: boolean;
  addProposalModalOpen: boolean;
  confirmVoteModalOpen: boolean;
  votedProposal: Proposal;
};

export const defaultState = (): State => ({
  notificationOpen: false,
  notificationSuccess: true,
  addVoterModalOpen: false,
  addProposalModalOpen: false,
  confirmVoteModalOpen: false,
  votedProposal: { id: BigInt(0), description: '', voteCount: BigInt(0) },
});

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'OPEN_NOTIFICATION': {
      return { ...state, notificationOpen: true, notificationSuccess: action.payload.success };
    }
    case 'CLOSE_NOTIFICATION': {
      return { ...state, notificationOpen: false };
    }
    case 'OPEN_ADD_VOTER_MODAL': {
      return { ...state, addVoterModalOpen: true };
    }
    case 'CLOSE_ADD_VOTER_MODAL': {
      return { ...state, addVoterModalOpen: false };
    }
    case 'OPEN_ADD_PROPOSAL_MODAL': {
      return { ...state, addProposalModalOpen: true };
    }
    case 'CLOSE_ADD_PROPOSAL_MODAL': {
      return { ...state, addProposalModalOpen: false };
    }
    case 'OPEN_CONFIRM_VOTE_MODAL': {
      return {
        ...state,
        confirmVoteModalOpen: true,
        votedProposal: action.payload.votedProposal,
      };
    }
    case 'CLOSE_CONFIRM_VOTE_MODAL': {
      return { ...state, confirmVoteModalOpen: false };
    }
  }
};
