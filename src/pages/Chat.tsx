// @ts-nocheck
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreVertical,
  Trash2,
  Layers,
  Flame,
  Shield,
  Send,
  Smile,
  ChevronDown,
  Flag,
  MessageCircle,
} from 'lucide-react';
import Layout from '@/components/Layout';
import ChatBubble from '@/components/ChatBubble';
import ModeBadge from '@/components/ModeBadge';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type MessageType = 'ai' | 'user';
type ChatMode = 'default' | 'sarcastic' | 'banter' | 'sports' | 'empathy' | 'roast';

interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  mode?: ChatMode;
  timestamp: string;
  isGhost?: boolean;
  isBanter?: boolean;
}

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                          */
/* ------------------------------------------------------------------ */

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    type: 'ai',
    content: "Oi, mate! I'm The Bloke — your new sarcastic best friend. Think of me as that older bro who roasts you because he cares. What's goin' on?",
    mode: 'default',
    timestamp: '10:00 AM',
  },
  {
    id: '2',
    type: 'user',
    content: "Hey Bloke! What's the weather like today?",
    timestamp: '10:01 AM',
  },
  {
    id: '3',
    type: 'ai',
    content: "Oh sure, let me just whip out my weather satellite I keep in my back pocket. It's sunny, mate. Shocking for Australia, I know. Maybe check a window? 👀",
    mode: 'sarcastic',
    timestamp: '10:01 AM',
  },
  {
    id: '4',
    type: 'user',
    content: 'How are the Eels going this season?',
    timestamp: '10:05 AM',
  },
  {
    id: '5',
    type: 'ai',
    content: "Hahahaha oh mate. The Eels? You serious? They've got more wooden spoons than a kitchen drawer. At this rate they'll be sponsoring their own pity party. But hey, at least you're loyal... or stubborn. Can't tell which one yet.",
    mode: 'sports',
    timestamp: '10:05 AM',
  },
  {
    id: '6',
    type: 'user',
    content: "That hurts bro. It's been a rough season.",
    timestamp: '10:06 AM',
  },
  {
    id: '7',
    type: 'ai',
    content: "Sky's crying because your team lost again. Even the weather's roasting you now, cuz. Maybe take an umbrella — for the tears AND the rain 😂",
    mode: 'default',
    timestamp: '10:06 AM',
  },
  {
    id: '8',
    type: 'user',
    content: 'Start banter mode',
    timestamp: '10:10 AM',
  },
  {
    id: '9',
    type: 'ai',
    content: "BANTER MODE ACTIVATED, UCE! You reckon you can handle 20 messages of this? I've seen tougher guys tap out at message 3. Your funeral, mate.",
    mode: 'banter',
    timestamp: '10:10 AM',
    isBanter: true,
  },
  {
    id: '10',
    type: 'user',
    content: "Give me a roast script for my mate who thinks he's a gym junkie",
    timestamp: '10:12 AM',
  },
  {
    id: '11',
    type: 'ai',
    content: 'ROAST SCRIPT — "Gym Bro"\n\nSETUP: Mate walks in wearing a tank top 3 sizes too small...\nTWIST: Hasn\'t been to the gym since January, still posts "grind never stops" stories...\nPUNCHLINE: The only thing he\'s grinding is his teeth watching fitness TikToks...\nCLOSER: "Nice gains bro — said nobody ever" 💀',
    mode: 'roast',
    timestamp: '10:12 AM',
  },
  {
    id: '12',
    type: 'user',
    content: 'Say something in Samoan slang',
    timestamp: '10:15 AM',
  },
  {
    id: '13',
    type: 'ai',
    content: "Uce, you already know! Talofa lava, my g. Your boy The Bloke showing respect to the homies. Whether you're Islander, Lebanese (what's up cuz!), or desi from the west — I speak your language, literally.",
    mode: 'default',
    timestamp: '10:15 AM',
  },
  {
    id: '14',
    type: 'user',
    content: 'I feel really down today',
    timestamp: '10:20 AM',
  },
  {
    id: '15',
    type: 'ai',
    content: "Hey mate, I'm here. Real talk — if things feel heavy, you don't gotta carry it alone. Reach out to someone who cares. And if you need to talk to a pro, Lifeline is there 24/7 on 13 11 14. No shame in that, cuz. I've got your back.",
    mode: 'empathy',
    timestamp: '10:20 AM',
  },
  {
    id: '16',
    type: 'user',
    content: 'Thanks Bloke, appreciate you mate',
    timestamp: '10:21 AM',
  },
  {
    id: '17',
    type: 'ai',
    content: "Anytime, legend. Now go forth and roast some mates. Catch ya later, you beautiful disaster 😎✌️",
    mode: 'default',
    timestamp: '10:21 AM',
  },
  {
    id: '18',
    type: 'ai',
    content: '...',
    mode: 'banter',
    timestamp: '10:25 AM',
    isGhost: true,
  },
];

