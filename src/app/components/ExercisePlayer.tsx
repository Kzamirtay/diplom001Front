import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Clock, Star, Trophy, CheckCircle, Coffee } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";
import { exercisesAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useAccessibility, useVibration } from "../../contexts/AccessibilityContext";

// Импорт компонентов упражнений
import SoundExercise from "./exercises/SoundExercise";
import MemoryExercise from "./exercises/MemoryExercise";
import MatchingExercise from "./exercises/MatchingExercise";
import PhonemicExercise from "./exercises/PhonemicExercise";

interface Exercise {
  id: number;
  title: string;
  description: string;
  type: string;
  difficulty_level: number;
  duration_minutes: number;
  content: any;
}

interface Session {
  id: number;
  start_time: string;
}

// Константы для СДВГ-режима
const ADHD_BREAK_INTERVAL = 3 * 60; // 3 минуты
const ADHD_BREAK_DURATION = 30; // 30 секунд перерыв

export default function ExercisePlayer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentChild } = useAuth();
  const { shouldReduceMotion, shouldUseShortSessions, shouldVibrate } = useAccessibility();
  const { vibrateSuccess, vibrateClick } = useVibration();
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Состояние прохождения
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [result, setResult] = useState<any>(null);

  // СДВГ-режим: перерывы
  const [showBreak, setShowBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(ADHD_BREAK_DURATION);

  useEffect(() => {
    if (id && currentChild) {
      startExercise();
    }
  }, [id, currentChild]);

  // Таймер
  useEffect(() => {
    if (!completed && session && !showBreak) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [completed, session, showBreak]);

  // СДВГ-режим: проверка необходимости перерыва
  useEffect(() => {
    if (shouldUseShortSessions && timeElapsed > 0 && timeElapsed % ADHD_BREAK_INTERVAL === 0 && !completed) {
      setShowBreak(true);
      setBreakTimeLeft(ADHD_BREAK_DURATION);
      vibrateSuccess();
    }
  }, [timeElapsed, shouldUseShortSessions, completed]);

  // Таймер перерыва
  useEffect(() => {
    if (showBreak && breakTimeLeft > 0) {
      const timer = setInterval(() => {
        setBreakTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (showBreak && breakTimeLeft === 0) {
      setShowBreak(false);
    }
  }, [showBreak, breakTimeLeft]);

  const startExercise = async () => {
    if (!currentChild) {
      setError("Выберите ребенка для начала упражнения");
      setLoading(false);
      return;
    }

    try {
      const exRes = await exercisesAPI.getById(Number(id));
      setExercise(exRes.data);

      const sessionRes = await exercisesAPI.startSession(Number(id), currentChild.id);
      setSession(sessionRes.data.session);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка запуска упражнения");
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseComplete = async (score: number, accuracy: number) => {
    if (!session || !exercise) return;

    vibrateSuccess();
    setCompleting(true);
    try {
      const res = await exercisesAPI.completeSession(exercise.id, {
        session_id: session.id,
        score: score,
        accuracy_percent: accuracy,
        details: {
          time_spent: timeElapsed,
          completed_at: new Date().toISOString(),
        }
      });

      setResult(res.data);
      setCompleted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка завершения упражнения");
    } finally {
      setCompleting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "speech": return "var(--speech)";
      case "cognitive": return "var(--cognition)";
      case "articulation": return "var(--articulation)";
      default: return "var(--primary)";
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "speech": return "🗣️";
      case "cognitive": return "🧠";
      case "articulation": return "👅";
      default: return "🎯";
    }
  };

  // Настройки анимации в зависимости от режима
  const motionProps = shouldReduceMotion 
    ? { initial: false, animate: false }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const renderExerciseComponent = () => {
    if (!exercise) return null;
    const exerciseId = exercise.id;
    const exerciseType = exercise.type;

    if (exerciseType === "speech" || [1, 2].includes(exerciseId)) {
      if (exerciseId === 2 || exercise.title.toLowerCase().includes("анализ")) {
        return <PhonemicExercise onComplete={handleExerciseComplete} />;
      }
      return <SoundExercise onComplete={handleExerciseComplete} />;
    }

    if (exerciseType === "cognitive" || [3, 4].includes(exerciseId)) {
      if (exerciseId === 3 || exercise.title.toLowerCase().includes("запомни")) {
        return <MemoryExercise onComplete={handleExerciseComplete} />;
      }
      return <MatchingExercise onComplete={handleExerciseComplete} />;
    }

    if (exerciseType === "articulation") {
      return <SoundExercise onComplete={handleExerciseComplete} />;
    }

    return <MatchingExercise onComplete={handleExerciseComplete} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/exercises" className="text-[var(--primary)] hover:underline">
            Вернуться к каталогу
          </Link>
        </div>
      </div>
    );
  }

  // Экран перерыва для СДВГ
  if (showBreak) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coffee size={48} className="text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Время перерыва!</h1>
          <p className="text-[var(--muted-foreground)] mb-6">
            Отличная работа! Сделайте паузу и отдохните.
          </p>
          
          <div className="text-6xl font-bold text-[var(--primary)] mb-8">
            {breakTimeLeft}
          </div>
          
          <p className="text-sm text-[var(--muted-foreground)]">
            Перерыв закончится автоматически
          </p>
        </motion.div>
      </div>
    );
  }

  // Экран наград
  if (completed && result) {
    return (
      <div className="min-h-screen p-4 max-w-2xl mx-auto flex flex-col items-center justify-center">
        <motion.div {...motionProps} className="w-full">
          <div className="text-center mb-8">
            <motion.div
              initial={shouldReduceMotion ? {} : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={shouldReduceMotion ? {} : { delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle size={48} className="text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Отличная работа!</h1>
            <p className="text-[var(--muted-foreground)]">
              Упражнение "{exercise?.title}" завершено
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <Trophy size={32} className="text-yellow-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-yellow-600">+{result.xp_earned}</div>
                <div className="text-sm text-yellow-700">XP получено</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Star size={32} className="text-blue-600 mx-auto mb-2" fill="currentColor" />
                <div className="text-3xl font-bold text-blue-600">+{Math.floor(result.xp_earned / 10)}</div>
                <div className="text-sm text-blue-700">Звезд</div>
              </div>
            </div>

            {result.level_info && (
              <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-xl p-4 text-white text-center mb-4">
                <div className="text-sm opacity-90 mb-1">Текущий уровень</div>
                <div className="text-2xl font-bold">{result.level_info.name}</div>
                <div className="text-sm opacity-90">{result.level_info.current_xp} XP</div>
                <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={shouldReduceMotion ? {} : { width: 0 }}
                    animate={{ width: `${result.level_info.progress_percent}%` }}
                    transition={shouldReduceMotion ? {} : { delay: 0.8, duration: 0.5 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}

            {result.new_badges?.length > 0 && (
              <div className="border-t pt-4">
                <div className="text-center text-sm font-medium mb-3 text-[var(--primary)]">
                  🎉 Новые достижения!
                </div>
                <div className="flex gap-2 justify-center">
                  {result.new_badges.map((badge: any) => (
                    <div key={badge.id} className="text-center">
                      <div className="text-3xl">{badge.icon}</div>
                      <div className="text-xs text-[var(--muted-foreground)] mt-1">{badge.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link to="/exercises">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => vibrateClick()}
                className="w-full py-4 rounded-xl text-white text-lg font-medium shadow-lg"
                style={{ background: `linear-gradient(135deg, var(--primary), var(--secondary))` }}
              >
                Продолжить обучение
              </motion.button>
            </Link>
            <Link to="/">
              <button className="w-full py-3 rounded-xl text-[var(--muted-foreground)] text-sm">
                На главную
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] p-4">
        <div className="flex items-center gap-3">
          <Link to={`/exercises/${id}`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-medium">{exercise?.title}</h1>
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <Clock size={14} />
              <span>{formatTime(timeElapsed)}</span>
              {shouldUseShortSessions && (
                <span className="text-orange-500 ml-2">
                  • Перерыв через {formatTime(ADHD_BREAK_INTERVAL - (timeElapsed % ADHD_BREAK_INTERVAL))}
                </span>
              )}
            </div>
          </div>
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: `${getCategoryColor(exercise?.type || '')}20` }}
          >
            {getCategoryIcon(exercise?.type || '')}
          </div>
        </div>
      </div>

      {/* Exercise Content */}
      <div className="flex-1">
        {renderExerciseComponent()}
      </div>
    </div>
  );
}
