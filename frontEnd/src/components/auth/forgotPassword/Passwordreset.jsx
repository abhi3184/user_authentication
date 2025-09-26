import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { notify } from "../../../utils/tostr";

export default function SetNewPassword({ userData }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [loading, setLoading] = useState(false);

  const inputClass = `w-full px-4 py-3 rounded-xl border bg-gray-50
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
    transition-all duration-300`;

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("forgotPasswordData");
    return saved ? JSON.parse(saved) : userData || {};
  });

  useEffect(() => {
    if (data) localStorage.setItem("forgotPasswordData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (userData && !data) {
      setData(userData);
    }
  }, [userData]);;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      notify.show({ success: false, message: "Password must be at least 8 characters" });
      return;
    }
    if (password !== confirmPassword) {
      notify.show({ success: false, message: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put("http://localhost:8000/forgot-password/update-password", {
        email: data.email,
        password,
      });

      if (res.data.success) {
        notify.show({ success: true, message: "Password reset successfully!" });
        navigate("/login");
         localStorage.removeItem("forgotPasswordData");
        localStorage.removeItem("otpExpiry");
      } else {
        notify.show({ success: false, message: res.data.message || "Failed to reset password" });
      }
    } catch (err) {
      notify.show({ success: false, message: "Server error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Set New Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              placeholder="Enter new password"
              className={`${inputClass} ${touched.password && password.length < 8 ? "border-red-400" : "border-gray-300"}`}
            />
            {touched.password && password.length < 8 && (
              <p className="text-red-500 text-xs mt-1">
                Password must be at least 8 characters
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
              placeholder="Re-enter password"
              className={`${inputClass} ${touched.confirmPassword && password !== confirmPassword ? "border-red-400" : "border-gray-300"}`}
            />
            {touched.confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            {loading ? "Saving..." : "Save Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
          >
            Back to Login
          </button>
        </form>
      </motion.div>
    </div>
  );
}
