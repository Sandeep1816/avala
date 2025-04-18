'use client';

import { CookiesProvider } from 'react-cookie';
import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ClientLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <CookiesProvider>
      {!isAuthPage && <Navbar />}
      <main className={`flex-grow ${isAuthPage ? 'min-h-screen flex items-center justify-center bg-gray-100' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </CookiesProvider>
  );
};

export default ClientLayout; 