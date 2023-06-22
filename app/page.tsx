import Index from '../components/index';

const title = 'Voting';
const description = 'Voting - dApp';

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://voting-dapp-sepolia.vercel.app/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

const IndexPage = () => <Index />;

export default IndexPage;
