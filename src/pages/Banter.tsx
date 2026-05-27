// @ts-nocheck
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Flag,
  Ghost,
  Trophy,
  Thermometer,
  BatteryWarning,
  Quote,
  HeartCrack,
  HelpCircle,
  RotateCcw,
  Home,
  Send,
} from 'lucide-react';
import Layout from '@/components/Layout';
import ChatBubble from '@/components/ChatBubble';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
}

interface Stage {
  name: string;
  tactic: string;
  range: [number, number];
  color: string;
  widthPct: number;
}

const STAGES: Stage[] = [
  { name: 'FAKE SYMPATHY', tactic: "I'll pretend to care… sort of", range: [1, 3], color: '#30D158', widthPct: 15 },
  { name: 'MILD DISAGREE', tactic: "Let's question everything you say", range: [4, 5], color: '#FF006E', widthPct: 10 },
  { name: 'STRAW MAN', tactic: 'Distort everything. Exaggerate. ', range: [6, 7], color: '#FF006E', widthPct: 10 },
  { name: 'REPEAT & TWIST', tactic: 'Throw your own words back at you', range: [8, 10], color: '#FF006E', widthPct: 15 },
  { name: 'PHONE TEMP', tactic: "Your phone's heating up from these Ls", range: [11, 13], color: '#FF9500', widthPct: 15 },
  { name: 'BATTERY ROAST', tactic: 'Even your battery wants out', range: [14, 16], color: '#FF3B30', widthPct: 15 },
  { name: 'THE GHOST', tactic: '*poof* Gone.', range: [17, 20], color: '#FF006E', widthPct: 20 },
];

const MOCK_MESSAGES: Message[] = [
  // Stage 1: Fake Sympathy (1-3)
  { id: 1, sender: 'ai', text: "I feel you, uce. That must've been rough. 🫠" },
  { id: 2, sender: 'user', text: 'Yeah man, tough loss today' },
  { id: 3, sender: 'ai', text: 'Sort of. I mean… everyone loses. You just do it more often. 💀' },
  // Stage 2: Mild Disagree (4-5)
  { id: 4, sender: 'user', text: 'The ref was terrible though' },
  { id: 5, sender: 'ai', text: 'But was it the ref though? 🧐 Or is that just what people say when their team chokes?' },
  // Stage 3: Straw Man (6-7)
  { id: 6, sender: 'user', text: 'Our defence was solid at least' },
  { id: 7, sender: 'ai', text: 'So what you\'re saying is… you enjoy watching grown men hug each other for 80 minutes? Interesting. 📝' },
  // Stage 4: Repeat & Twist (8-10)
  { id: 8, sender: 'user', text: 'That\'s not what I meant at all' },
  { id: 9, sender: 'ai', text: '"That\'s not what I meant at all" — famous last words. Bold. Wrong. But bold. 🔥' },
  { id: 10, sender: 'user', text: 'You\'re deliberately twisting my words' },
  // Stage 5: Phone Temp (11-13)
  { id: 11, sender: 'ai', text: 'Your phone\'s getting hot just reading this. 📱🌡️ CPU working overtime trying to process your Ls.' },
  { id: 12, sender: 'user', text: 'My phone is fine actually' },
  { id: 13, sender: 'ai', text: 'Is it though? Or are you just used to third-degree burns from these conversations? 🔥' },
  // Stage 6: Battery Roast (14-16)
  { id: 14, sender: 'user', text: 'Can we talk about something else?' },
  { id: 15, sender: 'ai', text: 'Your battery is trying to leave the conversation. Even it\'s had enough. ⚰️' },
  { id: 16, sender: 'user', text: 'It\'s at 80% actually' },
  // Stage 7: The Ghost (17-20)
  { id: 17, sender: 'ai', text: 'You\'re right. Happy now? 🏳️' },
  { id: 18, sender: 'user', text: 'Wait, you agree with me?' },
  { id: 19, sender: 'ai', text: 'Actually, I think you migh…' },
  { id: 20, sender: 'ai', text: '…' },
];

const PLACEHOLDERS: Record<number, string> = {
  1: 'Say something…',
  2: 'Say something…',
  3: 'Say something…',
  4: 'Defend yourself…',
  5: 'Defend yourself…',
  6: 'Correct me…',
  7: 'Correct me…',
  8: 'Say something dumber…',
  9: 'Say something dumber…',
  10: 'Say something dumber…',
  11: "Your phone's fine…",
  12: "Your phone's fine…",
  13: "Your phone's fine…",
  14: 'Charge your phone…',
  15: 'Charge your phone…',
  16: 'Charge your phone…',
  17: 'Admit I\'m right…',
  18: 'Admit I\'m right…',
  19: 'Admit I\'m right…',
  20: 'The Bloke has left the chat…',
};

