import React, { useState, useEffect } from "react";
import axios from "axios";
import { notify } from "../../../utils/tostr";
import OtpInput from "../OtpInput";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function VerifyMobileOTP({ userData, onNext }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const navigate = useNavigate();

  // Restore OTP expiry from localStorage
  useEffect(() => {
    const savedExpiry = localStorage.getItem("mobileOtpExpiry");
    if (savedExpiry) {
      const now = Math.floor(Date.now() / 1000);
      const remaining = parseInt(savedExpiry, 10) - now;
      setTimeLeft(remaining > 0 ? remaining : 0);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(
      () => setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1)),
      1000
    );
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      notify.show({ success: false, message: "OTP must be 6 digits" });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/registration/verify-mobile-otp", {
        mobile: userData.mobile,
        otp,
      });
      if (res.data.success) {
        notify.show({ success: true, message: "Mobile verified!" });
        localStorage.removeItem("mobileOtpExpiry"); // clear expiry
        navigate("/register/set-password");
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
          Verify Mobile OTP
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
              onClick={() => navigate("/")}
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
