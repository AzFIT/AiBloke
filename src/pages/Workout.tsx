// @ts-nocheck
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import Layout from '@/components/Layout';

/* ──────────────────────────── data ───────────────────────────────────────── */

interface Exercise {
  code: string;
  name: string;
}

interface DayData {
  id: number;
  label: string;
  exercises: Exercise[];
}

const days: DayData[] = [
  {
    id: 1,
    label: 'Muscle Groups',
    exercises: [
      { code: 'A1', name: 'One Arm Dumbbell Shoulder Press' },
      { code: 'A2', name: 'Dumbbell Chest Press' },
      { code: 'B1', name: 'Lat Pulldown' },
      { code: 'B2', name: 'Barbell Squat' },
    ],
  },
  {
    id: 2,
    label: 'Muscle Groups',
    exercises: [
      { code: 'A1', name: 'Barbell Deadlift' },
      { code: 'A2', name: 'Incline Dumbbell Press' },
      { code: 'B1', name: 'Cable Row' },
      { code: 'B2', name: 'Leg Press' },
    ],
  },
  {
    id: 3,
    label: 'Muscle Groups',
    exercises: [
      { code: 'A1', name: 'Overhead Press' },
      { code: 'A2', name: 'Weighted Pull-Up' },
      { code: 'B1', name: 'Walking Lunge' },
      { code: 'B2', name: 'Dumbbell Fly' },
    ],
  },
  {
    id: 4,
    label: 'Muscle Groups',
    exercises: [
      { code: 'A1', name: 'Front Squat' },
      { code: 'A2', name: 'Bench Press' },
      { code: 'B1', name: 'T-Bar Row' },
      { code: 'B2', name: 'Romanian Deadlift' },
    ],
  },
];

const tableHeaders = ['Set', 'Reps', '%1RM', 'Tempo'];
const tableRows = [
  { set: 1, reps: '10-12', rm: '65%', tempo: '2010' },
  { set: 2, reps: '10-12', rm: '70%', tempo: '2010' },
  { set: 3, reps: '8-10', rm: '75%', tempo: '2110' },
  { set: 4, reps: '6-8', rm: '80%', tempo: '2110' },
];

/* ──────────────────────────── easing ─────────────────────────────────────── */

const easePrimary = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ──────────────────────────── Workout Page ───────────────────────────────── */

