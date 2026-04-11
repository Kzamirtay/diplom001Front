import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ParentDashboard from "./components/ParentDashboard";
import ExerciseCatalog from "./components/ExerciseCatalog";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Chat from "./components/Chat";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "parent", Component: ParentDashboard },
      { path: "exercises", Component: ExerciseCatalog },
      { path: "profile", Component: Profile },
      { path: "chat", Component: Chat },
      { path: "settings", Component: Settings },
    ],
  },
]);
