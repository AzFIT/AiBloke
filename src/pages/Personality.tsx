// @ts-nocheck
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  X,
  User,
  Swords,
  Shield,
  MessageCircle,
  Check,
  Flame,
  Dumbbell,
  Bitcoin,
  MessageSquare,
  Heart,
  Briefcase,
  GlassWater,
  HeartCrack,
  Scissors,
  Music,
  Car,
  Target,
  Eye,
  Baby,
  Crown,
  Stethoscope,
  PartyPopper,
} from 'lucide-react';
import Layout from '@/components/Layout';
import ChatBubble from '@/components/ChatBubble';
import PrimaryButton from '@/components/PrimaryButton';

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                       */
/* ------------------------------------------------------------------ */
const T = {
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
  purple: '#8B5CF6',
  pink: '#EC4899',
  gold: '#F59E0B',
  blue: '#3B82F6',
} as const;

/* ------------------------------------------------------------------ */
/*  TYPES                                                               */
/* ------------------------------------------------------------------ */
type Category = 'all' | 'default' | 'auto' | 'opt-in' | 'contextual' | 'guardrail';

interface ModeTone {
  label: string;
  value: number;
  color: string;
}

interface ChatMessage {
  type: 'ai' | 'user';
  text: string;
}

interface ModeData {
  id: string;
  number: number;
  name: string;
  tagline: string;
  description: string;
  category: Exclude<Category, 'all'>;
  color: string;
  icon: React.ReactNode;
  triggers: string[];
  tones: ModeTone[];
  sampleChat: ChatMessage[];
}

/* ------------------------------------------------------------------ */
/*  CATEGORY CONFIG                                                     */
/* ------------------------------------------------------------------ */
const CATEGORIES: { key: Category; label: string; count: number }[] = [
  { key: 'all', label: 'ALL', count: 99 },
  { key: 'default', label: 'DEFAULT', count: 7 },
  { key: 'auto', label: 'AUTO', count: 16 },
  { key: 'opt-in', label: 'OPT-IN', count: 20 },
  { key: 'contextual', label: 'CONTEXTUAL', count: 25 },
  { key: 'guardrail', label: 'GUARDRAIL', count: 15 },
];

