// @ts-nocheck
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight,
  Search,
  Flame,
  MessageSquare,
  Trophy,
  ChevronDown,
  Star,
  User,
  Layers,
  Heart,
  Ghost,
  ChevronUp,
  MessageCircle,
  Zap,
  Sun,
  CloudRain,
} from 'lucide-react';
import ChatBubble from '@/components/ChatBubble';
import ModeBadge from '@/components/ModeBadge';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

/* ------------------------------------------------------------------ */
/*  Reusable animation wrapper                                        */
/* ------------------------------------------------------------------ */
function FadeInSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  SECTION 1 — HERO                                                 */
/* ------------------------------------------------------------------ */
const heroChatMessages = [
  { type: 'ai' as const, text: 'Oi, what do you want now?' },
  { type: 'user' as const, text: "What's the weather like?" },
  { type: 'ai' as const, text: "Mate... you got a window? Use it. Fine, it's 24°C and sunny. Perfect day for your team to lose again 😏" },
];

const HeroSection = memo(function HeroSection() {
  const [showTyping1, setShowTyping1] = useState(false);
  const [showBubble1, setShowBubble1] = useState(false);
  const [showTyping2, setShowTyping2] = useState(false);
  const [showBubble2, setShowBubble2] = useState(false);
  const [showTyping3, setShowTyping3] = useState(false);
  const [showBubble3, setShowBubble3] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowTyping1(true), 500);
    const t2 = setTimeout(() => { setShowTyping1(false); setShowBubble1(true); }, 1100);
    const t3 = setTimeout(() => setShowTyping2(true), 1600);
    const t4 = setTimeout(() => { setShowTyping2(false); setShowBubble2(true); }, 2100);
    const t5 = setTimeout(() => setShowTyping3(true), 2600);
    const t6 = setTimeout(() => { setShowTyping3(false); setShowBubble3(true); }, 3800);
    const t7 = setTimeout(() => setShowCTA(true), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); clearTimeout(t7); };
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden gradient-hero">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-30 bg-cover bg-center"
        style={{ backgroundImage: 'url(/hero-bg-gradient.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary" />

      <div className="relative z-10 px-5 pt-14 pb-8 max-w-lg mx-auto w-full">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        >
          <h1 className="font-display font-extrabold text-5xl tracking-tight leading-[1.05]">
            <span className="text-text-primary block">THE BLOKE</span>
            <span className="text-accent-neon glow-text-green block">AI</span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mt-4 text-base text-text-secondary leading-relaxed max-w-[320px]"
        >
          Not your average assistant. A sarcastic mate who roasts you, knows your slang, and never lets your team&apos;s losses go unmentioned.
        </motion.p>

        {/* Character — hidden on very small screens */}
        <motion.img
          src="/hero-bloke-character.png"
          alt="The Bloke character"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden sm:block absolute top-20 right-0 w-[240px] h-auto animate-float pointer-events-none"
        />

        {/* Live Chat Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 w-full max-w-[340px] bg-bg-secondary/80 backdrop-blur-sm border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
            <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">Live Demo</span>
          </div>

          <div className="flex flex-col gap-2 scale-[0.95] origin-top-left">
            {showTyping1 && <TypingIndicator />}
            {showBubble1 && <ChatBubble type="ai" delay={0}>{heroChatMessages[0].text}</ChatBubble>}
            {showTyping2 && <TypingIndicator />}
            {showBubble2 && <ChatBubble type="user" delay={0}>{heroChatMessages[1].text}</ChatBubble>}
            {showTyping3 && <TypingIndicator />}
            {showBubble3 && <ChatBubble type="ai" delay={0}>{heroChatMessages[2].text}</ChatBubble>}
          </div>
        </motion.div>

        {/* CTAs */}
        <AnimatePresence>
          {showCTA && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              className="mt-6 flex flex-col items-start gap-3"
            >
              <PrimaryButton href="#/onboarding" icon={<ArrowRight className="w-4 h-4" />}>
                LET&apos;S GO, MATE
              </PrimaryButton>
              <SecondaryButton href="#/chat">
                Already got a mate? Log in
              </SecondaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="w-6 h-6 text-text-muted" />
      </motion.div>
    </section>
  );
});

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-bloke-bubble border border-[rgba(57,255,20,0.15)] rounded-[4px_16px_16px_16px] px-4 py-3 shadow-neon-green">
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-typing-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-typing-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-text-secondary animate-typing-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SECTION 2 — 4 CORE FEATURES                                      */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: Search,
    title: 'Sarcastic Search',
    desc: 'Ask anything. Get roasted first, answered second. With a fake loading screen that tracks how impatient you are.',
    image: '/feature-sarcastic.png',
    color: 'accent-cyan',
    borderColor: '#00F0FF',
    badge: null,
  },
  {
    icon: Flame,
    title: 'Roast My Mate',
    desc: "Answer 6 questions about your mate. We'll write you a roast script with setup, twist, and killer punchline. Copy and paste straight to the group chat.",
    image: '/feature-roast.png',
    color: 'accent-neon',
    borderColor: '#39FF14',
    badge: null,
  },
  {
    icon: MessageSquare,
    title: 'Banter Battle Mode',
    desc: "20 messages of structured argument. We'll fake sympathy, straw-man your points, roast your phone's battery, then GHOST you at message 20. Try to survive.",
    image: '/feature-banter.png',
    color: 'accent-magenta',
    borderColor: '#FF006E',
    badge: 'MOST POPULAR',
  },
  {
    icon: Trophy,
    title: 'Sports Troll Engine',
    desc: "We track your team's losses in real-time. When they lose, you get roasted. When they win, we find something else to mock. Weather-linked punchlines included.",
    image: '/feature-sports.png',
    color: 'accent-amber',
    borderColor: '#FF9500',
    badge: null,
  },
];

