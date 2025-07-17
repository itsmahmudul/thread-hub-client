import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

const ManageUsers = () => {
    const axiosPublic = useAxiosPublic();
    const { darkMode } = useAuth();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const fetchUsers = async (searchTerm = "") => {
        setLoading(true);
        try {
            const res = await axiosPublic.get("/all-users", {
                params: { search: searchTerm },
            });
            setUsers(res.data);
            setMessage(null);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setMessage({ type: "error", text: "Failed to load users" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(search);
    };

    const makeAdmin = async (userId) => {
        try {
            const res = await axiosPublic.patch(`/users/admin/${userId}`);
            if (res.data.success) {
                setMessage({ type: "success", text: res.data.message });
                fetchUsers(search);
            } else {
                setMessage({ type: "error", text: res.data.message || "Failed to promote" });
            }
        } catch (error) {
            console.error("Make admin failed:", error);
            setMessage({ type: "error", text: "Failed to promote user" });
        }
    };

    return (
        <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} p-6 max-w-6xl mx-auto font-sans min-h-screen`}>
            <h2 className="text-3xl font-extrabold mb-6 text-center">
                Manage Users
            </h2>

            <form
                onSubmit={handleSearch}
                className="mb-6 flex max-w-md mx-auto gap-3"
                aria-label="Search users"
            >
                <input
                    type="text"
                    placeholder="Search users by name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`flex-grow rounded-md px-4 py-2 focus:outline-none focus:ring-2 transition ${darkMode
                            ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:ring-blue-400"
                            : "border border-gray-300 placeholder-gray-500 text-gray-900 focus:ring-blue-500"
                        }`}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 rounded-md hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </form>

            {/* Animated Messages */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`max-w-md mx-auto mb-6 p-3 rounded-md text-center text-sm font-medium ${message.type === "success"
                                ? darkMode
                                    ? "bg-green-800 text-green-300"
                                    : "bg-green-100 text-green-800"
                                : darkMode
                                    ? "bg-red-800 text-red-300"
                                    : "bg-red-100 text-red-800"
                            }`}
                        role="alert"
                    >
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-center`}
                >
                    Loading users...
                </motion.p>
            ) : users.length === 0 ? (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-center`}
                >
                    No users found.
                </motion.p>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {users.map((user) => (
                            <motion.div
                                key={user._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                layout
                                className={`flex flex-col md:flex-row md:items-center justify-between rounded-lg p-4 shadow-md transition hover:shadow-lg
                  ${darkMode
                                        ? "bg-gray-800 shadow-gray-700"
                                        : "bg-white shadow-gray-300"
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={
                                            user.authorImage ||
                                            "https://ui-avatars.com/api/?name=" +
                                            encodeURIComponent(user.authorName || "User")
                                        }
                                        alt={user.authorName}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-600"
                                        loading="lazy"
                                    />
                                    <div>
                                        <h3 className={`${darkMode ? "text-gray-100" : "text-gray-800"} text-lg font-semibold`}>
                                            {user.authorName}
                                        </h3>
                                        <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
                                            {user.authorEmail}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 md:mt-0 flex flex-wrap gap-3 items-center">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${user.subscription === "gold"
                                                ? darkMode
                                                    ? "bg-yellow-700 text-yellow-200"
                                                    : "bg-yellow-300 text-yellow-900"
                                                : darkMode
                                                    ? "bg-gray-700 text-gray-300"
                                                    : "bg-gray-200 text-gray-700"
                                            }`}
                                    >
                                        {user.subscription || "free"}
                                    </span>

                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${user.role === "admin"
                                                ? darkMode
                                                    ? "bg-green-700 text-green-200"
                                                    : "bg-green-300 text-green-900"
                                                : darkMode
                                                    ? "bg-blue-700 text-blue-300"
                                                    : "bg-blue-200 text-blue-900"
                                            }`}
                                    >
                                        {user.role}
                                    </span>

                                    {user.role !== "admin" && (
                                        <button
                                            onClick={() => makeAdmin(user._id)}
                                            className="px-4 cursor-pointer py-1 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                                            aria-label={`Make ${user.authorName} admin`}
                                        >
                                            Make Admin
                                        </button>
                                    )}

                                    {user.role === "admin" && (
                                        <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm font-semibold`}>
                                            Admin
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
