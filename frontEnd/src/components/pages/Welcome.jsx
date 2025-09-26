import React from "react";
import { motion } from "framer-motion";

export default function WelcomePage() {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h2>
      <p className="text-gray-700">This is your dashboard. Select an option from the sidebar to get started.</p>
    </motion.div>
  );
}