const FeatureSection = memo(function FeatureSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <section className="bg-bg-primary py-16 px-5">
      <div className="max-w-lg mx-auto">
        <FadeInSection>
          <h2 className="font-display font-bold text-4xl tracking-tight text-text-primary mb-10">
            WHAT THE <span className="text-accent-neon">BLOKE</span> DOES
          </h2>
        </FadeInSection>

        <div ref={ref} className="grid grid-cols-1 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                whileHover={{ y: -4 }}
                className="relative bg-bg-secondary rounded-2xl p-6 border-t-[3px] shadow-card overflow-hidden"
                style={{ borderTopColor: f.borderColor }}
              >
                {f.badge && (
                  <span className="absolute top-4 right-4 bg-accent-magenta text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {f.badge}
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: `${f.borderColor}20` }}>
                    <Icon className="w-7 h-7" style={{ color: f.borderColor }} strokeWidth={2} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-text-primary">{f.title}</h3>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-4">{f.desc}</p>

                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  className="w-full max-w-[200px] h-auto mx-auto rounded-lg object-contain"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  SECTION 3 — HOW IT WORKS                                         */
/* ------------------------------------------------------------------ */
const steps = [
  {
    num: '01',
    title: 'Tell us about yourself',
    desc: 'Your nationality, your slang, your sports team. The more we know, the harder we roast.',
    icon: User,
    color: '#39FF14',
  },
  {
    num: '02',
    title: 'Pick your mode',
    desc: 'Chat, Banter, Roast, or Sports Troll. Each mode hits different. Switch anytime.',
    icon: Layers,
    color: '#00F0FF',
  },
  {
    num: '03',
    title: 'Get roasted (with love)',
    desc: "Every response feels like banter with your mate. Sarcastic, personal, and weirdly caring underneath.",
    icon: Heart,
    color: '#FF006E',
  },
];

const HowItWorksSection = memo(function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <section className="bg-bg-secondary py-16 px-5">
      <div className="max-w-lg mx-auto" ref={ref}>
        <FadeInSection>
          <h2 className="font-display font-bold text-4xl tracking-tight text-text-primary mb-10 text-center">
            HOW IT WORKS
          </h2>
        </FadeInSection>

        <div className="flex flex-col gap-8 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Connecting line */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.2 + 0.3 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full h-8 w-[2px] border-l-2 border-dashed border-text-muted origin-top"
                  />
                )}

                <span className="font-slang text-5xl tracking-wider" style={{ color: step.color }}>
                  {step.num}
                </span>

                <div className="mt-3 p-3 rounded-2xl" style={{ backgroundColor: `${step.color}15` }}>
                  <Icon className="w-10 h-10" style={{ color: step.color }} strokeWidth={1.5} />
                </div>

                <h3 className="font-display font-bold text-xl text-text-primary mt-3">{step.title}</h3>
                <p className="text-sm text-text-secondary mt-1 max-w-[280px]">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  SECTION 4 — CULTURAL SLANG SHOWCASE                              */
