import React, { useState, useEffect } from "react";
import axios from "axios";
import { notify } from "../../../utils/tostr";
import OtpInput from "../OtpInput";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function VerifyOTP({ userData }) {
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const navigate = useNavigate();
  const [localUserData, setLocalUserData] = useState({ email: "", mobile: "" });

  useEffect(() => {
    const savedData = localStorage.getItem("forgotPasswordData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setLocalUserData(parsed); // use local state
    } else if (userData) {
      setLocalUserData(userData); // fallback to prop
    }
  }, [userData]);

  useEffect(() => {
    const savedExpiry = localStorage.getItem("otpExpiry");
    if (savedExpiry) {
      const now = Math.floor(Date.now() / 1000);
      const remaining = parseInt(savedExpiry, 10) - now;
      setTimeLeft(remaining > 0 ? remaining : 0);
    } else {
      const expiry = Math.floor(Date.now() / 1000) + 300;
      localStorage.setItem("otpExpiry", expiry);
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (emailOtp.length !== 6 || mobileOtp.length !== 6) {
      notify.show({ success: false, message: "Enter 6-digit OTPs" });
      return;
    }

    try {
      setLoading(true);
      // Verify Email OTP
      const emailRes = await axios.post("http://localhost:8000/forgot-password/verify-email-otp", {
        email: localUserData.email,
        otp: emailOtp,
      });
      if (!emailRes.data.success) throw new Error("Email OTP invalid");

      // Verify Mobile OTP
      const mobileRes = await axios.post("http://localhost:8000/forgot-password/verify-otp", {
        mobile: localUserData.mobile,
        otp: mobileOtp,
      });
      if (!mobileRes.data.success) throw new Error("Mobile OTP invalid");

      notify.show({ success: true, message: "Both OTPs Verified" });

      localStorage.removeItem("otpExpiry");
      navigate("/forgot-password/set-password");
    } catch (err) {
      notify.show({ success: false, message: err.message });
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
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Verify OTPs</h2>

        <form onSubmit={handleVerify} className="space-y-4 text-center">
          {/* Email OTP */}
          <div className="mb-4">
            <label className="text-left block text-sm font-medium text-gray-700 mb-1">
              Email OTP
            </label>
            <OtpInput
              length={6}
              value={emailOtp}
              onChange={setEmailOtp}
              inputStyle="w-12 h-12 mx-1 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 bg-gray-50"
            />
          </div>

          {/* Mobile OTP */}
          <div className="mb-4">
            <label className="text-left block text-sm font-medium text-gray-700 mb-1">
              Mobile OTP
            </label>
            <OtpInput
              length={6}
              value={mobileOtp}
              onChange={setMobileOtp}
              inputStyle="w-12 h-12 mx-1 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 bg-gray-50"
            />
          </div>

          {/* Timer */}
          <p className="text-sm text-gray-500 mt-2">
            OTP expires in: <span className="font-semibold">{formatTime(timeLeft)}</span>
          </p>

          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              disabled={loading || timeLeft === 0}
              className="cursor-pointer w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTPs"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="cursor-pointer w-full py-3 rounded-xl font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
