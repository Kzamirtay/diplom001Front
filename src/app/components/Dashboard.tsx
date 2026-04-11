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
    <div className="min-h-screen p-6 pb-24">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-3xl shadow-lg">
            👧
          </div>
          <div>
            <h1 className="text-2xl">Привет, Маша!</h1>
            <p className="text-[var(--muted-foreground)]">
              Готова учиться сегодня?
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 text-center shadow-md"
          >
            <Star
              className="mx-auto mb-2"
              size={24}
              style={{ color: "var(--warning)" }}
            />
            <div className="text-2xl mb-1" style={{ color: "var(--warning)" }}>
              45
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">
              Звезды сегодня
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 text-center shadow-md"
          >
            <Award
              className="mx-auto mb-2"
              size={24}
              style={{ color: "var(--primary)" }}
            />
            <div
              className="text-2xl mb-1"
              style={{ color: "var(--primary)" }}
            >
              12
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">
              Достижений
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 text-center shadow-md"
          >
            <TrendingUp
              className="mx-auto mb-2"
              size={24}
              style={{ color: "var(--success)" }}
            />
            <div
              className="text-2xl mb-1"
              style={{ color: "var(--success)" }}
            >
              7
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">
              Дней подряд
            </div>
          </motion.div>
        </div>
      </div>

      {/* Continue Learning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <h2 className="mb-4">Продолжить обучение</h2>
        <div
          className="bg-white rounded-2xl p-6 shadow-lg relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
          }}
        >
          <div className="relative z-10">
            <div className="text-5xl mb-3">🎯</div>
            <h3 className="text-white mb-2">Найди пару</h3>
            <p className="text-white text-opacity-90 mb-4">
              Осталось 3 уровня
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[var(--primary)] px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg"
            >
              <Play size={20} />
              Продолжить
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Recommended Exercises */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2>Рекомендуем</h2>
          <Link
            to="/exercises"
            className="text-[var(--primary)] hover:underline"
          >
            Все упражнения
          </Link>
        </div>

        <div className="space-y-3">
          {recommendedExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${getCategoryColor(exercise.category)}20` }}
                >
                  {exercise.icon}
                </div>

                <div className="flex-1">
                  <h3 className="mb-1">{exercise.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
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
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Пройдено {exercise.progress}/{exercise.total} уровней
                  </div>
                </div>

                <Play
                  size={24}
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
        className="mt-8"
      >
        <Link to="/exercises">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full py-5 rounded-2xl text-white text-xl shadow-xl"
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
