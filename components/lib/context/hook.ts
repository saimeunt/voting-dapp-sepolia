import { useContext } from 'react';

import Context from '.';

const Hook = () => {
  const { state, dispatch } = useContext(Context);
  const openAddVoterModal = () => dispatch({ type: 'OPEN_ADD_VOTER_MODAL' });
  const closeAddVoterModal = () => dispatch({ type: 'CLOSE_ADD_VOTER_MODAL' });
  const openAddProposalModal = () => dispatch({ type: 'OPEN_ADD_PROPOSAL_MODAL' });
  const closeAddProposalModal = () => dispatch({ type: 'CLOSE_ADD_PROPOSAL_MODAL' });
  return {
    state,
    openAddVoterModal,
    closeAddVoterModal,
    openAddProposalModal,
    closeAddProposalModal,
  };
};

export default Hook;
