// src/layouts/GuestLayout.tsx - Layout for unauthenticated users
import React from 'react';
import Header from '@components/Header';
import Footer from '@components/Footer';
import ToastContainer from '@components/ui/ToastContainer';

interface GuestLayoutProps {
  children: React.ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  return (
    <>
      <ToastContainer position="top-right" topAnchorSelector="#site-header" topMargin={8} />
      <Header />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default GuestLayout;
