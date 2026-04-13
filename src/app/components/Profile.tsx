import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Award, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { progressAPI } from "../../services/api";

type Tab = "skills" | "achievements" | "history";

interface Skill {
  skill_name: string;
  skill_category: string;
  xp: number;
  level: number;
  progress_percent: number;
  accuracy_percent: number;
}

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  pivot?: {
    earned_at: string;
  };
}

interface HistoryDay {
  date: string;
  exercises: number;
  stars: number;
  status: "completed" | "partial" | "missed";
}

export default function Profile() {
  const { user, currentChild } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("skills");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [achievements, setAchievements] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<number[]>([]);
  const [history, setHistory] = useState<HistoryDay[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalXp: 0,
    level: 1,
    stars: 0,
    streak: 0,
    badges: 0,
  });

  useEffect(() => {
    if (currentChild) {
      loadProfileData();
    } else {
      setLoading(false);
    }
  }, [currentChild]);

  const loadProfileData = async () => {
    if (!currentChild) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Загружаем прогресс
      const progressRes = await progressAPI.getProgress(currentChild.id);
      const progressData = progressRes.data;
      
      setSkills(progressData.skills || []);
      setStats({
        totalXp: progressData.total_xp || 0,
        level: progressData.overall_level?.level || 1,
        stars: Math.floor((progressData.total_xp || 0) / 10),
        streak: 0, // TODO: получать из API
        badges: 0,
      });

      // Загружаем достижения
      const achievementsRes = await progressAPI.getAchievements(currentChild.id);
      const earned = achievementsRes.data.earned || [];
      const available = achievementsRes.data.available || [];
      
      setEarnedBadges(earned.map((b: Badge) => b.id));
      setAchievements([...earned, ...available]);
      setStats(prev => ({ ...prev, badges: earned.length }));

      // Загружаем историю
      const historyRes = await progressAPI.getHistory(currentChild.id, 30);
      // Преобразуем сессии в формат истории
      const sessionsData = historyRes.data.data || historyRes.data || [];
      setSessions(sessionsData);
      const historyMap = new Map<string, HistoryDay>();
      
      sessionsData.forEach((session: any) => {
        const date = session.start_time?.split('T')[0];
        if (date) {
          const existing = historyMap.get(date);
          if (existing) {
            existing.exercises += 1;
            existing.stars += Math.floor((session.xp_earned || 0) / 10);
          } else {
            historyMap.set(date, {
              date,
              exercises: 1,
              stars: Math.floor((session.xp_earned || 0) / 10),
              status: "completed",
            });
          }
        }
      });
      
      setHistory(Array.from(historyMap.values()).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
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
          <p className="text-[var(--muted-foreground)]">Выберите ребенка для просмотра профиля</p>
        </div>
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
          <button onClick={loadProfileData} className="ml-2 underline">Повторить</button>
        </motion.div>
      )}

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-white rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-3xl shadow-lg">
                {currentChild.avatar_url || "👧"}
              </div>
              <button className="absolute -bottom-0.5 -right-0.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-xs">
                ✏️
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl mb-0.5 truncate">{currentChild.first_name}</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                {new Date().getFullYear() - new Date(currentChild.birth_date).getFullYear()} лет
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div
                className="text-2xl mb-0.5"
                style={{ color: "var(--primary)" }}
              >
                Ур. {stats.level}
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                {stats.totalXp} XP
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2.5 bg-[var(--background)] rounded-lg">
              <div
                className="text-lg mb-0.5"
                style={{ color: "var(--warning)" }}
              >
                ★ {stats.stars}
              </div>
              <div className="text-[10px] text-[var(--muted-foreground)] leading-tight">
                Звезд
              </div>
            </div>
            <div className="text-center p-2.5 bg-[var(--background)] rounded-lg">
              <div
                className="text-lg mb-0.5"
                style={{ color: "var(--success)" }}
              >
                🔥 {stats.streak}
              </div>
              <div className="text-[10px] text-[var(--muted-foreground)] leading-tight">
                Дней
              </div>
            </div>
            <div className="text-center p-2.5 bg-[var(--background)] rounded-lg">
              <div
                className="text-lg mb-0.5"
                style={{ color: "var(--primary)" }}
              >
                🏆 {stats.badges}
              </div>
              <div className="text-[10px] text-[var(--muted-foreground)] leading-tight">
                Наград
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm flex-shrink-0 ${
            activeTab === "skills"
              ? "bg-[var(--primary)] text-white shadow-lg"
              : "bg-white text-gray-700 shadow-md"
          }`}
        >
          <TrendingUp size={16} />
          Навыки
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm flex-shrink-0 ${
            activeTab === "achievements"
              ? "bg-[var(--primary)] text-white shadow-lg"
              : "bg-white text-gray-700 shadow-md"
          }`}
        >
          <Award size={16} />
          Достижения
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm flex-shrink-0 ${
            activeTab === "history"
              ? "bg-[var(--primary)] text-white shadow-lg"
              : "bg-white text-gray-700 shadow-md"
          }`}
        >
          <Calendar size={16} />
          История
        </button>
      </div>

      {/* Skills Tab */}
      {activeTab === "skills" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {skills.length === 0 ? (
            <div className="text-center py-8 text-[var(--muted-foreground)]">
              Начните заниматься, чтобы развивать навыки!
            </div>
          ) : (
            skills.map((skill, index) => (
              <motion.div
                key={skill.skill_name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="flex-1 text-base">{skill.skill_name}</h3>
                  <span
                    className="text-lg font-medium"
                    style={{ color: getCategoryColor(skill.skill_category) }}
                  >
                    {skill.progress_percent}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress_percent}%` }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: getCategoryColor(skill.skill_category) }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-[var(--muted-foreground)]">
                  <span>Уровень {skill.level}</span>
                  <span>{skill.xp} XP</span>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-2.5"
        >
          {achievements.length === 0 ? (
            <div className="col-span-2 text-center py-8 text-[var(--muted-foreground)]">
              Достижения появятся по мере занятий
            </div>
          ) : (
            achievements.map((achievement, index) => {
              const isEarned = earnedBadges.includes(achievement.id);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl p-4 shadow-md text-center ${
                    !isEarned && "opacity-50"
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {isEarned ? achievement.icon : "🔒"}
                  </div>
                  <h3 className="mb-1.5 text-sm font-medium leading-tight">
                    {achievement.name}
                  </h3>
                  <p className="text-[10px] text-[var(--muted-foreground)] mb-1.5 leading-tight">
                    {achievement.description}
                  </p>
                  {isEarned && achievement.pivot?.earned_at && (
                    <div className="text-[10px] text-[var(--primary)]">
                      {new Date(achievement.pivot.earned_at).toLocaleDateString("ru-RU")}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2.5"
        >
          {history.length === 0 ? (
            <div className="text-center py-8 text-[var(--muted-foreground)]">
              История занятий появится здесь
            </div>
          ) : (
            history.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-3.5 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{
                      backgroundColor:
                        day.status === "completed"
                          ? "var(--success)"
                          : day.status === "partial"
                          ? "var(--warning)"
                          : "var(--border)",
                      color: day.status === "missed" ? "gray" : "white",
                    }}
                  >
                    {day.status === "completed"
                      ? "✓"
                      : day.status === "partial"
                      ? "◐"
                      : "○"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium mb-0.5">
                      {new Date(day.date).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                      })}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {day.exercises > 0
                        ? `${day.exercises} упр. • ${day.stars} звезд`
                        : "Пропущено"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
