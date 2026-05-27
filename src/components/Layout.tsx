import { type ReactNode, useState } from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
  showBottomNav?: boolean;
  bottomNavActiveIndex?: number;
}

export default function Layout({ children, showBottomNav = true, bottomNavActiveIndex = 0 }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-bg-primary">
      <Navbar onMenuToggle={setMenuOpen} />

      <main
        className={`pt-14 transition-opacity duration-200 ${menuOpen ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}
        style={{ paddingBottom: showBottomNav ? 'calc(64px + env(safe-area-inset-bottom))' : '0' }}
      >
        {children}
      </main>

      {showBottomNav && <BottomNav activeIndex={bottomNavActiveIndex} />}
    </div>
  );
}
