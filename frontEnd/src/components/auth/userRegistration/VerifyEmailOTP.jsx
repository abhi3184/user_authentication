import React, { useState, useEffect } from "react";
import axios from "axios";
import { notify } from "../../../utils/tostr";
import OtpInput from "../OtpInput";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function VerifyEmailOTP({ userData, onNext }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const navigate = useNavigate();

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("registrationData");
    return saved ? JSON.parse(saved) : userData || {};
  });

  useEffect(() => {
    const savedExpiry = localStorage.getItem("emailOtpExpiry");
    if (savedExpiry) {
      const now = Math.floor(Date.now() / 1000);
      const remaining = parseInt(savedExpiry, 10) - now;
      setTimeLeft(remaining > 0 ? remaining : 0);
    } else {
      const expiry = Math.floor(Date.now() / 1000) + 300;
      localStorage.setItem("emailOtpExpiry", expiry);
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      notify.show({ success: false, message: "OTP must be 6 digits" });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/registration/verify-email-otp", {
        email: userData.email,
        otp,
      });
      if (res.data.success) {
        notify.show({ success: true, message: "Email verified!" });
        localStorage.removeItem("emailOtpExpiry");
        navigate("/register/send-mobile-otp");
      } else notify.show({ success: false, message: res.data.message });
    } catch {
      notify.show({ success: false, message: "Verification failed." });
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
          Verify Email OTP
        </h2>
        <form onSubmit={handleVerify} className="space-y-4 text-center">
          <OtpInput
            length={6}
            value={otp}
            onChange={setOtp}
            inputStyle="w-12 h-12 mx-1 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 bg-gray-50"
          />
          <p className="text-sm text-gray-500 mt-2">
            Expires in: <span className="font-semibold">{formatTime(timeLeft)}</span>
          </p>

          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              disabled={loading || timeLeft === 0}
              className="cursor-pointer w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              {loading ? "Verifying..." : "Verify OTP"}
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
