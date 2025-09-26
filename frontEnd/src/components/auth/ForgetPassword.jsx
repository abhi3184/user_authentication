import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import NewPasswordForm from "../auth/userRegistration/Password";
import OtpInput from "./OtpInput"
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/tostr";

export default function ForgotPassword({ onBack }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    mobile: "",
    emailOtp: "",
    mobileOtp: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(1);
  const [showStep, setShowStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [resendloading, setResendLoading] = useState(false);
  const [verifing, setVerifing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // -------- Validation --------
  const validateStep1 = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Invalid email";

    if (!form.mobile.trim()) errors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile))
      errors.mobile = "Invalid mobile number";

    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!/^\d{6}$/.test(form.emailOtp)) errors.emailOtp = "Enter valid 6-digit OTP";
    if (!/^\d{6}$/.test(form.mobileOtp)) errors.mobileOtp = "Enter valid 6-digit OTP";
    return errors;
  };

  const validateStep3 = () => {
    const errors = {};
    if (!form.password.trim()) errors.password = "Password is required";
    else if (form.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    if (form.confirmPassword !== form.password)
      errors.confirmPassword = "Passwords do not match";

    return errors;
  };

  const errorsStep1 = validateStep1();
  const errorsStep2 = validateStep2();
  const errorsStep3 = validateStep3();

  // -------- Handlers --------
  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setTouched({ email: true, mobile: true });
    if (Object.keys(errorsStep1).length === 0) {
      try {
        setLoading(true);
        const emailRes = await axios.post("http://localhost:8000/forgot-password/send-email-otp", {
          email: form.email,
        });

        console.log("Email OTP Response:", emailRes.data);

        if (emailRes.data.success) {
          const expireAt = emailRes.data.expires_at * 1000;
          const now = Date.now();
          const secondsLeft = Math.max(Math.floor((expireAt - now) / 1000), 0);

          setTimeLeft(secondsLeft);
          setStep(2);
        } else {
          notify.show({ success: false, message:mobileRes.data.message});
          return;
        }
        // ✅ 2️⃣ Mobile OTP
        const mobileRes = await axios.post("http://localhost:8000/forgot-password/send-mobile-otp", {
          mobile: form.mobile,
        });

        if (!mobileRes.data.success) {
          notify.show({ success: false, message:mobileRes.data.message});
          return;
        }
        notify.show({ success: true, message:"OTP sent to both email & mobile"});
        setStep(2);
      } catch (err) {
        notify.show({ success: false, message:err.response?.data?.message || "Failed to send OTPs"});
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mm = m < 10 ? `0${m}` : m;
    const ss = s < 10 ? `0${s}` : s;
    return `${mm}:${ss}`;
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setTouched({ emailOtp: true, mobileOtp: true });

    if (form.emailOtp.length !== 6) {
      notify.show({ success: false, message:"Email OTP must be 6 digits"});
      return;
    }
    if (form.mobileOtp.length !== 6) {
      notify.show({ success: false, message:"Mobile OTP must be 6 digits"});
      return;
    }

    if (Object.keys(errorsStep2).length === 0) {
      try {
        setVerifing(true);

        // Email OTP verify
        const emailRes = await axios.post("http://localhost:8000/forgot-password/verify-email-otp", {
          email: form.email,
          otp: form.emailOtp,
        });

        if (!emailRes.data.success) {
          notify.show({ success: false, message:emailRes.data.message});
          return
        }

        // Mobile OTP verify
        const mobileRes = await axios.post("http://localhost:8000/forgot-password/verify-otp", {
          mobile: form.mobile,
          otp: form.mobileOtp,
        });

        if (!emailRes.data.success) {
          notify.show({ success: false, message:"Email OTP is invalid"});
          return
        }

        if (!mobileRes.data.success) {
          notify.show({ success: false, message:"Mobile OTP is invalid"});
          return
        }

        if (emailRes.data.success && mobileRes.data.success) {
          notify.show({ success: true, message:"Both OTPs Verified ✅"});
          setStep(3);
        }

      } catch (err) {
        notify.show({ success: false, message:"Verification failed"});
      } finally {
        setVerifing(false);
      }
    }
  };


  const handleSavePassword = async (payload) => {
    try {
      const response = await fetch("http://localhost:8000/forgot-password/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Password reset failed");
      }

      const data = await response.json();
      notify.show({ success: true, message:"Password reset successfully! You can now log in."});
      console.log("✅ Password Reset:", data);
      if (onBack) onBack();
      navigate("/login");
    } catch (error) {
      notify.show({ success: false, message:error.message});
    }
  };



  const handleResendEmailOTP = async () => {
    try {
      setResendLoading(true);
      setForm((prev) => ({ ...prev, emailOtp: "", mobileOtp: "" }));
      const response = await axios.post(
        "http://localhost:8000/forgot-password/resend-email-otp",
        { email: form.email }
      );

      if (response.data.success) {
        notify.show({ success: true, message:response.data.message});
        const expireAt = response.data.expires_at * 1000;
        const now = Date.now();
        const secondsLeft = Math.max(Math.floor((expireAt - now) / 1000), 0);
        setTimeLeft(secondsLeft); // restart countdown
      } else {
        notify.show({ success: false, message:response.data.message || "Failed to resend OTP"})
      }
    } catch (err) {
        notify.show({ success: false, message:"Failed to resend OTP. Try again."})
    } finally {
      setResendLoading(false);
    }
  };
  // -------- UI --------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 px-4">
      <AnimatePresence
        mode="wait"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        onExitComplete={() => setShowStep(step)}
      >
        {/* Step 1 - Enter Email + Mobile */}
        {showStep === 1 && step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/50"
          >
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 mb-6">
              Forgot Password
            </h2>
            <form onSubmit={handleSubmitStep1}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border ${touched.email && errorsStep1.email
                    ? "border-red-400"
                    : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-300`}
                  placeholder="Enter email"
                />
                {touched.email && errorsStep1.email && (
                  <p className="mt-1 text-xs text-red-600">{errorsStep1.email}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border ${touched.mobile && errorsStep1.mobile
                    ? "border-red-400"
                    : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-pink-300`}
                  placeholder="Enter mobile number"
                />
                {touched.mobile && errorsStep1.mobile && (
                  <p className="mt-1 text-xs text-red-600">{errorsStep1.mobile}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full py-3 rounded-xl font-semibold shadow-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-all disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="cursor-pointer mt-4 w-full py-2 rounded-xl font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              >
                Back to Login
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 2 - Verify OTPs */}
        {showStep === 2 && step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-white/50"
          >
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-500 to-cyan-500 mb-6">
              Verify OTPs
            </h2>
            <form onSubmit={handleSubmitStep2}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email OTP
                </label>
                <OtpInput
                  length={6}
                  value={form.emailOtp}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, emailOtp: val }))
                  }
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile OTP
                </label>
                <OtpInput
                  length={6}
                  value={form.mobileOtp}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, mobileOtp: val }))
                  }
                />
              </div>

              {timeLeft !== 0 && (
                <p className="text-center text-sm text-gray-500 mb-2 mt-2">
                  OTP will expire in: <span className="font-semibold">{formatTime(timeLeft)}</span>
                </p>
              )}


              {timeLeft === 0 && (
                <p className="text-red-500 text-center text-sm mt-2 mb-2">
                  OTP expired. Please resend.
                </p>
              )}

              <button
                type="submit"
                disabled={verifing}
                className="cursor-pointer w-full py-3 rounded-xl font-semibold shadow-md bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 text-white hover:opacity-90 transition-all disabled:opacity-60"
              >
                {verifing ? "Verifying..." : "Verify OTPs"}
              </button>
              
              {timeLeft === 0 && (
                <button
                  onClick={handleResendEmailOTP}
                  type="button"
                  className={`mt-3 cursor-pointer w-full py-2 rounded-xl font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all
                  ${resendloading || timeLeft > 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                >
                  {resendloading ? "Sending..." : "Resend OTP"}
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="cursor-pointer mt-4 w-full py-2 rounded-xl font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
              >
                Back to Login
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 3 - Reset Password */}
        {step === 3 && (
          <NewPasswordForm
            userData={{ email: form.email, mobile: form.mobile }}
            onSubmit={handleSavePassword}
            onBack={() => setStep(1)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
