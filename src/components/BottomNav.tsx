import { memo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, MessageSquare, Flame, Trophy, User } from 'lucide-react';

const navItems = [
  { icon: MessageCircle, label: 'Chat', href: '#/chat' },
  { icon: MessageSquare, label: 'Banter', href: '#/banter' },
  { icon: Flame, label: 'Roast', href: '#/roast' },
  { icon: Trophy, label: 'Sports', href: '#/sports' },
  { icon: User, label: 'Profile', href: '#/personality' },
];

interface BottomNavProps {
  activeIndex?: number;
}

const BottomNav = memo(function BottomNav({ activeIndex = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 z-50 border-t border-[rgba(255,255,255,0.06)]"
      style={{
        backgroundColor: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item, index) => {
          const isActive = index === activeIndex;
          const Icon = item.icon;
          return (
            <motion.a
              key={item.label}
              href={item.href}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * 0.05,
                duration: 0.3,
                ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
              }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center justify-center gap-0.5 w-14 h-14 relative"
            >
              <Icon
                className={`w-6 h-6 ${isActive ? 'text-accent-neon' : 'text-text-muted'}`}
                strokeWidth={2}
              />
              <span className={`text-[10px] font-medium ${isActive ? 'text-accent-neon' : 'text-text-muted'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavDot"
                  className="absolute -top-0.5 w-1 h-1 rounded-full bg-accent-neon"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.a>
          );
        })}
      </div>
    </nav>
  );
});

export default BottomNav;
