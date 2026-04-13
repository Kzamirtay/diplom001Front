import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loggedUser = await login(formData.email, formData.password);
      
      // Перенаправляем в зависимости от роли пользователя из API
      const userRole = loggedUser?.role || loggedUser?.user?.role;
      if (userRole === "parent" || userRole === "specialist") {
        navigate("/parent");
      } else if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Неверный email или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  // Тестовые данные для быстрого входа
  const fillTestData = () => {
    setFormData({
      email: "parent@example.com",
      password: "password123",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🧠</div>
          <h1 className="text-2xl font-bold mb-1">НейроРазвитие</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Войдите, чтобы продолжить
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                placeholder="Введите email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Пароль</label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all"
                placeholder="Введите пароль"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Вход...
              </span>
            ) : (
              "Войти"
            )}
          </motion.button>
        </form>

        {/* Test Data Button */}
        <button
          type="button"
          onClick={fillTestData}
          className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Заполнить тестовые данные
        </button>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          Нет аккаунта?{" "}
          <button
            type="button"
            className="text-[var(--primary)] hover:underline font-medium"
          >
            Зарегистрироваться
          </button>
        </div>
      </motion.div>
    </div>
  );
}
