export type Action =
  | { type: 'OPEN_ADD_VOTER_MODAL' }
  | { type: 'CLOSE_ADD_VOTER_MODAL' }
  | { type: 'OPEN_ADD_PROPOSAL_MODAL' }
  | { type: 'CLOSE_ADD_PROPOSAL_MODAL' };

export type State = {
  addVoterModalOpen: boolean;
  addProposalModalOpen: boolean;
};

export const defaultState = (): State => ({
  addVoterModalOpen: false,
  addProposalModalOpen: false,
});

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
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
  }
};
