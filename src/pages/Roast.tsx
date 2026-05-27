// @ts-nocheck
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  History,
  Copy,
  Check,
  Share2,
  RotateCcw,
  Star,
  X,
  Trash2,
  ChevronLeft,
} from 'lucide-react';
import Layout from '@/components/Layout';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface RoastFormData {
  name: string;
  relationship: string;
  flaws: string[];
  brag: string;
  embarrassing: string;
  savageLevel: number;
}

interface GeneratedRoast {
  id: string;
  name: string;
  date: string;
  savageLevel: number;
  setup: string;
  twist: string;
  punchline: string;
  closer: string;
}

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const primaryEase = [0.16, 1, 0.3, 1] as [number, number, number, number];
const bounceEase = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

const RELATIONSHIPS = [
  'Work mate',
  'School friend',
  'Cousin',
  'Sibling',
  'Partner',
  'Random bloke',
  'Rival',
];

const FLAWS = [
  'Always late',
  'Terrible taste',
  'Thinks they\'re smart',
  'Bad at sports',
  'Over-sharer',
  'Food thief',
  'Takes forever to reply',
  'Dad jokes',
  'Can\'t cook',
  'Always cold',
];

const SAVAGE_LABELS: Record<number, { label: string; emoji: string }> = {
  1: { label: 'Gentle tease', emoji: '\u{1F60A}' },
  2: { label: 'Mild roast', emoji: '\u{1F60F}' },
  3: { label: 'Standard banter', emoji: '\u{1F608}' },
  4: { label: 'Brutal', emoji: '\u{1F525}' },
  5: { label: 'Career ending', emoji: '\u{1F480}' },
};

/* ------------------------------------------------------------------ */
/*  MOCK HISTORY                                                       */
/* ------------------------------------------------------------------ */

const MOCK_HISTORY: GeneratedRoast[] = [
  {
    id: '1',
    name: 'Dave',
    date: '2024-05-20',
    savageLevel: 3,
    setup: 'So Dave walked into the office today — late, as usual, carrying his "world famous" homemade cookies.',
    twist: 'World famous because three people called in sick last time he brought them.',
    punchline: 'The only thing famous about Dave is how fast the bathroom clears when he opens Tupperware.',
    closer: 'Stick to buying donuts, legend. It\'s safer for everyone.',
  },
  {
    id: '2',
    name: 'Sarah',
    date: '2024-05-18',
    savageLevel: 4,
    setup: 'Sarah\'s been talking about her gym progress for six months straight.',
    twist: 'The only thing getting heavier is everyone\'s patience listening to her.',
    punchline: 'She pays $80 a week to take selfies in Lululemon and hold a protein shake.',
    closer: 'But you didn\'t hear this from me… the protein shake is empty.',
  },
];

/* ------------------------------------------------------------------ */
/*  GENERATE ROAST MOCK                                                */
/* ------------------------------------------------------------------ */

