import React from 'react'
import Topbar from './TopBar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  wishlistCount?: number
  cartCount?: number
}

const Layout: React.FC<LayoutProps> = ({
  children,
  wishlistCount = 0,
  cartCount = 3,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* --- Topbar --- */}
      <Topbar wishlistCount={wishlistCount} cartCount={cartCount} />

      {/* --- Main Content --- */}
      {/* Add top padding equal to Topbar height so content isn’t hidden */}
      <main className="flex-1 pt-20 md:pt-24 pb-16">
        {children}
      </main>

      {/* --- Footer --- */}
      <Footer />
    </div>
  )
}

export default Layout
