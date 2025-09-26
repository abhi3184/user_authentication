import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notify } from "../../utils/tostr";

export default function UserLogin({ onForgot, onVerify }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "", remember: false });
    const [touched, setTouched] = useState({ username: false, password: false });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const validate = () => {
        const errors = {};
        if (!form.username.trim()) {
            errors.username = "Username or Email is required";
        } else {

        }
        if (!form.password.trim()) errors.password = "Password is required";
        return errors;
    };

    const errors = validate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ username: true, password: true });

        if (Object.keys(errors).length === 0) {
            try {
                setLoading(true);

                const response = await axios.post("http://localhost:8000/auth/login", {
                    login: form.username, // can be username/email/mobile
                    password: form.password,
                });

                if (response.data.success) {
                    notify.show({ success: true, message: "Login successful! 🎉" });

                    // Clear form
                    setForm({ username: "", password: "", remember: false });
                    setTouched({ username: false, password: false });

                    // Save token or userData if needed
                    localStorage.setItem("token", response.data.token);

                    navigate("/dashboard");
                } else {
                    notify.show({ success: false, message: response.data.message || "Invalid credentials." });
                }
            } catch (err) {
                // Correct error handling
                notify.show({ success: false, message: err.response?.data?.detail || "Server error" });
            } finally {
                setLoading(false);
            }
        }
    };


    const inputClass = `
    w-full px-4 py-3 rounded-xl border bg-gray-50
    focus:outline-none focus:ring-2 focus:ring-blue-400
    focus:border-blue-500 transition-all duration-300
  `;


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <motion.div
                key="login"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
            >
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    NCCF Login
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username / Email
                        </label>
                        <motion.input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.1 }}
                            className={`${inputClass} ${touched.username && errors.username ? "border-red-400" : "border-gray-300"
                                }`}
                            placeholder="Enter username or email"
                        />
                        {touched.username && errors.username && (
                            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <motion.input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.1 }}
                            placeholder="Enter password"
                            className={`${inputClass} ${touched.password && errors.password ? "border-red-400" : "border-gray-300"
                                }`}
                        />
                        {touched.password && errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between mb-6 text-sm">
                        <label className="flex items-center space-x-2 text-gray-600">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={form.remember}
                                onChange={handleChange}
                                className="rounded accent-blue-600 cursor-pointer"
                            />
                            <span className="cursor-pointer">Remember me</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => navigate("/forgot-password")}
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Register */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="text-blue-600 hover:underline font-medium cursor-pointer"
                    >
                        Register
                    </button>
                </p>
            </motion.div>
        </div>
    );
}