function generateMockRoast(data: RoastFormData): GeneratedRoast {
  const setups: Record<string, string> = {
    'Work mate': `So ${data.name} showed up to work today — ${data.flaws[0]?.toLowerCase() || 'causing chaos'}, as always.`,
    'School friend': `${data.name} and I go way back. They\'ve been ${data.flaws[0]?.toLowerCase() || 'a mess'} since Year 7.`,
    Cousin: `Family dinner with ${data.name}. Classic. ${data.flaws[0] || 'Something embarrassing'} guaranteed.`,
    Sibling: `Growing up with ${data.name} was… an experience. ${data.flaws[0] || 'Chaos'} every single day.`,
    Partner: `${data.name} — the love of my life. Also the reason I need therapy.`,
    'Random bloke': `Met ${data.name} once. That was enough to learn about the ${data.flaws[0]?.toLowerCase() || 'disaster'}.`,
    Rival: `${data.name} thinks they\'re winning. That\'s the saddest part.`,
  };

  const twists: Record<string, string> = {
    'Always late': `This time they actually showed up only 45 minutes late — a personal best.`,
    'Terrible taste': `They showed up wearing something that looked like a blindfolded toddler dressed them.`,
    'Thinks they\'re smart': `They started explaining something they clearly read half a Wikipedia article about.`,
    'Bad at sports': `They tried to kick a ball. Tried. Emphasis on tried.`,
    'Over-sharer': `Within five minutes, I knew their medical history, dating failures, and credit score.`,
    'Food thief': `Caught them eyeing my lunch like it was their last meal on death row.`,
    'Takes forever to reply': `Sent them a text three days ago. They just replied "lol".`,
    'Dad jokes': `They said "I\'m hungry" and waited for someone to say "Hi hungry, I\'m dad." Someone did. It was them.`,
    'Can\'t cook': `Brought their "famous" pasta. Famous for sending people to the hospital.`,
    'Always cold': `Wearing a puffer jacket indoors. It\'s 28 degrees.`,
  };

  const punchlines: Record<number, string> = {
    1: `${data.name}\'s not bad, just… consistently disappointing. Like a warm salad.`,
    2: `Look, ${data.name} tries. And that\'s the problem — the effort is visible and tragic.`,
    3: `${data.name}\'s the kind of person who makes everyone else feel better about themselves. That\'s their gift.`,
    4: `${data.name} is living proof that you can\'t fix stupid, but you can dress it up in designer clothes.`,
    5: `${data.name}\'s existence is an act of public service — reminding everyone what not to be. Nobel Peace Prize incoming.`,
  };

  const closers: Record<number, string> = {
    1: `But hey, they mean well. allegedly.`,
    2: `But you didn\'t hear this from me… everyone\'s already thinking it.`,
    3: `But you didn\'t hear this from me… the group chat agrees.`,
    4: `But you didn\'t hear this from me… their last three exes said worse.`,
    5: `But you didn\'t hear this from me… I\'m genuinely concerned for their future children.`,
  };

  return {
    id: Date.now().toString(),
    name: data.name,
    date: new Date().toISOString().split('T')[0],
    savageLevel: data.savageLevel,
    setup: setups[data.relationship] || `So ${data.name} did their thing today…`,
    twist: twists[data.flaws[0]] || `And somehow it got even worse than expected.`,
    punchline: punchlines[data.savageLevel] || `${data.name} remains undefeated… at taking Ls.`,
    closer: closers[data.savageLevel] || `But you didn\'t hear this from me…`,
  };
}

