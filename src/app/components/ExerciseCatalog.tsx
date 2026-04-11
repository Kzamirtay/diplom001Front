import { useState } from "react";
import { motion } from "motion/react";
import { Star, Lock, Clock } from "lucide-react";

type Category = "all" | "speech" | "cognition" | "articulation";

export default function ExerciseCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null
  );

  const categories = [
    { id: "all" as Category, name: "Все", icon: "✨", color: "var(--primary)" },
    { id: "speech" as Category, name: "Речь", icon: "🗣️", color: "var(--speech)" },
    {
      id: "cognition" as Category,
      name: "Когниция",
      icon: "🧠",
      color: "var(--cognition)",
    },
    {
      id: "articulation" as Category,
      name: "Артикуляция",
      icon: "👅",
      color: "var(--articulation)",
    },
  ];

  const exercises = [
    {
      id: 1,
      title: "Найди звук",
      category: "speech" as Category,
      difficulty: 2,
      duration: 10,
      progress: 60,
      icon: "🗣️",
      locked: false,
    },
    {
      id: 2,
      title: "Запомни картинки",
      category: "cognition" as Category,
      difficulty: 3,
      duration: 15,
      progress: 20,
      icon: "🧠",
      locked: false,
    },
    {
      id: 3,
      title: "Гимнастика для языка",
      category: "articulation" as Category,
      difficulty: 1,
      duration: 5,
      progress: 100,
      icon: "👅",
      locked: false,
    },
    {
      id: 4,
      title: "Составь слово",
      category: "speech" as Category,
      difficulty: 3,
      duration: 12,
      progress: 0,
      icon: "🗣️",
      locked: false,
    },
    {
      id: 5,
      title: "Найди отличия",
      category: "cognition" as Category,
      difficulty: 2,
      duration: 10,
      progress: 40,
      icon: "🧠",
      locked: false,
    },
    {
      id: 6,
      title: "Повтори звук",
      category: "articulation" as Category,
      difficulty: 2,
      duration: 8,
      progress: 0,
      icon: "👅",
      locked: false,
    },
    {
      id: 7,
      title: "Сложные слова",
      category: "speech" as Category,
      difficulty: 5,
      duration: 20,
      progress: 0,
      icon: "🗣️",
      locked: true,
    },
    {
      id: 8,
      title: "Лабиринт внимания",
      category: "cognition" as Category,
      difficulty: 4,
      duration: 15,
      progress: 0,
      icon: "🧠",
      locked: true,
    },
  ];

  const getCategoryColor = (category: Category) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.color || "var(--primary)";
  };

  const filteredExercises = exercises.filter((exercise) => {
    const categoryMatch =
      selectedCategory === "all" || exercise.category === selectedCategory;
    const difficultyMatch =
      selectedDifficulty === null || exercise.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <div className="min-h-screen p-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl mb-2">Упражнения</h1>
        <p className="text-[var(--muted-foreground)]">
          Выбери упражнение для тренировки
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="mb-3">Категория</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? "text-white shadow-lg"
                  : "bg-white text-gray-700 shadow-md"
              }`}
              style={{
                backgroundColor:
                  selectedCategory === category.id
                    ? category.color
                    : undefined,
              }}
            >
              <span className="text-xl">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="mb-6">
        <h3 className="mb-3">Сложность</h3>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDifficulty(null)}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedDifficulty === null
                ? "bg-[var(--primary)] text-white shadow-lg"
                : "bg-white text-gray-700 shadow-md"
            }`}
          >
            Все
          </motion.button>
          {[1, 2, 3, 4, 5].map((level) => (
            <motion.button
              key={level}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-4 py-2 rounded-xl flex items-center gap-1 transition-all ${
                selectedDifficulty === level
                  ? "bg-[var(--primary)] text-white shadow-lg"
                  : "bg-white text-gray-700 shadow-md"
              }`}
            >
              <Star
                size={16}
                fill={
                  selectedDifficulty === level ? "white" : "var(--warning)"
                }
                style={{
                  color:
                    selectedDifficulty === level ? "white" : "var(--warning)",
                }}
              />
              {level}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="space-y-4">
        {filteredExercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={!exercise.locked ? { scale: 0.98 } : {}}
            className={`bg-white rounded-2xl p-5 shadow-md relative ${
              exercise.locked
                ? "opacity-60"
                : "hover:shadow-lg transition-shadow cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{
                  backgroundColor: `${getCategoryColor(exercise.category)}20`,
                }}
              >
                {exercise.locked ? <Lock size={28} /> : exercise.icon}
              </div>

              <div className="flex-1">
                <h3 className="mb-1">{exercise.title}</h3>

                {/* Difficulty */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={
                        i < exercise.difficulty ? "var(--warning)" : "none"
                      }
                      style={{
                        color:
                          i < exercise.difficulty
                            ? "var(--warning)"
                            : "var(--border)",
                      }}
                    />
                  ))}
                  <Clock
                    size={14}
                    className="ml-2"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {exercise.duration} мин
                  </span>
                </div>

                {/* Progress */}
                {!exercise.locked && exercise.progress > 0 && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--muted-foreground)]">
                        Прогресс
                      </span>
                      <span className="text-[var(--muted-foreground)]">
                        {exercise.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${exercise.progress}%`,
                          backgroundColor: getCategoryColor(exercise.category),
                        }}
                      />
                    </div>
                  </div>
                )}

                {exercise.locked && (
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Доступно после уровня 5
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="mb-2">Упражнения не найдены</h3>
          <p className="text-[var(--muted-foreground)]">
            Попробуйте изменить фильтры
          </p>
        </motion.div>
      )}
    </div>
  );
}
