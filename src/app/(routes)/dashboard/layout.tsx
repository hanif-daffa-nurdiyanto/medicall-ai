import React from 'react'
import Navbar from './_components/Navbar';
import Footer from './_components/Footer';

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default DashboardLayout