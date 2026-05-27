// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  ListFilter,
  Check,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import ChatBubble from '@/components/ChatBubble';
import ModeBadge from '@/components/ModeBadge';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface Culture {
  name: string;
  slang: string;
  region: string;
  flag: string;
}

interface Team {
  name: string;
  league: string;
  location: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const CULTURES: Culture[] = [
  { name: 'Samoan', slang: 'Uce', region: 'Pacific Islander', flag: '🇼🇸' },
  { name: 'Lebanese', slang: 'Cuz', region: 'Middle Eastern', flag: '🇱🇧' },
  { name: 'Australian', slang: 'Mate', region: 'Oceanian', flag: '🇦🇺' },
  { name: 'Indian', slang: 'Bhai', region: 'South Asian', flag: '🇮🇳' },
  { name: 'Filipino', slang: 'Pare', region: 'Southeast Asian', flag: '🇵🇭' },
  { name: 'Singaporean', slang: 'Lah', region: 'Southeast Asian', flag: '🇸🇬' },
  { name: 'Cantonese', slang: 'Dai lo', region: 'East Asian', flag: '🇭🇰' },
  { name: 'Korean', slang: 'Hyung', region: 'East Asian', flag: '🇰🇷' },
  { name: 'Tongan', slang: 'Toko', region: 'Pacific Islander', flag: '🇹🇴' },
  { name: 'Fijian', slang: 'Taukave', region: 'Pacific Islander', flag: '🇫🇯' },
  { name: 'Maori', slang: 'Cuz', region: 'Pacific Islander', flag: '🇳🇿' },
  { name: 'Papua New Guinean', slang: 'Wantok', region: 'Pacific Islander', flag: '🇵🇬' },
  { name: 'Chinese', slang: 'Ge', region: 'East Asian', flag: '🇨🇳' },
  { name: 'Vietnamese', slang: 'Anh', region: 'Southeast Asian', flag: '🇻🇳' },
  { name: 'Thai', slang: 'Pee', region: 'Southeast Asian', flag: '🇹🇭' },
  { name: 'Japanese', slang: 'Senpai', region: 'East Asian', flag: '🇯🇵' },
  { name: 'Indonesian', slang: 'Bro', region: 'Southeast Asian', flag: '🇮🇩' },
  { name: 'Malaysian', slang: 'Boss', region: 'Southeast Asian', flag: '🇲🇾' },
  { name: 'Sri Lankan', slang: 'Machan', region: 'South Asian', flag: '🇱🇰' },
  { name: 'Pakistani', slang: 'Bhai', region: 'South Asian', flag: '🇵🇰' },
  { name: 'Nepali', slang: 'Dai', region: 'South Asian', flag: '🇳🇵' },
  { name: 'Bangladeshi', slang: 'Bhaiya', region: 'South Asian', flag: '🇧🇩' },
  { name: 'South African', slang: 'Bru', region: 'African', flag: '🇿🇦' },
  { name: 'Nigerian', slang: 'Oga', region: 'African', flag: '🇳🇬' },
  { name: 'Kenyan', slang: 'Buda', region: 'African', flag: '🇰🇪' },
  { name: 'Ghanaian', slang: 'Chale', region: 'African', flag: '🇬🇭' },
  { name: 'British', slang: 'Mate', region: 'European', flag: '🇬🇧' },
  { name: 'Irish', slang: 'Lad', region: 'European', flag: '🇮🇪' },
  { name: 'Scottish', slang: 'Pal', region: 'European', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { name: 'Italian', slang: 'Fratello', region: 'European', flag: '🇮🇹' },
  { name: 'Greek', slang: 'File', region: 'European', flag: '🇬🇷' },
  { name: 'French', slang: 'Pote', region: 'European', flag: '🇫🇷' },
  { name: 'Spanish', slang: 'Tio', region: 'European', flag: '🇪🇸' },
  { name: 'German', slang: 'Kumpel', region: 'European', flag: '🇩🇪' },
  { name: 'Dutch', slang: 'Gozer', region: 'European', flag: '🇳🇱' },
  { name: 'Portuguese', slang: 'Mano', region: 'European', flag: '🇵🇹' },
  { name: 'Turkish', slang: 'Kanka', region: 'Middle Eastern', flag: '🇹🇷' },
  { name: 'Arab', slang: 'Habibi', region: 'Middle Eastern', flag: '🇸🇦' },
  { name: 'Persian', slang: 'Dada', region: 'Middle Eastern', flag: '🇮🇷' },
  { name: 'American', slang: 'Bro', region: 'North American', flag: '🇺🇸' },
  { name: 'Canadian', slang: 'Buddy', region: 'North American', flag: '🇨🇦' },
  { name: 'Mexican', slang: 'Carnal', region: 'North American', flag: '🇲🇽' },
];

const LEAGUES = ['NRL', 'AFL', 'A-League', 'Premier League', 'NBA', 'NFL', 'IPL'];

const TEAMS: Record<string, Team[]> = {
  NRL: [
    { name: 'Eels', league: 'NRL', location: 'Parramatta', color: '#0055A4' },
    { name: 'Bulldogs', league: 'NRL', location: 'Canterbury', color: '#0000FF' },
    { name: 'Panthers', league: 'NRL', location: 'Penrith', color: '#FF6600' },
    { name: 'Rabbitohs', league: 'NRL', location: 'South Sydney', color: '#006633' },
    { name: 'Roosters', league: 'NRL', location: 'Sydney', color: '#CC0000' },
    { name: 'Broncos', league: 'NRL', location: 'Brisbane', color: '#660033' },
    { name: 'Cowboys', league: 'NRL', location: 'North Queensland', color: '#FFCC00' },
    { name: 'Storm', league: 'NRL', location: 'Melbourne', color: '#330066' },
  ],
  AFL: [
    { name: 'Swans', league: 'AFL', location: 'Sydney', color: '#CC0000' },
    { name: 'Giants', league: 'AFL', location: 'GWS', color: '#FF6600' },
    { name: 'Magpies', league: 'AFL', location: 'Collingwood', color: '#000000' },
    { name: 'Tigers', league: 'AFL', location: 'Richmond', color: '#FFCC00' },
    { name: 'Bombers', league: 'AFL', location: 'Essendon', color: '#CC0000' },
    { name: 'Blues', league: 'AFL', location: 'Carlton', color: '#0000CC' },
  ],
  'Premier League': [
    { name: 'Man Utd', league: 'Premier League', location: 'Manchester', color: '#CC0000' },
    { name: 'Liverpool', league: 'Premier League', location: 'Liverpool', color: '#CC0000' },
    { name: 'Arsenal', league: 'Premier League', location: 'London', color: '#CC0000' },
    { name: 'Chelsea', league: 'Premier League', location: 'London', color: '#0000CC' },
    { name: 'Man City', league: 'Premier League', location: 'Manchester', color: '#66CCFF' },
    { name: 'Tottenham', league: 'Premier League', location: 'London', color: '#000066' },
  ],
  NBA: [
    { name: 'Lakers', league: 'NBA', location: 'Los Angeles', color: '#552583' },
    { name: 'Warriors', league: 'NBA', location: 'Golden State', color: '#1D428A' },
    { name: 'Celtics', league: 'NBA', location: 'Boston', color: '#007A33' },
    { name: 'Bulls', league: 'NBA', location: 'Chicago', color: '#CE1141' },
    { name: 'Nets', league: 'NBA', location: 'Brooklyn', color: '#000000' },
    { name: 'Heat', league: 'NBA', location: 'Miami', color: '#98002E' },
  ],
  NFL: [
    { name: 'Patriots', league: 'NFL', location: 'New England', color: '#002244' },
    { name: 'Cowboys', league: 'NFL', location: 'Dallas', color: '#041E42' },
    { name: 'Chiefs', league: 'NFL', location: 'Kansas City', color: '#E31837' },
    { name: 'Eagles', league: 'NFL', location: 'Philadelphia', color: '#004C54' },
    { name: '49ers', league: 'NFL', location: 'San Francisco', color: '#AA0000' },
    { name: 'Packers', league: 'NFL', location: 'Green Bay', color: '#203731' },
  ],
  IPL: [
    { name: 'Mumbai Indians', league: 'IPL', location: 'Mumbai', color: '#004BA0' },
    { name: 'Chennai Super Kings', league: 'IPL', location: 'Chennai', color: '#FFFF00' },
    { name: 'RCB', league: 'IPL', location: 'Bangalore', color: '#EC1C24' },
    { name: 'KKR', league: 'IPL', location: 'Kolkata', color: '#3A225D' },
    { name: 'Delhi Capitals', league: 'IPL', location: 'Delhi', color: '#0078BC' },
    { name: 'Rajasthan Royals', league: 'IPL', location: 'Jaipur', color: '#254AA5' },
  ],
  'A-League': [
    { name: 'Sydney FC', league: 'A-League', location: 'Sydney', color: '#6699CC' },
    { name: 'Melbourne City', league: 'A-League', location: 'Melbourne', color: '#66CCFF' },
    { name: 'WSW', league: 'A-League', location: 'Western Sydney', color: '#CC0000' },
    { name: 'Brisbane Roar', league: 'A-League', location: 'Brisbane', color: '#FF6600' },
  ],
};

const DETECTION_STEPS = [
  'Checking slang patterns...',
  'Reading name hints...',
  'Smelling the barbie...',
  'Asking around...',
];

/* ------------------------------------------------------------------ */
/*  EASINGS                                                            */
/* ------------------------------------------------------------------ */

const easePrimary = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeBounce = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [selectedCulture, setSelectedCulture] = useState<Culture | null>(null);
  const [selectedLeague, setSelectedLeague] = useState('NRL');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectStep, setDetectStep] = useState(0);
  const [detectionComplete, setDetectionComplete] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 5));
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleAutoDetect = useCallback(() => {
    setIsDetecting(true);
    setDetectStep(0);
    setDetectionComplete(false);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      setDetectStep(currentStep);
      if (currentStep >= DETECTION_STEPS.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsDetecting(false);
          setDetectionComplete(true);
          // Simulated detected culture
          setSelectedCulture({ name: 'Lebanese', slang: 'Cuz', region: 'Middle Eastern', flag: '🇱🇧' });
        }, 400);
      }
    }, 500);
  }, []);

  const handleCultureSelect = useCallback((culture: Culture) => {
    setSelectedCulture(culture);
    setShowSheet(false);
  }, []);

  const handleTeamSelect = useCallback((team: Team) => {
    setSelectedTeam(team);
  }, []);

  const handleConfirmTeam = useCallback(() => {
    if (selectedTeam) goNext();
  }, [selectedTeam, goNext]);

  const filteredCultures = CULTURES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedCultures = filteredCultures.reduce<Record<string, Culture[]>>((acc, c) => {
    if (!acc[c.region]) acc[c.region] = [];
    acc[c.region].push(c);
    return acc;
  }, {});

  /* Show progress bar except on step 1 and 5 */
  const showProgress = step >= 2 && step <= 4;
  const progressPercent = ((step - 1) / 4) * 100;

  return (
    <div className="min-h-[100dvh] bg-bg-primary relative overflow-hidden">
      {/* Progress bar */}
      <AnimatePresence>
        {showProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 h-1 bg-[rgba(255,255,255,0.06)]"
          >
            <motion.div
              className="h-full"
              style={{ background: 'linear-gradient(90deg, #39FF14 0%, #00F0FF 100%)' }}
              initial={{ width: `${((step - 2) / 4) * 100}%` }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: easePrimary }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step counter */}
      {showProgress && (
        <div className="fixed top-3 right-4 z-50">
          <span className="text-xs text-text-secondary font-medium">
            Step {step - 1} of 4
          </span>
        </div>
      )}

      {/* Skip button on steps 2-3 */}
      {(step === 2 || step === 3) && (
        <button
          onClick={goNext}
          className="fixed top-3 left-4 z-50 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          Skip
        </button>
      )}

      {/* Animated step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          // @ts-expect-error framer-motion dynamic variant
          initial={(d: number) => ({ x: d * 100 + '%', opacity: 0 })}
          animate={{ x: 0, opacity: 1 }}
          // @ts-expect-error framer-motion dynamic variant
          exit={(d: number) => ({ x: d * -100 + '%', opacity: 0 })}
          transition={{ duration: 0.4, ease: easePrimary }}
          className="min-h-[100dvh] flex flex-col"
        >
          {step === 1 && <StepWelcome onNext={goNext} />}
          {step === 2 && (
            <StepNationality
              selectedCulture={selectedCulture}
              isDetecting={isDetecting}
              detectStep={detectStep}
              detectionComplete={detectionComplete}
              onAutoDetect={handleAutoDetect}
              onOpenSheet={() => setShowSheet(true)}
              onConfirm={() => selectedCulture && goNext()}
              onSkip={goNext}
            />
          )}
          {step === 3 && (
            <StepSports
              selectedLeague={selectedLeague}
              selectedTeam={selectedTeam}
              onLeagueChange={setSelectedLeague}
              onTeamSelect={handleTeamSelect}
              onConfirm={handleConfirmTeam}
              onSkip={goNext}
            />
          )}
          {step === 4 && (
            <StepConfirmation
              culture={selectedCulture}
              team={selectedTeam}
              onConfirm={goNext}
              onEdit={goBack}
            />
          )}
          {step === 5 && (
            <StepChatEntry
              culture={selectedCulture}
              team={selectedTeam}
              onStart={() => navigate('/chat')}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Culture Selection Bottom Sheet */}
      <AnimatePresence>
        {showSheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col justify-end"
            onClick={() => setShowSheet(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: easePrimary }}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-t-3xl max-h-[80vh] flex flex-col"
              style={{ backgroundColor: '#1A1A26' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-10 h-1 rounded-full bg-text-muted" />
              </div>

              <h3 className="font-display font-bold text-lg text-text-primary mb-3 text-center px-6">
                Pick Your Culture
              </h3>

              {/* Search */}
              <div className="px-4 pb-3">
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full"
                  style={{ backgroundColor: '#0A0A0F' }}
                >
                  <Search className="w-4 h-4 text-text-muted shrink-0" strokeWidth={2} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search cultures..."
                    className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                  />
                </div>
              </div>

              {/* Culture list */}
              <div className="flex-1 overflow-y-auto px-4 pb-6">
                {Object.entries(groupedCultures).map(([region, cultures]) => (
                  <div key={region} className="mb-4">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 sticky top-0 py-1" style={{ backgroundColor: '#1A1A26' }}>
                      {region}
                    </p>
                    <div className="space-y-1">
                      {cultures.map((culture) => {
                        const isSelected = selectedCulture?.name === culture.name;
                        return (
                          <motion.button
                            key={culture.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCultureSelect(culture)}
                            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-left transition-colors ${
                              isSelected
                                ? 'border-l-[3px] border-l-accent-neon'
                                : 'border-l-[3px] border-l-transparent'
                            }`}
                            style={{
                              backgroundColor: isSelected ? '#12121A' : 'transparent',
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{culture.flag}</span>
                              <div>
                                <p className="text-sm text-text-primary font-medium">
                                  {culture.name}
                                </p>
                                <p className="text-xs text-text-muted">
                                  Calls you: <span className="text-accent-neon font-slang uppercase">{culture.slang}</span>
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-accent-neon" strokeWidth={2} />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  STEP 1: WELCOME                                                    */
/* ================================================================== */

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-6 min-h-[100dvh] relative"
      style={{
        background: 'linear-gradient(135deg, #0A0A0F 0%, #1A0A2E 50%, #0A1A0F 100%)',
      }}
    >
      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easePrimary }}
        className="font-display font-extrabold text-5xl text-accent-neon text-center tracking-tight"
        style={{ textShadow: '0 0 10px rgba(57,255,20,0.5)' }}
      >
        OI, MATE!
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-4 text-lg text-text-secondary text-center max-w-[300px]"
      >
        Welcome to The Bloke AI — your new sarcastic mate.
      </motion.p>

      {/* Character peek (animated div placeholder) */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: easeBounce }}
        className="absolute bottom-32 right-0 w-[200px] h-[200px] rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(57,255,20,0.15) 0%, transparent 70%)',
        }}
      >
        <span className="font-slang text-6xl text-accent-neon opacity-60">B</span>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.3, ease: easeBounce }}
        className="flex flex-col items-center gap-3 mt-12 w-full max-w-[280px]"
      >
        <PrimaryButton onClick={onNext} size="large" className="w-full">
          LET&apos;S GO
        </PrimaryButton>
        <SecondaryButton href="#/chat" className="w-full">
          Already been here? Log in
        </SecondaryButton>
      </motion.div>
    </div>
  );
}

/* ================================================================== */
/*  STEP 2: NATIONALITY DETECTION                                      */
/* ================================================================== */

function StepNationality({
  selectedCulture,
  isDetecting,
  detectStep,
  detectionComplete,
  onAutoDetect,
  onOpenSheet,
  onConfirm,
}: {
  selectedCulture: Culture | null;
  isDetecting: boolean;
  detectStep: number;
  detectionComplete: boolean;
  onAutoDetect: () => void;
  onOpenSheet: () => void;
  onConfirm: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col px-6 pt-20 pb-8 min-h-[100dvh]">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easePrimary }}
        className="font-display font-bold text-4xl text-text-primary tracking-tight"
      >
        WHERE YOU FROM, MATE?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: easePrimary }}
        className="mt-3 text-base text-text-secondary leading-relaxed"
      >
        This helps us talk like your actual mates do. We can try to detect it, or you can tell us.
      </motion.p>

      {/* Detection loading state */}
      <AnimatePresence>
        {isDetecting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-10 h-10 rounded-full border-2 border-transparent border-t-accent-cyan"
            />
            <p className="font-mono text-sm text-text-secondary">Analysing your vibe...</p>
            <p className="font-mono text-xs text-text-muted">
              {DETECTION_STEPS[Math.min(detectStep, DETECTION_STEPS.length - 1)]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detection result */}
      <AnimatePresence>
        {detectionComplete && selectedCulture && !isDetecting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: easeBounce }}
            className="mt-8 rounded-xl p-6 text-center"
            style={{ backgroundColor: '#1A1A26' }}
          >
            <p className="text-sm text-text-secondary mb-2">Looks like you&apos;re</p>
            <h3 className="font-display font-bold text-3xl text-accent-neon mb-2">
              {selectedCulture.flag} {selectedCulture.name}
            </h3>
            <p className="text-base text-text-secondary">
              We&apos;ll call you:{' '}
              <span className="font-slang text-accent-neon uppercase text-lg">{selectedCulture.slang}</span>
            </p>

            {/* Sample chat bubble */}
            <div className="mt-4 flex justify-start">
              <div className="max-w-[85%] px-4 py-3 bg-bloke-bubble border border-[rgba(57,255,20,0.15)] rounded-[4px_16px_16px_16px] shadow-neon-green">
                <p className="text-sm text-text-primary">
                  Oi {selectedCulture.slang}! Welcome to The Bloke.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 justify-center">
              <PrimaryButton onClick={onConfirm}>CONFIRM</PrimaryButton>
              <SecondaryButton onClick={onOpenSheet}>CHANGE</SecondaryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initial options (hidden when detecting or showing result) */}
      {!isDetecting && !detectionComplete && (
        <div className="mt-8 flex flex-col gap-4">
          {/* Auto-detect card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: easePrimary }}
            whileTap={{ scale: 0.98 }}
            onClick={onAutoDetect}
            className="w-full rounded-xl p-6 text-left transition-colors"
            style={{
              backgroundColor: '#12121A',
              border: '2px solid rgba(0,240,255,0.2)',
            }}
          >
            <div className="flex items-start gap-4">
              <Globe className="w-10 h-10 text-accent-cyan shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="font-display font-bold text-xl text-text-primary">Auto-Detect</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  We&apos;ll figure it out from your language style
                </p>
              </div>
            </div>
          </motion.button>

          {/* Manual select card */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: easePrimary }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenSheet}
            className="w-full rounded-xl p-6 text-left transition-colors"
            style={{
              backgroundColor: '#12121A',
              border: '2px solid rgba(57,255,20,0.2)',
            }}
          >
            <div className="flex items-start gap-4">
              <ListFilter className="w-10 h-10 text-accent-neon shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="font-display font-bold text-xl text-text-primary">Pick Myself</h3>
                <p className="mt-1 text-sm text-text-secondary">I know where I&apos;m from</p>
              </div>
            </div>
          </motion.button>

          {/* Culture pills quick-grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4"
          >
            <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Popular picks</p>
            <div className="flex flex-wrap gap-2">
              {CULTURES.slice(0, 18).map((c, i) => (
                <motion.button
                  key={c.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.02, duration: 0.2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    /* selected via sheet for consistency */
                    onOpenSheet();
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border border-[rgba(255,255,255,0.08)] hover:border-accent-neon/30 transition-colors"
                  style={{ backgroundColor: '#12121A', color: '#8A8A9A' }}
                >
                  {c.flag} {c.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  STEP 3: SPORTS TEAM                                                */
/* ================================================================== */

function StepSports({
  selectedLeague,
  selectedTeam,
  onLeagueChange,
  onTeamSelect,
  onConfirm,
}: {
  selectedLeague: string;
  selectedTeam: Team | null;
  onLeagueChange: (l: string) => void;
  onTeamSelect: (t: Team) => void;
  onConfirm: () => void;
}) {
  const teams = TEAMS[selectedLeague] || [];

  return (
    <div className="flex-1 flex flex-col px-6 pt-20 pb-8 min-h-[100dvh]">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easePrimary }}
        className="font-display font-bold text-4xl text-text-primary tracking-tight"
      >
        WHO DO YOU BARRACK FOR?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: easePrimary }}
        className="mt-3 text-base text-text-secondary leading-relaxed"
      >
        We&apos;ll roast them when they lose. Fair warning.
      </motion.p>

      {/* League selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-6 -mx-2"
      >
        <div className="flex gap-2 overflow-x-auto px-2 pb-2 scrollbar-hide snap-x">
          {LEAGUES.map((league, i) => {
            const isActive = league === selectedLeague;
            return (
              <motion.button
                key={league}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: easeBounce }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLeagueChange(league)}
                className={`shrink-0 snap-start px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  isActive
                    ? 'border-[rgba(255,149,0,0.4)] text-[#FF9500]'
                    : 'border-transparent text-text-muted'
                }`}
                style={{
                  backgroundColor: isActive ? 'rgba(255,149,0,0.15)' : '#12121A',
                }}
              >
                {league}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Team grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-4 grid grid-cols-2 gap-3 flex-1"
      >
        <AnimatePresence mode="wait">
          {teams.map((team, i) => {
            const isSelected = selectedTeam?.name === team.name;
            return (
              <motion.button
                key={`${selectedLeague}-${team.name}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: easePrimary }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onTeamSelect(team)}
                className={`relative rounded-xl p-4 text-left border transition-all ${
                  isSelected
                    ? 'border-[rgba(255,149,0,0.5)]'
                    : 'border-[rgba(255,255,255,0.06)]'
                }`}
                style={{
                  backgroundColor: '#12121A',
                  boxShadow: isSelected ? '0 0 20px rgba(255,149,0,0.15)' : 'none',
                }}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent-neon flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#0A0A0F]" strokeWidth={3} />
                  </div>
                )}
                <div
                  className="w-10 h-10 rounded-full mb-2 flex items-center justify-center"
                  style={{ backgroundColor: team.color }}
                >
                  <span className="text-white font-display font-bold text-xs">
                    {team.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-text-primary font-medium">{team.name}</p>
                <p className="text-xs text-text-muted">{team.location}</p>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Bottom actions */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {selectedTeam && (
          <PrimaryButton onClick={onConfirm} className="w-full max-w-[280px]">
            CONFIRM — {selectedTeam.name}
          </PrimaryButton>
        )}
        <button
          onClick={onSkip}
          className="text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          I don&apos;t follow sports ›
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  STEP 4: CONFIRMATION                                               */
/* ================================================================== */

function StepConfirmation({
  culture,
  team,
  onConfirm,
  onEdit,
}: {
  culture: Culture | null;
  team: Team | null;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  const slang = culture?.slang || 'Mate';
  const cultureName = culture?.name || 'Australian';
  const teamName = team?.name || 'No team';
  const leagueName = team?.league || '';

  return (
    <div className="flex-1 flex flex-col px-6 pt-20 pb-8 min-h-[100dvh]">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easePrimary }}
        className="font-display font-bold text-4xl text-text-primary tracking-tight text-center"
      >
        LOOKS GOOD?
      </motion.h2>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4, ease: easePrimary }}
        className="mt-8 mx-auto w-full max-w-[340px] rounded-2xl p-8 border border-[rgba(255,255,255,0.08)]"
        style={{
          backgroundColor: '#1A1A26',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(90deg, #39FF14 0%, #00F0FF 100%)',
              padding: 3,
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#0A0A0F' }}
            >
              <span className="font-display font-bold text-2xl text-text-primary">
                {slang.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Nationality row */}
        <div className="mb-4">
          <p className="text-xs text-text-secondary uppercase tracking-wider">Culture</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-base text-text-primary font-medium">
              {culture?.flag} {cultureName}
            </p>
            <ModeBadge mode="default" label={`Calls you: ${slang}`} />
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-[rgba(255,255,255,0.06)] my-4" />

        {/* Sports row */}
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wider">Team</p>
          <div className="flex items-center gap-2 mt-1">
            {team && (
              <div
                className="w-6 h-6 rounded-full shrink-0"
                style={{ backgroundColor: team.color }}
              />
            )}
            <p className="text-base text-text-primary font-medium">
              {teamName} {leagueName && <span className="text-text-muted">· {leagueName}</span>}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sample chat preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 mx-auto w-full max-w-[320px]"
      >
        <p className="text-xs text-text-secondary text-center mb-3">
          This is how The Bloke will talk to you:
        </p>
        <div className="scale-[0.9] origin-top">
          <ChatBubble type="ai">
            <span>
              G&apos;day {slang}! Ready to get absolutely roasted?
            </span>
          </ChatBubble>
          <div className="mt-1" />
          <ChatBubble type="user">Be gentle</ChatBubble>
          <div className="mt-1" />
          <ChatBubble type="ai">
            <span>Yeah nah, that&apos;s not really my thing 😏</span>
          </ChatBubble>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-8 flex flex-col items-center gap-3 mx-auto w-full max-w-[280px]"
      >
        <PrimaryButton onClick={onConfirm} className="w-full">
          LOOKS GOOD — LET&apos;S CHAT
        </PrimaryButton>
        <SecondaryButton onClick={onEdit} className="w-full">
          EDIT MY DETAILS
        </SecondaryButton>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          START OVER
        </button>
      </motion.div>
    </div>
  );
}

/* ================================================================== */
/*  STEP 5: MAIN CHAT ENTRY                                            */
/* ================================================================== */

function StepChatEntry({
  culture,
  team,
  onStart,
}: {
  culture: Culture | null;
  team: Team | null;
  onStart: () => void;
}) {
  const slang = culture?.slang || 'Mate';
  const teamName = team?.name || 'your team';
  const [showPrompts, setShowPrompts] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setShowPrompts(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-[100dvh] bg-bg-primary">
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 pt-16 pb-4">
        {/* Welcome message with typing indicator simulation */}
        <AnimatePresence>
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ChatBubble type="ai">
              <span>
                Habibi! Welcome to The Bloke. I&apos;m already tracking {teamName} and let&apos;s just say... you might want to sit down for this season. What do you wanna know, {slang}?
              </span>
            </ChatBubble>
          </motion.div>
        </AnimatePresence>

        {/* Suggested prompts */}
        <AnimatePresence>
          {showPrompts && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-4"
            >
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['Roast my mate', "How's my team doing?", 'Banter mode', "What's the weather?"].map(
                  (prompt, i) => (
                    <motion.button
                      key={prompt}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08, duration: 0.3, ease: easeBounce }}
                      whileTap={{ scale: 0.95 }}
                      className="shrink-0 px-4 py-2 rounded-full text-xs font-medium border border-[rgba(255,255,255,0.08)]"
                      style={{ backgroundColor: '#12121A', color: '#8A8A9A' }}
                    >
                      {prompt}
                    </motion.button>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode switcher pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="flex justify-center px-4 pb-2"
      >
        <div
          className="flex items-center gap-1 px-4 py-1.5 rounded-full text-xs"
          style={{
            backgroundColor: '#1A1A26',
            color: '#8A8A9A',
          }}
        >
          <Sparkles className="w-3 h-3" strokeWidth={2} />
          Chat Mode
        </div>
      </motion.div>

      {/* Input bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, ease: easePrimary }}
        className="shrink-0 px-4 py-3 border-t border-[rgba(255,255,255,0.06)]"
      >
        <div
          className="flex items-center gap-2 rounded-full px-4 py-3"
          style={{ backgroundColor: '#1A1A26' }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask The Bloke anything..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onStart}
            className="w-9 h-9 rounded-full bg-accent-neon flex items-center justify-center shrink-0"
          >
            <ArrowRight className="w-[18px] h-[18px] text-[#0A0A0F]" strokeWidth={2} />
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom hint */}
      <div className="text-center pb-4 pt-1">
        <p className="text-[10px] text-text-muted">
          Press the arrow to start chatting
        </p>
      </div>
    </div>
  );
}