/* ------------------------------------------------------------------ */
const slangTerms = ['Mate', 'Bro', 'Habibi', 'Bhai', 'Uce', 'Che', 'Wey', 'Anh', 'Hyung', 'Lah', 'Bru', 'Digger', 'Pare', 'Chur', 'Odogwu', 'Jani'];
const slangTerms2 = ['Cuz', 'Homie', 'Machi', 'Fam', 'G', 'Vro', 'Akhi', 'Sis', 'Dawg', 'Blood', 'Cuzzie', 'My G', 'Slatt', 'Blud', 'Gang', 'Amigo'];
const accentColors = ['#39FF14', '#00F0FF', '#FF006E', '#FF9500'];

const culturePills = [
  { flag: '🇦🇺', label: 'AUSSIE' },
  { flag: '🇱🇧', label: 'LEBANESE' },
  { flag: '🇮🇳', label: 'INDIAN' },
  { flag: '🇼🇸', label: 'SAMOAN' },
  { flag: '🇰🇷', label: 'KOREAN' },
  { flag: '🇸🇬', label: 'SINGAPOREAN' },
  { flag: '🇳🇬', label: 'NIGERIAN' },
  { flag: '🇵🇭', label: 'FILIPINO' },
  { flag: '🇳🇿', label: 'KIWI' },
  { flag: '🇬🇧', label: 'BRITISH' },
];

const SlangTicker = memo(function SlangTicker() {
  return (
    <div className="overflow-hidden py-6">
      {/* Row 1 — left to right */}
      <div className="flex whitespace-nowrap animate-ticker will-change-transform">
        {[...slangTerms, ...slangTerms].map((term, i) => (
          <span key={`r1-${i}`} className="inline-flex items-center gap-4 mx-4">
            <span
              className="font-slang text-5xl sm:text-6xl uppercase tracking-wide"
              style={{ color: accentColors[i % accentColors.length] }}
            >
              {term}
            </span>
            <span className="text-text-muted text-2xl">·</span>
          </span>
        ))}
      </div>

      {/* Row 2 — right to left (reverse) */}
      <div className="flex whitespace-nowrap animate-ticker-slow will-change-transform mt-4 opacity-40">
        {[...slangTerms2, ...slangTerms2].map((term, i) => (
          <span key={`r2-${i}`} className="inline-flex items-center gap-4 mx-4">
            <span
              className="font-slang text-4xl sm:text-5xl uppercase tracking-wide"
              style={{ color: accentColors[(i + 2) % accentColors.length] }}
            >
              {term}
            </span>
            <span className="text-text-muted text-xl">·</span>
          </span>
        ))}
      </div>
    </div>
  );
});

