import React, { useState } from "react";
import axios from "axios";
import { notify } from "../../../utils/tostr";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SendMobileOTP({ userData = {}, setUserData }) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ mobile: false });
  const navigate = useNavigate();

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("registrationData");
    return saved ? JSON.parse(saved) : {};
  });

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, userData[name]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const validateField = (name, value) => {
    let message = "";
    if (name === "mobile") {
      if (!value || !value.trim()) message = "Mobile is required";
      else if (!/^\d{10}$/.test(value)) message = "Mobile must be 10 digits";
    }
    setErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ mobile: true });

    if (!validateField("mobile", userData.mobile)) return;

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/registration/send-mobile-otp", {
        mobile: userData.mobile,
      });
      if (res.data.success) {
        notify.show({ success: true, message: "OTP sent!" });
        const expiry = Math.floor(Date.now() / 1000) + 300;
        localStorage.setItem("mobileOtpExpiry", expiry);
        navigate("/register/verify-mobile-otp");
        localStorage.setItem("registrationData", JSON.stringify(userData));

      } else {
        notify.show({ success: false, message: res.data.message });
      }
    } catch (err) {
      let message = "Server error. Please try again.";
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      notify.show({ success: false, message });
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
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Send Mobile OTP
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile
            </label>
            <motion.input
              name="mobile"
              value={userData.mobile || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter mobile"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.1 }}
              className={`${inputClass} ${touched.mobile && errors.mobile ? "border-red-400" : "border-gray-300"
                }`}
            />
            {touched.mobile && errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
