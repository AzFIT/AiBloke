import { memo, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  className?: string;
  size?: 'default' | 'large';
  variant?: 'green' | 'magenta';
}

const PrimaryButton = memo(function PrimaryButton({
  children,
  onClick,
  href,
  icon,
  className = '',
  size = 'default',
  variant = 'green',
}: PrimaryButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-display font-semibold
    rounded-full transition-shadow
    ${size === 'large' ? 'text-base px-10 py-4' : 'text-base px-8 py-3.5'}
    ${className}
  `;

  const gradient = variant === 'magenta'
    ? 'linear-gradient(135deg, #FF006E 0%, #FF9500 100%)'
    : 'linear-gradient(90deg, #39FF14 0%, #00F0FF 100%)';

  const shadow = variant === 'magenta' ? 'shadow-neon-magenta' : 'shadow-neon-green';

  const content = (
    <>
      <span className="text-[#0A0A0F]">{children}</span>
      {icon && <span className="text-[#0A0A0F]">{icon}</span>}
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 },
  };

  if (href) {
    return (
      <motion.a
        {...motionProps}
        href={href}
        className={`${baseClasses} ${shadow}`}
        style={{ background: gradient }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      {...motionProps}
      onClick={onClick}
      className={`${baseClasses} ${shadow}`}
      style={{ background: gradient }}
    >
      {content}
    </motion.button>
  );
});

export default PrimaryButton;
