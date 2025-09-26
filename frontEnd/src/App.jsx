import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "./components/auth/UserLogin";
import UserRegistration from "./components/auth/userRegistration/UserRegistration";
import ForgotPasswordRoutes from "./components/auth/forgotPassword/ForgotPassRoutes";
import Layout from "./components/layout/Layout";
import WelcomePage from "./components/pages/Welcome";
import UserList from "./components/pages/UserList";
import Settings from "./components/pages/Setting";
import 'react-toastify/dist/ReactToastify.css';
import ToastProvider from './utils/tostr';
import ProtectedRoute from './utils/ProtectedRoutes';

function App() {
  return (
    <>
      {/* ToastProvider must wrap the app, not be inside Routes */}
      <ToastProvider />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register/*" element={<UserRegistration />} />
        <Route path="/forgot-password" element={<ForgotPasswordRoutes />} />

        {/* Dashboard with nested routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<Layout />} >
            <Route path="welcome" element={<WelcomePage />} />
            <Route path="users" element={<UserList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
