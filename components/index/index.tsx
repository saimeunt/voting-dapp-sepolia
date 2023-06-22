import { getStatus, getVoters, getProposals } from '../../lib/contract';
import Heading from './heading';
import VotersTable from './voters-table';
import ProposalsTable from './proposals-table';

const Index = async () => {
  const [status, voters, proposals] = await Promise.all([getStatus(), getVoters(), getProposals()]);
  return (
    <main className="py-4">
      <Heading status={status} />
      <VotersTable voters={voters} status={status} />
      <ProposalsTable proposals={proposals} status={status} />
    </main>
  );
};

export default Index;
