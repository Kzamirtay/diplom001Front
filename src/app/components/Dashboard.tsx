import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play, Star, Award, TrendingUp, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { progressAPI, exercisesAPI } from "../../services/api";

interface Exercise {
  id: number;
  title: string;
  type: string;
  difficulty_level: number;
  icon?: string;
}

interface Progress {
  total_xp: number;
  overall_level: {
    level: number;
    name: string;
  };
  skills: Array<{
    skill_name: string;
    xp: number;
    level: number;
  }>;
}

export default function Dashboard() {
  const { user, currentChild } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [recommendations, setRecommendations] = useState<Exercise[]>([]);
  const [stats, setStats] = useState({
    stars: 0,
    badges: 0,
    streak: 0,
  });

  useEffect(() => {
    if (currentChild) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentChild]);

  const loadDashboardData = async () => {
    if (!currentChild) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Загружаем прогресс ребенка
      const progressRes = await progressAPI.getProgress(currentChild.id);
      setProgress(progressRes.data);
      
      // Загружаем рекомендации
      const recRes = await progressAPI.getRecommendations(currentChild.id);
      setRecommendations(recRes.data.slice(0, 3));
      
      // Загружаем достижения для подсчета
      const achRes = await progressAPI.getAchievements(currentChild.id);
      
      // Рассчитываем статистику
      const totalStars = progressRes.data.skills?.reduce((sum: number, s: any) => sum + Math.floor(s.xp / 10), 0) || 0;
      
      setStats({
        stars: totalStars,
        badges: achRes.data.earned?.length || 0,
        streak: Math.floor(Math.random() * 7) + 1, // TODO: получать streak из API
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка загрузки данных");
    } finally {
      setLoading(false);
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
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!currentChild) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--muted-foreground)] mb-4">Выберите ребенка для продолжения</p>
          <Link to="/profile" className="text-[var(--primary)] hover:underline">
            Перейти в профиль
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto">
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm"
        >
          {error}
          <button onClick={loadDashboardData} className="ml-2 underline">Повторить</button>
        </motion.div>
      )}

      {/* Header */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-2xl shadow-lg">
            {currentChild?.avatar_url || "👧"}
          </div>
          <div>
            <h1 className="text-xl leading-tight mb-1">
              Привет, {currentChild?.first_name || "друг"}!
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Готов{currentChild?.first_name?.endsWith('а') ? 'а' : ''} учиться сегодня?
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-3 text-center shadow-md"
          >
            <Star
              className="mx-auto mb-1"
              size={20}
              style={{ color: "var(--warning)" }}
            />
            <div className="text-xl mb-0.5" style={{ color: "var(--warning)" }}>
              {stats.stars}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              Звезды
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-3 text-center shadow-md"
          >
            <Award
              className="mx-auto mb-1"
              size={20}
              style={{ color: "var(--primary)" }}
            />
            <div
              className="text-xl mb-0.5"
              style={{ color: "var(--primary)" }}
            >
              {stats.badges}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              Наград
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-3 text-center shadow-md"
          >
            <TrendingUp
              className="mx-auto mb-1"
              size={20}
              style={{ color: "var(--success)" }}
            />
            <div
              className="text-xl mb-0.5"
              style={{ color: "var(--success)" }}
            >
              {stats.streak}
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              Дней
            </div>
          </motion.div>
        </div>
      </div>

      {/* Level Progress */}
      {progress && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-5"
        >
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Уровень {progress.overall_level?.level}</span>
              <span className="text-sm text-[var(--muted-foreground)]">
                {progress.total_xp} XP
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress.overall_level?.progress_percent || 0}%` }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary))" }}
              />
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-2">
              {progress.overall_level?.name}
            </p>
          </div>
        </motion.div>
      )}

      {/* Continue Learning */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-5"
        >
          <h2 className="mb-3 text-lg">Продолжить обучение</h2>
          <Link to={`/exercises/${recommendations[0]?.id}`}>
            <div
              className="bg-white rounded-xl p-5 shadow-lg relative overflow-hidden cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
              }}
            >
              <div className="relative z-10">
                <div className="text-4xl mb-2">{getCategoryIcon(recommendations[0]?.type)}</div>
                <h3 className="text-white mb-1 text-lg">{recommendations[0]?.title}</h3>
                <p className="text-white text-opacity-90 mb-3 text-sm">
                  Уровень сложности: {recommendations[0]?.difficulty_level}/5
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[var(--primary)] px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg text-sm"
                >
                  <Play size={18} />
                  Продолжить
                </motion.button>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Recommended Exercises */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg">Рекомендуем</h2>
          <Link
            to="/exercises"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            Все
          </Link>
        </div>

        <div className="space-y-2.5">
          {recommendations.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl p-4 shadow-md active:shadow-lg transition-shadow cursor-pointer"
            >
              <Link to={`/exercises/${exercise.id}`} className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${getCategoryColor(exercise.type)}20` }}
                >
                  {getCategoryIcon(exercise.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 text-base truncate">{exercise.title}</h3>
                  <div className="flex items-center gap-1.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < exercise.difficulty_level ? "var(--warning)" : "none"}
                        style={{
                          color:
                            i < exercise.difficulty_level
                              ? "var(--warning)"
                              : "var(--border)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {exercise.type === 'speech' ? 'Речь' : 
                     exercise.type === 'cognitive' ? 'Когниция' : 'Артикуляция'}
                  </div>
                </div>

                <Play
                  size={20}
                  className="flex-shrink-0"
                  style={{ color: getCategoryColor(exercise.type) }}
                />
              </Link>
            </motion.div>
          ))}
          
          {recommendations.length === 0 && (
            <p className="text-center text-[var(--muted-foreground)] py-8">
              Загрузите упражнения в панели администратора
            </p>
          )}
        </div>
      </div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6"
      >
        <Link to="/exercises">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 rounded-xl text-white text-lg shadow-xl font-medium"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--secondary))",
            }}
          >
            Начать занятие ✨
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
