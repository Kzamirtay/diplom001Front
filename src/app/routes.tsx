import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ParentDashboard from "./components/ParentDashboard";
import ExerciseCatalog from "./components/ExerciseCatalog";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Chat from "./components/Chat";
import ExerciseDetail from "./components/ExerciseDetail";
import ExercisePlayer from "./components/ExercisePlayer";

// Компонент защиты маршрутов
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Компонент для гостей (неавторизованных)
function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <GuestRoute />,
    children: [
      {
        index: true,
        Component: Login,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          { index: true, Component: Dashboard },
          { path: "parent", Component: ParentDashboard },
          { path: "exercises", Component: ExerciseCatalog },
          { path: "exercises/:id", Component: ExerciseDetail },
          { path: "exercises/:id/play", Component: ExercisePlayer },
          { path: "profile", Component: Profile },
          { path: "chat", Component: Chat },
          { path: "settings", Component: Settings },
        ],
      },
    ],
  },
]);
