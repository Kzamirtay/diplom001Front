import { RouterProvider } from "react-router";
import { AuthProvider } from "../contexts/AuthContext";
import { AccessibilityProvider } from "../contexts/AccessibilityContext";
import { router } from "./routes";
import "../styles/accessibility.css";

export default function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <RouterProvider router={router} />
      </AccessibilityProvider>
    </AuthProvider>
  );
}
