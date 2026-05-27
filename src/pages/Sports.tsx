// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Plus,
  Circle,
  CloudSun,
  CloudRain,
  Thermometer,
  Zap,
  X,
  Flame,
  Clock,
  TrendingDown,
  Sun,
} from 'lucide-react';
import Layout from '@/components/Layout';
import ChatBubble from '@/components/ChatBubble';

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                       */
/* ------------------------------------------------------------------ */
const TOKENS = {
  bgPrimary: '#0A0A0F',
  bgSecondary: '#12121A',
  bgElevated: '#1A1A26',
  accentNeon: '#39FF14',
  accentCyan: '#00F0FF',
  accentAmber: '#FF9500',
  accentMagenta: '#FF006E',
  textPrimary: '#F5F5F7',
  textSecondary: '#8A8A9A',
  textMuted: '#4A4A5A',
  safetyRed: '#FF3B30',
  success: '#30D158',
  blokeBubble: '#1E3A2F',
} as const;

/* ------------------------------------------------------------------ */
/*  TYPES                                                               */
/* ------------------------------------------------------------------ */
interface Team {
  id: string;
  name: string;
  shortName: string;
  league: string;
  leagueCode: string;
  color: string;
  record: { w: number; l: number; d: number };
  status: 'playing' | 'upcoming' | 'finished';
  nextGame?: string;
  rival: string;
  recentGames: { opponent: string; score: string; result: 'W' | 'L' | 'D'; date: string }[];
  upcomingFixtures: { opponent: string; date: string }[];
}

interface LiveGame {
  id: string;
  league: string;
  time: string;
  quarter: string;
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  homeLinked: boolean;
  awayLinked: boolean;
}

interface WeatherCard {
  id: string;
  condition: 'sunny' | 'rain' | 'hot' | 'storm' | 'cold';
  temp: number;
  location: string;
  icon: React.ReactNode;
  roast: string;
}

interface Burn {
  id: string;
  teamName: string;
  teamColor: string;
  message: string;
  timeAgo: string;
}

/* ------------------------------------------------------------------ */
/*  MOCK DATA                                                           */
/* ------------------------------------------------------------------ */
const TEAMS: Team[] = [
  {
    id: 'eels',
    name: 'Parramatta Eels',
    shortName: 'Eels',
    league: 'NRL',
    leagueCode: 'NRL',
    color: '#1A3B5D',
    record: { w: 3, l: 8, d: 0 },
    status: 'playing',
    rival: 'Canterbury Bulldogs',
    recentGames: [
      { opponent: 'Panthers', score: '12-24', result: 'L', date: '3 days ago' },
      { opponent: 'Rabbitohs', score: '18-22', result: 'L', date: '1 week ago' },
      { opponent: 'Broncos', score: '10-34', result: 'L', date: '2 weeks ago' },
      { opponent: 'Roosters', score: '28-14', result: 'W', date: '3 weeks ago' },
      { opponent: 'Storm', score: '16-20', result: 'L', date: '1 month ago' },
    ],
    upcomingFixtures: [
      { opponent: 'Bulldogs', date: 'Sat, 7:30pm' },
      { opponent: 'Sea Eagles', date: 'Next Fri, 8:00pm' },
    ],
  },
  {
    id: 'swans',
    name: 'Sydney Swans',
    shortName: 'Swans',
    league: 'AFL',
    leagueCode: 'AFL',
    color: '#E31937',
    record: { w: 6, l: 3, d: 0 },
    status: 'upcoming',
    nextGame: 'Sat 3:20pm',
    rival: 'GWS Giants',
    recentGames: [
      { opponent: 'Giants', score: '89-76', result: 'W', date: '1 week ago' },
      { opponent: 'Magpies', score: '72-95', result: 'L', date: '2 weeks ago' },
      { opponent: 'Cats', score: '102-88', result: 'W', date: '3 weeks ago' },
      { opponent: 'Demons', score: '85-90', result: 'L', date: '1 month ago' },
      { opponent: 'Lions', score: '110-78', result: 'W', date: '1 month ago' },
    ],
    upcomingFixtures: [
      { opponent: 'Giants', date: 'Sat, 3:20pm' },
      { opponent: 'Crows', date: 'Next Sun, 1:10pm' },
    ],
  },
  {
    id: 'manutd',
    name: 'Manchester United',
    shortName: 'Man Utd',
    league: 'Premier League',
    leagueCode: 'EPL',
    color: '#DA291C',
    record: { w: 4, l: 7, d: 2 },
    status: 'finished',
    rival: 'Liverpool',
    recentGames: [
      { opponent: 'Liverpool', score: '0-3', result: 'L', date: '2 days ago' },
      { opponent: 'Chelsea', score: '1-1', result: 'D', date: '1 week ago' },
      { opponent: 'Arsenal', score: '0-1', result: 'L', date: '2 weeks ago' },
      { opponent: 'Spurs', score: '2-1', result: 'W', date: '3 weeks ago' },
      { opponent: 'City', score: '0-2', result: 'L', date: '1 month ago' },
    ],
    upcomingFixtures: [
      { opponent: 'Newcastle', date: 'Sun, 11:30pm' },
      { opponent: 'Everton', date: 'Next Sat, 10:00pm' },
    ],
  },
  {
    id: 'lakers',
    name: 'Los Angeles Lakers',
    shortName: 'Lakers',
    league: 'NBA',
    leagueCode: 'NBA',
    color: '#552583',
    record: { w: 15, l: 18, d: 0 },
    status: 'upcoming',
    nextGame: 'Sun 11:00am',
    rival: 'Warriors',
    recentGames: [
      { opponent: 'Warriors', score: '108-118', result: 'L', date: '2 days ago' },
      { opponent: 'Celtics', score: '112-105', result: 'W', date: '4 days ago' },
      { opponent: 'Nuggets', score: '98-112', result: 'L', date: '1 week ago' },
      { opponent: 'Suns', score: '120-115', result: 'W', date: '1 week ago' },
      { opponent: 'Heat', score: '95-102', result: 'L', date: '2 weeks ago' },
    ],
    upcomingFixtures: [
      { opponent: 'Clippers', date: 'Sun, 11:00am' },
      { opponent: 'Kings', date: 'Tue, 11:30am' },
    ],
  },
];