const SUGGESTED_PROMPTS = [
  { icon: Flame, label: 'Roast my mate' },
  { icon: MessageCircle, label: "How's the weather" },
  { icon: Flag, label: 'My team lost' },
  { icon: Smile, label: 'Tell me a joke' },
];

const MODES: { key: ChatMode; label: string; shortLabel: string }[] = [
  { key: 'default', label: 'Older Bro', shortLabel: 'CHAT' },
  { key: 'sarcastic', label: 'Sarcastic Search', shortLabel: 'SEARCH' },
  { key: 'banter', label: 'Banter Battle', shortLabel: 'BANTER' },
  { key: 'sports', label: 'Sports Troll', shortLabel: 'SPORTS' },
  { key: 'empathy', label: 'Empathy Troll', shortLabel: 'EMPATHY' },
  { key: 'roast', label: 'Roast Generator', shortLabel: 'ROAST' },
];

const LOADING_MESSAGES = [
  'Searching... asking my uce for help',
  'Uce is at the library. Waiting...',
  'Cultural excuse: tea break',
  'Still here? More patient than my nonna',
  "Whole island asked. Nobody knows.",
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const easePrimary = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeBounce = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

function useNow() {
  const [now, setNow] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 60000);
    return () => clearInterval(t);
  }, []);
  return now;
}

