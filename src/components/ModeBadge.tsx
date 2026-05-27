import { memo } from 'react';

interface ModeBadgeProps {
  mode: 'default' | 'sarcastic' | 'banter' | 'sports' | 'empathy' | 'roast';
  label?: string;
  className?: string;
}

const modeColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  default: {
    bg: 'rgba(57,255,20,0.15)',
    border: 'rgba(57,255,20,0.3)',
    text: '#39FF14',
    glow: '0 0 20px rgba(57,255,20,0.3)',
  },
  sarcastic: {
    bg: 'rgba(0,240,255,0.15)',
    border: 'rgba(0,240,255,0.3)',
    text: '#00F0FF',
    glow: '0 0 20px rgba(0,240,255,0.3)',
  },
  banter: {
    bg: 'rgba(255,0,110,0.15)',
    border: 'rgba(255,0,110,0.3)',
    text: '#FF006E',
    glow: '0 0 20px rgba(255,0,110,0.3)',
  },
  sports: {
    bg: 'rgba(255,149,0,0.15)',
    border: 'rgba(255,149,0,0.3)',
    text: '#FF9500',
    glow: '0 0 20px rgba(255,149,0,0.3)',
  },
  empathy: {
    bg: 'rgba(139,92,246,0.15)',
    border: 'rgba(139,92,246,0.3)',
    text: '#8B5CF6',
    glow: '0 0 20px rgba(139,92,246,0.3)',
  },
  roast: {
    bg: 'rgba(255,59,48,0.15)',
    border: 'rgba(255,59,48,0.3)',
    text: '#FF3B30',
    glow: '0 0 20px rgba(255,59,48,0.3)',
  },
};

const defaultLabels: Record<string, string> = {
  default: 'DEFAULT',
  sarcastic: 'SARCASTIC SEARCH',
  banter: 'BANTER BATTLE',
  sports: 'SPORTS TROLL',
  empathy: 'EMPATHY MODE',
  roast: 'ROAST GENERATOR',
};

const ModeBadge = memo(function ModeBadge({ mode, label, className = '' }: ModeBadgeProps) {
  const colors = modeColors[mode] || modeColors.default;
  const displayLabel = label || defaultLabels[mode] || 'MODE';

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${className}`}
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        boxShadow: colors.glow,
      }}
    >
      {displayLabel}
    </span>
  );
});

export default ModeBadge;