const LIVE_GAMES: LiveGame[] = [
  {
    id: 'live1',
    league: 'NRL',
    time: "67'",
    quarter: '2nd Half',
    homeTeam: 'Eels',
    homeScore: 12,
    awayTeam: 'Panthers',
    awayScore: 24,
    homeLinked: true,
    awayLinked: false,
  },
];

const WEATHER_CARDS: WeatherCard[] = [
  {
    id: 'w1',
    condition: 'sunny',
    temp: 24,
    location: 'Parramatta, NSW',
    icon: <Sun className="w-10 h-10" style={{ color: TOKENS.accentAmber }} />,
    roast: "Beautiful day out. Shame your team plays like they're still in bed.",
  },
  {
    id: 'w2',
    condition: 'rain',
    temp: 16,
    location: 'Manchester, UK',
    icon: <CloudRain className="w-10 h-10" style={{ color: TOKENS.accentCyan }} />,
    roast: "Sky's crying because your team lost again. Even the weather feels bad for you.",
  },
  {
    id: 'w3',
    condition: 'hot',
    temp: 35,
    location: 'Los Angeles, CA',
    icon: <Thermometer className="w-10 h-10" style={{ color: TOKENS.safetyRed }} />,
    roast: "35 degrees out here and your team still couldn't find any heat.",
  },
];

const RECENT_BURNS: Burn[] = [
  {
    id: 'b1',
    teamName: 'Parramatta Eels',
    teamColor: '#1A3B5D',
    message: "12 points? My grandma scores more at bingo and she's been gone 5 years.",
    timeAgo: '2 hours ago',
  },
  {
    id: 'b2',
    teamName: 'Man United',
    teamColor: '#DA291C',
    message: "Lost to Liverpool AGAIN. At this point it's tradition, not sport.",
    timeAgo: 'Yesterday',
  },
  {
    id: 'b3',
    teamName: 'Lakers',
    teamColor: '#552583',
    message: "Back-to-back Ls. LeBron's carrying more than the team, he's carrying my expectations to the grave.",
    timeAgo: '2 days ago',
  },
  {
    id: 'b4',
    teamName: 'Parramatta Eels',
    teamColor: '#1A3B5D',
    message: "Three losses in a row? That's not a slump, that's a lifestyle choice.",
    timeAgo: 'Last week',
  },
  {
    id: 'b5',
    teamName: 'Sydney Swans',
    teamColor: '#E31937',
    message: "Actually won one? Even a broken clock is right twice a day I guess.",
    timeAgo: 'Last week',
  },
];