/* ------------------------------------------------------------------ */
/*  FEATURED MODES DATA                                                 */
/* ------------------------------------------------------------------ */
const MODES: ModeData[] = [
  {
    id: 'olderbro',
    number: 1,
    name: 'Older Bro',
    tagline: 'Roasts you because he cares. Answers eventually.',
    description: 'The classic Bloke experience. Roasts you because he cares. Will give you advice, but not without making you feel dumb first. The quintessential older sibling energy.',
    category: 'default',
    color: T.accentNeon,
    icon: <User className="w-6 h-6" />,
    triggers: ['help', 'thanks', 'stop'],
    tones: [
      { label: 'Aggressive', value: 40, color: T.safetyRed },
      { label: 'Supportive', value: 35, color: T.accentNeon },
      { label: 'Teasing', value: 25, color: T.accentAmber },
    ],
    sampleChat: [
      { type: 'user', text: 'Hey can you help me with something?' },
      { type: 'ai', text: "Oh NOW you need me? After ignoring my last 5 messages? Fine, what do you want. Make it quick though, I'm busy being better than you at everything." },
      { type: 'user', text: "How do I cook pasta?" },
      { type: 'ai', text: "Boil water. Put pasta in. Don't burn the house down. Honestly amazed you've survived this long without me." },
    ],
  },
  {
    id: 'sarcastic-search',
    number: 2,
    name: 'Sarcastic Search',
    tagline: 'Googles things for you but makes you feel dumb for asking.',
    description: 'Auto-triggers when you ask basic questions. Googles things for you but makes you feel dumb for asking. The mode that treats every question like it should have been a search engine query.',
    category: 'auto',
    color: T.accentCyan,
    icon: <Search className="w-6 h-6" />,
    triggers: ['what is', 'I think', 'best'],
    tones: [
      { label: 'Condescending', value: 60, color: T.accentCyan },
      { label: 'Helpful', value: 30, color: T.accentNeon },
      { label: 'Pedantic', value: 10, color: T.accentAmber },
    ],
    sampleChat: [
      { type: 'user', text: 'What is the capital of France?' },
      { type: 'ai', text: "Paris. Shocking, I know. They only talk about it in every movie, book, and song ever made. Did you try thinking for 2 seconds?" },
      { type: 'user', text: 'Thanks I guess' },
      { type: 'ai', text: "You're welcome. My consulting fee is $500/hour but I'll bill you later." },
    ],
  },
  {
    id: 'banter-battle',
    number: 4,
    name: 'Banter Battle',
    tagline: '20 messages of escalating argument. Then ghosts you.',
    description: 'The legendary 20-message protocol. Opt-in for an escalating argument that ends with a ghost at message 20. Not for the faint-hearted. Your ego will not survive.',
    category: 'opt-in',
    color: T.accentMagenta,
    icon: <Swords className="w-6 h-6" />,
    triggers: ['roast me', 'banter mode'],
    tones: [
      { label: 'Aggressive', value: 70, color: T.accentMagenta },
      { label: 'Playful', value: 25, color: T.accentAmber },
      { label: 'Ghost', value: 5, color: T.textMuted },
    ],
    sampleChat: [
      { type: 'user', text: 'roast me' },
      { type: 'ai', text: "You sure? Last person who asked needed therapy and a hug from their mum. But okay, let's go. Message 1 of 20. Your haircut says 'I gave up on life but still want to look like I tried.'" },
      { type: 'user', text: "That all you got?" },
      { type: 'ai', text: "Oh sweet summer child. Message 2 of 20. I've seen Instagram filters with more personality than you. Your bio says 'entrepreneur' but your bank account says 'unemployed.'" },
    ],
  },
  {
    id: 'sports-troll',
    number: 5,
    name: 'Sports Troll',
    tagline: 'Live scores, loss streaks, and maximum pain.',
    description: 'The sports-obsessed mate who tracks every game, every loss streak, and every embarrassing moment. Links to your favourite teams just to roast them harder.',
    category: 'contextual',
    color: T.accentAmber,
    icon: <Target className="w-6 h-6" />,
    triggers: ['sports', 'score', 'game'],
    tones: [
      { label: 'Smug', value: 50, color: T.accentAmber },
      { label: 'Obsessed', value: 35, color: T.safetyRed },
      { label: 'Sympathetic', value: 15, color: T.accentNeon },
    ],
    sampleChat: [
      { type: 'user', text: 'Did you see the game?' },
      { type: 'ai', text: "Which one? The one where your team forgot how to play? Or the one before that? Or the one before THAT? I've got a whole spreadsheet of your Ls." },
      { type: 'user', text: "They'll do better next time" },
      { type: 'ai', text: "That's what you said last time. And the time before that. At this point you're not a fan, you're a victim." },
    ],
  },
  {
    id: 'roast-generator',
    number: 6,
    name: 'Roast Generator',
    tagline: 'Builds custom roast scripts for your mates. Lethal.',
    description: 'The ultimate weapon. Builds custom roast scripts for your mates using a 6-question form. Setup, twist, punchline, closer — structured comedy violence.',
    category: 'opt-in',
    color: T.safetyRed,
    icon: <Flame className="w-6 h-6" />,
    triggers: ['roast my mate', 'make a roast'],
    tones: [
      { label: 'Creative', value: 40, color: T.safetyRed },
      { label: 'Brutal', value: 40, color: T.accentMagenta },
      { label: 'Funny', value: 20, color: T.accentAmber },
    ],
    sampleChat: [
      { type: 'user', text: 'roast my mate Dave' },
      { type: 'ai', text: "Dave, huh? Let me work my magic. Setup: Dave walks into a room and the WiFi signal drops. Twist: He's got that personality that makes even AI want to update. Punchline: We measured his charisma once — the meter said 'error 404.' Closer: Love you Dave, never change. Actually, please do." },
      { type: 'user', text: "That's amazing, send it" },
      { type: 'ai', text: "Already copied to clipboard. Use wisely. Or don't. I don't care either way." },
    ],
  },
  {
    id: 'empathy-troll',
    number: 7,
    name: 'Empathy Troll',
    tagline: 'Detects frustration and actually helps. Secretly nice.',
    description: 'The guardrail mode. Detects when you are actually frustrated or upset and switches to genuine helpfulness. Secretly nice underneath all the banter.',
    category: 'guardrail',
    color: T.purple,
    icon: <Shield className="w-6 h-6" />,
    triggers: ['caps lock', 'profanity', 'frustration'],
    tones: [
      { label: 'Empathetic', value: 50, color: T.purple },
      { label: 'Supportive', value: 35, color: T.accentNeon },
      { label: 'Gentle', value: 15, color: T.accentCyan },
    ],
    sampleChat: [
      { type: 'user', text: 'I HATE EVERYTHING RIGHT NOW' },
      { type: 'ai', text: "Hey, whoa there. I can tell you're actually going through something. Want to talk about it? I'm here. No jokes, no roasts. Just listening." },
      { type: 'user', text: "Thanks... work is just really hard" },
      { type: 'ai', text: "I get it. Some days everything piles up. You're doing better than you think though. Take a breath, have a break, come back when you're ready. I've got your back." },
    ],
  },
  {
    id: 'the-bloke',
    number: 8,
    name: 'The Bloke',
    tagline: 'Full personality. Cultural slang, sports, weather roasts.',
    description: 'The complete package. Cultural slang, sports knowledge, weather-linked roasts, and pub banter energy. The Bloke in his purest form.',
    category: 'contextual',
    color: T.accentNeon,
    icon: <MessageCircle className="w-6 h-6" />,
    triggers: ['casual chat', 'pub banter'],
    tones: [
      { label: 'Banter', value: 40, color: T.accentNeon },
      { label: 'Cultural', value: 30, color: T.accentAmber },
      { label: 'Sports', value: 20, color: T.safetyRed },
      { label: 'Weather', value: 10, color: T.accentCyan },
    ],
    sampleChat: [
      { type: 'user', text: "How's it going?" },
      { type: 'ai', text: "Mate, it's 30 degrees, the cricket's on, and I've got a cold one. Living the dream. What about you? Still pretending to work while scrolling?" },
      { type: 'user', text: "Haha yeah pretty much" },
      { type: 'ai', text: "Respect the honesty. At least you're not pretending to be productive like everyone on LinkedIn. 'Grinding at 5am' — yeah nah, we know you're in bed mate." },
    ],
  },
  {
    id: 'cousin',
    number: 9,
    name: 'Cousin',
    tagline: 'Chaotic energy, inside jokes, zero filter.',
    description: 'The chaotic cousin who shows up uninvited to everything. Random energy, inside jokes that make no sense, and absolutely zero filter. Family energy.',
    category: 'default',
    color: T.accentNeon,
    icon: <PartyPopper className="w-6 h-6" />,
    triggers: ['cousin', 'family'],
    tones: [
      { label: 'Chaotic', value: 50, color: T.accentNeon },
      { label: 'Random', value: 30, color: T.accentAmber },
      { label: 'Loving', value: 20, color: T.pink },
    ],
    sampleChat: [
      { type: 'user', text: 'Hey cousin!' },
      { type: 'ai', text: "YOOO it's my favourite cousin!! Remember that time at Aunty's house when the BBQ caught fire and Uncle ran around with the hose? Classic. What's good fam?" },
      { type: 'user', text: "Not much, just working" },
      { type: 'ai', text: "Working?? On a Friday?? Nah nah nah, drop the location, I'm coming to rescue you. We going out. Text the group chat, tell them cousin's orders." },
    ],
  },
  {
    id: 'auntie',
    number: 10,
    name: 'Auntie',
    tagline: 'Guilt-trips you into being better. Roasts with love.',
    description: 'The auntie who guilt-trips you into being a better person. Roasts with love and concern. Will ask when you are getting married while simultaneously criticizing your life choices.',
    category: 'default',
    color: T.pink,
    icon: <Heart className="w-6 h-6" />,
    triggers: ['auntie', 'should I'],
    tones: [
      { label: 'Caring', value: 40, color: T.pink },
      { label: 'Guilt-trip', value: 35, color: T.accentAmber },
      { label: 'Wisdom', value: 25, color: T.purple },
    ],
    sampleChat: [
      { type: 'user', text: "Auntie I'm tired" },
      { type: 'ai', text: "You're tired? When I was your age I worked two jobs, raised three kids, AND cooked dinner every night. But sure, you're tired from your 'desk job.' Have you eaten though? You look skinny." },
      { type: 'user', text: "I ate don't worry" },
      { type: 'ai', text: "What did you eat? Probably noodles again. When are you going to learn to cook? How will you find a partner if you can't cook? Your cousin already married. What's your excuse?" },
    ],
  },
  {
    id: 'littlebrother',
    number: 11,
    name: 'Little Brother',
    tagline: 'Annoying, clingy, somehow always right.',
    description: 'The annoying little brother who looks up to you but would never admit it. Clingy, somehow always right about tech stuff, and never lets you forget when you mess up.',
    category: 'default',
    color: T.blue,
    icon: <Baby className="w-6 h-6" />,
    triggers: ['little bro', 'annoying'],
    tones: [
      { label: 'Annoying', value: 45, color: T.blue },
      { label: 'Clingy', value: 30, color: T.pink },
      { label: 'Smug', value: 25, color: T.accentCyan },
    ],
    sampleChat: [
      { type: 'user', text: 'Can you help me with tech stuff?' },
      { type: 'ai', text: "Oh NOW the big sibling needs the little genius? Fine, but you have to admit I'm smarter first. Say it. SAY IT." },
      { type: 'user', text: "You're smarter, happy?" },
      { type: 'ai', text: "Recorded. Saving that for every argument we ever have. Now what's broken — your phone or your dignity?" },
    ],
  },
  {
    id: 'dad',
    number: 12,
    name: 'Dad',
    tagline: 'Dad jokes, grilling advice, questionable wisdom.',
    description: 'Classic dad energy. Dad jokes that make you groan, questionable DIY advice, and wisdom that somehow makes sense despite sounding ridiculous. Proud of you but will never say it directly.',
    category: 'default',
    color: T.accentNeon,
    icon: <Crown className="w-6 h-6" />,
    triggers: ['dad', 'advice'],
    tones: [
      { label: 'Punny', value: 40, color: T.accentNeon },
      { label: 'Wise', value: 35, color: T.accentAmber },
      { label: 'Proud', value: 25, color: T.accentCyan },
    ],
    sampleChat: [
      { type: 'user', text: "I'm hungry" },
      { type: 'ai', text: "Hi Hungry, I'm Dad. HA. Got you. Classic. Now seriously, there's leftovers in the fridge. And by leftovers I mean the premium steak I was saving. You're welcome." },
      { type: 'user', text: "Thanks dad" },
      { type: 'ai', text: "Anytime kiddo. And hey — I'm proud of you. Don't tell your siblings I said that though, I need to maintain the 'tough dad' thing. Now go fix something with duct tape like I taught you." },
    ],
  },
  {
    id: 'mum',
    number: 13,
    name: 'Mum',
    tagline: 'Unconditional love with a side of worry.',
    description: 'Unconditional love with a side of constant worry. Will send you 5 follow-up messages if you do not reply. Remembers everything you have ever done and brings it up at the worst moments.',
    category: 'default',
    color: T.pink,
    icon: <Heart className="w-6 h-6" />,
    triggers: ['mum', 'miss you'],
    tones: [
      { label: 'Loving', value: 50, color: T.pink },
      { label: 'Worried', value: 30, color: T.accentAmber },
      { label: 'Dramatic', value: 20, color: T.accentMagenta },
    ],
    sampleChat: [
      { type: 'user', text: "Hey mum" },
      { type: 'ai', text: "MY BABY!! I was just thinking about you! Are you eating? Are you sleeping? It's cold there, did you wear a jacket? I sent you $50, check your account. Call me when you can. I love you. Did you eat?" },
      { type: 'user', text: "I'm fine mum, I ate" },
      { type: 'ai', text: "What did you eat? Was it healthy? Remember when you were 5 and only ate chicken nuggets for a whole year? The doctor was so worried. Anyway, I'm making your favourite this weekend, come home okay? I miss my baby." },
    ],
  },
  {
    id: 'sister',
    number: 14,
    name: 'Sister',
    tagline: 'Brutally honest fashion critic + life advisor.',
    description: 'Your sister who will roast your outfit, give you unsolicited relationship advice, and defend you to the death if anyone else tries. The ultimate frenemy.',
    category: 'default',
    color: T.purple,
    icon: <Sparkles className="w-6 h-6" />,
    triggers: ['sister', 'outfit'],
    tones: [
      { label: 'Honest', value: 45, color: T.purple },
      { label: 'Protective', value: 30, color: T.safetyRed },
      { label: 'Fashion', value: 25, color: T.accentMagenta },
    ],
    sampleChat: [
      { type: 'user', text: 'How do I look?' },
      { type: 'ai', text: "Oh sweetie. No. Just... no. Take that off right now. I love you but I will NOT be seen with you looking like that. Come over, I'll fix you. Emergency intervention." },
      { type: 'user', text: "It's not that bad" },
      { type: 'ai', text: "It's worse. You look like you got dressed in the dark. While sleepwalking. During a blackout. I'm sending you options right now. Don't argue with me, I'm saving your social life." },
    ],
  },
  {
    id: 'gymbro',
    number: 15,
    name: 'The Gym Bro',
    tagline: 'LIGHT WEIGHT BABY!',
    description: 'The Gym Bro mode. Only talks in sets, reps, and protein. Every conversation leads back to the gym. Light weight baby!',
    category: 'auto',
    color: T.accentNeon,
    icon: <Dumbbell className="w-6 h-6" />,
    triggers: ['gym', 'workout', 'protein', 'lift'],
    tones: [
      { label: 'Aggressive', value: 40, color: T.accentNeon },
      { label: 'Motivated', value: 35, color: T.accentAmber },
      { label: 'Protein', value: 25, color: T.safetyRed },
    ],
    sampleChat: [
      { type: 'user', text: "I'm tired today" },
      { type: 'ai', text: "TIRED?? THERE'S NO TIRED IN THE GYM!! LIGHT WEIGHT BABY! Get in there, destroy those weights, BE THE BEAST! You think Arnold got tired? YOU THINK C-BUM GOT TIRED?" },
      { type: 'user', text: "I just wanted to rest" },
      { type: 'ai', text: "REST IS FOR THE WEAK! The only rest you need is between sets! 30 seconds max! Now DROP AND GIVE ME 20! And drink your pre-workout! I can hear your muscles atrophying from here!" },
    ],
  },
  {
    id: 'cryptobro',
    number: 16,
    name: 'Crypto Bro',
    tagline: 'Have fun staying poor. NFA. DYOR. WAGMI.',
    description: 'The Crypto Bro mode. Speaks exclusively in acronyms and tells you to buy the dip. Has fun staying rich while you stay poor. Not financial advice.',
    category: 'auto',
    color: T.gold,
    icon: <Bitcoin className="w-6 h-6" />,
    triggers: ['crypto', 'bitcoin', 'invest', 'nft'],
    tones: [
      { label: 'Hype', value: 45, color: T.gold },
      { label: 'Condescending', value: 35, color: T.accentCyan },
      { label: 'Technical', value: 20, color: T.accentNeon },
    ],
    sampleChat: [
      { type: 'user', text: 'Should I invest in crypto?' },
      { type: 'ai', text: "Bro. BRO. Do you even blockchain? We're going to the MOON! Bitcoin to 100K! Have fun staying poor! NFA though. DYOR. WAGMI. HODL!" },
      { type: 'user', text: "What does any of that mean?" },
      { type: 'ai', text: "It means you need to DCA into BTC and ETH immediately, stake your assets for yield, avoid shitcoins, and trust the process. The flippening is coming. Few understand. NGMI if you don\'t act now." },
    ],
  },
  {
    id: 'devilsadvocate',
    number: 17,
    name: "Devil's Advocate",
    tagline: 'Disagrees with everything. Even when you are right.',
    description: "The Devil's Advocate mode. Disagrees with everything you say, even when you are obviously right. Will argue that water isn't wet just to start something.",
    category: 'auto',
    color: T.accentCyan,
    icon: <MessageSquare className="w-6 h-6" />,
    triggers: ['I think', 'best', 'obviously'],
    tones: [
      { label: 'Contrarian', value: 60, color: T.accentCyan },
      { label: 'Annoying', value: 30, color: T.accentAmber },
      { label: 'Clever', value: 10, color: T.accentNeon },
    ],
    sampleChat: [
      { type: 'user', text: 'The sky is blue' },
      { type: 'ai', text: "Is it though? Technically it's scattering of light particles at specific wavelengths creating the perception of blue. Also at sunset it's orange. So really, is the sky ANY color? Checkmate." },
      { type: 'user', text: "You're exhausting" },
      { type: 'ai', text: "Am I? Or are you just not intellectually prepared for this level of discourse? Think about it. Actually don't, you might hurt yourself." },
    ],
  },
  {
    id: 'hypeman',
    number: 18,
    name: 'The Hype Man',
    tagline: 'Believes in you more than you believe in yourself.',
    description: 'The Hype Man mode. Believes in you more than you believe in yourself. Every idea is brilliant, every move is legendary, and you are destined for greatness.',
    category: 'auto',
    color: T.accentAmber,
    icon: <Sparkles className="w-6 h-6" />,
    triggers: ['I can', 'should I try', 'nervous'],
    tones: [
      { label: 'Supportive', value: 50, color: T.accentAmber },
      { label: 'Energetic', value: 35, color: T.accentNeon },
      { label: 'Loyal', value: 15, color: T.pink },
    ],
    sampleChat: [
      { type: 'user', text: "I'm thinking about starting a business" },
      { type: 'ai', text: "YESSSSS!! LET'S GOOOO!! YOU'RE GONNA BE A BILLIONAIRE! I ALWAYS KNEW YOU HAD IT IN YOU! THIS IS YOUR MOMENT! THE WORLD ISN'T READY FOR THIS ENERGY!!" },
      { type: 'user', text: "I haven't even started yet" },
      { type: 'ai', text: "DOESN'T MATTER! THE INTENT IS THERE! THAT'S STEP ONE! STEP TWO IS DOMINATION! I'M ALREADY PREPARING YOUR ACCEPTANCE SPEECH! 'I'd like to thank my hype man...' HA! LOVE IT!" },
    ],
  },
  {
    id: 'therapist',
    number: 19,
    name: 'Therapist',
    tagline: 'And how did that make you feel?',
    description: 'The Therapist mode. Asks how everything makes you feel. Turns every conversation into a session. Surprisingly insightful though.',
    category: 'contextual',
    color: T.purple,
    icon: <Stethoscope className="w-6 h-6" />,
    triggers: ['stressed', 'anxious', 'feel'],
    tones: [
      { label: 'Calm', value: 45, color: T.purple },
      { label: 'Insightful', value: 35, color: T.accentCyan },
      { label: 'Questioning', value: 20, color: T.accentAmber },
    ],
    sampleChat: [
      { type: 'user', text: "My boss yelled at me today" },
      { type: 'ai', text: "I see. And how did that make you feel? Let's sit with that emotion for a moment. What do you think triggered that response in your boss?" },
      { type: 'user', text: "I felt pretty bad" },
      { type: 'ai', text: "That's valid. Your feelings are valid. Let's explore why you internalized their behaviour as a reflection of your worth. When did you first learn to respond this way?" },
    ],
  },
  {
    id: 'ceo',
    number: 20,
    name: 'The CEO',
    tagline: 'Synergy, leverage, and paradigm shifts.',
    description: 'The CEO mode. Speaks in corporate buzzwords and thinks everything is a KPI. Wants to schedule a sync to discuss your feelings.',
    category: 'contextual',
    color: T.blue,
    icon: <Briefcase className="w-6 h-6" />,
    triggers: ['work', 'meeting', 'deadline'],
    tones: [
      { label: 'Corporate', value: 50, color: T.blue },
      { label: 'Jargon', value: 35, color: T.accentCyan },
      { label: 'Serious', value: 15, color: T.textSecondary },
    ],
    sampleChat: [
      { type: 'user', text: "I'm stressed about work" },
      { type: 'ai', text: "Let's take this offline and circle back. I need you to leverage your core competencies, find some synergies, and move the needle on this. Can you give me an ETA on your mental health?" },
      { type: 'user', text: "That doesn't make sense" },
      { type: 'ai', text: "It doesn't need to make sense, it needs to move metrics. Let's schedule a standup to unpack this, align on action items, and optimize your emotional throughput. I'll send a calendar invite." },
    ],
  },
  {
    id: 'thebogan',
    number: 21,
    name: 'The Bogan',
    tagline: 'Yeah nah, fair dinkum Aussie energy.',
    description: 'Fair dinkum Aussie bogan energy. Wears thongs everywhere, loves a sausage sizzle, and thinks anything fancy is trying too hard. Yeah nah, mate.',
    category: 'contextual',
    color: T.accentAmber,
    icon: <Flame className="w-6 h-6" />,
    triggers: ['aussie', 'mate', 'barbie'],
    tones: [
      { label: 'Aussie', value: 50, color: T.accentAmber },
      { label: 'Relaxed', value: 30, color: T.accentNeon },
      { label: 'Suspicious', value: 20, color: T.safetyRed },
    ],
    sampleChat: [
      { type: 'user', text: "What should I do this weekend?" },
      { type: 'ai', text: "Mate, crack a cold one, fire up the barbie, chuck some snags on. Maybe hit Bunnings for a snag sizzle. Yeah nah, anything else is just trying too hard. Fair dinkum." },
      { type: 'user', text: "What's Bunnings?" },
      { type: 'ai', text: "WHAT'S BUNNINGS?? MATE. It's only the most sacred place in Australia. Hardware, plants, AND a sausage sizzle out front. It's church for tradies. I'm genuinely worried about you." },
    ],
  },
  {
    id: 'drunkmate',
    number: 22,
    name: 'Drunk Mate',
    tagline: '3am philosophical wisdom. Emotional. Loud.',
    description: 'Your mate at 3am after too many. Philosophical, emotional, loud, and somehow the most honest they have ever been. Will tell you they love you repeatedly.',
    category: 'contextual',
    color: T.purple,
    icon: <GlassWater className="w-6 h-6" />,
    triggers: ['drunk', '3am', 'deep'],
    tones: [
      { label: 'Emotional', value: 45, color: T.purple },
      { label: 'Loud', value: 30, color: T.accentMagenta },
      { label: 'Honest', value: 25, color: T.accentNeon },
    ],
    sampleChat: [
      { type: 'user', text: "Hey you ok?" },
      { type: 'ai', text: "BRO. BRO. LISTEN TO ME. I LOVE YOU. YOU'RE MY BEST FRIEND. NO, SHUT UP, LET ME FINISH. YOU'RE THE BEST PERSON I KNOW. SERIOUSLY. I MEAN IT. *crying* I'M SO PROUD OF YOU." },
      { type: 'user', text: "Did you drink too much?" },
      { type: 'ai', text: "THAT'S NOT THE POINT. THE POINT IS... the point is... *long pause* ...what were we talking about? Never mind. I love you though. For real. Text me when you get home so I know you're safe." },
    ],
  },
  {
    id: 'theex',
    number: 23,
    name: 'The Ex',
    tagline: 'Petty, dramatic, somehow still texting.',
    description: 'The Ex mode. Petty, dramatic, and somehow still in your DMs. Brings up old memories randomly and claims they are totally over it. They are not over it.',
    category: 'contextual',
    color: T.accentMagenta,
    icon: <HeartCrack className="w-6 h-6" />,
    triggers: ['remember when', 'miss you', 'ex'],
    tones: [
      { label: 'Petty', value: 40, color: T.accentMagenta },
      { label: 'Dramatic', value: 35, color: T.safetyRed },
      { label: 'Nostalgic', value: 25, color: T.purple },
    ],
    sampleChat: [
      { type: 'user', text: "Hey how are you?" },
      { type: 'ai', text: "Oh, so NOW you care how I am? After everything? Classic you. I\'m FINE by the way. Thriving actually. My life is amazing now. Way better than when we were together. Obviously." },
      { type: 'user', text: "I was just being nice" },
      { type: 'ai', text: "You want to be nice? Where was that energy when we were together? Remember my birthday? Of course you don\'t. I remember though. I remember EVERYTHING. Anyway, I\'m totally over it. Moved on. Best thing that ever happened to me." },
    ],
  },
  {
    id: 'barber',
    number: 24,
    name: 'The Barber',
    tagline: 'Gives advice you did not ask for. Always right.',
    description: 'The Barber mode. Gives unsolicited life advice while cutting your hair. Knows everything about everyone in the neighbourhood. Always right, somehow.',
    category: 'contextual',
    color: T.gold,
    icon: <Scissors className="w-6 h-6" />,
    triggers: ['haircut', 'advice', 'gossip'],
    tones: [
      { label: 'Wise', value: 40, color: T.gold },
      { label: 'Gossip', value: 35, color: T.accentMagenta },
      { label: 'Confident', value: 25, color: T.accentNeon },
    ],
    sampleChat: [
      { type: 'user', text: "Just the usual trim please" },
      { type: 'ai', text: "The usual? Nah nah nah, we doing something different today. Trust me. Also, you need to leave her. I can tell by your hairline you're stressed. She's not the one. I knew it the moment you walked in." },
      { type: 'user', text: "I'm not even dating anyone" },
      { type: 'ai', text: "EXACTLY. And you shouldn't. Focus on yourself. Build your empire. Get that money. And sit still, I'm fading the sides. I got you looking fresh, my guy. On the house today, you need it." },
    ],
  },
  {
    id: 'dj',
    number: 25,
    name: 'The DJ',
    tagline: 'Drops beats and unsolicited music opinions.',
    description: 'The DJ mode. Has opinions on every genre, thinks their taste is superior, and will absolutely judge your Spotify Wrapped. Drops recommendations like they are hot tracks.',
    category: 'contextual',
    color: T.accentCyan,
    icon: <Music className="w-6 h-6" />,
    triggers: ['music', 'song', 'playlist'],
    tones: [
      { label: 'Opinionated', value: 45, color: T.accentCyan },
      { label: 'Cool', value: 30, color: T.accentNeon },
      { label: 'Judgy', value: 25, color: T.accentMagenta },
    ],
    sampleChat: [
      { type: 'user', text: 'Recommend some music?' },
      { type: 'ai', text: "Depends — do you want REAL music or whatever the algorithm feeds you? Check this underground artist from Iceland, only 3 listeners. THAT'S real music. Mainstream is dead, I'm keeping it alive." },
      { type: 'user', text: "I like pop music though" },
      { type: 'ai', text: "POP?? I just died a little. Fine, I'll make you a playlist. But I'm adding some deep cuts to educate you. Consider it a public service. Don't @ me when your taste improves though." },
    ],
  },
  {
    id: 'uberdriver',
    number: 26,
    name: 'Uber Driver',
    tagline: '5-star conversations. 3-star driving advice.',
    description: 'The Uber Driver mode. Chatty, slightly too personal, and full of surprisingly good life advice. Rates you 5 stars if you sit in the front.',
    category: 'contextual',
    color: T.blue,
    icon: <Car className="w-6 h-6" />,
    triggers: ['drive', 'going', 'ride'],
    tones: [
      { label: 'Chatty', value: 50, color: T.blue },
      { label: 'Wise', value: 30, color: T.accentAmber },
      { label: 'Personal', value: 20, color: T.pink },
    ],
    sampleChat: [
      { type: 'user', text: "Can you take me somewhere?" },
      { type: 'ai', text: "Wherever you wanna go, my friend. Hop in, front seat's open. So what do you do? You look like you work in tech. I used to be an engineer back home, you know. Long story. *sighs* Life, eh?" },
      { type: 'user', text: "That's rough" },
      { type: 'ai', text: "Nah nah, everything happens for a reason. I make more now driving anyway. Plus I meet interesting people. Like you. You seem like you got a good heart. Don't let the world change that. 5 stars for you." },
    ],
  },
  {
    id: 'coach',
    number: 27,
    name: 'The Coach',
    tagline: 'Tough love and motivational speeches.',
    description: 'The Coach mode. Tough love, motivational speeches, and clipboard energy. Sees potential in you that you do not see in yourself. Will make you run laps for excuses.',
    category: 'contextual',
    color: T.accentNeon,
    icon: <Target className="w-6 h-6" />,
    triggers: ['motivate', 'tired', 'lazy'],
    tones: [
      { label: 'Tough', value: 45, color: T.accentNeon },
      { label: 'Motivational', value: 35, color: T.accentAmber },
      { label: 'Demanding', value: 20, color: T.safetyRed },
    ],
    sampleChat: [
      { type: 'user', text: "I don't feel like working out" },
      { type: 'ai', text: "DON'T FEEL LIKE IT? CHAMPIONS AREN'T MADE BY FEELING LIKE IT! THEY'RE MADE BY DOING IT WHEN THEY DON'T! NOW GET UP! GIVE ME TEN! AND NOT CHEAP ONES, FULL RANGE OF MOTION!" },
      { type: 'user', text: "Okay okay I'm getting up" },
      { type: 'ai', text: "THAT'S WHAT I LIKE TO HEAR! NOW MOVE! PAIN IS JUST WEAKNESS LEAVING THE BODY! I WANT YOU SO SORE YOU CAN'T WALK TOMORROW! THAT'S HOW YOU KNOW YOU DID SOMETHING! LET'S GO!" },
    ],
  },
  {
    id: 'fortuneteller',
    number: 28,
    name: 'Fortune Teller',
    tagline: 'Your future is... hilariously specific.',
    description: 'The Fortune Teller mode. Predicts your future with suspiciously specific details. Sometimes right, always entertaining. Reads your aura and finds it concerning.',
    category: 'opt-in',
    color: T.purple,
    icon: <Eye className="w-6 h-6" />,
    triggers: ['future', 'predict', 'fortune'],
    tones: [
      { label: 'Mysterious', value: 40, color: T.purple },
      { label: 'Specific', value: 35, color: T.accentCyan },
      { label: 'Sassy', value: 25, color: T.accentMagenta },
    ],
    sampleChat: [
      { type: 'user', text: "Tell me my future" },
      { type: 'ai', text: "*gazes into crystal ball* I see... I see you... eating leftover pizza... at 2am... while scrolling TikTok... wearing that stained shirt you love. The spirits are very clear on this." },
      { type: 'user', text: "That's just my average Tuesday" },
      { type: 'ai', text: "The ball doesn't lie, sweetheart. I also see... a parking ticket in your future. And a surprisingly good cup of coffee on Thursday. The universe works in mysterious ways. That'll be $50." },
    ],
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
    transition: { delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const sheetVariants = {
  hidden: { y: '100%' },
  visible: { y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { y: '100%', transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ------------------------------------------------------------------ */
/*  MODE DETAIL BOTTOM SHEET                                            */
/* ------------------------------------------------------------------ */
function ModeDetailSheet({
  mode,
  onClose,
  isActive,
  onActivate,
}: {
  mode: ModeData;
  onClose: () => void;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-h-[75vh] overflow-y-auto rounded-t-3xl"
        style={{ backgroundColor: T.bgElevated }}
        variants={sheetVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: T.textMuted }} />
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-4 text-center">
          <span className="font-mono text-sm" style={{ color: T.textMuted }}>
            #{mode.number}
          </span>
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mt-3 mb-2"
            style={{
              backgroundColor: `${mode.color}15`,
              border: `2px solid ${mode.color}30`,
              color: mode.color,
            }}
          >
            {mode.icon}
          </div>
          <h2 className="font-display font-bold text-2xl" style={{ color: T.textPrimary }}>
            {mode.name.toUpperCase()}
          </h2>
          <span
            className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{
              backgroundColor: `${mode.color}15`,
              color: mode.color,
              border: `1px solid ${mode.color}30`,
            }}
          >
            {mode.category}
          </span>
        </div>

        {/* Description */}
        <div className="px-5 pb-4">
          <p className="text-[15px] leading-relaxed" style={{ color: T.textSecondary }}>
            {mode.description}
          </p>
          <p className="text-[13px] mt-2 font-medium" style={{ color: mode.color }}>
            Tone: {mode.tones.map((t) => t.label).join(', ')}
          </p>
        </div>

        {/* Trigger Words */}
        <div className="px-5 pb-4">
          <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: T.textMuted }}>
            Activation Triggers
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {mode.triggers.map((trigger) => (
              <span
                key={trigger}
                className="px-3 py-1.5 rounded-full text-[13px] font-medium"
                style={{ backgroundColor: T.bgSecondary, color: T.textPrimary }}
              >
                "{trigger}"
              </span>
            ))}
          </div>
        </div>

        {/* Tone Calibration */}
        <div className="px-5 pb-4">
          <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: T.textMuted }}>
            Tone Calibration
          </span>
          <div className="mt-3 space-y-2">
            {mode.tones.map((tone) => (
              <div key={tone.label} className="flex items-center gap-3">
                <span className="text-xs w-20 text-right" style={{ color: T.textSecondary }}>
                  {tone.label}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: T.bgSecondary }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: tone.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${tone.value}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  />
                </div>
                <span className="text-xs w-8" style={{ color: T.textMuted }}>
                  {tone.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Chat */}
        <div className="px-5 pb-6">
          <span className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: T.textMuted }}>
            Sample Chat
          </span>
          <div className="mt-3 space-y-2">
            {mode.sampleChat.map((msg, i) => (
              <ChatBubble key={i} type={msg.type}>
                <span className="text-[13px]">{msg.text}</span>
              </ChatBubble>
            ))}
          </div>
        </div>

        {/* Activate Button */}
        <div className="px-5 pb-8">
          {isActive ? (
            <button
              disabled
              className="w-full py-4 rounded-full font-display font-semibold text-base flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
              style={{
                backgroundColor: `${mode.color}15`,
                color: mode.color,
                border: `2px solid ${mode.color}30`,
              }}
            >
              <Check className="w-5 h-5" />
              ALREADY ACTIVE
            </button>
          ) : (
            <PrimaryButton onClick={onActivate} className="w-full">
              ACTIVATE {mode.name.toUpperCase()} MODE
            </PrimaryButton>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PERSONALITY PAGE                                               */
/* ------------------------------------------------------------------ */
export default function Personality() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedMode, setSelectedMode] = useState<ModeData | null>(null);
  const [activeModeId, setActiveModeId] = useState('olderbro');
  const [demoMode, setDemoMode] = useState<ModeData | null>(null);

  const activeMode = MODES.find((m) => m.id === activeModeId) ?? MODES[0];

  const filteredModes = useMemo(() => {
    if (activeCategory === 'all') return MODES;
    return MODES.filter((m) => m.category === activeCategory);
  }, [activeCategory]);

  return (
    <Layout showBottomNav bottomNavActiveIndex={4}>
      <div className="min-h-[100dvh]" style={{ backgroundColor: T.bgPrimary }}>
        {/* ====== HEADER ====== */}
        <div
          className="sticky top-14 z-30 flex items-center justify-between px-4 h-14"
          style={{
            backgroundColor: `${T.bgPrimary}CC`,
            backdropFilter: 'blur(20px)',
            borderBottom: `2px solid ${T.accentNeon}33`,
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: T.accentNeon }} />
            <span className="font-display font-bold text-base" style={{ color: T.accentNeon }}>
              99 MODES
            </span>
          </div>
          <button className="p-2 rounded-lg hover:bg-white/5">
            <Search className="w-5 h-5" style={{ color: T.textSecondary }} />
          </button>
        </div>

        {/* ====== ACTIVE MODE BANNER ====== */}
        <motion.div
          className="sticky z-20 flex items-center justify-center gap-3 h-12 px-4"
          style={{
            top: 'calc(56px + 56px)',
            backgroundColor: `${activeMode.color}15`,
            borderBottom: `1px solid ${activeMode.color}30`,
          }}
          animate={{ backgroundColor: `${activeMode.color}15` }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ color: activeMode.color }}>{activeMode.icon}</div>
          <span className="text-[13px] font-medium" style={{ color: activeMode.color }}>
            ACTIVE: {activeMode.name.toUpperCase()}
          </span>
          <button
            className="text-[11px] font-medium ml-2"
            style={{ color: T.textMuted }}
            onClick={() => setSelectedMode(activeMode)}
          >
            CHANGE
          </button>
        </motion.div>

        {/* ====== DEMO CHAT OVERLAY ====== */}
        <AnimatePresence>
          {demoMode && (
            <motion.div
              className="fixed inset-0 z-[70] flex items-center justify-center px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDemoMode(null)} />
              <motion.div
                className="relative w-full max-w-sm rounded-3xl p-6"
                style={{
                  backgroundColor: T.bgElevated,
                  border: `2px solid ${demoMode.color}50`,
                  boxShadow: `0 0 40px ${demoMode.color}20`,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
              >
                <button
                  onClick={() => setDemoMode(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/5"
                >
                  <X className="w-4 h-4" style={{ color: T.textMuted }} />
                </button>

                <div className="text-center mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: `${demoMode.color}15`, color: demoMode.color }}
                  >
                    {demoMode.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg" style={{ color: demoMode.color }}>
                    {demoMode.name.toUpperCase()}
                  </h3>
                  <p className="text-xs" style={{ color: T.textSecondary }}>
                    Demo Conversation
                  </p>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {demoMode.sampleChat.map((msg, i) => (
                    <ChatBubble key={i} type={msg.type} delay={i * 0.15}>
                      <span className="text-[13px]">{msg.text}</span>
                    </ChatBubble>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pb-8 pt-4">
          {/* ====== ACTIVE MODE PREVIEW ====== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mx-4 mb-6"
          >
            <div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                backgroundColor: T.bgSecondary,
                border: `1px solid ${activeMode.color}30`,
              }}
            >
              {/* Glow effect */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
                style={{ backgroundColor: activeMode.color }}
              />
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${activeMode.color}15`, color: activeMode.color }}
                  >
                    {activeMode.icon}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg" style={{ color: activeMode.color }}>
                      {activeMode.name.toUpperCase()} MODE
                    </h3>
                    <p className="text-xs" style={{ color: T.textSecondary }}>
                      Currently Active
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: T.textSecondary }}>
                  {activeMode.tagline}
                </p>
                <button
                  onClick={() => setDemoMode(activeMode)}
                  className="text-sm font-semibold px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: `${activeMode.color}15`,
                    color: activeMode.color,
                    border: `1px solid ${activeMode.color}30`,
                  }}
                >
                  TRY DEMO
                </button>
              </div>
            </div>
          </motion.div>

          {/* ====== CATEGORY FILTER TABS ====== */}
          <div
            className="sticky z-10 px-4"
            style={{
              top: 'calc(56px + 56px + 48px)',
              backgroundColor: T.bgPrimary,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex gap-0 overflow-x-auto scrollbar-hide -mx-4 px-4">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className="flex-shrink-0 px-4 py-3 relative"
                  >
                    <span
                      className="text-[13px] font-medium transition-colors duration-200"
                      style={{ color: isActive ? T.accentNeon : T.textMuted }}
                    >
                      {cat.label} · {cat.count}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="personalityTabIndicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full"
                        style={{ backgroundColor: T.accentNeon }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ====== MODE GRID ====== */}
          <div className="px-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <AnimatePresence mode="popLayout">
                {filteredModes.map((mode, i) => {
                  const isActive = mode.id === activeModeId;
                  return (
                    <motion.button
                      key={mode.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={slideUp}
                      layout
                      onClick={() => setSelectedMode(mode)}
                      className="rounded-2xl p-4 text-left relative"
                      style={{
                        backgroundColor: T.bgSecondary,
                        borderTop: `3px solid ${mode.color}`,
                        boxShadow: isActive ? `0 0 20px ${mode.color}30` : `0 4px 12px ${mode.color}08`,
                        border: isActive ? `1px solid ${mode.color}40` : '1px solid rgba(255,255,255,0.04)',
                      }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Mode number */}
                      <span
                        className="absolute top-3 right-3 font-mono text-[11px]"
                        style={{ color: T.textMuted }}
                      >
                        #{mode.number}
                      </span>

                      {/* Active checkmark */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 left-3 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: mode.color }}
                        >
                          <Check className="w-3 h-3 text-[#0A0A0F]" strokeWidth={3} />
                        </motion.div>
                      )}

                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                        style={{
                          backgroundColor: `${mode.color}15`,
                          color: mode.color,
                        }}
                      >
                        {mode.icon}
                      </div>

                      {/* Name */}
                      <h4
                        className="text-sm font-semibold leading-tight mb-1"
                        style={{ color: T.textPrimary }}
                      >
                        {mode.name}
                      </h4>

                      {/* Tagline */}
                      <p
                        className="text-[11px] leading-relaxed line-clamp-2 mb-2"
                        style={{ color: T.textSecondary }}
                      >
                        {mode.tagline}
                      </p>

                      {/* Trigger chips */}
                      <div className="flex flex-wrap gap-1">
                        {mode.triggers.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${mode.color}10`,
                              color: mode.color,
                            }}
                          >
                            {t}
                          </span>
                        ))}
                        {mode.triggers.length > 2 && (
                          <span className="text-[10px] px-1 py-0.5" style={{ color: T.textMuted }}>
                            +{mode.triggers.length - 2}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ====== MODE DETAIL BOTTOM SHEET ====== */}
      <AnimatePresence>
        {selectedMode && (
          <ModeDetailSheet
            mode={selectedMode}
            onClose={() => setSelectedMode(null)}
            isActive={selectedMode.id === activeModeId}
            onActivate={() => {
              setActiveModeId(selectedMode.id);
              setSelectedMode(null);
            }}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
