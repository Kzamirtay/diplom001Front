import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Star, Clock, Play, Trophy, ChevronRight } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router";
import { exercisesAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface Exercise {
  id: number;
  title: string;
  description: string;
  type: string;
  difficulty_level: number;
  duration_minutes: number;
  content: any;
  category?: {
    name: string;
  };
}

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentChild } = useAuth();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadExercise();
    }
  }, [id]);

  const loadExercise = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await exercisesAPI.getById(Number(id));
      setExercise(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка загрузки упражнения");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    if (!currentChild || !exercise) {
      setError("Выберите ребенка для начала упражнения");
      return;
    }

    setStarting(true);
    try {
      const res = await exercisesAPI.startSession(exercise.id, currentChild.id);
      setSession(res.data.session);
      // Переходим к прохождению упражнения
      navigate(`/exercises/${exercise.id}/play`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка начала упражнения");
    } finally {
      setStarting(false);
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case "speech":
        return "var(--speech)";
      case "cognitive":
        return "var(--cognition)";
      case "articulation":
        return "var(--articulation)";
      default:
        return "var(--primary)";
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "speech":
        return "🗣️";
      case "cognitive":
        return "🧠";
      case "articulation":
        return "👅";
      default:
        return "🎯";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)] mb-4">Упражнение не найдено</p>
          <Link to="/exercises" className="text-[var(--primary)] hover:underline">
            Вернуться к каталогу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div 
        className="p-4 pb-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${getCategoryColor(exercise.type)}, var(--secondary))`,
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Link to="/exercises" className="text-white/80 hover:text-white">
            <ArrowLeft size={24} />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-5xl mb-3">{getCategoryIcon(exercise.type)}</div>
          <h1 className="text-2xl font-bold mb-2">{exercise.title}</h1>
          
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{exercise.duration_minutes || 10} мин</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={16} fill="currentColor" />
              <span>Сложность {exercise.difficulty_level}/5</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 shadow-md mb-4"
        >
          <h2 className="text-lg font-medium mb-2">Описание</h2>
          <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
            {exercise.description || "Описание упражнения отсутствует."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-md mb-4"
        >
          <h2 className="text-lg font-medium mb-3">Что вы получите</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Trophy size={16} className="text-yellow-600" />
              </div>
              <span>+{exercise.difficulty_level * 10} XP</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Star size={16} className="text-blue-600" />
              </div>
              <span>Улучшение навыков</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 shadow-md mb-4"
        >
          <h2 className="text-lg font-medium mb-3">Категория</h2>
          <div 
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{ 
              backgroundColor: `${getCategoryColor(exercise.type)}20`,
              color: getCategoryColor(exercise.type)
            }}
          >
            <span>{getCategoryIcon(exercise.type)}</span>
            <span>
              {exercise.type === 'speech' ? 'Речь' : 
               exercise.type === 'cognitive' ? 'Когнитивные навыки' : 'Артикуляция'}
            </span>
          </div>
        </motion.div>

        {/* Session Info */}
        {session && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4"
          >
            <p className="text-green-700 text-sm">
              ✓ Сессия начата! Готовьтесь к упражнению.
            </p>
          </motion.div>
        )}

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="fixed bottom-20 left-4 right-4 max-w-2xl mx-auto"
        >
          <button
            onClick={handleStart}
            disabled={starting || !currentChild}
            className="w-full py-4 rounded-xl text-white text-lg shadow-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${getCategoryColor(exercise.type)}, var(--secondary))`,
            }}
          >
            {starting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Начинаем...
              </>
            ) : (
              <>
                <Play size={20} fill="white" />
                {session ? "Продолжить" : "Начать упражнение"}
              </>
            )}
          </button>
          
          {!currentChild && (
            <p className="text-center text-xs text-red-500 mt-2">
              Выберите ребенка в профиле для начала
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
