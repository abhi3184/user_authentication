// ToastProvider.jsx
import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const ToastMessage = ({ message, type }) => {
  const isSuccess = type === "success";
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-md`}
      style={{
        background: isSuccess ? "#d4f5d4" : "#fcdada",
        color: isSuccess ? "#065f06" : "#a60000",
      }}
    >
      {isSuccess ? <FiCheckCircle size={20} /> : <FiXCircle size={20} />}
      <span className="font-medium">{message}</span>
    </motion.div>
  );
};

// Unified notify function
export const notify = {
  show: (response) => {
    // response should have { success: boolean, message: string }
    if (response.success) {
      toast.custom(() => <ToastMessage message={response.message} type="success" />);
    } else {
      toast.custom(() => <ToastMessage message={response.message} type="error" />);
    }
  },
};

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8} // spacing between toasts
      containerStyle={{ marginTop: 15,zIndex: 99999 }}
    />
  );
}