const CulturalSection = memo(function CulturalSection() {
  const [activePill, setActivePill] = useState(1); // Lebanese default
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });

  const slangExamples: Record<number, { ai: string; user: string; ai2: string }> = {
    0: { ai: "Oi mate, you really gonna ask me that? Fair dinkum, I thought you had more sense.", user: "Just answer the question", ai2: "Yeah nah, fine. But you're shoutin' the next round at the pub." },
    1: { ai: "Habibi, you really asked me that? Wallah, I thought you were smarter.", user: "Just answer the question", ai2: "Khalas, fine. But you're buying the next shawarma." },
    2: { ai: "Bhai, yeh kya puch raha hai? I thought you had some akal, yaar.", user: "Just answer the question", ai2: "Theek hai, fine. But you're paying for the next chai." },
    3: { ai: "Uce, you serious? Fo'i, I thought you knew better.", user: "Just answer the question", ai2: "Ugly, fine. But next BBQ, you're bringing the taro." },
    4: { ai: "Ya, really? Aish, I thought you had more sense, oppa.", user: "Just answer the question", ai2: "Arasso, fine. But you're buying the next BBQ." },
    5: { ai: "Aiyoh, you really asked me that? Walao, I thought you smarter lah.", user: "Just answer the question", ai2: "Ok lah, fine. But next meal at hawker centre, you pay." },
    6: { ai: "Odogwu, you really asked that? I thought you get sense, my guy.", user: "Just answer the question", ai2: "Oya, fine. But you're buying the next jollof." },
    7: { ai: "Pare, seryoso ka ba? Susmaryosep, akala ko may sense ka.", user: "Just answer the question", ai2: "Sige na nga, fine. Pero next inuman, sagot mo." },
    8: { ai: "Bro, you for real? Chur, I thought you had more brains, cuz.", user: "Just answer the question", ai2: "Sweet as, fine. But you're shoutin' the next flat white." },
    9: { ai: "Mate, you 'avin a laugh? Blimey, I thought you 'ad more sense.", user: "Just answer the question", ai2: "Right then, fine. But next pint at the pub, you're buyin'." },
  };

  const ex = slangExamples[activePill] || slangExamples[1];

  return (
    <section className="bg-bg-primary py-16 overflow-hidden" ref={ref}>
      <div className="px-5 max-w-lg mx-auto mb-6">
        <FadeInSection>
          <h2 className="font-display font-bold text-4xl tracking-tight text-text-primary">
            WE SPEAK YOUR LANGUAGE
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            40+ cultures. 100+ slang terms. The Bloke matches your vibe.
          </p>
        </FadeInSection>
      </div>

      <SlangTicker />

      {/* Culture pills */}
      <div className="px-5 max-w-lg mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-1 px-1">
          {culturePills.map((pill, i) => (
            <motion.button
              key={pill.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.06, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActivePill(i)}
              className={`flex-shrink-0 snap-start px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activePill === i
                  ? 'border-accent-neon/30 bg-accent-neon/10 text-accent-neon scale-105'
                  : 'border-[rgba(255,255,255,0.1)] bg-bg-secondary text-text-muted opacity-60 hover:opacity-100'
              }`}
            >
              {pill.flag} {pill.label}
            </motion.button>
          ))}
        </div>

        {/* Slang example card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePill}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-bg-secondary rounded-2xl p-4 border border-[rgba(255,255,255,0.06)]"
          >
            <ChatBubble type="ai" delay={0}>
              {ex.ai}
            </ChatBubble>
            <div className="mt-2">
              <ChatBubble type="user" delay={0}>
                {ex.user}
              </ChatBubble>
            </div>
            <div className="mt-2">
              <ChatBubble type="ai" delay={0}>
                {ex.ai2}
              </ChatBubble>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  SECTION 5 — BANTER PREVIEW                                       */
/* ------------------------------------------------------------------ */
const banterMessages = [
  { type: 'ai' as const, text: 'I feel you mate... sort of', stage: 'Fake Sympathy' },
  { type: 'ai' as const, text: "So what you're saying is [absurd thing]", stage: 'Straw Man' },
  { type: 'ai' as const, text: "Your phone's getting hot from all these Ls", stage: 'Phone Temp' },
  { type: 'ai' as const, text: '...', stage: 'THE GHOST', ghost: true },
];

const BanterPreviewSection = memo(function BanterPreviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [activeMsg, setActiveMsg] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setActiveMsg((prev) => (prev + 1) % banterMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section
      className="py-16 px-5 border-t border-b"
      style={{
        background: 'linear-gradient(135deg, rgba(255,0,110,0.08) 0%, rgba(10,10,15,0.95) 100%)',
        borderColor: 'rgba(255,0,110,0.2)',
      }}
      ref={ref}
    >
      <div className="max-w-lg mx-auto">
        <FadeInSection>
          <ModeBadge mode="banter" className="mb-4" />
          <h2 className="font-display font-bold text-4xl tracking-tight text-text-primary">
            20 MESSAGES. THEN <span className="text-accent-magenta glow-text-magenta">POOF</span>
          </h2>
        </FadeInSection>

        {/* Message counter visual — 4x5 grid */}
        <FadeInSection delay={0.2}>
          <div className="mt-8 grid grid-cols-5 gap-2 max-w-[200px] mx-auto">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i === 19
                    ? 'bg-accent-magenta/20 border-2 border-accent-magenta'
                    : i < 19
                    ? 'bg-gradient-to-br from-accent-magenta to-accent-amber'
                    : 'bg-bg-elevated border border-[rgba(255,255,255,0.1)]'
                }`}
              >
                {i === 19 && <Ghost className="w-4 h-4 text-accent-magenta animate-neon-pulse" />}
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-accent-magenta mt-3 font-medium">
            Message 20: THE GHOST 👻
          </p>
        </FadeInSection>

        {/* Sample exchange */}
        <div className="mt-8 space-y-3">
          <AnimatePresence mode="wait">
            {banterMessages.map((msg, i) => (
              i === activeMsg && (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: msg.ghost ? 0.15 : 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ChatBubble type="ai" delay={0}>
                    <span className="block">{msg.text}</span>
                    <span className="block text-[10px] uppercase tracking-wider mt-1 text-accent-magenta font-medium opacity-70">
                      {msg.stage}
                    </span>
                  </ChatBubble>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        <FadeInSection delay={0.4}>
          <div className="mt-8">
            <PrimaryButton href="#/banter" variant="magenta">
              START A BANTER BATTLE
            </PrimaryButton>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  SECTION 6 — SPORTS TROLL TEASER                                  */
/* ------------------------------------------------------------------ */
const SportsTrollSection = memo(function SportsTrollSection() {
  return (
    <section className="bg-bg-primary py-16 px-5">
      <div className="max-w-lg mx-auto">
        <FadeInSection>
          <h2 className="font-display font-bold text-4xl tracking-tight text-text-primary">
            YOUR TEAM LOST. AGAIN.
          </h2>
          <p className="mt-2 text-base text-text-secondary">
            We track 45+ teams across 10 leagues. When they lose, you hear about it.
          </p>
        </FadeInSection>

        {/* Live score mockup */}
        <FadeInSection delay={0.2}>
          <div className="mt-8 bg-bg-secondary rounded-2xl p-5 border border-[rgba(255,255,255,0.06)] shadow-card">
            {/* League badge */}
            <span className="inline-block px-3 py-1 bg-accent-amber/10 text-accent-amber text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              NRL
            </span>

            {/* Score */}
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="font-display font-bold text-lg text-text-primary">PARRAMATTA EELS</p>
                <p className="font-display font-bold text-4xl text-text-primary mt-1">12</p>
              </div>
              <div className="px-3">
                <span className="text-text-muted text-lg font-display">—</span>
              </div>
              <div className="text-center flex-1">
                <p className="font-display font-bold text-lg text-text-primary">PENRITH PANTHERS</p>
                <p className="font-display font-bold text-4xl text-text-primary mt-1">28</p>
              </div>
            </div>

            <p className="text-center text-safety-red text-sm font-semibold uppercase tracking-wider mt-3">
              FULL TIME
            </p>

            {/* Bloke's comment */}
            <div className="mt-4">
              <ChatBubble type="ai" delay={0}>
                {"Oof, 3 losses in a row now? Your team really said 'nah, we good' to winning, didn't they mate 😬"}
              </ChatBubble>
            </div>
          </div>
        </FadeInSection>

        {/* Weather link preview */}
        <FadeInSection delay={0.3}>
          <div className="mt-4 bg-bg-elevated rounded-xl p-4 flex items-start gap-3">
            <Sun className="w-5 h-5 text-accent-amber flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary">
              <span className="text-accent-amber font-medium">Sunny, 26°C</span> — &quot;Beautiful day to watch your team get absolutely cooked&quot;
            </p>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.4}>
          <div className="mt-6">
            <SecondaryButton href="#/sports" borderColor="#FF9500">
              LINK MY TEAM
            </SecondaryButton>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  SECTION 7 — SOCIAL PROOF / TESTIMONIALS                          */
/* ------------------------------------------------------------------ */
const testimonials = [
  { quote: "I asked it for the weather and got roasted for 5 minutes before getting an answer. 10/10.", name: "Jake M.", handle: "@jakemate__", rating: 5 },
  { quote: "The banter battle had me arguing with an AI for 18 messages before it ghosted me. I'm still mad.", name: "Priya K.", handle: "@priyak89", rating: 5 },
  { quote: "It called me 'uce' and roasted the Eels in the same sentence. Felt like talking to my cousin.", name: "TJ S.", handle: "@tjs_ava", rating: 5 },
  { quote: "The roast generator is lethal. I copy-pasted one into my group chat and started a war.", name: "Chen W.", handle: "@chenw_sg", rating: 5 },
  { quote: "I waited 90 seconds on the loading screen just to see what it would say. It called me a legend. Worth it.", name: "Liam O.", handle: "@liamobrien", rating: 5 },
];

const stats = [
  { num: 99, label: 'Personality Modes', color: '#39FF14' },
  { num: 40, suffix: '+', label: 'Cultures', color: '#00F0FF' },
  { num: 45, suffix: '+', label: 'Sports Teams', color: '#FF9500' },
  { num: 20, label: 'Banter Messages', color: '#FF006E' },
];

function AnimatedNumber({ target, suffix = '', color, inView }: { target: number; suffix?: string; color: string; inView: boolean }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView, target]);

  return (
    <span className="font-display font-bold text-4xl tabular-nums" style={{ color }}>
      {display}{suffix}
    </span>
  );
}

const TestimonialsSection = memo(function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <section className="bg-bg-secondary py-16" ref={ref}>
      <div className="px-5 max-w-lg mx-auto">
        <FadeInSection>
          <h2 className="font-display font-bold text-4xl tracking-tight text-text-primary mb-8">
            WHAT THE MATES ARE SAYING
          </h2>
        </FadeInSection>
      </div>

      {/* Horizontal scroll testimonials */}
      <div className="flex gap-4 overflow-x-auto px-5 pb-4 snap-x snap-mandatory scrollbar-hide">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex-shrink-0 w-[280px] snap-start bg-bg-primary rounded-2xl p-6 border border-[rgba(255,255,255,0.06)] shadow-card"
          >
            <MessageCircle className="w-8 h-8 text-accent-neon mb-3" strokeWidth={1.5} />
            <p className="text-base text-text-primary italic leading-relaxed">&quot;{t.quote}&quot;</p>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-accent-amber fill-accent-amber" />
                ))}
              </div>
            </div>
            <p className="mt-2 font-semibold text-sm text-text-primary">{t.name}</p>
            <p className="text-xs text-text-secondary">{t.handle}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats bar */}
      <div className="px-5 max-w-lg mx-auto mt-10">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-center"
            >
              <AnimatedNumber target={s.num} suffix={s.suffix || ''} color={s.color} inView={isInView} />
              <p className="text-xs text-text-secondary mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  SECTION 8 — FAQ                                                  */
/* ------------------------------------------------------------------ */
const faqItems = [
  {
    q: 'Is this actually AI or just pre-written responses?',
    a: "It's real AI — powered by language models — but trained with a very specific personality. Every roast is generated fresh based on what you say, your culture, and your team's current losing streak.",
  },
  {
    q: 'Can I get it to stop roasting me?',
    a: "Yeah mate, just say 'stop' or 'too far' and we dial it back immediately. Safety first, banter second. There's always an opt-out.",
  },
  {
    q: 'What cultures are supported?',
    a: 'Over 40 cultures and counting — Lebanese, Samoan, Indian, Filipino, Korean, Singaporean, Australian, British, Nigerian, Kiwi, and many more. Each with authentic slang and cultural references.',
  },
  {
    q: 'Does it really track sports scores?',
    a: "Yep. Link your team and we'll know when they lose before you do. NRL, AFL, Premier League, NBA, NFL — 10 leagues, 45+ teams.",
  },
  {
    q: 'What happens in Banter Battle mode?',
    a: "A structured 20-message argument that escalates from fake sympathy to full ghosting. At message 20, the AI stops responding entirely. It's a game. Try to survive.",
  },
  {
    q: 'Is it free?',
    a: 'Completely free to start. Premium gets you unlimited banter battles, custom roast templates, and priority sports trolling.',
  },
];

const FAQSection = memo(function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <section className="bg-bg-primary py-16 px-5" ref={ref}>
      <div className="max-w-lg mx-auto">
        <FadeInSection>
          <h2 className="font-display font-bold text-4xl tracking-tight text-text-primary mb-8">
            GOT QUESTIONS, MATE?
          </h2>
        </FadeInSection>

        <div className="space-y-3">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-bg-secondary rounded-xl border border-[rgba(255,255,255,0.06)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-base text-text-primary pr-4">{item.q}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-text-secondary" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  SECTION 9 — FINAL CTA + FOOTER                                   */
/* ------------------------------------------------------------------ */
const FinalCTASection = memo(function FinalCTASection() {
  return (
    <>
      <section
        className="py-16 px-5"
        style={{ background: 'linear-gradient(225deg, #0A0A0F 0%, #1A0A2E 50%, #0A1A0F 100%)' }}
      >
        <div className="max-w-lg mx-auto text-center">
          <FadeInSection>
            <h2 className="font-display font-extrabold text-5xl tracking-tight text-text-primary">
              READY TO GET ROASTED?
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <p className="mt-4 text-base text-text-secondary">
              Your new mate is waiting. And he&apos;s already got jokes about your team ready.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="mt-8 flex flex-col items-center gap-3">
              <PrimaryButton href="#/onboarding" size="large" icon={<Zap className="w-5 h-5" />}>
                START CHATTING — IT&apos;S FREE
              </PrimaryButton>
              <p className="text-xs text-text-muted mt-2">
                No signup required for first 10 messages
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-primary border-t border-[rgba(255,255,255,0.06)] py-8 px-5">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-display font-bold text-base text-text-primary">THE BLOKE AI</p>

          <div className="flex items-center justify-center gap-6 mt-4">
            <a href="#/personality" className="text-xs text-text-secondary hover:text-text-primary transition-colors">About</a>
            <a href="#/safety" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Safety</a>
            <a href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Terms</a>
          </div>

          <p className="text-[11px] text-text-muted mt-6">
            &copy; 2025 The Bloke AI. Made with sarcasm and love.
          </p>
        </div>
      </footer>
    </>
  );
});

/* ------------------------------------------------------------------ */
/*  HOME PAGE — assemble all sections                                */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-bg-primary">
      <HeroSection />
      <FeatureSection />
      <HowItWorksSection />
      <CulturalSection />
      <BanterPreviewSection />
      <SportsTrollSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
