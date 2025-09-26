import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { notify } from "../../../utils/tostr";

export default function SendOTP({ userData, setUserData }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(userData.email || "");
  const [mobile, setMobile] = useState(userData.mobile || "");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const inputClass = "w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-300";

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setTouched({ email: true, mobile: true });

    if (!email || !mobile) {
      notify.show({ success: false, message: "Email & Mobile are required" });
      return;
    }

    try {
      setLoading(true);

      const emailRes = await axios.post("http://localhost:8000/forgot-password/send-email-otp", { email });
      if (!emailRes.data.success) throw new Error(emailRes.data.message);

      const mobileRes = await axios.post("http://localhost:8000/forgot-password/send-mobile-otp", { mobile });
      if (!mobileRes.data.success) throw new Error(mobileRes.data.message);

      const userDataToStore = { email, mobile };
      setUserData(userDataToStore);
      notify.show({ success: true, message: "OTP sent to both email & mobile" });
      navigate("/forgot-password/verify-otp");
      localStorage.setItem("forgotPasswordData", JSON.stringify(userDataToStore));
      localStorage.setItem("otpExpiry", emailRes.data.expires_at);
    } catch (err) {
      notify.show({ success: false, message: err.message || "Failed to send OTPs" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSend} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="Enter email"
              className={`${inputClass} ${touched.email && !email ? "border-red-400" : "border-gray-300"}`}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.1 }}
            />
            {touched.email && !email && (
              <p className="text-red-500 text-sm mt-1">Email is required</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
            <motion.input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onBlur={() => handleBlur("mobile")}
              placeholder="Enter mobile number"
              className={`${inputClass} ${touched.mobile && !mobile ? "border-red-400" : "border-gray-300"}`}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.1 }}
            />
            {touched.mobile && !mobile && (
              <p className="text-red-500 text-sm mt-1">Mobile number is required</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTPs"}
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
