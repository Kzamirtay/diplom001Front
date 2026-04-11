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
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border)] shadow-lg z-50 safe-area-bottom">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-[60px] ${
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-gray-500"
                  }`}
                >
                  <Icon
                    size={22}
                    className={isActive ? "stroke-[2.5]" : "stroke-2"}
                  />
                  <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