/* ------------------------------------------------------------------ */
/*  ANIMATION VARIANTS                                                  */
/* ------------------------------------------------------------------ */
const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const popIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
  }),
};

const sheetVariants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { y: '100%', transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ------------------------------------------------------------------ */
/*  HELPER COMPONENTS                                                   */
/* ------------------------------------------------------------------ */
function SectionLabel({ text, color = TOKENS.accentNeon, icon }: { text: string; color?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <span
        className="font-body font-semibold text-[11px] uppercase tracking-[2px]"
        style={{ color }}
      >
        {text}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TEAM DETAIL BOTTOM SHEET                                            */
/* ------------------------------------------------------------------ */
function TeamDetailSheet({ team, onClose }: { team: Team; onClose: () => void }) {
  const currentStreak = team.recentGames.reduce((acc, g) => {
    if (g.result === 'L') return acc + 1;
    return acc;
  }, 0);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sheet */}
      <motion.div
        className="relative w-full max-h-[70vh] overflow-y-auto rounded-t-3xl"
        style={{ backgroundColor: TOKENS.bgElevated }}
        variants={sheetVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: TOKENS.textMuted }} />
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-display font-bold text-xl"
              style={{ backgroundColor: team.color }}
            >
              {team.shortName[0]}
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5">
              <X className="w-5 h-5" style={{ color: TOKENS.textSecondary }} />
            </button>
          </div>

          <h2 className="font-display font-bold text-2xl" style={{ color: TOKENS.textPrimary }}>
            {team.name}
          </h2>
          <p className="text-sm mt-1" style={{ color: TOKENS.textSecondary }}>
            {team.league}
          </p>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-sm" style={{ color: TOKENS.textPrimary }}>
              <span style={{ color: TOKENS.success }}>{team.record.w}W</span>
              {' · '}
              <span style={{ color: TOKENS.safetyRed }}>{team.record.l}L</span>
              {team.record.d > 0 && (
                <>
                  {' · '}
                  <span style={{ color: TOKENS.accentAmber }}>{team.record.d}D</span>
                </>
              )}
            </span>
            {currentStreak >= 2 && (
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${TOKENS.safetyRed}20`, color: TOKENS.safetyRed }}
              >
                <Flame className="w-3 h-3" />
                {currentStreak} loss streak
              </span>
            )}
          </div>

          {team.rival && (
            <p className="text-xs mt-2" style={{ color: TOKENS.textMuted }}>
              Rival: {team.rival}
            </p>
          )}
        </div>

        {/* Recent Games */}
        <div className="px-5 pb-4">
          <SectionLabel text="RECENT GAMES" color={TOKENS.accentAmber} />
          <div className="space-y-2">
            {team.recentGames.map((game, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={slideUp}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ backgroundColor: TOKENS.bgSecondary }}
              >
                <div>
                  <span className="text-sm font-medium" style={{ color: TOKENS.textPrimary }}>
                    vs {game.opponent}
                  </span>
                  <p className="text-xs" style={{ color: TOKENS.textMuted }}>
                    {game.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-display font-bold" style={{ color: TOKENS.textPrimary }}>
                    {game.score}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        game.result === 'W'
                          ? `${TOKENS.success}20`
                          : game.result === 'L'
                            ? `${TOKENS.safetyRed}20`
                            : `${TOKENS.accentAmber}20`,
                      color:
                        game.result === 'W'
                          ? TOKENS.success
                          : game.result === 'L'
                            ? TOKENS.safetyRed
                            : TOKENS.accentAmber,
                    }}
                  >
                    {game.result}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Fixtures */}
        <div className="px-5 pb-8">
          <SectionLabel text="UPCOMING" color={TOKENS.accentCyan} icon={<Clock className="w-3.5 h-3.5" style={{ color: TOKENS.accentCyan }} />} />
          <div className="space-y-2">
            {team.upcomingFixtures.map((fix, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={slideUp}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ backgroundColor: TOKENS.bgSecondary }}
              >
                <span className="text-sm font-medium" style={{ color: TOKENS.textPrimary }}>
                  vs {fix.opponent}
                </span>
                <span className="text-xs" style={{ color: TOKENS.accentCyan }}>
                  {fix.date}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  LIVE COMMENTARY                                                     */
/* ------------------------------------------------------------------ */
function getLiveCommentary(homeScore: number, awayScore: number, homeLinked: boolean) {
  const myScore = homeLinked ? homeScore : awayScore;
  const theirScore = homeLinked ? awayScore : homeScore;
  const diff = theirScore - myScore;

  if (diff > 10) {
    return "Oof, down by " + diff + "? This is getting embarrassing to watch. My grandma scores more at bingo \u{1F3AF}";
  }
  if (diff > 0) {
    return "Nail-biter! But let's be honest, you already know how this ends. Spoiler: not with a trophy.";
  }
  if (diff < 0) {
    return "Even a broken clock is right twice a day. Don't get used to it.";
  }
  return "Tied up? I've seen more exciting paint dry, mate.";
}

/* ------------------------------------------------------------------ */
/*  MAIN SPORTS PAGE                                                    */
/* ------------------------------------------------------------------ */
export default function Sports() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeTeamId, setActiveTeamId] = useState('eels');
  const activeTeam = TEAMS.find((t) => t.id === activeTeamId) ?? TEAMS[0];

  /* Loss streak for active team */
  const lossStreak = activeTeam.recentGames.reduce((acc, g) => {
    if (g.result === 'L') return acc + 1;
    return acc;
  }, 0);

  /* Commentary for live game */
  const liveGame = LIVE_GAMES[0];
  const commentary = liveGame
    ? getLiveCommentary(liveGame.homeScore, liveGame.awayScore, liveGame.homeLinked)
    : null;

  return (
    <Layout showBottomNav bottomNavActiveIndex={3}>
      <div className="min-h-[100dvh]" style={{ backgroundColor: TOKENS.bgPrimary }}>
        {/* ====== HEADER ====== */}
        <div
          className="sticky top-14 z-30 flex items-center justify-between px-4 h-14"
          style={{
            backgroundColor: `${TOKENS.bgPrimary}CC`,
            backdropFilter: 'blur(20px)',
            borderBottom: `2px solid ${TOKENS.accentAmber}4D`,
          }}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: TOKENS.accentAmber }} />
            <span className="font-display font-bold text-base" style={{ color: TOKENS.accentAmber }}>
              SPORTS TROLL
            </span>
            <button
              className="ml-2 p-1.5 rounded-lg"
              style={{ backgroundColor: `${TOKENS.accentAmber}15` }}
            >
              <Plus className="w-4 h-4" style={{ color: TOKENS.accentAmber }} />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: TOKENS.safetyRed }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: TOKENS.safetyRed }}
              />
            </span>
            <span className="text-xs font-medium" style={{ color: TOKENS.safetyRed }}>
              LIVE
            </span>
          </div>
        </div>

        <div className="px-4 pb-8 pt-4">
          {/* ====== MY TEAMS ====== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <SectionLabel text="MY TEAMS" color={TOKENS.accentAmber} />
          </motion.div>

          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {TEAMS.map((team, i) => {
              const isActive = team.id === activeTeamId;
              return (
                <motion.button
                  key={team.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={slideUp}
                  onClick={() => {
                    setActiveTeamId(team.id);
                    setSelectedTeam(team);
                  }}
                  className="flex-shrink-0 w-40 rounded-2xl p-4 text-left relative snap-start"
                  style={{
                    backgroundColor: TOKENS.bgSecondary,
                    border: isActive
                      ? `2px solid ${TOKENS.accentAmber}`
                      : '1px solid rgba(255,255,255,0.06)',
                    boxShadow: isActive ? `0 0 20px ${TOKENS.accentAmber}4D` : undefined,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Accent bar */}
                  <div
                    className="absolute top-0 left-4 right-4 h-0.5 rounded-full"
                    style={{
                      backgroundColor: team.color,
                      opacity: 0.8,
                    }}
                  />

                  {/* Team initial circle */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-display font-bold text-lg mb-2"
                    style={{ backgroundColor: team.color }}
                  >
                    {team.shortName[0]}
                  </div>

                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: TOKENS.textPrimary }}
                  >
                    {team.name}
                  </p>

                  <span
                    className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: TOKENS.bgElevated, color: TOKENS.textSecondary }}
                  >
                    {team.leagueCode}
                  </span>

                  <p className="text-xs mt-2" style={{ color: TOKENS.textSecondary }}>
                    <span style={{ color: TOKENS.success }}>{team.record.w}W</span>
                    {' · '}
                    <span style={{ color: TOKENS.safetyRed }}>{team.record.l}L</span>
                  </p>

                  {/* Status indicator */}
                  {team.status === 'playing' && (
                    <div className="flex items-center gap-1 mt-2">
                      <Circle className="w-2 h-2 fill-current" style={{ color: TOKENS.safetyRed }} />
                      <span className="text-[10px] font-medium" style={{ color: TOKENS.safetyRed }}>
                        LIVE
                      </span>
                    </div>
                  )}
                  {team.status === 'upcoming' && team.nextGame && (
                    <p className="text-[10px] mt-2" style={{ color: TOKENS.accentCyan }}>
                      Next: {team.nextGame}
                    </p>
                  )}
                </motion.button>
              );
            })}

            {/* Add Team Card */}
            <motion.button
              custom={TEAMS.length}
              initial="hidden"
              animate="visible"
              variants={slideUp}
              className="flex-shrink-0 w-40 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 snap-start"
              style={{
                border: `2px dashed ${TOKENS.accentAmber}4D`,
                backgroundColor: TOKENS.bgPrimary,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus className="w-8 h-8" style={{ color: TOKENS.accentAmber }} />
              <span className="text-sm font-medium" style={{ color: TOKENS.accentAmber }}>
                Add Team
              </span>
            </motion.button>
          </div>

          {/* ====== LIVE SCORES ====== */}
          {liveGame && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="mt-2"
            >
              <div
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: TOKENS.bgSecondary,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Live label */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: TOKENS.bgElevated, color: TOKENS.textSecondary }}
                  >
                    {liveGame.league}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span
                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ backgroundColor: TOKENS.safetyRed }}
                      />
                      <span
                        className="relative inline-flex rounded-full h-1.5 w-1.5"
                        style={{ backgroundColor: TOKENS.safetyRed }}
                      />
                    </span>
                    <span className="text-xs font-medium" style={{ color: TOKENS.safetyRed }}>
                      {liveGame.time} {liveGame.quarter}
                    </span>
                  </div>
                </div>

                {/* Scoreboard */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: liveGame.homeLinked ? TOKENS.accentAmber : TOKENS.textSecondary,
                      }}
                    >
                      {liveGame.homeTeam}
                    </span>
                    <motion.span
                      className="font-display font-bold text-3xl"
                      style={{
                        color: TOKENS.textPrimary,
                        fontSize: liveGame.homeLinked ? '32px' : '28px',
                      }}
                      key={liveGame.homeScore}
                      initial={{ scale: 1.2, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {liveGame.homeScore}
                    </motion.span>
                  </div>

                  <span className="text-[11px] font-medium px-3" style={{ color: TOKENS.textMuted }}>
                    VS
                  </span>

                  <div className="flex flex-col items-center gap-1 flex-1">
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: liveGame.awayLinked ? TOKENS.accentAmber : TOKENS.textSecondary,
                      }}
                    >
                      {liveGame.awayTeam}
                    </span>
                    <motion.span
                      className="font-display font-bold text-3xl"
                      style={{
                        color: TOKENS.textPrimary,
                        fontSize: liveGame.awayLinked ? '32px' : '28px',
                      }}
                      key={liveGame.awayScore}
                      initial={{ scale: 1.2, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {liveGame.awayScore}
                    </motion.span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: TOKENS.bgElevated }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: TOKENS.accentAmber }}
                    initial={{ width: '65%' }}
                    animate={{ width: '67%' }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                  />
                </div>
              </div>

              {/* Commentary */}
              {commentary && (
                <div className="mt-3">
                  <ChatBubble type="ai">
                    <span className="text-sm">{commentary}</span>
                  </ChatBubble>
                </div>
              )}
            </motion.div>
          )}

          {/* ====== LOSS STREAK TRACKER ====== */}
          {lossStreak >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="mt-6"
            >
              <SectionLabel
                text="LOSS STREAK"
                color={TOKENS.safetyRed}
                icon={<TrendingDown className="w-3.5 h-3.5" style={{ color: TOKENS.safetyRed }} />}
              />
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  backgroundColor: TOKENS.bgSecondary,
                  border: `2px solid ${TOKENS.safetyRed}4D`,
                }}
              >
                {/* Streak count */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <span className="font-display font-extrabold text-6xl" style={{ color: TOKENS.safetyRed }}>
                    {lossStreak}
                  </span>
                </motion.div>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: TOKENS.textSecondary }}>
                  LOSSES IN A ROW
                </p>

                {/* Streak Roast Active Banner */}
                {lossStreak >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ backgroundColor: `${TOKENS.accentAmber}20`, border: `1px solid ${TOKENS.accentAmber}40` }}
                  >
                    <Flame className="w-3.5 h-3.5" style={{ color: TOKENS.accentAmber }} />
                    <span className="text-xs font-bold" style={{ color: TOKENS.accentAmber }}>
                      STREAK ROAST ACTIVE
                    </span>
                  </motion.div>
                )}

                {/* L markers */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  {Array.from({ length: Math.min(lossStreak, 6) }).map((_, i) => (
                    <motion.div
                      key={i}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={popIn}
                      className="flex items-center"
                    >
                      <span
                        className="font-display font-extrabold text-2xl"
                        style={{ color: TOKENS.safetyRed }}
                      >
                        L
                      </span>
                      {i < Math.min(lossStreak, 6) - 1 && lossStreak >= 3 && (
                        <Flame className="w-4 h-4 ml-1 animate-pulse" style={{ color: TOKENS.accentAmber }} />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Bloke's streak message */}
                <div className="mt-4">
                  <ChatBubble type="ai">
                    <span className="text-sm">
                      {lossStreak >= 5
                        ? "I'm genuinely impressed. Most teams try to win occasionally."
                        : lossStreak >= 3
                          ? "Three losses in a row? That's not a slump, that's a lifestyle choice."
                          : "Back-to-back? Your team really said 'nah' to winning."}
                    </span>
                  </ChatBubble>
                </div>
              </div>
            </motion.div>
          )}

          {/* ====== WEATHER ROAST CARDS ====== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mt-6"
          >
            <SectionLabel text="WEATHER ROASTS" color={TOKENS.accentCyan} icon={<CloudSun className="w-3.5 h-3.5" style={{ color: TOKENS.accentCyan }} />} />
            <div className="space-y-3">
              {WEATHER_CARDS.map((w, i) => (
                <motion.div
                  key={w.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={slideUp}
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: TOKENS.bgSecondary,
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <motion.div
                      animate={
                        w.condition === 'sunny'
                          ? { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }
                          : w.condition === 'rain'
                            ? { y: [0, 3, 0] }
                            : { rotate: [0, 5, -5, 0] }
                      }
                      transition={{ duration: w.condition === 'sunny' ? 3 : 1, repeat: Infinity }}
                    >
                      {w.icon}
                    </motion.div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display font-bold text-3xl" style={{ color: TOKENS.textPrimary }}>
                          {w.temp}
                        </span>
                        <span className="text-lg" style={{ color: TOKENS.textSecondary }}>°C</span>
                      </div>
                      <p className="text-xs capitalize" style={{ color: TOKENS.textSecondary }}>
                        {w.condition}
                      </p>
                      <p className="text-[11px]" style={{ color: TOKENS.textMuted }}>
                        {w.location}
                      </p>
                    </div>
                  </div>
                  <ChatBubble type="ai">
                    <span className="text-sm">{w.roast}</span>
                  </ChatBubble>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ====== RECENT BURNS ====== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mt-6"
          >
            <SectionLabel text="RECENT BURNS" color={TOKENS.accentNeon} icon={<Zap className="w-3.5 h-3.5" style={{ color: TOKENS.accentNeon }} />} />
            <div className="space-y-2">
              {RECENT_BURNS.map((burn, i) => (
                <motion.div
                  key={burn.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={slideUp}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl"
                  style={{
                    backgroundColor: TOKENS.bgSecondary,
                    borderLeft: `2px solid ${burn.teamColor}`,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold mt-0.5"
                    style={{ backgroundColor: burn.teamColor }}
                  >
                    {burn.teamName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed" style={{ color: TOKENS.textPrimary }}>
                      {burn.message}
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: TOKENS.textMuted }}>
                      {burn.timeAgo}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ====== TEAM DETAIL BOTTOM SHEET ====== */}
      <AnimatePresence>
        {selectedTeam && (
          <TeamDetailSheet team={selectedTeam} onClose={() => setSelectedTeam(null)} />
        )}
      </AnimatePresence>
    </Layout>
  );
}
