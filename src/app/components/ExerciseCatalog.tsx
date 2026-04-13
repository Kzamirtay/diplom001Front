import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, Lock, Clock, Loader2 } from "lucide-react";
import { exercisesAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router";

type Category = "all" | "speech" | "cognitive" | "articulation";

interface Exercise {
  id: number;
  title: string;
  type: string;
  difficulty_level: number;
  duration_minutes?: number;
  description?: string;
  is_completed?: boolean;
  last_score?: number;
}

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export default function ExerciseCatalog() {
  const { currentChild } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryMap: Record<string, { name: string; icon: string; color: string }> = {
    speech: { name: "Речь", icon: "🗣️", color: "var(--speech)" },
    cognitive: { name: "Когниция", icon: "🧠", color: "var(--cognition)" },
    articulation: { name: "Артикуляция", icon: "👅", color: "var(--articulation)" },
  };

  const allCategories = [
    { id: "all" as Category, name: "Все", icon: "✨", color: "var(--primary)" },
    { id: "speech" as Category, name: "Речь", icon: "🗣️", color: "var(--speech)" },
    { id: "cognitive" as Category, name: "Когниция", icon: "🧠", color: "var(--cognition)" },
    { id: "articulation" as Category, name: "Артикуляция", icon: "👅", color: "var(--articulation)" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Загружаем категории
      const catRes = await exercisesAPI.getCategories();
      setCategories(catRes.data);
      
      // Загружаем упражнения
      const params: any = {};
      if (selectedCategory !== "all") {
        params.type = selectedCategory;
      }
      if (selectedDifficulty !== null) {
        params.difficulty = selectedDifficulty;
      }
      
      const exRes = await exercisesAPI.getAll(params);
      setExercises(exRes.data.data || exRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка загрузки упражнений");
    } finally {
      setLoading(false);
    }
  };

  // Перезагружаем при изменении фильтров
  useEffect(() => {
    if (!loading) {
      loadData();
    }
  }, [selectedCategory, selectedDifficulty]);

  const getCategoryColor = (type: string) => {
    return categoryMap[type]?.color || "var(--primary)";
  };

  const getCategoryIcon = (type: string) => {
    return categoryMap[type]?.icon || "🎯";
  };

  const getCategoryName = (type: string) => {
    return categoryMap[type]?.name || type;
  };

  const filteredExercises = exercises.filter((exercise) => {
    const categoryMatch = selectedCategory === "all" || exercise.type === selectedCategory;
    const difficultyMatch = selectedDifficulty === null || exercise.difficulty_level === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto">
      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm"
        >
          {error}
          <button onClick={loadData} className="ml-2 underline">Повторить</button>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <h1 className="text-2xl mb-1">Упражнения</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Выбери упражнение для тренировки
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="mb-5">
        <h3 className="mb-2 text-base">Категория</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {allCategories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm ${
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
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="mb-5">
        <h3 className="mb-2 text-base">Сложность</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDifficulty(null)}
            className={`px-3 py-2 rounded-xl transition-all text-sm flex-shrink-0 ${
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
              className={`px-3 py-2 rounded-xl flex items-center gap-1 transition-all text-sm flex-shrink-0 ${
                selectedDifficulty === level
                  ? "bg-[var(--primary)] text-white shadow-lg"
                  : "bg-white text-gray-700 shadow-md"
              }`}
            >
              <Star
                size={14}
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
      <div className="space-y-2.5">
        {filteredExercises.map((exercise, index) => {
          const isLocked = exercise.difficulty_level > 3 && !exercise.is_completed;
          const progress = exercise.is_completed ? 100 : (exercise.last_score ? Math.round(exercise.last_score * 10) : 0);
          
          return (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              className={`bg-white rounded-xl p-4 shadow-md relative ${
                isLocked
                  ? "opacity-60"
                  : "active:shadow-lg transition-shadow cursor-pointer"
              }`}
            >
              <Link to={isLocked ? "#" : `/exercises/${exercise.id}`} className="block">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                    style={{
                      backgroundColor: `${getCategoryColor(exercise.type)}20`,
                    }}
                  >
                    {isLocked ? <Lock size={24} /> : getCategoryIcon(exercise.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 text-base truncate">{exercise.title}</h3>

                    {/* Difficulty */}
                    <div className="flex items-center gap-1 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={
                            i < exercise.difficulty_level ? "var(--warning)" : "none"
                          }
                          style={{
                            color:
                              i < exercise.difficulty_level
                                ? "var(--warning)"
                                : "var(--border)",
                          }}
                        />
                      ))}
                      <Clock
                        size={12}
                        className="ml-1.5"
                        style={{ color: "var(--muted-foreground)" }}
                      />
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {exercise.duration_minutes || 10} мин
                      </span>
                    </div>

                    {/* Progress */}
                    {!isLocked && progress > 0 && (
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-[var(--muted-foreground)]">
                            Прогресс
                          </span>
                          <span className="text-[var(--muted-foreground)]">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: getCategoryColor(exercise.type),
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {isLocked && (
                      <div className="text-xs text-[var(--muted-foreground)]">
                        Доступно после прохождения предыдущих
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="mb-1 text-base">Упражнения не найдены</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Попробуйте изменить фильтры
          </p>
        </motion.div>
      )}
    </div>
  );
}
