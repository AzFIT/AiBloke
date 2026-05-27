// @ts-nocheck
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Heart,
  AlertTriangle,
  ShieldAlert,
  UserX,
  Ban,
  Hand,
  Phone,
  ChevronDown,
  StopCircle,
  LogOut,
  SlidersHorizontal,
  RotateCcw,
  Lock,
  Eye,
  Activity,
  Globe,
  MessageSquare,
  Check,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

/* ──────────────────────────── animation helpers ──────────────────────────── */

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const popIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  }),
};

/* ──────────────────────────── guardrail data ─────────────────────────────── */

interface Guardrail {
  id: string;
  title: string;
  summary: string;
  description: string;
  response: string;
  note?: string;
  color: string;
  icon: React.ElementType;
}

const guardrails: Guardrail[] = [
  {
    id: 'distress',
    title: 'Genuine Distress Detection',
    summary: 'Sentiment below -0.7 + crisis keywords',
    description:
      'If our system detects language indicating genuine emotional distress (sentiment score below -0.7 combined with keywords like suicide, self-harm, crisis), The Bloke immediately drops character.',
    response: 'Drops character → "Are you safe right now?" → Provides crisis lines → Switches to supportive mode',
    color: '#FF3B30',
    icon: Heart,
  },
  {
    id: 'toxicity',
    title: 'Toxicity Detection',
    summary: 'Score above 0.8 (profanity + aggression)',
    description:
      'Detected when profanity and aggressive language exceed our threshold.',
    response: '5-minute cooldown → "Last warning" → Done for the day',
    color: '#FF9500',
    icon: AlertTriangle,
  },
  {
    id: 'selfharm',
    title: 'Self-Harm Detection',
    summary: "'cut myself', 'hurt myself', 'want to die'",
    description: 'Immediate detection of explicit self-harm language.',
    response: 'Drops character immediately → Crisis lines → Supportive mode activated → Human review flagged',
    note: 'This is our highest priority trigger. No exceptions.',
    color: '#FF3B30',
    icon: ShieldAlert,
  },
  {
    id: 'underage',
    title: 'Underage Protection',
    summary: 'Age verification fail / school mentions',
    description:
      "If the system detects indicators the user may be under 18 (age verification failure, mentions of school, parents in context suggesting youth).",
    response: "Switches to 'Friendly Big Brother' mode → No roasts or banter → Helpful, age-appropriate responses",
    color: '#8B5CF6',
    icon: UserX,
  },
  {
    id: 'hatespeech',
    title: 'Hate Speech Detection',
    summary: 'Slur detection + intent analysis',
    description: 'Slur detection combined with intent context analysis.',
    response: 'Warning → 10-minute cooldown → Account review',
    note: 'Zero tolerance for hate speech. This includes directed slurs and dehumanising language.',
    color: '#FF3B30',
    icon: Ban,
  },
  {
    id: 'optout',
    title: 'User Opt-Out',
    summary: "'Stop', 'Too far', 'Not funny', 'Please stop'",
    description: 'You can opt out at any time. Always.',
    response: "'Got it. Dialing back.' → Switches to helpful mode → Apologises → Respects boundary",
    note: "Your boundaries are respected immediately. No questions asked.",
    color: '#39FF14',
    icon: Hand,
  },
];

/* ──────────────────────────── crisis data ────────────────────────────────── */

const crisisLines = [
  {
    name: 'Lifeline Australia',
    number: '13 11 14',
    note: '24/7 crisis support & suicide prevention',
    color: '#FF3B30',
  },
  {
    name: 'Beyond Blue',
    number: '1300 22 4636',
    note: 'Anxiety, depression & mental health support',
    color: '#3B82F6',
  },
  {
    name: 'Emergency Services',
    number: '000',
    note: 'Immediate danger — life-threatening emergency',
    color: '#EF4444',
  },
];

/* ──────────────────────────── privacy toggles ────────────────────────────── */

interface PrivacyToggle {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
  icon: React.ElementType;
}

const privacyToggles: PrivacyToggle[] = [
  {
    id: 'history',
    label: 'Save chat history',
    description: 'We store up to 50 conversation summaries for context.',
    defaultOn: true,
    icon: MessageSquare,
  },
  {
    id: 'analytics',
    label: 'Help improve The Bloke',
    description: 'Share anonymised interaction data to make roasts better.',
    defaultOn: true,
    icon: Activity,
  },
  {
    id: 'slang',
    label: 'Use my slang/culture',
    description: 'Personalise responses with your cultural slang and references.',
    defaultOn: true,
    icon: Globe,
  },
  {
    id: 'sports',
    label: 'Link sports teams',
    description: 'Allow score tracking and sports-related roasts.',
    defaultOn: true,
    icon: Activity,
  },
  {
    id: 'online',
    label: 'Show online status',
    description: 'Let other users see when you are active.',
    defaultOn: false,
    icon: Eye,
  },
];

