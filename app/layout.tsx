import { ReactNode } from 'react';
import 'tailwindcss/tailwind.css';
import '@rainbow-me/rainbowkit/styles.css';

import Providers from '../components/lib/providers';
import Header from '../components/header';
import Footer from '../components/footer';
import AddVoterModal from '../components/lib/add-voter-modal';

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en" className="h-full">
    <body className="h-full overflow-x-hidden bg-gray-900">
      <Providers>
        <Header />
        {children}
        <Footer />
        <AddVoterModal />
      </Providers>
    </body>
  </html>
);

export default RootLayout;
