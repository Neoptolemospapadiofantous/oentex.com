// src/layouts/GuestLayout.tsx - Layout for unauthenticated users
import React from 'react';
import Header from '@components/Header';
import Footer from '@components/Footer';

interface GuestLayoutProps {
  children: React.ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default GuestLayout;
