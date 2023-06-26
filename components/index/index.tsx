import { getOwner, getStatus, getVoters, getProposals } from '../../lib/contract';
import Main from './main';

const Index = async () => {
  const [owner, status, voters, proposals] = await Promise.all([
    getOwner(),
    getStatus(),
    getVoters(),
    getProposals(),
  ]);
  return <Main owner={owner} status={status} voters={voters} proposals={proposals} />;
};

export default Index;
