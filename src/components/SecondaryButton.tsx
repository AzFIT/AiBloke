import { memo, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  borderColor?: string;
}

const SecondaryButton = memo(function SecondaryButton({
  children,
  onClick,
  href,
  className = '',
  borderColor,
}: SecondaryButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-body font-semibold text-sm text-text-primary
    rounded-full border-[1.5px] border-[rgba(255,255,255,0.2)]
    px-6 py-3 bg-transparent
    transition-colors duration-200
    hover:border-accent-neon
    ${className}
  `;

  const style = borderColor ? { borderColor } : undefined;

  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  };

  if (href) {
    return (
      <motion.a
        {...motionProps}
        href={href}
        className={baseClasses}
        style={style}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      {...motionProps}
      onClick={onClick}
      className={baseClasses}
      style={style}
    >
      {children}
    </motion.button>
  );
});

export default SecondaryButton;
