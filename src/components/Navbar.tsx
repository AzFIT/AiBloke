import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onMenuToggle?: (open: boolean) => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    if (currentY < 50) {
      setVisible(true);
    } else if (currentY > lastScrollY && currentY > 100) {
      setVisible(false);
    } else if (currentY < lastScrollY) {
      setVisible(true);
    }
    setLastScrollY(currentY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    onMenuToggle?.(next);
  };

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: visible ? 0 : -56 }}
        transition={{ duration: 0.2 }}
        className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center justify-between px-4 border-b border-[rgba(255,255,255,0.06)]"
        style={{
          backgroundColor: 'rgba(10,10,15,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Wordmark */}
        <a href="#/" className="flex items-center gap-1.5">
          <span className="font-display font-bold text-xl text-text-primary tracking-tight">
            THE BLOKE
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-neon opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-neon"></span>
          </span>
        </a>

        {/* Hamburger */}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="w-5 h-5 text-text-primary" strokeWidth={2} />
          ) : (
            <Menu className="w-5 h-5 text-text-primary" strokeWidth={2} />
          )}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 left-0 right-0 z-40 border-b border-[rgba(255,255,255,0.06)]"
            style={{
              backgroundColor: 'rgba(10,10,15,0.95)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-col p-4 gap-2">
              <a href="#/" onClick={() => { setMenuOpen(false); onMenuToggle?.(false); }} className="px-4 py-3 rounded-lg hover:bg-bg-elevated text-text-primary font-body font-medium transition-colors">
                Home
              </a>
              <a href="#/chat" onClick={() => { setMenuOpen(false); onMenuToggle?.(false); }} className="px-4 py-3 rounded-lg hover:bg-bg-elevated text-text-primary font-body font-medium transition-colors">
                Chat
              </a>
              <a href="#/banter" onClick={() => { setMenuOpen(false); onMenuToggle?.(false); }} className="px-4 py-3 rounded-lg hover:bg-bg-elevated text-text-primary font-body font-medium transition-colors">
                Banter Battle
              </a>
              <a href="#/roast" onClick={() => { setMenuOpen(false); onMenuToggle?.(false); }} className="px-4 py-3 rounded-lg hover:bg-bg-elevated text-text-primary font-body font-medium transition-colors">
                Roast Generator
              </a>
              <a href="#/sports" onClick={() => { setMenuOpen(false); onMenuToggle?.(false); }} className="px-4 py-3 rounded-lg hover:bg-bg-elevated text-text-primary font-body font-medium transition-colors">
                Sports Troll
              </a>
              <a href="#/personality" onClick={() => { setMenuOpen(false); onMenuToggle?.(false); }} className="px-4 py-3 rounded-lg hover:bg-bg-elevated text-text-primary font-body font-medium transition-colors">
                Personality
              </a>
              <a href="#/safety" onClick={() => { setMenuOpen(false); onMenuToggle?.(false); }} className="px-4 py-3 rounded-lg hover:bg-bg-elevated text-text-primary font-medium transition-colors">
                Safety
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
