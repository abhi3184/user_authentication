import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { notify } from "../../../utils/tostr";
import axios from "axios"

export default function NewPasswordForm({ userData }) {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [touched, setTouched] = useState({ password: false, confirmPassword: false });
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState(() => {
        const saved = localStorage.getItem("registrationData");
        return saved ? JSON.parse(saved) : userData;
    });

    useEffect(() => {
        if (data) localStorage.setItem("registrationData", JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        if (userData && !data) {
            setData(userData);
        }
    }, [userData]);

    const validatePassword = (pwd) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(pwd);
    };

    const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            notify.show({ success: false, message: "Password must be 8+ chars, include uppercase, lowercase, number & symbol" });
            return;
        }
        if (password !== confirmPassword) {
            notify.show({ success: false, message: "Passwords do not match" });
            return;
        }
        try {
            setLoading(true);

            // Construct full payload
            const payload = {
                username: data.username,
                email: data.email,
                mobile: data.mobile,
                password: password
            };

            const res = await axios.post("http://localhost:8000/registration/postuser", payload);
            console.log(res)
            if (res.data.success) {
                notify.show({ success: true, message: "Registration successful!" });
                localStorage.removeItem("registrationData");
                navigate("/");
                
            } else {
                notify.show({ success: false, message: res.data.message || "Registration failed" });
            }
        } catch (err) {
            notify.show({ success: false, message: "Server error. Try again." });
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
                    Set New Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <motion.input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur("password")}
                            placeholder="Enter strong password"
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.1 }}
                            className={`${inputClass} ${touched.password && !validatePassword(password) ? "border-red-400" : "border-gray-300"}`}
                        />
                        {touched.password && !validatePassword(password) && (
                            <p className="text-red-500 text-xs mt-1">
                                Must be 8+ chars with uppercase, lowercase, number & symbol
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <motion.input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onBlur={() => handleBlur("confirmPassword")}
                            placeholder="Re-enter password"
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.1 }}
                            className={`${inputClass} ${touched.confirmPassword && password !== confirmPassword ? "border-red-400" : "border-gray-300"}`}
                        />
                        {touched.confirmPassword && password !== confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                        {loading ? "Saving Password... " : "Save Password"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="cusror-pointer w-full py-3 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
                    >
                        Back to Login
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
