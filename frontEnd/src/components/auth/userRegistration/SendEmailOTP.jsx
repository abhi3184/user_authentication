import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { notify } from "../../../utils/tostr";
import { useNavigate } from "react-router-dom";

export default function SendEmailOTP({ userData, setUserData }) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ username: false, email: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      if (!value.trim()) setErrors((prev) => ({ ...prev, email: "Email required" }));
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        setErrors((prev) => ({ ...prev, email: "Invalid email" }));
      else setErrors((prev) => ({ ...prev, email: "" }));
    }

    if (name === "username") {
      if (!value.trim()) setErrors((prev) => ({ ...prev, username: "Username required" }));
      else setErrors((prev) => ({ ...prev, username: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!userData.username?.trim()) errs.username = "Username required";
    if (!userData.email?.trim()) errs.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
      errs.email = "Invalid email";
    return errs;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ username: true, email: true });
    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/registration/send-email-otp", {
        email: userData.email,
      });

      if (res.data.success) {
        notify.show({ success: true, message: res.data.message });
        navigate("/register/verify-email-otp");
        const expiry = Math.floor(Date.now() / 1000) + 300;
        localStorage.setItem("emailOtpExpiry", expiry);
        localStorage.setItem("registrationData", JSON.stringify(userData));
      } else {
        notify.show({ success: false, message: res.data.message });
      }
    } catch {
      notify.show({ success: false, message: "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full px-4 py-3 rounded-xl border bg-gray-50
    focus:outline-none focus:ring-2 focus:ring-blue-400
    focus:border-blue-500 transition-all duration-300
  `;

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
          Send Email OTP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <motion.input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter username"
              className={`${inputClass} ${touched.username && errors.username ? "border-red-400" : "border-gray-300"
                }`}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.1 }}
            />
            {touched.username && errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <motion.input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter email"
              className={`${inputClass} ${touched.email && errors.email ? "border-red-400" : "border-gray-300"
                }`}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.1 }}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
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
