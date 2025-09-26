import React, { useEffect, useState,useRef  } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash } from "react-icons/fi";
import { notify } from "../../utils/tostr";
import api from "../../api/index"

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const didFetch = useRef(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("http://localhost:8000/user/users");
      setUsers(response.data);
    } catch (err) {
      const message = err.response?.data?.detail || err.message || "Server error";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didFetch.current) return; // Prevent double fetch in Strict Mode
    fetchUsers();
    didFetch.current = true;
  }, []);

  // Edit user
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setErrors({});
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    try {
      await api.put(
        `http://localhost:8000/user/updateUser/${selectedUser.id}`,
        selectedUser
      );
      fetchUsers();
      setIsEditOpen(false);
    } catch (err) {
    }
  };

  // Delete user
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`http://localhost:8000/user/deleteUser/${selectedUser.id}`);
      notify.show({ success: true, message: "User deleted successfully" });
      fetchUsers();
      setIsDeleteOpen(false);
    } catch (err) {
    }
  };

  // Validate form
  const validateForm = () => {
    const tempErrors = {};
    if (!selectedUser.username?.trim()) tempErrors.username = "Username is required";
    else if (selectedUser.username.length < 3) tempErrors.username = "Username must be at least 3 characters";

    if (!selectedUser.email?.trim()) tempErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedUser.email)) tempErrors.email = "Enter a valid email";

    if (!selectedUser.mobile?.trim()) tempErrors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(selectedUser.mobile)) tempErrors.mobile = "Enter a valid 10-digit mobile number";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  return (
    <div className="flex flex-col items-center justify-start p-2 w-full h-full">
      <div className="w-full max-w-6xl flex-1 overflow-auto rounded-xl shadow-md bg-white border border-gray-200">
        <div className="h-full overflow-y-auto">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-blue-100 text-blue-900 sticky top-0 z-10">
              <tr className="h-10">
                <th className="px-3 text-left font-semibold">ID</th>
                <th className="px-3 text-left font-semibold">Name</th>
                <th className="px-3 text-left font-semibold">Email</th>
                <th className="px-3 text-left font-semibold">Phone</th>
                <th className="px-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">Loading...</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="even:bg-gray-50 odd:bg-white hover:bg-blue-50 transition-colors cursor-pointer h-10"
                    >
                      <td className="px-3 font-medium text-gray-800">{user.id}</td>
                      <td className="px-3 text-gray-700">{user.username}</td>
                      <td className="px-3 text-gray-600">{user.email}</td>
                      <td className="px-3 text-gray-600">{user.mobile}</td>
                      <td className="px-3 py-1 flex items-center justify-center space-x-2">
                        <button
                          className="cursor-pointer p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 shadow-sm transition"
                          title="Edit"
                          onClick={() => handleEditClick(user)}
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          className="cursor-pointer p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 shadow-sm transition"
                          title="Delete"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <FiTrash size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <motion.div
              className="bg-white rounded-2xl p-5 w-full max-w-md shadow-lg relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Edit User</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Username</label>
                  <input
                    type="text"
                    value={selectedUser?.username || ""}
                    onChange={(e) => {
                      setSelectedUser({ ...selectedUser, username: e.target.value });
                      if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none ${errors.username ? "border-red-400 focus:ring-red-300" : "focus:ring-blue-400"
                      } text-sm`}
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-0.5">{errors.username}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    value={selectedUser?.email || ""}
                    onChange={(e) => {
                      setSelectedUser({ ...selectedUser, email: e.target.value });
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none ${errors.email ? "border-red-400 focus:ring-red-300" : "focus:ring-blue-400"
                      } text-sm`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Mobile</label>
                  <input
                    type="tel"
                    value={selectedUser?.mobile || ""}
                    onChange={(e) => {
                      setSelectedUser({ ...selectedUser, mobile: e.target.value });
                      if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none ${errors.mobile ? "border-red-400 focus:ring-red-300" : "focus:ring-blue-400"
                      } text-sm`}
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-0.5">{errors.mobile}</p>}
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="cursor-pointer px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-xs transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { if (validateForm()) handleSave(); }}
                  className="cursor-pointer px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs transition "
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteOpen && (
          <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <motion.div
              className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-lg relative text-xs"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-lg font-semibold text-red-600 mb-2 text-center">Delete User</h2>
              <p className="text-center mb-4">
                Are you sure you want to delete <span className="font-semibold">{selectedUser?.username}</span>?
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="cursor-pointer px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="cursor-pointer px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
