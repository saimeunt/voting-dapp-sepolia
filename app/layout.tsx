import { ReactNode } from 'react';
import 'tailwindcss/tailwind.css';

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body className="overflow-x-hidden bg-slate-50">{children}</body>
  </html>
);

export default RootLayout;
