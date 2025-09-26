import React from "react";
import { motion } from "framer-motion";

export default function Settings() {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Settings</h2>
      <p className="text-gray-700">Here you can add settings options or forms.</p>
    </motion.div>
  );
}
