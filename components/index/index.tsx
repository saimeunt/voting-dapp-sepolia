import { getStatus } from '../../lib/contract';
import { statusToString } from '../../lib/types';

const Index = async () => {
  const status = await getStatus();
  return <main className="m-4">Workflow Status: {statusToString(status)}</main>;
};

export default Index;
