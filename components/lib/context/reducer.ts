export type Action =
  | { type: 'OPEN_ADD_VOTER_MODAL' }
  | { type: 'CLOSE_ADD_VOTER_MODAL' }
  | { type: 'OPEN_ADD_PROPOSAL_MODAL' }
  | { type: 'CLOSE_ADD_PROPOSAL_MODAL' }
  | { type: 'OPEN_NOTIFICATION'; payload: { success: boolean } }
  | { type: 'CLOSE_NOTIFICATION' };

export type State = {
  addVoterModalOpen: boolean;
  addProposalModalOpen: boolean;
  notificationOpen: boolean;
  notificationSuccess: boolean;
};

export const defaultState = (): State => ({
  addVoterModalOpen: false,
  addProposalModalOpen: false,
  notificationOpen: false,
  notificationSuccess: true,
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
    case 'OPEN_NOTIFICATION': {
      return { ...state, notificationOpen: true, notificationSuccess: action.payload.success };
    }
    case 'CLOSE_NOTIFICATION': {
      return { ...state, notificationOpen: false };
    }
  }
};