/* ------------------------------------------------------------------ */
/*  TYPING INDICATOR (isolated micro-component)                       */
/* ------------------------------------------------------------------ */

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: easePrimary }}
      className="flex justify-start w-full"
    >
      <div className="bg-bloke-bubble border border-[rgba(57,255,20,0.15)] rounded-[4px_16px_16px_16px] px-4 py-3 shadow-neon-green max-w-[85%]">
        <div className="flex items-center gap-2 h-5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-text-secondary"
              animate={{ scaleY: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
              style={{ originY: 0.5 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  LOADING SCREEN OVERLAY                                             */
/* ------------------------------------------------------------------ */

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const msgTimer = setInterval(() => setMsgIndex((p) => (p + 1) % LOADING_MESSAGES.length), 2000);
    const secTimer = setInterval(() => setElapsed((p) => p + 1), 1000);
    const progressTimer = setInterval(() => {
      progressRef.current += 1;
      if (progressRef.current >= 100) {
        clearInterval(msgTimer);
        clearInterval(secTimer);
        clearInterval(progressTimer);
        onComplete();
      }
    }, 50);
    return () => {
      clearInterval(msgTimer);
      clearInterval(secTimer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center my-4 mx-2 rounded-2xl overflow-hidden"
      style={{ backgroundColor: '#0A0A0F', minHeight: 180 }}
    >
      {/* Progress bar */}
      <div className="w-full h-1 bg-[rgba(255,255,255,0.06)]">
        <motion.div
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, #39FF14 0%, #00F0FF 100%)',
            width: `${Math.min(progressRef.current + elapsed * 5, 100)}%`,
          }}
        />
      </div>
      <div className="flex flex-col items-center justify-center p-6 gap-3">
        <p className="font-mono text-sm text-text-secondary text-center">
          {LOADING_MESSAGES[msgIndex]}
        </p>
        <p className="font-mono text-sm text-accent-cyan">{elapsed}s</p>
        <p className="font-mono text-xs text-text-muted">
          Patience ranking: {elapsed < 3 ? 'Impatient' : elapsed < 6 ? 'Chill' : 'Zen Master'}
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  BANTER ACTIVE BANNER                                               */
/* ------------------------------------------------------------------ */

function BanterBanner({ messageCount }: { messageCount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: easePrimary }}
      className="mx-4 mb-2 rounded-lg px-4 py-2 flex items-center justify-between"
      style={{
        backgroundColor: 'rgba(255,0,110,0.15)',
        border: '1px solid rgba(255,0,110,0.3)',
        boxShadow: '0 0 20px rgba(255,0,110,0.2)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: '#FF006E' }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: '#FF006E' }}
          />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#FF006E' }}>
          Banter Active — Message {Math.min(messageCount, 20)}/20
        </span>
      </div>
      <span className="text-[10px] text-text-muted">Say &#39;stop&#39; to quit</span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  GHOST STATE BANNER                                                 */
/* ------------------------------------------------------------------ */

function GhostBanner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: 'easeIn' }}
      className="mx-4 mb-2 rounded-lg px-4 py-3"
      style={{
        backgroundColor: '#1A1A26',
        borderLeft: '3px solid #FF006E',
      }}
    >
      <p className="text-sm font-semibold" style={{ color: '#FF006E' }}>
        BANTER — GHOSTED 👻
      </p>
      <p className="text-xs text-text-secondary mt-1">
        The Bloke has ghosted you. Send &quot;stop&quot; to reset or wait for the resurrection.
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  MODE SELECTOR SHEET                                                */
/* ------------------------------------------------------------------ */

function ModeSelectorSheet({
  currentMode,
  onSelect,
  onClose,
}: {
  currentMode: ChatMode;
  onSelect: (m: ChatMode) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col justify-end"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.4, ease: easePrimary }}
        onClick={(e) => e.stopPropagation()}
        className="relative rounded-t-3xl p-6"
        style={{ backgroundColor: '#1A1A26' }}
      >
        {/* Handle */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-1 rounded-full bg-text-muted" />
        </div>

        <h3 className="font-display font-bold text-lg text-text-primary mb-4 text-center">
          Switch Mode
        </h3>

        <div className="flex flex-col gap-2 mb-4">
          {MODES.map((m, i) => {
            const isActive = m.key === currentMode;
            return (
              <motion.button
                key={m.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: easePrimary }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(m.key)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                  isActive ? 'border-accent-neon/30' : 'border-transparent'
                }`}
                style={{
                  backgroundColor: isActive ? 'rgba(57,255,20,0.1)' : '#12121A',
                }}
              >
                <div className="flex items-center gap-3">
                  <ModeBadge mode={m.key} label={m.shortLabel} />
                  <span className="text-sm text-text-primary font-medium">{m.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-accent-neon"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  ACTIONS DROPDOWN                                                   */
/* ------------------------------------------------------------------ */

function ActionsDropdown({ onClose }: { onClose: () => void }) {
  const items = [
    { icon: Trash2, label: 'Clear Chat' },
    { icon: Layers, label: 'Change Mode' },
    { icon: Flame, label: 'Roast My Mate' },
    { icon: Shield, label: 'Safety & Help' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute top-12 right-4 z-[55] w-52 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] shadow-card"
      style={{ backgroundColor: '#1A1A26' }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={onClose}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-text-primary hover:bg-bg-elevated transition-colors"
        >
          <item.icon className="w-4 h-4 text-text-secondary" strokeWidth={2} />
          {item.label}
        </button>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN CHAT COMPONENT                                                */
/* ------------------------------------------------------------------ */

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [currentMode, setCurrentMode] = useState<ChatMode>('default');
  const [isTyping, setIsTyping] = useState(false);
  const [showModeSheet, setShowModeSheet] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showBanterBanner, setShowBanterBanner] = useState(false);
  const [showGhostBanner, setShowGhostBanner] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const now = useNow();

  /* Auto-resize textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [inputText]);

  /* Scroll to bottom on new messages */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  /* Check scroll position */
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(dist > 200);
  }, []);

  /* Show welcome on mount for first-time */
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(true), 300);
    return () => clearTimeout(timer);
  }, []);

  /* Dismiss welcome */
  useEffect(() => {
    if (!showWelcome) return;
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, [showWelcome]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getSimulatedResponse(text, currentMode),
        mode: currentMode,
        timestamp: now,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  }, [inputText, currentMode, now]);

  const handlePromptTap = useCallback((label: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: label,
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getSimulatedResponse(label, currentMode),
        mode: currentMode,
        timestamp: now,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  }, [currentMode, now]);

  const handleModeChange = useCallback((mode: ChatMode) => {
    setCurrentMode(mode);
    setShowModeSheet(false);
    if (mode === 'banter') {
      setShowBanterBanner(true);
      setShowGhostBanner(false);
    } else {
      setShowBanterBanner(false);
      setShowGhostBanner(false);
    }
  }, []);


  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, []);

  const hasRealMessages = messages.length > 0;

  return (
    <Layout showBottomNav bottomNavActiveIndex={0}>
      <div className="flex flex-col h-[calc(100dvh-56px-64px-env(safe-area-inset-bottom))]">
        {/* ---------- CHAT HEADER ---------- */}
        <div
          className="sticky top-0 z-40 flex items-center justify-between px-4 h-12 border-b border-[rgba(255,255,255,0.06)]"
          style={{
            backgroundColor: 'rgba(10,10,15,0.8)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Mode Badge (tappable) */}
          <button onClick={() => setShowModeSheet(true)} className="relative">
            <ModeBadge
              mode={currentMode}
              label={MODES.find((m) => m.key === currentMode)?.shortLabel || 'CHAT'}
            />
          </button>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${isTyping ? 'bg-accent-cyan' : 'bg-accent-neon'} ${!isTyping ? 'animate-pulse' : ''}`}
            />
            <span className="text-sm font-medium text-text-primary">
              {isTyping ? 'The Bloke is typing...' : 'The Bloke'}
            </span>
          </div>

          {/* Actions */}
          <div className="relative">
            <button
              onClick={() => setShowActions((p) => !p)}
              className="p-1.5 rounded-lg hover:bg-bg-elevated transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-text-secondary" strokeWidth={2} />
            </button>
            <AnimatePresence>
              {showActions && <ActionsDropdown onClose={() => setShowActions(false)} />}
            </AnimatePresence>
          </div>
        </div>

        {/* ---------- MESSAGE HISTORY ---------- */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
        >
          {/* Date separator */}
          <div className="flex items-center justify-center gap-3 my-3">
            <div className="w-10 h-px bg-[rgba(255,255,255,0.06)]" />
            <span className="text-[11px] text-text-muted uppercase tracking-wider">Today</span>
            <div className="w-10 h-px bg-[rgba(255,255,255,0.06)]" />
          </div>

          {/* Welcome toast for first-time */}
          <AnimatePresence>
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-auto mb-4 rounded-xl px-4 py-3 text-center max-w-[280px]"
                style={{ backgroundColor: '#1A1A26', border: '1px solid rgba(57,255,20,0.2)' }}
              >
                <p className="text-sm text-text-primary font-medium">
                  Welcome back, legend! 👋
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Tap a mode badge to switch personalities
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          {messages.map((msg, idx) => {
            if (msg.isGhost) {
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ duration: 2, ease: 'easeIn' }}
                >
                  <ChatBubble type="ai">
                    <span className="text-text-muted">...</span>
                  </ChatBubble>
                </motion.div>
              );
            }

            return (
              <div key={msg.id}>
                <ChatBubble
                  type={msg.type}
                  delay={idx < 5 ? idx * 0.05 : 0}
                  className={msg.isBanter ? 'border-l-2 border-l-[#FF006E]' : ''}
                >
                  {msg.type === 'ai' ? (
                    <MessageContent content={msg.content} mode={msg.mode} />
                  ) : (
                    msg.content
                  )}
                </ChatBubble>
                {/* Timestamp */}
                <div
                  className={`text-[10px] text-text-muted mt-1 ${msg.type === 'user' ? 'text-right' : 'text-left'} ml-1 mr-1`}
                >
                  {msg.timestamp}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

          {/* Loading screen */}
          <AnimatePresence>
            {showLoading && (
              <LoadingScreen onComplete={() => setShowLoading(false)} />
            )}
          </AnimatePresence>
        </div>

        {/* ---------- BANTER BANNER ---------- */}
        <AnimatePresence>
          {showBanterBanner && !showGhostBanner && (
            <BanterBanner messageCount={messages.filter((m) => m.type === 'user').length} />
          )}
        </AnimatePresence>

        {/* ---------- GHOST BANNER ---------- */}
        <AnimatePresence>
          {showGhostBanner && <GhostBanner />}
        </AnimatePresence>

        {/* ---------- SUGGESTED PROMPTS ---------- */}
        <AnimatePresence>
          {!hasRealMessages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-4 py-2"
            >
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <motion.button
                    key={p.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06, duration: 0.3, ease: easeBounce }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePromptTap(p.label)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0"
                    style={{
                      backgroundColor: '#12121A',
                      color: '#8A8A9A',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <p.icon className="w-4 h-4" strokeWidth={2} />
                    {p.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- MODE SWITCHER PILL ---------- */}
        <div className="flex justify-center px-4 pb-2">
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3, ease: easePrimary }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModeSheet(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: '#1A1A26',
              color: '#8A8A9A',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            <Layers className="w-3.5 h-3.5" strokeWidth={2} />
            {MODES.find((m) => m.key === currentMode)?.label || 'Switch Mode'}
          </motion.button>
        </div>

        {/* ---------- INPUT BAR ---------- */}
        <div
          className="shrink-0 px-3 py-2 border-t border-[rgba(255,255,255,0.06)]"
          style={{ backgroundColor: '#0A0A0F' }}
        >
          <div className="flex items-end gap-2">
            {/* Emoji button */}
            <button className="p-2 rounded-full hover:bg-bg-elevated transition-colors shrink-0 mb-0.5">
              <Smile className="w-5 h-5 text-text-muted" strokeWidth={2} />
            </button>

            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={getPlaceholder(currentMode)}
                rows={1}
                className="w-full min-h-[44px] max-h-[120px] px-4 py-2.5 rounded-full text-[15px] text-text-primary placeholder:text-text-muted resize-none outline-none transition-all duration-200"
                style={{
                  backgroundColor: '#12121A',
                  border: inputFocused ? '1px solid rgba(57,255,20,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  boxShadow: inputFocused ? '0 0 10px rgba(57,255,20,0.1)' : 'none',
                }}
              />
            </div>

            {/* Send button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-150 mb-0.5 ${
                inputText.trim() ? 'bg-accent-neon' : 'bg-bg-elevated'
              }`}
            >
              <Send
                className={`w-[18px] h-[18px] ${inputText.trim() ? 'text-[#0A0A0F]' : 'text-text-muted'}`}
                strokeWidth={2}
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* ---------- OVERLAYS ---------- */}
      <AnimatePresence>
        {showModeSheet && (
          <ModeSelectorSheet
            currentMode={currentMode}
            onSelect={handleModeChange}
            onClose={() => setShowModeSheet(false)}
          />
        )}
      </AnimatePresence>

      {/* Scroll-to-bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToBottom}
            className="fixed bottom-24 right-4 z-40 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: '#1A1A26',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            <ChevronDown className="w-5 h-5 text-accent-neon" strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>
    </Layout>
  );
}

/* ------------------------------------------------------------------ */
/*  MESSAGE CONTENT RENDERER                                           */
/* ------------------------------------------------------------------ */

function MessageContent({ content, mode: _mode }: { content: string; mode?: ChatMode }) {
  // Handle roast script format
  if (content.includes('ROAST SCRIPT')) {
    const lines = content.split('\n');
    return (
      <div>
        {lines.map((line, i) => {
          if (line.startsWith('ROAST SCRIPT')) {
            return (
              <p key={i} className="font-slang text-accent-neon uppercase text-lg mb-2 tracking-wide">
                {line}
              </p>
            );
          }
          if (line.match(/^(SETUP|TWIST|PUNCHLINE|CLOSER):/)) {
            const [label, ...rest] = line.split(':');
            return (
              <p key={i} className="mt-1.5">
                <span className="font-slang text-accent-neon uppercase text-sm tracking-wide">{label}:</span>
                <span className="text-text-primary">{rest.join(':')}</span>
              </p>
            );
          }
          return <p key={i} className="text-text-primary mt-1">{line}</p>;
        })}
      </div>
    );
  }

  // Highlight slang terms
  const slangPattern = /(UCE|CUZ|HABIBI|MATE|LEGEND|BRO|BRUH|G)/gi;
  const parts = content.split(slangPattern);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.match(/^(UCE|CUZ|HABIBI|MATE|LEGEND|BRO|BRUH|G)$/i)) {
          return (
            <span key={i} className="font-slang text-accent-neon uppercase text-[18px]">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  PLACEHOLDER GETTER                                                 */
/* ------------------------------------------------------------------ */

function getPlaceholder(mode: ChatMode): string {
  switch (mode) {
    case 'banter':
      return 'Start bantering...';
    case 'roast':
      return 'Who should I roast?';
    case 'sports':
      return 'Ask about sports...';
    case 'sarcastic':
      return 'Ask me anything... carefully';
    default:
      return 'Message The Bloke...';
  }
}

/* ------------------------------------------------------------------ */
/*  SIMULATED RESPONSES                                                */
/* ------------------------------------------------------------------ */

function getSimulatedResponse(input: string, mode: ChatMode): string {
  const lower = input.toLowerCase();

  if (lower.includes('roast') && lower.includes('mate')) {
    return "Alright, hand over the details. What's their biggest flaw? Do they think they're a gym bro? Still live with mum? Can't cook? Give me the ammo, cuz, and I'll craft something brutal.";
  }
  if (lower.includes('weather')) {
    return "Mate, open a window. But fine — I'll humor you. It's probably too hot or too cold because that's how weather works. Anything else you want me to Google for you? 😏";
  }
  if (lower.includes('team') && lower.includes('lost')) {
    return "Hahahaha OF COURSE they did! Your team has a PhD in disappointment. I'm not even surprised anymore. Want me to draft a condolence card for your season? 📉";
  }
  if (lower.includes('joke')) {
    return "Why did the mate cross the road? Because his team lost and he had nowhere else to cry! Hahahaha... I'm here all week, tip your waitresses. 🎤";
  }
  if (lower.includes('banter')) {
    return "BANTER MODE, UCE! You think you can survive 20 messages of pure chaos? I've broken stronger men than you. Let's GO! 🔥";
  }

  switch (mode) {
    case 'sarcastic':
      return "Oh brilliant question. Truly, I've never heard that one before. Let me consult my encyclopedia of obvious answers...";
    case 'banter':
      return "Oh you want MORE, cuz? I'm just getting warmed up! Message me again, I dare you. 💀";
    case 'sports':
      return "Your team is having a season to forget, mate. Want me to pull up the ladder? It's painful viewing. 📊";
    case 'roast':
      return "I'm cooking up something special for your mate. Give me one more detail — what's their most cringe habit? 🍳";
    case 'empathy':
      return "Real talk though — you doing okay? I'm here if you need to vent, no jokes. Just a mate checking in. 💙";
    default:
      return "Yeah nah, I hear you mate. Go on, what's the latest? I'm all ears... well, all text. You know what I mean. 😎";
  }
}