/* ------------------------------------------------------------------ */
/*  PROGRESS DOTS                                                      */
/* ------------------------------------------------------------------ */

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      {Array.from({ length: total }, (_, i) => {
        const isCompleted = i < current;
        const isActive = i === current;
        return (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            animate={{
              scale: isActive ? 1.3 : 1,
            }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: isCompleted || isActive ? '#39FF14' : 'transparent',
              border: isCompleted || isActive ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
              boxShadow: isActive ? '0 0 10px rgba(57,255,20,0.5)' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  QUESTION CARD                                                      */
/* ------------------------------------------------------------------ */

interface QuestionCardProps {
  children: React.ReactNode;
  questionNum: number;
  total: number;
  title: string;
}

function QuestionCard({ children, questionNum, total, title }: QuestionCardProps) {
  return (
    <div
      className="rounded-2xl p-6 w-full max-w-sm mx-auto"
      style={{
        backgroundColor: '#12121A',
        border: '1px solid rgba(255,255,255,0.06)',
        borderTop: '3px solid #39FF14',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      <span
        className="text-[11px] font-semibold uppercase tracking-[2px] block mb-3"
        style={{ color: '#39FF14' }}
      >
        QUESTION {questionNum} OF {total}
      </span>
      <h2 className="font-display font-bold text-2xl text-[#F5F5F7] leading-tight mb-6">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  OPTION CHIP                                                        */
/* ------------------------------------------------------------------ */

function OptionChip({
  label,
  selected,
  onClick,
  delay = 0,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  delay?: number;
}) {
  return (
    <motion.button
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.3, ease: bounceEase }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-150"
      style={{
        backgroundColor: selected ? 'rgba(57,255,20,0.1)' : '#1A1A26',
        border: selected ? '1.5px solid #39FF14' : '1.5px solid rgba(255,255,255,0.1)',
        color: selected ? '#39FF14' : '#F5F5F7',
      }}
    >
      {selected && <Check className="w-3.5 h-3.5 inline mr-1.5" strokeWidth={3} />}
      {label}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  CARD SLIDE VARIANTS                                                */
/* ------------------------------------------------------------------ */

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function Roast() {
  const [step, setStep] = useState(0); // 0-5 = questions, 6 = generating, 7 = preview
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<RoastFormData>({
    name: '',
    relationship: '',
    flaws: [],
    brag: '',
    embarrassing: '',
    savageLevel: 3,
  });
  const [generatingText, setGeneratingText] = useState('Cooking up a roast...');
  const [roast, setRoast] = useState<GeneratedRoast | null>(null);
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<GeneratedRoast[]>(MOCK_HISTORY);
  const [selectedHistory, setSelectedHistory] = useState<GeneratedRoast | null>(null);
  const [customFlaw, setCustomFlaw] = useState('');

  /* ---- Generating animation ---- */
  const startGenerating = useCallback(() => {
    setStep(6);
    const texts = ['Cooking up a roast...', 'Adding spice...', 'Sharpening punchline...', 'Finding the twist...'];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setGeneratingText(texts[i]);
    }, 600);

    setTimeout(() => {
      clearInterval(interval);
      const generated = generateMockRoast(form);
      setRoast(generated);
      setHistory((prev) => [generated, ...prev]);
      setStep(7);
    }, 2500);
  }, [form]);

  /* ---- Navigation ---- */
  const goNext = useCallback(() => {
    if (step < 5) {
      setDirection(1);
      setStep((s) => s + 1);
    } else if (step === 5) {
      startGenerating();
    }
  }, [step, startGenerating]);

  const goBack = useCallback(() => {
    if (step > 0 && step < 6) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const goRestart = useCallback(() => {
    setForm({
      name: '',
      relationship: '',
      flaws: [],
      brag: '',
      embarrassing: '',
      savageLevel: 3,
    });
    setStep(0);
    setDirection(1);
    setRoast(null);
    setCopied(false);
    setRated(false);
    setCustomFlaw('');
  }, []);

  /* ---- Copy ---- */
  const handleCopy = useCallback(() => {
    if (!roast) return;
    const text = `ROAST SCRIPT for ${roast.name}\n\nSETUP:\n${roast.setup}\n\nTWIST:\n${roast.twist}\n\nPUNCHLINE:\n${roast.punchline}\n\nCLOSER:\n${roast.closer}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [roast]);

  /* ---- Share ---- */
  const handleShare = useCallback(() => {
    if (!roast) return;
    const text = `${roast.punchline}\n\n— courtesy of The Bloke AI`;
    if (navigator.share) {
      navigator.share({ title: `Roast for ${roast.name}`, text }).catch(() => {});
    }
  }, [roast]);

  /* ---- Rating ---- */
  const handleRate = useCallback(() => {
    setRated(true);
  }, []);

  /* ---- History delete ---- */
  const handleDelete = useCallback((id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
    if (selectedHistory?.id === id) {
      setSelectedHistory(null);
      setStep(7);
    }
  }, [selectedHistory]);

  /* ---- Form updates ---- */
  const toggleFlaw = useCallback((flaw: string) => {
    setForm((prev) => ({
      ...prev,
      flaws: prev.flaws.includes(flaw)
        ? prev.flaws.filter((f) => f !== flaw)
        : prev.flaws.length < 3
          ? [...prev.flaws, flaw]
          : prev.flaws,
    }));
  }, []);

  const canProceed = [
    form.name.trim().length > 0,
    form.relationship.length > 0,
    form.flaws.length > 0,
    form.brag.trim().length > 0,
    true, // embarrassing is optional
    true, // savage level always has value
  ];

  const savageInfo = SAVAGE_LABELS[form.savageLevel];

  /* ---- Render preview from history or fresh ---- */
  const displayRoast = selectedHistory || roast;

  return (
    <Layout showBottomNav bottomNavActiveIndex={2}>
      <div
        className="flex flex-col min-h-[100dvh] relative"
        style={{ background: 'linear-gradient(180deg, #0A0A0F 0%, rgba(255,59,48,0.02) 100%)' }}
      >
        {/* ========== HEADER ========== */}
        <div
          className="sticky top-14 z-40 flex items-center justify-between px-4 h-14"
          style={{
            backgroundColor: 'rgba(10,10,15,0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: '2px solid rgba(255,59,48,0.2)',
          }}
        >
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#39FF14]" strokeWidth={2} />
            <span
              className="font-display font-bold text-base uppercase tracking-wide"
              style={{ color: '#39FF14' }}
            >
              ROAST MY MATE
            </span>
          </div>

          <button
            onClick={() => setHistoryOpen(true)}
            className="relative p-2 rounded-lg hover:bg-[#1A1A26] transition-colors"
          >
            <History className="w-6 h-6 text-[#8A8A9A]" strokeWidth={2} />
            {history.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF006E] text-[10px] text-white flex items-center justify-center font-bold">
                {history.length}
              </span>
            )}
          </button>
        </div>

        {/* ========== QUESTION FORM ========== */}
        {step < 6 && (
          <div className="flex-1 flex flex-col px-4 pt-8 pb-24">
            <ProgressDots current={step} total={6} />

            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={step}
                  custom={direction}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: primaryEase }}
                  className="absolute inset-0"
                >
                  {/* --- Question 1: Name --- */}
                  {step === 0 && (
                    <QuestionCard questionNum={1} total={6} title="WHAT'S YOUR MATE'S NAME?">
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Enter their name or nickname..."
                        className="w-full h-14 px-4 rounded-xl text-base text-[#F5F5F7] placeholder-[#4A4A5A] outline-none"
                        style={{
                          backgroundColor: '#1A1A26',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && canProceed[0] && goNext()}
                        autoFocus
                      />
                      <p className="text-xs text-[#4A4A5A] mt-2">
                        Can be a nickname. The roast hits harder with names.
                      </p>
                    </QuestionCard>
                  )}

                  {/* --- Question 2: Relationship --- */}
                  {step === 1 && (
                    <QuestionCard questionNum={2} total={6} title="HOW DO YOU KNOW THEM?">
                      <div className="flex flex-wrap gap-2">
                        {RELATIONSHIPS.map((rel, i) => (
                          <OptionChip
                            key={rel}
                            label={rel}
                            selected={form.relationship === rel}
                            onClick={() => setForm((p) => ({ ...p, relationship: rel }))}
                            delay={i * 0.04}
                          />
                        ))}
                      </div>
                    </QuestionCard>
                  )}

                  {/* --- Question 3: Flaws --- */}
                  {step === 2 && (
                    <QuestionCard questionNum={3} total={6} title="WHAT'S THEIR BIGGEST FLAW?">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {FLAWS.map((flaw, i) => (
                          <OptionChip
                            key={flaw}
                            label={flaw}
                            selected={form.flaws.includes(flaw)}
                            onClick={() => toggleFlaw(flaw)}
                            delay={i * 0.04}
                          />
                        ))}
                      </div>
                      <input
                        type="text"
                        value={customFlaw}
                        onChange={(e) => setCustomFlaw(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customFlaw.trim()) {
                            toggleFlaw(customFlaw.trim());
                            setCustomFlaw('');
                          }
                        }}
                        placeholder="Something else..."
                        className="w-full h-12 px-4 rounded-xl text-sm text-[#F5F5F7] placeholder-[#4A4A5A] outline-none"
                        style={{
                          backgroundColor: '#1A1A26',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      />
                      <p className="text-xs text-[#4A4A5A] mt-2">
                        {form.flaws.length}/3 selected
                      </p>
                    </QuestionCard>
                  )}

                  {/* --- Question 4: Brag --- */}
                  {step === 3 && (
                    <QuestionCard questionNum={4} total={6} title="WHAT DO THEY BRAG ABOUT?">
                      <input
                        type="text"
                        value={form.brag}
                        onChange={(e) => setForm((p) => ({ ...p, brag: e.target.value }))}
                        placeholder="They never shut up about..."
                        className="w-full h-14 px-4 rounded-xl text-base text-[#F5F5F7] placeholder-[#4A4A5A] outline-none"
                        style={{
                          backgroundColor: '#1A1A26',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && canProceed[3] && goNext()}
                        autoFocus
                      />
                      <p className="text-xs text-[#4A4A5A] mt-2">
                        The thing they mention in every conversation.
                      </p>
                    </QuestionCard>
                  )}

                  {/* --- Question 5: Embarrassing --- */}
                  {step === 4 && (
                    <QuestionCard questionNum={5} total={6} title="MOST EMBARRASSING MOMENT?">
                      <textarea
                        value={form.embarrassing}
                        onChange={(e) => setForm((p) => ({ ...p, embarrassing: e.target.value }))}
                        placeholder="That time they..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl text-base text-[#F5F5F7] placeholder-[#4A4A5A] outline-none resize-none"
                        style={{
                          backgroundColor: '#1A1A26',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      />
                      <p className="text-xs text-[#4A4A5A] mt-2">
                        (Optional but makes it legendary)
                      </p>
                    </QuestionCard>
                  )}

                  {/* --- Question 6: Savage Level --- */}
                  {step === 5 && (
                    <QuestionCard questionNum={6} total={6} title="HOW SAVAGE SHOULD THIS BE?">
                      <div className="py-4">
                        <input
                          type="range"
                          min={1}
                          max={5}
                          value={form.savageLevel}
                          onChange={(e) => setForm((p) => ({ ...p, savageLevel: Number(e.target.value) }))}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #39FF14 0%, #39FF14 ${(form.savageLevel - 1) * 25}%, rgba(255,255,255,0.1) ${(form.savageLevel - 1) * 25}%, rgba(255,255,255,0.1) 100%)`,
                            accentColor: '#39FF14',
                          }}
                        />
                        <div className="flex justify-between mt-2 text-[10px] text-[#4A4A5A] uppercase tracking-wider">
                          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                        </div>
                        <div className="text-center mt-6">
                          <motion.span
                            key={form.savageLevel}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.15, ease: bounceEase }}
                            className="text-4xl block mb-2"
                          >
                            {savageInfo.emoji}
                          </motion.span>
                          <span className="text-base font-semibold text-[#F5F5F7]">
                            {savageInfo.label}
                          </span>
                        </div>
                        {form.savageLevel === 5 && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-center mt-3"
                            style={{ color: '#FF3B30' }}
                          >
                            Are you sure? This might end friendships.
                          </motion.p>
                        )}
                      </div>
                    </QuestionCard>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="mt-6 max-w-sm mx-auto w-full flex gap-3">
              {step > 0 && (
                <SecondaryButton
                  onClick={goBack}
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  BACK
                </SecondaryButton>
              )}
              <PrimaryButton
                onClick={goNext}
                className={step > 0 ? 'flex-[2]' : 'w-full'}
                icon={step === 5 ? <Flame className="w-4 h-4" /> : undefined}
                variant={step === 5 ? 'magenta' : 'green'}
              >
                {step === 5 ? 'GENERATE ROAST' : 'NEXT'}
              </PrimaryButton>
            </div>
          </div>
        )}

        {/* ========== GENERATING STATE ========== */}
        {step === 6 && (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: bounceEase }}
              className="mb-6"
            >
              <div className="relative">
                <Flame className="w-16 h-16 text-[#FF9500]" strokeWidth={2} />
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0"
                >
                  <Flame className="w-16 h-16 text-[#FF006E]" strokeWidth={2} />
                </motion.div>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-sm text-[#8A8A9A] mb-4"
            >
              {generatingText}
            </motion.p>
            <div className="w-48 h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#1A1A26' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #39FF14 0%, #00F0FF 100%)' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: primaryEase }}
              />
            </div>
          </div>
        )}

        {/* ========== ROAST PREVIEW ========== */}
        {step === 7 && displayRoast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: primaryEase }}
            className="flex-1 px-4 pt-6 pb-32 overflow-y-auto"
          >
            {/* Script Card */}
            <div
              className="rounded-2xl p-6 max-w-sm mx-auto"
              style={{
                backgroundColor: '#12121A',
                border: '2px solid rgba(255,59,48,0.3)',
                boxShadow: '0 0 20px rgba(57,255,20,0.15)',
              }}
            >
              {/* Header */}
              <div className="text-center mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h2 className="font-slang text-[32px] leading-none" style={{ color: '#39FF14' }}>
                  ROAST SCRIPT
                </h2>
                <p className="text-sm text-[#8A8A9A] mt-1">
                  For {displayRoast.name}
                </p>
              </div>

              {/* SETUP */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-5 pl-3"
                style={{ borderLeft: '2px solid #39FF14' }}
              >
                <span className="font-slang text-sm uppercase tracking-wider" style={{ color: '#39FF14' }}>
                  SETUP
                </span>
                <p className="text-[15px] text-[#F5F5F7] mt-1 italic leading-relaxed">
                  {displayRoast.setup}
                </p>
              </motion.div>

              {/* TWIST */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mb-5 pl-3"
                style={{ borderLeft: '2px solid #39FF14' }}
              >
                <span className="font-slang text-sm uppercase tracking-wider" style={{ color: '#39FF14' }}>
                  TWIST
                </span>
                <p className="text-[15px] text-[#F5F5F7] mt-1 italic leading-relaxed">
                  {displayRoast.twist}
                </p>
              </motion.div>

              {/* PUNCHLINE */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-5 pl-3"
                style={{
                  borderLeft: '2px solid #39FF14',
                  background: 'rgba(57,255,20,0.05)',
                  padding: '12px 12px 12px 14px',
                  borderRadius: '8px',
                }}
              >
                <span className="font-slang text-sm uppercase tracking-wider" style={{ color: '#39FF14' }}>
                  PUNCHLINE
                </span>
                <p className="text-base text-[#F5F5F7] mt-1 font-medium leading-relaxed">
                  {displayRoast.punchline}
                </p>
              </motion.div>

              {/* CLOSER */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="pl-3"
                style={{ borderLeft: '2px solid #39FF14' }}
              >
                <span className="font-slang text-sm uppercase tracking-wider" style={{ color: '#39FF14' }}>
                  CLOSER
                </span>
                <p className="text-[15px] text-[#8A8A9A] mt-1 italic leading-relaxed">
                  {displayRoast.closer}
                </p>
              </motion.div>
            </div>

            {/* Action buttons */}
            <div className="max-w-sm mx-auto mt-4 space-y-3">
              <PrimaryButton
                onClick={handleCopy}
                className="w-full"
                icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? 'COPIED!' : 'COPY TO CLIPBOARD'}
              </PrimaryButton>
              <SecondaryButton onClick={handleShare} className="w-full">
                <Share2 className="w-4 h-4" />
                SHARE TO...
              </SecondaryButton>
              <button
                onClick={goRestart}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[#4A4A5A] hover:text-[#8A8A9A] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                GENERATE AGAIN
              </button>
            </div>

            {/* Rating */}
            {!rated ? (
              <div className="max-w-sm mx-auto mt-6 text-center">
                <p className="text-sm text-[#8A8A9A] mb-3">How was this roast?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileTap={{ scale: 1.2 }}
                      onClick={handleRate}
                      className="p-1"
                    >
                      <Star
                        className="w-7 h-7"
                        strokeWidth={2}
                        fill={star <= displayRoast.savageLevel ? '#FF9500' : 'transparent'}
                        color={star <= displayRoast.savageLevel ? '#FF9500' : '#4A4A5A'}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-center text-[#30D158] mt-6"
              >
                Thanks mate! We&apos;ll make &apos;em even better.
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ========== HISTORY DRAWER ========== */}
        <AnimatePresence>
          {historyOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55]"
              onClick={() => {
                setHistoryOpen(false);
                setSelectedHistory(null);
              }}
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              />

              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.4, ease: primaryEase }}
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-3xl"
                style={{
                  backgroundColor: '#1A1A26',
                  paddingBottom: 'calc(24px + env(safe-area-inset-bottom))',
                }}
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 rounded-full bg-[#4A4A5A]" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pb-4">
                  <h3 className="font-display font-bold text-lg text-[#F5F5F7]">
                    PAST ROASTS
                  </h3>
                  <button
                    onClick={() => {
                      setHistoryOpen(false);
                      setSelectedHistory(null);
                    }}
                    className="p-1 rounded-lg hover:bg-[#12121A]"
                  >
                    <X className="w-5 h-5 text-[#8A8A9A]" />
                  </button>
                </div>

                {/* Content: History list or Detail */}
                {!selectedHistory ? (
                  /* List */
                  <div className="px-4 space-y-3">
                    {history.length === 0 ? (
                      <div className="text-center py-12">
                        <Flame className="w-12 h-12 text-[#4A4A5A] mx-auto mb-3" />
                        <p className="text-base text-[#8A8A9A]">
                          No roasts yet. Go roast someone!
                        </p>
                      </div>
                    ) : (
                      history.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-xl"
                          style={{ backgroundColor: '#12121A' }}
                        >
                          <button
                            onClick={() => {
                              setSelectedHistory(item);
                              setStep(7);
                              setHistoryOpen(false);
                            }}
                            className="flex-1 text-left"
                          >
                            <p className="font-semibold text-[#F5F5F7]">{item.name}</p>
                            <p className="text-xs text-[#4A4A5A]">{item.date}</p>
                          </button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, j) => (
                              <Flame
                                key={j}
                                className="w-3.5 h-3.5"
                                strokeWidth={2}
                                fill={j < item.savageLevel ? '#FF9500' : 'transparent'}
                                color={j < item.savageLevel ? '#FF9500' : '#4A4A5A'}
                              />
                            ))}
                          </div>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="ml-3 p-2 rounded-lg hover:bg-[#FF3B30]/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-[#FF3B30]" />
                          </button>
                        </motion.div>
                      ))
                    )}
                  </div>
                ) : (
                  /* Detail view inside drawer */
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => setSelectedHistory(null)}
                      className="text-sm text-[#8A8A9A] mb-4 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Back to list
                    </button>
                    <div
                      className="rounded-xl p-4"
                      style={{ backgroundColor: '#12121A' }}
                    >
                      <p className="font-slang text-lg" style={{ color: '#39FF14' }}>
                        {selectedHistory.name}
                      </p>
                      <p className="text-sm text-[#F5F5F7] mt-2 italic">
                        {selectedHistory.punchline}
                      </p>
                      <div className="flex gap-1 mt-3">
                        {Array.from({ length: 5 }, (_, j) => (
                          <Flame
                            key={j}
                            className="w-4 h-4"
                            fill={j < selectedHistory.savageLevel ? '#FF9500' : 'transparent'}
                            color={j < selectedHistory.savageLevel ? '#FF9500' : '#4A4A5A'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
