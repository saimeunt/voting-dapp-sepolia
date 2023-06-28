import { useContext } from 'react';

import Context from '.';

const Hook = () => {
  const { state, dispatch } = useContext(Context);
  const openAddVoterModal = () => dispatch({ type: 'OPEN_ADD_VOTER_MODAL' });
  const closeAddVoterModal = () => dispatch({ type: 'CLOSE_ADD_VOTER_MODAL' });
  const openAddProposalModal = () => dispatch({ type: 'OPEN_ADD_PROPOSAL_MODAL' });
  const closeAddProposalModal = () => dispatch({ type: 'CLOSE_ADD_PROPOSAL_MODAL' });
  const openNotification = (success: boolean): void => {
    dispatch({ type: 'OPEN_NOTIFICATION', payload: { success } });
    setTimeout(() => dispatch({ type: 'CLOSE_NOTIFICATION' }), 5 * 1000);
  };
  const closeNotification = (): void => dispatch({ type: 'CLOSE_NOTIFICATION' });
  const openConfirmVoteModal = (votedProposalId: bigint) =>
    dispatch({ type: 'OPEN_CONFIRM_VOTE_MODAL', payload: { votedProposalId } });
  const closeConfirmVoteModal = () => dispatch({ type: 'CLOSE_CONFIRM_VOTE_MODAL' });
  return {
    state,
    openAddVoterModal,
    closeAddVoterModal,
    openAddProposalModal,
    closeAddProposalModal,
    openNotification,
    closeNotification,
    openConfirmVoteModal,
    closeConfirmVoteModal,
  };
};

export default Hook;
