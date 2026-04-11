import { motion } from "motion/react";
import { Play, Star, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router";

export default function Dashboard() {
  const recommendedExercises = [
    {
      id: 1,
      title: "Найди звук",
      category: "speech",
      difficulty: 2,
      progress: 3,
      total: 5,
      icon: "🗣️",
    },
    {
      id: 2,
      title: "Запомни картинки",
      category: "cognition",
      difficulty: 3,
      progress: 1,
      total: 5,
      icon: "🧠",
    },
    {
      id: 3,
      title: "Гимнастика для языка",
      category: "articulation",
      difficulty: 1,
      progress: 5,
      total: 5,
      icon: "👅",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "speech":
        return "var(--speech)";
      case "cognition":
        return "var(--cognition)";
      case "articulation":
        return "var(--articulation)";
      default:
        return "var(--primary)";
    }
  };

  return (
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-5"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-2xl shadow-lg">
            👧
          </div>
          <div>
            <h1 className="text-xl leading-tight mb-1">Привет, Маша!</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Готова учиться сегодня?
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
              45
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
              12
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
              7
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              Дней
            </div>
          </motion.div>
        </div>
      </div>

      {/* Continue Learning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-5"
      >
        <h2 className="mb-3 text-lg">Продолжить обучение</h2>
        <div
          className="bg-white rounded-xl p-5 shadow-lg relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
          }}
        >
          <div className="relative z-10">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-white mb-1 text-lg">Найди пару</h3>
            <p className="text-white text-opacity-90 mb-3 text-sm">
              Осталось 3 уровня
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
      </motion.div>

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
          {recommendedExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl p-4 shadow-md active:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${getCategoryColor(exercise.category)}20` }}
                >
                  {exercise.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 text-base truncate">{exercise.title}</h3>
                  <div className="flex items-center gap-1.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < exercise.difficulty ? "var(--warning)" : "none"}
                        style={{
                          color:
                            i < exercise.difficulty
                              ? "var(--warning)"
                              : "var(--border)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {exercise.progress}/{exercise.total} уровней
                  </div>
                </div>

                <Play
                  size={20}
                  className="flex-shrink-0"
                  style={{ color: getCategoryColor(exercise.category) }}
                />
              </div>
            </motion.div>
          ))}
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
