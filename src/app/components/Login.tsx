import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"child" | "parent">("child");

  const handleLogin = () => {
    if (role === "parent") {
      navigate("/parent");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Mascot */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-8xl mb-4"
          >
            🦉
          </motion.div>
          <h1 className="text-3xl mb-2" style={{ color: "var(--primary)" }}>
            НейроРазвитие
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Развиваемся вместе, играя!
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="mb-4">Выберите роль</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setRole("child")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                role === "child"
                  ? "border-[var(--primary)] bg-[var(--primary)] bg-opacity-10"
                  : "border-gray-200 hover:border-[var(--primary)]"
              }`}
            >
              <div className="text-3xl mb-2">👧</div>
              <div className="font-medium">Ребенок</div>
            </button>
            <button
              onClick={() => setRole("parent")}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                role === "parent"
                  ? "border-[var(--primary)] bg-[var(--primary)] bg-opacity-10"
                  : "border-gray-200 hover:border-[var(--primary)]"
              }`}
            >
              <div className="text-3xl mb-2">👨‍👩‍👧</div>
              <div className="font-medium">Родитель</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="w-full px-4 py-3 bg-[var(--input-background)] rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div>
            <label className="block mb-2">Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[var(--input-background)] rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="w-full py-4 rounded-xl text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            }}
          >
            Войти
          </motion.button>

          <div className="text-center space-y-2">
            <a
              href="#"
              className="text-sm text-[var(--primary)] hover:underline block"
            >
              Забыли пароль?
            </a>
            <a
              href="#"
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] block"
            >
              Регистрация
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
