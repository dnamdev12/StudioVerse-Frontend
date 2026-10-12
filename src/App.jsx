import { Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import VerifyOtp from "./components/verify-otp";
import Dashboard from "./components/dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Studios from "./components/studios";
import StudioForm from "./components/studios/StudioForm";
import PlaceholderPage from "./components/layout/PlaceholderPage";
import { MENU_ITEMS } from "./components/layout/menu";

// Menu items that have real pages; the rest show a placeholder for now.
const BUILT_PAGES = ["/dashboard", "/studios"];

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/studios" element={<Studios />} />
          <Route path="/studios/create" element={<StudioForm key="create" />} />
          <Route path="/studios/:id/edit" element={<StudioForm key="edit" />} />
          {MENU_ITEMS.filter((item) => !BUILT_PAGES.includes(item.path)).map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<PlaceholderPage title={item.label} />}
            />
          ))}
        </Route>
      </Routes>
    </>
  );
}
