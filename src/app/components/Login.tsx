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
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Mascot */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-7xl mb-3"
          >
            🦉
          </motion.div>
          <h1 className="text-2xl mb-1" style={{ color: "var(--primary)" }}>
            НейроРазвитие
          </h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Развиваемся вместе, играя!
          </p>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-5">
          <h2 className="mb-3 text-base">Выберите роль</h2>
          <div className="flex gap-2.5">
            <button
              onClick={() => setRole("child")}
              className={`flex-1 p-3.5 rounded-xl border-2 transition-all ${
                role === "child"
                  ? "border-[var(--primary)] bg-[var(--primary)] bg-opacity-10"
                  : "border-gray-200 active:border-[var(--primary)]"
              }`}
            >
              <div className="text-2xl mb-1.5">👧</div>
              <div className="text-sm font-medium">Ребенок</div>
            </button>
            <button
              onClick={() => setRole("parent")}
              className={`flex-1 p-3.5 rounded-xl border-2 transition-all ${
                role === "parent"
                  ? "border-[var(--primary)] bg-[var(--primary)] bg-opacity-10"
                  : "border-gray-200 active:border-[var(--primary)]"
              }`}
            >
              <div className="text-2xl mb-1.5">👨‍👩‍👧</div>
              <div className="text-sm font-medium">Родитель</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-5 space-y-3.5">
          <div>
            <label className="block mb-1.5 text-sm">Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="w-full px-4 py-2.5 bg-[var(--input-background)] rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
            />
          </div>
          <div>
            <label className="block mb-1.5 text-sm">Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[var(--input-background)] rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            className="w-full py-3.5 rounded-xl text-white shadow-lg font-medium"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            }}
          >
            Войти
          </motion.button>

          <div className="text-center space-y-1.5">
            <a
              href="#"
              className="text-xs text-[var(--primary)] hover:underline block"
            >
              Забыли пароль?
            </a>
            <a
              href="#"
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] block"
            >
              Регистрация
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
