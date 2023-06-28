'use client';
import { ReactNode, useState} from 'react';
import 'tailwindcss/tailwind.css';
import '@rainbow-me/rainbowkit/styles.css';

import Providers from '../components/lib/providers';
import Header from '../components/header';
import Footer from '../components/footer';
import AddVoterModal from '../components/lib/add-voter-modal';
import AddProposalModal from '../components/lib/add-proposal-modal';
import ConfirmVoteModal from '../components/lib/confirm-vote-modal';

const RootLayout = ({ children }: { children: ReactNode }) => {
  const [voteId, setVoteId] = useState<bigint>(BigInt(0)); // Définir ou obtenir la valeur de voteId

  return (<html lang="en" className="h-full">
    <body className="h-full overflow-x-hidden bg-gray-900">
      <Providers>
        <Header />
        {children}
        <Footer />
        <AddVoterModal />
        <AddProposalModal />
        <ConfirmVoteModal voteId={voteId} /> {}
      </Providers>
    </body>
  </html>)
};

export const dynamic = 'force-dynamic';

export default RootLayout;