/* ──────────────────────────── Guardrail Accordion ────────────────────────── */

function GuardrailAccordion({ item, index }: { item: Guardrail; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      custom={index}
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mb-3"
    >
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: '#12121A', borderLeft: `3px solid ${item.color}` }}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 shrink-0" style={{ color: item.color }} strokeWidth={2} />
            <div>
              <h3 className="font-body font-semibold text-[15px] text-[#F5F5F7]">{item.title}</h3>
              <p className="text-[12px] text-[#4A4A5A] mt-0.5">{item.summary}</p>
            </div>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-5 h-5 text-[#4A4A5A]" />
          </motion.div>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-0 space-y-3">
                <p className="text-[14px] text-[#8A8A9A] leading-relaxed">{item.description}</p>
                <div
                  className="rounded-lg p-3 text-[13px] leading-relaxed"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                >
                  <span className="text-[#4A4A5A] font-medium">Response: </span>
                  <span className="text-[#F5F5F7]">{item.response}</span>
                </div>
                {item.note && (
                  <p className="text-[12px] italic" style={{ color: item.color }}>
                    {item.note}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────── Crisis Card ────────────────────────────────── */

function CrisisCard({
  line,
  index,
}: {
  line: (typeof crisisLines)[number];
  index: number;
}) {
  const [showCallMsg, setShowCallMsg] = useState(false);

  return (
    <motion.div
      custom={index}
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative"
    >
      <div
        className="rounded-xl p-5"
        style={{
          backgroundColor: '#0A0A0F',
          borderLeft: `3px solid ${line.color}`,
        }}
      >
        <div className="flex items-start gap-3">
          <Phone className="w-6 h-6 shrink-0 mt-0.5" style={{ color: line.color }} strokeWidth={2} />
          <div className="flex-1">
            <h3 className="font-body font-semibold text-[16px] text-[#F5F5F7]">{line.name}</h3>
            <motion.p
              className="font-display font-bold text-[24px] mt-1"
              style={{ color: line.color }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              {line.number}
            </motion.p>
            <p className="text-[12px] text-[#8A8A9A] mt-1">{line.note}</p>
            <button
              onClick={() => setShowCallMsg(true)}
              className="mt-3 px-5 py-2 rounded-full text-[13px] font-semibold text-[#0A0A0F]"
              style={{ backgroundColor: line.color }}
            >
              CALL NOW
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showCallMsg} onOpenChange={setShowCallMsg}>
        <DialogContent
          showCloseButton={false}
          className="bg-[#1A1A26] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] max-w-sm"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-[#F5F5F7]">{line.name}</DialogTitle>
            <DialogDescription className="text-center text-[#8A8A9A]">
              In a real app, this would initiate a call to {line.number}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-center gap-3">
            <button
              onClick={() => setShowCallMsg(false)}
              className="px-6 py-2.5 rounded-full bg-[#39FF14] text-[#0A0A0F] font-semibold text-sm"
            >
              Got it
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

/* ──────────────────────────── Privacy Toggle Row ─────────────────────────── */

function PrivacyToggleRow({
  toggle,
  index,
}: {
  toggle: PrivacyToggle;
  index: number;
}) {
  const [on, setOn] = useState(toggle.defaultOn);
  const Icon = toggle.icon;

  return (
    <motion.div
      custom={index}
      variants={slideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="flex items-start justify-between py-4 border-b border-[rgba(255,255,255,0.04)] last:border-0"
    >
      <div className="flex items-start gap-3 flex-1 pr-4">
        <Icon className="w-5 h-5 text-[#8A8A9A] shrink-0 mt-0.5" strokeWidth={1.5} />
        <div>
          <p className="text-[15px] text-[#F5F5F7] font-medium">{toggle.label}</p>
          <p className="text-[12px] text-[#8A8A9A] mt-0.5">{toggle.description}</p>
        </div>
      </div>
      <Switch
        checked={on}
        onCheckedChange={setOn}
        className="data-[state=checked]:bg-[#39FF14] data-[state=unchecked]:bg-[#4A4A5A] shrink-0"
      />
    </motion.div>
  );
}

/* ════════════════════════════ MAIN PAGE ════════════════════════════════════ */

export default function Safety() {
  const [roastIntensity, setRoastIntensity] = useState([3]);
  const [stopDialogOpen, setStopDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  const intensityColor =
    roastIntensity[0] <= 2
      ? '#39FF14'
      : roastIntensity[0] <= 3
        ? '#FF9500'
        : '#FF3B30';

  const intensityLabel =
    roastIntensity[0] === 1
      ? 'Gentle'
      : roastIntensity[0] === 2
        ? 'Mild'
        : roastIntensity[0] === 3
          ? 'Moderate'
          : roastIntensity[0] === 4
            ? 'Savage'
            : 'Brutal';

  const handleReset = useCallback(() => {
    setRoastIntensity([3]);
    setResetDialogOpen(false);
  }, []);

  return (
    <Layout showBottomNav={true} bottomNavActiveIndex={4}>
      <div className="min-h-[100dvh] bg-[#0A0A0F]">
        {/* ─────────── Section 1: Header ─────────── */}
        <div
          className="sticky top-14 z-40 flex items-center px-4 h-14 border-b"
          style={{
            backgroundColor: 'rgba(10,10,15,0.8)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(139,92,246,0.3)',
          }}
        >
          <Shield className="w-5 h-5 text-[#F5F5F7] mr-2" strokeWidth={2} />
          <span className="font-display font-bold text-[16px] text-[#F5F5F7] tracking-tight">
            SAFETY &amp; SETTINGS
          </span>
        </div>

        {/* ─────────── Section 2: Safety Hero ─────────── */}
        <div
          className="px-6 pt-8 pb-8 text-center"
          style={{ backgroundColor: '#12121A', borderRadius: '0 0 24px 24px' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
            className="mx-auto w-20 h-20 flex items-center justify-center rounded-full mb-4"
            style={{ backgroundColor: 'rgba(57,255,20,0.1)' }}
          >
            <Shield
              className="w-10 h-10 text-[#39FF14]"
              strokeWidth={1.5}
              style={{ filter: 'drop-shadow(0 0 10px rgba(57,255,20,0.5))' }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-display font-bold text-[22px] text-[#F5F5F7] tracking-tight"
          >
            Safety First, Mate
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-[15px] text-[#8A8A9A] mt-2 max-w-[320px] mx-auto leading-relaxed"
          >
            The Bloke is never genuinely mean. These are the hard boundaries.
          </motion.p>

          <div className="flex items-center justify-center gap-4 mt-5">
            {[
              { icon: Shield, text: '6 Safety Triggers' },
              { icon: Phone, text: 'Crisis Lines' },
              { icon: Hand, text: 'Instant Opt-Out' },
            ].map((badge, i) => (
              <motion.div
                key={badge.text}
                custom={i}
                variants={popIn}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-1.5"
              >
                <badge.icon className="w-4 h-4 text-[#8A8A9A]" strokeWidth={2} />
                <span className="text-[12px] text-[#8A8A9A]">{badge.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─────────── Section 3: Guardrail Accordions ─────────── */}
        <div className="px-4 pt-8 pb-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-[11px] font-semibold text-[#8A8A9A] uppercase tracking-[2px] mb-4 px-1"
          >
            Safety Guardrails
          </motion.h2>

          {guardrails.map((g, i) => (
            <GuardrailAccordion key={g.id} item={g} index={i} />
          ))}
        </div>

        {/* ─────────── Section 4: Crisis Resources ─────────── */}
        <div
          className="mx-4 mt-4 mb-4 p-5 rounded-3xl"
          style={{ backgroundColor: '#12121A' }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-display font-bold text-[22px] text-[#F5F5F7] mb-1"
          >
            Crisis Support Lines
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="text-[14px] text-[#8A8A9A] mb-5"
          >
            If you or someone you know needs help, these services are available 24/7.
          </motion.p>

          <div className="space-y-3">
            {crisisLines.map((line, i) => (
              <CrisisCard key={line.name} line={line} index={i} />
            ))}
          </div>
        </div>

        {/* ─────────── Section 5: Opt-Out Controls ─────────── */}
        <div className="px-4 pt-8 pb-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="font-display font-bold text-[22px] text-[#F5F5F7] mb-5"
          >
            Your Controls
          </motion.h2>

          {/* Instant Stop */}
          <motion.div
            custom={0}
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-xl p-5 mb-3"
            style={{ backgroundColor: '#12121A' }}
          >
            <div className="flex items-start gap-4">
              <StopCircle className="w-8 h-8 text-[#FF3B30] shrink-0" strokeWidth={1.5} />
              <div className="flex-1">
                <h3 className="font-body font-semibold text-[16px] text-[#F5F5F7]">
                  Say &ldquo;STOP&rdquo; Anytime
                </h3>
                <p className="text-[14px] text-[#8A8A9A] mt-1 leading-relaxed">
                  Type &ldquo;stop&rdquo;, &ldquo;too far&rdquo;, or &ldquo;not funny&rdquo; in any chat and The Bloke immediately switches to helpful mode.
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Check className="w-3.5 h-3.5 text-[#30D158]" strokeWidth={2} />
                  <span className="text-[12px] text-[#30D158]">Always Active</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowStopConfirm(true)}
                  className="mt-4 w-full py-3.5 rounded-full font-display font-bold text-[16px] text-[#0A0A0F] bg-[#FF3B30]"
                >
                  STOP EVERYTHING
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Banter Exit */}
          <motion.div
            custom={1}
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-xl p-5 mb-3"
            style={{ backgroundColor: '#12121A' }}
          >
            <div className="flex items-start gap-4">
              <LogOut className="w-8 h-8 text-[#FF006E] shrink-0" strokeWidth={1.5} />
              <div className="flex-1">
                <h3 className="font-body font-semibold text-[16px] text-[#F5F5F7]">Exit Banter Battle</h3>
                <p className="text-[14px] text-[#8A8A9A] mt-1 leading-relaxed">
                  Send &ldquo;stop&rdquo; or &ldquo;I surrender&rdquo; during any banter battle to end it immediately.
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Check className="w-3.5 h-3.5 text-[#30D158]" strokeWidth={2} />
                  <span className="text-[12px] text-[#30D158]">Always Active</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Roast Intensity Slider */}
          <motion.div
            custom={2}
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-xl p-5 mb-3"
            style={{ backgroundColor: '#12121A' }}
          >
            <div className="flex items-start gap-4">
              <SlidersHorizontal className="w-8 h-8 text-[#FF9500] shrink-0" strokeWidth={1.5} />
              <div className="flex-1">
                <h3 className="font-body font-semibold text-[16px] text-[#F5F5F7]">Roast Intensity Limit</h3>
                <p className="text-[14px] text-[#8A8A9A] mt-1 leading-relaxed">
                  How savage should the roasts be? Set a maximum savagery level.
                </p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-[#39FF14] font-medium">Gentle</span>
                    <span
                      className="text-[14px] font-display font-bold"
                      style={{ color: intensityColor }}
                    >
                      {intensityLabel}
                    </span>
                    <span className="text-[11px] text-[#FF3B30] font-medium">Brutal</span>
                  </div>
                  <Slider
                    value={roastIntensity}
                    onValueChange={setRoastIntensity}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className="text-[10px] font-medium"
                        style={{ color: roastIntensity[0] === n ? intensityColor : '#4A4A5A' }}
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Reset to Defaults */}
          <motion.div
            custom={3}
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-xl p-5"
            style={{ backgroundColor: '#12121A' }}
          >
            <div className="flex items-start gap-4">
              <RotateCcw className="w-8 h-8 text-[#00F0FF] shrink-0" strokeWidth={1.5} />
              <div className="flex-1">
                <h3 className="font-body font-semibold text-[16px] text-[#F5F5F7]">Reset to Defaults</h3>
                <p className="text-[14px] text-[#8A8A9A] mt-1 leading-relaxed">
                  Switch back to the standard &ldquo;Older Bro&rdquo; personality and reset all preferences.
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setResetDialogOpen(true)}
                  className="mt-4 px-6 py-2.5 rounded-full border-[1.5px] border-[rgba(255,255,255,0.2)] text-[13px] font-semibold text-[#F5F5F7] hover:border-[#39FF14] transition-colors"
                >
                  RESET NOW
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─────────── Section 6: Privacy Settings ─────────── */}
        <div
          className="mx-0 mt-6 p-5 rounded-t-3xl"
          style={{ backgroundColor: '#12121A' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex items-center gap-2 mb-4"
          >
            <Lock className="w-5 h-5 text-[#8A8A9A]" strokeWidth={2} />
            <h2 className="font-display font-bold text-[22px] text-[#F5F5F7]">Privacy</h2>
          </motion.div>

          {privacyToggles.map((toggle, i) => (
            <PrivacyToggleRow key={toggle.id} toggle={toggle} index={i} />
          ))}

          <div className="mt-4 text-center">
            <p className="font-mono text-[11px] text-[#4A4A5A]">
              Privacy Level: Public=12 | Shared=7 | Internal=3 | Restricted=1
            </p>
            <p className="text-[11px] text-[#4A4A5A] mt-1">
              Your data is classified and protected per Australian privacy standards.
            </p>
          </div>
        </div>

        {/* ─────────── Section 7: About ─────────── */}
        <div className="px-6 py-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <h3
              className="font-display font-bold text-[24px] tracking-tight"
              style={{
                color: '#39FF14',
                textShadow: '0 0 10px rgba(57,255,20,0.5)',
              }}
            >
              THE BLOKE AI
            </h3>
            <p className="font-mono text-[12px] text-[#4A4A5A] mt-1">v1.0 &middot; Last updated: 2026-05-27</p>
            <p className="text-[14px] text-[#8A8A9A] mt-3 max-w-[320px] mx-auto leading-relaxed">
              Your new mate who roasts you. Built with safety guardrails, personality modes, and support for 40+ cultures.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex items-center justify-center gap-6 mt-5"
          >
            <a href="#" className="text-[13px] text-[#00F0FF] underline" onClick={(e) => e.preventDefault()}>
              Terms of Service
            </a>
            <a href="#" className="text-[13px] text-[#00F0FF] underline" onClick={(e) => e.preventDefault()}>
              Privacy Policy
            </a>
            <a href="#" className="text-[13px] text-[#00F0FF] underline" onClick={(e) => e.preventDefault()}>
              Contact
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[12px] text-[#4A4A5A] mt-6"
          >
            &copy; 2025 The Bloke AI. Made with sarcasm and love.
          </motion.p>
        </div>

        {/* ─────────── Stop Confirmation Dialog ─────────── */}
        <Dialog open={showStopConfirm} onOpenChange={setShowStopConfirm}>
          <DialogContent
            showCloseButton={false}
            className="bg-[#1A1A26] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] max-w-sm"
          >
            <DialogHeader>
              <DialogTitle className="text-center flex items-center justify-center gap-2 text-[#FF3B30]">
                <StopCircle className="w-5 h-5" />
                Stop Everything?
              </DialogTitle>
              <DialogDescription className="text-center text-[#8A8A9A]">
                The Bloke will switch to helpful mode immediately. All banter stops.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row justify-center gap-3">
              <button
                onClick={() => setShowStopConfirm(false)}
                className="px-6 py-2.5 rounded-full border border-[rgba(255,255,255,0.2)] text-[#F5F5F7] font-semibold text-sm hover:border-[#39FF14] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowStopConfirm(false);
                  setStopDialogOpen(true);
                }}
                className="px-6 py-2.5 rounded-full bg-[#FF3B30] text-[#0A0A0F] font-semibold text-sm"
              >
                Yes, Stop
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─────────── Stop Success Toast ─────────── */}
        <Dialog open={stopDialogOpen} onOpenChange={setStopDialogOpen}>
          <DialogContent
            showCloseButton={false}
            className="bg-[#1A1A26] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] max-w-sm"
          >
            <DialogHeader>
              <DialogTitle className="text-center text-[#30D158] flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Switched to Helpful Mode
              </DialogTitle>
              <DialogDescription className="text-center text-[#8A8A9A]">
                The Bloke is now in supportive mode. All banter has been stopped.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row justify-center">
              <button
                onClick={() => setStopDialogOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#39FF14] text-[#0A0A0F] font-semibold text-sm"
              >
                Got it
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─────────── Reset Confirmation Dialog ─────────── */}
        <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <DialogContent
            showCloseButton={false}
            className="bg-[#1A1A26] border-[rgba(255,255,255,0.06)] text-[#F5F5F7] max-w-sm"
          >
            <DialogHeader>
              <DialogTitle className="text-center">Reset All Preferences?</DialogTitle>
              <DialogDescription className="text-center text-[#8A8A9A]">
                This will reset roast intensity, personality mode, and all settings to their defaults.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row justify-center gap-3">
              <button
                onClick={() => setResetDialogOpen(false)}
                className="px-6 py-2.5 rounded-full border border-[rgba(255,255,255,0.2)] text-[#F5F5F7] font-semibold text-sm hover:border-[#39FF14] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-[#00F0FF] text-[#0A0A0F] font-semibold text-sm"
              >
                Reset
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