export default function Workout() {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [selectedExercise, setSelectedExercise] = useState(0);

  const handleDayClick = (dayId: number) => {
    if (expandedDay === dayId) {
      setExpandedDay(null);
    } else {
      setExpandedDay(dayId);
      setSelectedExercise(0);
    }
  };

  const handleClose = () => {
    setExpandedDay(null);
  };

  return (
    <Layout showBottomNav={true} bottomNavActiveIndex={3}>
      <div
        className="min-h-[100dvh] px-4 pt-6 pb-24"
        style={{
          background: 'linear-gradient(180deg, #0A0A0F 0%, #0F1629 40%, #0A0A0F 100%)',
        }}
      >
        {/* Program title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easePrimary }}
          className="mb-6"
        >
          <p className="text-[12px] text-[#00F0FF] uppercase tracking-[2px] font-medium mb-1">
            Phase 2, Week 2
          </p>
          <h1 className="font-display font-bold text-[28px] text-[#F5F5F7] tracking-tight">
            {expandedDay ? `Day ${expandedDay}` : 'Select a Day'}
          </h1>
        </motion.div>

        {/* Day buttons */}
        <div className="space-y-3 relative">
          <AnimatePresence mode="popLayout">
            {days.map((day) => {
              const isExpanded = expandedDay === day.id;
              const isOtherExpanded = expandedDay !== null && !isExpanded;

              if (isOtherExpanded) {
                // Other days fade out and drop when one is expanded
                return (
                  <motion.div
                    key={day.id}
                    layout
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: 60, scale: 0.95 }}
                    exit={{ opacity: 0, y: 60, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: easePrimary }}
                    className="rounded-2xl h-[72px] flex items-center px-5"
                    style={{ backgroundColor: '#12121A' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-[#4A4A5A] font-display font-bold">
                        Day {day.id}
                      </span>
                      <span className="text-[13px] text-[#4A4A5A]">{day.label}</span>
                    </div>
                  </motion.div>
                );
              }

              if (isExpanded) {
                // Expanded day fills most of the screen
                return (
                  <motion.div
                    key={day.id}
                    layout
                    initial={{ borderRadius: 16, height: 72 }}
                    animate={{
                      borderRadius: 20,
                      height: 'auto',
                    }}
                    exit={{ borderRadius: 16, height: 72 }}
                    transition={{ duration: 0.5, ease: easePrimary }}
                    className="rounded-[20px] overflow-hidden"
                    style={{ backgroundColor: '#12121A' }}
                  >
                    {/* Expanded header */}
                    <motion.div
                      layout="position"
                      className="flex items-center justify-between px-5 pt-5 pb-3"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          layout="position"
                          className="w-1 h-8 rounded-full"
                          style={{ backgroundColor: '#00F0FF' }}
                        />
                        <div>
                          <motion.span
                            layout="position"
                            className="text-[13px] text-[#00F0FF] font-display font-bold"
                          >
                            Day {day.id}
                          </motion.span>
                          <motion.p
                            layout="position"
                            className="text-[12px] text-[#8A8A9A]"
                          >
                            {day.label}
                          </motion.p>
                        </div>
                      </div>
                      <motion.button
                        layout="position"
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                      >
                        <X className="w-4 h-4 text-[#8A8A9A]" strokeWidth={2} />
                      </motion.button>
                    </motion.div>

                    {/* Expanded content */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="px-5 pb-5"
                    >
                      {/* MOVEMENTS label */}
                      <p className="text-[11px] text-[#00F0FF] uppercase tracking-[2px] font-semibold mb-3">
                        Movements
                      </p>

                      {/* Exercise selector */}
                      <div className="mb-4">
                        <h2 className="font-display font-bold text-[18px] text-[#F5F5F7] mb-1">
                          {day.exercises[selectedExercise].code}. {day.exercises[selectedExercise].name}
                        </h2>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {day.exercises.map((ex, i) => (
                            <button
                              key={ex.code}
                              onClick={() => setSelectedExercise(i)}
                              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                                i === selectedExercise
                                  ? 'bg-[#00F0FF] text-[#0A0A0F]'
                                  : 'bg-[rgba(255,255,255,0.06)] text-[#8A8A9A] hover:text-[#F5F5F7]'
                              }`}
                            >
                              {ex.code}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Table */}
                      <div
                        className="rounded-xl overflow-hidden mb-4"
                        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                      >
                        {/* Table header */}
                        <div className="grid grid-cols-4 gap-0">
                          {tableHeaders.map((h) => (
                            <div
                              key={h}
                              className="px-3 py-2.5 text-center"
                            >
                              <span className="text-[10px] text-[#4A4A5A] uppercase tracking-wider font-medium">
                                {h}
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Table rows */}
                        {tableRows.map((row, i) => (
                          <motion.div
                            key={row.set}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.08, duration: 0.3, ease: easePrimary }}
                            className="grid grid-cols-4 gap-0 border-t border-[rgba(255,255,255,0.04)]"
                          >
                            <div className="px-3 py-3 text-center">
                              <span className="text-[13px] text-[#F5F5F7] font-medium">{row.set}</span>
                            </div>
                            <div className="px-3 py-3 text-center">
                              <span className="text-[13px] text-[#F5F5F7]">{row.reps}</span>
                            </div>
                            <div className="px-3 py-3 text-center">
                              <span className="text-[13px] text-[#00F0FF] font-medium">{row.rm}</span>
                            </div>
                            <div className="px-3 py-3 text-center">
                              <span className="text-[13px] text-[#8A8A9A]">{row.tempo}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Video placeholder */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5, ease: easePrimary }}
                        className="relative rounded-xl overflow-hidden"
                        style={{
                          aspectRatio: '16/9',
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          border: '2px dashed rgba(0,240,255,0.3)',
                        }}
                      >
                        {/* Pulsing glow */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          animate={{
                            boxShadow: [
                              'inset 0 0 20px rgba(0,240,255,0.05)',
                              'inset 0 0 40px rgba(0,240,255,0.15)',
                              'inset 0 0 20px rgba(0,240,255,0.05)',
                            ],
                          }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.7, 1, 0.7],
                              }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                              className="w-14 h-14 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: 'rgba(0,240,255,0.15)' }}
                            >
                              <Play className="w-6 h-6 text-[#00F0FF] ml-1" strokeWidth={2} fill="#00F0FF" />
                            </motion.div>
                            <span className="text-[12px] text-[#4A4A5A]">Exercise video</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              }

              // Collapsed day button (default state)
              return (
                <motion.button
                  key={day.id}
                  layout
                  onClick={() => handleDayClick(day.id)}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    layout: { duration: 0.5, ease: easePrimary },
                    opacity: { duration: 0.4 },
                    y: { duration: 0.4, ease: easePrimary },
                    scale: { duration: 0.15 },
                  }}
                  className="w-full rounded-2xl h-[72px] flex items-center px-5 text-left relative overflow-hidden"
                  style={{ backgroundColor: '#12121A' }}
                >
                  {/* Left accent bar for Day 1 */}
                  {day.id === 1 && (
                    <motion.div
                      layout="position"
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-full"
                      style={{ backgroundColor: '#00F0FF' }}
                    />
                  )}
                  <div className="flex items-center gap-3 ml-1">
                    <span className="text-[15px] text-[#F5F5F7] font-display font-bold">
                      Day {day.id}
                    </span>
                    <span className="text-[13px] text-[#8A8A9A]">{day.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
