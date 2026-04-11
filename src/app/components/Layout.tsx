import { Outlet, Link, useLocation } from "react-router";
import { Home, BookOpen, User, MessageCircle, Settings } from "lucide-react";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Главная" },
    { path: "/exercises", icon: BookOpen, label: "Упражнения" },
    { path: "/profile", icon: User, label: "Профиль" },
    { path: "/chat", icon: MessageCircle, label: "Чат" },
    { path: "/settings", icon: Settings, label: "Настройки" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? "text-[var(--primary)] scale-105"
                      : "text-gray-500 hover:text-[var(--primary)]"
                  }`}
                >
                  <Icon
                    size={24}
                    className={isActive ? "stroke-[2.5]" : "stroke-2"}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
