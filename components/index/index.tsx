import {
  getOwner,
  getStatus,
  getVoters,
  getProposals,
  getWinningProposalId,
} from '../../lib/contract';
import Main from './main';

const Index = async () => {
  const [owner, status, voters, proposals, winningProposalId] = await Promise.all([
    getOwner(),
    getStatus(),
    getVoters(),
    getProposals(),
    getWinningProposalId(),
  ]);
  return (
    <Main
      owner={owner}
      status={status}
      voters={voters}
      proposals={proposals}
      winningProposalId={winningProposalId}
    />
  );
};

export default Index;
