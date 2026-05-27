import { memo } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ChatBubbleProps {
  type: 'ai' | 'user';
  children: ReactNode;
  delay?: number;
  className?: string;
}

const ChatBubble = memo(function ChatBubble({ type, children, delay = 0, className = '' }: ChatBubbleProps) {
  const isAI = type === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: isAI ? -10 : 10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} w-full`}
    >
      <div
        className={`
          max-w-[85%] px-4 py-3 text-[15px] leading-relaxed
          ${isAI
            ? 'bg-bloke-bubble border border-[rgba(57,255,20,0.15)] text-text-primary rounded-[4px_16px_16px_16px] shadow-neon-green'
            : 'bg-user-bubble border border-[rgba(255,255,255,0.06)] text-text-primary rounded-[16px_16px_4px_16px]'
          }
          ${className}
        `}
      >
        {children}
      </div>
    </motion.div>
  );
});

export default ChatBubble;