const primaryEase = [0.16, 1, 0.3, 1] as [number, number, number, number];
const bounceEase = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  CONFETTI COMPONENT                                                 */
/* ------------------------------------------------------------------ */

function ConfettiBurst({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 40 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 4,
      life: 1,
      decay: 0.005 + Math.random() * 0.01,
      color: Math.random() > 0.5 ? '#FF006E' : '#39FF14',
      size: 4 + Math.random() * 6,
    }));

    let raf: number;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.life -= p.decay;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      if (alive) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const timer = setTimeout(() => cancelAnimationFrame(raf), 3000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  STAGE ICON                                                         */
/* ------------------------------------------------------------------ */

function StageIcon({ stageIndex }: { stageIndex: number }) {
  const icons = [
    <HeartCrack key="h" className="w-4 h-4" />,
    <HelpCircle key="q" className="w-4 h-4" />,
    <Quote key="m" className="w-4 h-4" />,
    <Quote key="r" className="w-4 h-4" />,
    <Thermometer key="t" className="w-4 h-4" />,
    <BatteryWarning key="b" className="w-4 h-4" />,
    <Ghost key="g" className="w-4 h-4" />,
  ];
  return <span className="text-[#FF006E]">{icons[stageIndex] || null}</span>;
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function Banter() {
  const [currentMsg, setCurrentMsg] = useState(1);
  const [showOverlay, setShowOverlay] = useState<number | null>(1);
  const [surrenderOpen, setSurrenderOpen] = useState(false);
  const [surrendered, setSurrendered] = useState(false);
  const [ghosted, setGhosted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showSurvivor, setShowSurvivor] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentStageIndex = STAGES.findIndex(
    (s) => currentMsg >= s.range[0] && currentMsg <= s.range[1]
  );
  const currentStage = STAGES[currentStageIndex] ?? STAGES[0];

  /* scroll to bottom */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMsg]);

  /* stage overlay trigger */
  useEffect(() => {
    const stageFirsts = STAGES.map((s) => s.range[0]);
    if (stageFirsts.includes(currentMsg)) {
      setShowOverlay(currentStageIndex);
      const t = setTimeout(() => setShowOverlay(null), 1500);
      return () => clearTimeout(t);
    }
  }, [currentMsg, currentStageIndex]);

  /* ghost at 20 */
  useEffect(() => {
    if (currentMsg >= 20 && !surrendered) {
      const t = setTimeout(() => {
        setGhosted(true);
        setShowSurvivor(true);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [currentMsg, surrendered]);

  const handleSend = useCallback(() => {
    if (currentMsg >= 20 || surrendered || ghosted) return;
    if (!inputValue.trim()) return;
    setInputValue('');
    setCurrentMsg((m) => Math.min(m + 1, 20));
  }, [currentMsg, surrendered, ghosted, inputValue]);

  const handleSurrender = useCallback(() => {
    setSurrendered(true);
    setSurrenderOpen(false);
    setGhosted(true);
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentMsg(1);
    setSurrendered(false);
    setGhosted(false);
    setShowSurvivor(false);
    setInputValue('');
    setShowOverlay(0);
  }, []);

  const visibleMessages = MOCK_MESSAGES.filter((m) => m.id <= currentMsg);

  return (
    <Layout showBottomNav bottomNavActiveIndex={1}>
      <div
        className="flex flex-col min-h-[100dvh] relative"
        style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, rgba(255,0,110,0.03) 100%)' }}
      >
        {/* ========== HEADER ========== */}
        <div
          className="sticky top-14 z-40 flex items-center justify-between px-4 h-14"
          style={{
            backgroundColor: 'rgba(10,10,15,0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: '2px solid rgba(255,0,110,0.3)',
          }}
        >
          {/* Left: Mode title */}
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-[#FF006E]" strokeWidth={2} />
            <span
              className="font-display font-bold text-base uppercase tracking-wide"
              style={{ color: '#FF006E', textShadow: '0 0 10px rgba(255,0,110,0.4)' }}
            >
              BANTER BATTLE
            </span>
          </div>

          {/* Center: Message counter */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 font-mono font-bold text-lg">
            <motion.span
              key={currentMsg}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                color: currentMsg >= 18 ? '#FF006E' : '#F5F5F7',
                textShadow: currentMsg >= 18 ? '0 0 10px rgba(255,0,110,0.5)' : 'none',
              }}
            >
              {String(currentMsg).padStart(2, '0')}
            </motion.span>
            <span className="text-[#4A4A5A]">/ 20</span>
          </div>

          {/* Right: Surrender */}
          <motion.button
            onClick={() => setSurrenderOpen(true)}
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-0.5 p-1"
          >
            <Flag className="w-5 h-5 text-[#4A4A5A]" strokeWidth={2} />
            <span className="text-[10px] text-[#4A4A5A] font-medium">GIVE UP</span>
          </motion.button>
        </div>

        {/* ========== STAGE TRACKER ========== */}
        <div
          className="sticky z-30 px-4 py-3"
          style={{
            top: 'calc(56px + 56px)',
            backgroundColor: '#12121A',
            borderBottom: '1px solid rgba(255,0,110,0.15)',
          }}
        >
          {/* Progress bar segments */}
          <div className="flex gap-1 h-2.5 mb-2">
            {STAGES.map((stage) => {
              const isCompleted = currentMsg > stage.range[1];
              const isActive = currentMsg >= stage.range[0] && currentMsg <= stage.range[1];
              return (
                <motion.div
                  key={stage.name}
                  className="h-full rounded-full relative overflow-hidden"
                  style={{ width: `${stage.widthPct}%` }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: isCompleted
                        ? 'rgba(255,0,110,0.4)'
                        : isActive
                          ? 'transparent'
                          : 'rgba(255,255,255,0.06)',
                    }}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, #FF006E 0%, #FF9500 100%)',
                        boxShadow: '0 0 12px rgba(255,0,110,0.5)',
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: primaryEase }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Stage label */}
          <div className="flex items-center justify-center gap-2">
            <StageIcon stageIndex={currentStageIndex} />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStage.name}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: '#FF006E' }}
              >
                {currentStage.name}
              </motion.span>
            </AnimatePresence>
            {currentMsg >= 20 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="animate-neon-pulse"
              >
                <Ghost className="w-4 h-4 text-[#FF006E]" />
              </motion.div>
            )}
          </div>
        </div>

        {/* ========== MESSAGE AREA ========== */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-40">
          {/* Ghost banner */}
          <AnimatePresence>
            {ghosted && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: primaryEase }}
                className="p-3 rounded-lg mb-4"
                style={{
                  backgroundColor: '#1A1A26',
                  borderLeft: '3px solid #FF006E',
                }}
              >
                <p className="text-[13px] text-[#F5F5F7] font-medium">
                  {surrendered ? (
                    <>
                      You surrendered at message {currentMsg}. The Bloke is disappointed.
                    </>
                  ) : (
                    <>
                      The Bloke has ghosted you. Message 20 reached. The argument is over.
                    </>
                  )}
                </p>
                {!surrendered && (
                  <p className="text-xs text-[#8A8A9A] mt-1">
                    Send &apos;stop&apos; to exit Banter Mode or wait for the resurrection…
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          {visibleMessages.map((msg, idx) => {
            const isLastGhost = msg.id === 20 && ghosted && !surrendered;
            const msgStage = STAGES.findIndex(
              (s) => msg.id >= s.range[0] && msg.id <= s.range[1]
            );
            const borderAccent =
              msg.sender === 'ai'
                ? msgStage === 4
                  ? 'border-l-2 border-l-[#FF9500]'
                  : msgStage === 5
                    ? 'border-l-2 border-l-[#FF3B30]'
                    : 'border-l-2 border-l-[#FF006E]'
                : '';

            return (
              <div key={`${msg.id}-${idx}`} className="relative">
                {/* Message number */}
                <span className="absolute -top-2 right-0 text-[10px] font-mono text-[#4A4A5A] z-10">
                  #{msg.id}
                </span>
                <div className={borderAccent}>
                  <ChatBubble
                    type={msg.sender}
                    delay={idx < 3 ? idx * 0.1 : 0}
                    className={isLastGhost ? 'opacity-10 transition-opacity ease-in' : ''}
                  >
                    <span className="text-[15px]">{msg.text}</span>
                  </ChatBubble>
                </div>
              </div>
            );
          })}

          {/* Ghost fade for last message */}
          {currentMsg >= 20 && !surrendered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 0.5, duration: 2, ease: 'easeIn' }}
              className="flex justify-start"
            >
              <div
                className="max-w-[85%] px-4 py-3 rounded-[4px_16px_16px_16px] bg-[#1E3A2F] border border-[rgba(57,255,20,0.15)]"
                style={{ opacity: 0.1 }}
              >
                <span className="text-[15px] text-[#F5F5F7]">…</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ========== SURVIVOR STATE ========== */}
        <AnimatePresence>
          {showSurvivor && !surrendered && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: primaryEase }}
              className="fixed inset-x-0 bottom-20 z-40 px-6"
            >
              <div
                className="rounded-2xl p-6 text-center max-w-sm mx-auto"
                style={{
                  backgroundColor: '#1A1A26',
                  border: '2px solid rgba(255,0,110,0.3)',
                  boxShadow: '0 0 30px rgba(255,0,110,0.3)',
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, ...{ duration: 0.4, ease: bounceEase } }}
                  className="flex justify-center mb-3"
                >
                  <Trophy className="w-12 h-12 text-[#FF9500]" strokeWidth={2} />
                </motion.div>
                <h2
                  className="font-display font-bold text-2xl mb-2"
                  style={{ color: '#FF006E' }}
                >
                  GHOST SURVIVOR
                </h2>
                <p className="text-sm text-[#8A8A9A] mb-4">
                  You survived all 20 messages without surrendering. The Bloke has finally met his match.
                </p>
                <div className="flex gap-3 justify-center">
                  <PrimaryButton onClick={handleRestart} icon={<RotateCcw className="w-4 h-4" />}>
                    GO AGAIN
                  </PrimaryButton>
                  <SecondaryButton
                    href="#/chat"
                    borderColor="rgba(255,0,110,0.3)"
                  >
                    <Home className="w-4 h-4" />
                    BACK TO CHAT
                  </SecondaryButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== SURRENDERED STATE ========== */}
        <AnimatePresence>
          {surrendered && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: primaryEase }}
              className="fixed inset-x-0 bottom-20 z-40 px-6"
            >
              <div
                className="rounded-2xl p-6 text-center max-w-sm mx-auto"
                style={{
                  backgroundColor: '#1A1A26',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <h2 className="font-display font-bold text-xl text-[#FF3B30] mb-2">
                  YOU SURRENDERED
                </h2>
                <p className="text-sm text-[#8A8A9A] mb-4">
                  Couldn&apos;t even make it to 20? Weak.
                </p>
                <PrimaryButton onClick={handleRestart} icon={<RotateCcw className="w-4 h-4" />}>
                  TRY AGAIN
                </PrimaryButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== INPUT BAR ========== */}
        {!showSurvivor && !surrendered && (
          <div
            className="fixed bottom-16 left-0 right-0 z-40 px-4 py-3"
            style={{
              backgroundColor: 'rgba(10,10,15,0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-2 max-w-lg mx-auto">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={currentMsg >= 20 || ghosted}
                placeholder={PLACEHOLDERS[currentMsg] || 'Fight back…'}
                className="flex-1 h-12 px-4 rounded-full text-[15px] text-[#F5F5F7] placeholder-[#4A4A5A] outline-none transition-colors disabled:opacity-30"
                style={{
                  backgroundColor: '#1A1A26',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={currentMsg >= 20 || ghosted || !inputValue.trim()}
                className="w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-30"
                style={{
                  background: 'linear-gradient(90deg, #FF006E 0%, #FF9500 100%)',
                  boxShadow: '0 0 20px rgba(255,0,110,0.3)',
                }}
              >
                <Send className="w-5 h-5 text-[#0A0A0F]" strokeWidth={2} />
              </motion.button>
            </div>
          </div>
        )}

        {/* ========== STAGE ANNOUNCEMENT OVERLAY ========== */}
        <AnimatePresence>
          {showOverlay !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[55] flex items-center justify-center px-6"
              style={{ backgroundColor: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)' }}
            >
              <div className="text-center">
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: bounceEase }}
                  className="font-slang text-[72px] leading-none block"
                  style={{ color: '#FF006E' }}
                >
                  STAGE {currentStageIndex + 1}
                </motion.span>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3, ease: primaryEase }}
                  className="font-display font-bold text-2xl text-[#F5F5F7] mt-2"
                >
                  {currentStage.name}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3, ease: primaryEase }}
                  className="text-sm text-[#8A8A9A] mt-2"
                >
                  {currentStage.tactic}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== SURRENDER CONFIRMATION DIALOG ========== */}
        <AnimatePresence>
          {surrenderOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] flex items-center justify-center px-6"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
              onClick={() => setSurrenderOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: bounceEase }}
                onClick={(e) => e.stopPropagation()}
                className="rounded-3xl p-8 max-w-[300px] w-full text-center"
                style={{ backgroundColor: '#1A1A26' }}
              >
                <Flag className="w-10 h-10 text-[#FF006E] mx-auto mb-3" strokeWidth={2} />
                <h3
                  className="font-display font-bold text-[22px] mb-2"
                  style={{ color: '#FF006E' }}
                >
                  GIVING UP ALREADY?
                </h3>
                <p className="text-sm text-[#8A8A9A] mb-6">
                  The Bloke will judge you harshly for this. Are you sure?
                </p>
                <div className="flex flex-col gap-3">
                  <PrimaryButton variant="magenta" onClick={handleSurrender}>
                    YES, I SURRENDER
                  </PrimaryButton>
                  <SecondaryButton onClick={() => setSurrenderOpen(false)}>
                    NAH, KEEP GOING
                  </SecondaryButton>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confetti */}
        <ConfettiBurst active={showSurvivor && !surrendered} />
      </div>
    </Layout>
  );
}
