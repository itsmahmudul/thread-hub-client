import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";
import { toast } from "react-toastify";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { FiFileText, FiMessageCircle, FiUsers } from "react-icons/fi";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminProfile = () => {
    const axiosSecure = useAxiosPublic();
    const { user, darkMode } = useAuth();

    console.log(user.accessToken);

    const [stats, setStats] = useState({ posts: 0, comments: 0, users: 0 });
    const [tags, setTags] = useState([]);
    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        const fetchStatsAndTags = async () => {
            try {
                const [statsRes, tagsRes] = await Promise.all([
                    axiosSecure.get("/admin/stats"),
                    axiosSecure.get("/tags"),
                ]);

                setStats({
                    posts: statsRes.data.totalPosts || 0,
                    comments: statsRes.data.totalComments || 0,
                    users: statsRes.data.totalUsers || 0,
                });

                setTags(tagsRes.data || []);
            } catch (error) {
                console.error("Failed to fetch stats or tags:", error);
                toast.error("Failed to load admin data");
            }
        };

        fetchStatsAndTags();
    }, [axiosSecure]);

    const onAddTag = async (data) => {
        const newTag = data.tag.trim().toLowerCase(); // convert to lowercase to match backend logic
        if (!newTag) return toast.error("Tag cannot be empty");
        if (tags.includes(newTag)) return toast.error("Tag already exists");

        try {
            const res = await axiosSecure.post("/tags", { name: newTag });

            if (res.data.insertedId) {
                setTags((prev) => [...prev, newTag]);
                toast.success(`Tag "${newTag}" added`);
                reset();
            } else {
                toast.error("Failed to add tag");
            }
        } catch (error) {
            if (error.response?.status === 409) {
                toast.error("Tag already exists");
            } else {
                toast.error("Failed to add tag");
                console.error(error);
            }
        }
    };

    const pieData = {
        labels: ["Posts", "Comments", "Users"],
        datasets: [
            {
                label: "Site Stats",
                data: [stats.posts, stats.comments, stats.users],
                backgroundColor: ["#3b82f6", "#f87171", "#34d399"],
                borderColor: darkMode ? "#1f2937" : "#fff",
                borderWidth: 2,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: darkMode ? "#d1d5db" : "#374151",
                    font: { size: 14 },
                },
            },
        },
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.2 }}
            className={`max-w-5xl mx-auto p-6 rounded-2xl shadow-xl transition-all duration-300 ${darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"}`}
        >
            {/* Profile Info */}
            <motion.section
                variants={fadeIn}
                className="flex items-center space-x-6 mb-12"
            >
                <img
                    src={user.photoURL || "/default-avatar.png"}
                    alt={`${user.displayName}'s avatar`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-600 shadow-md"
                />
                <div>
                    <h1 className="text-3xl font-bold">{user.displayName || "Admin"}</h1>
                    <p className="text-gray-400">{user.email}</p>
                </div>
            </motion.section>

            {/* Pie Chart */}
            <motion.section variants={fadeIn} className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">📊 Site Activity Overview</h2>
                <Pie data={pieData} options={pieOptions} />
            </motion.section>

            {/* Stats Cards */}
            <motion.section
                variants={fadeIn}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`p-6 rounded-xl shadow-md text-center transition ${darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"}`}
                >
                    <FiFileText className="text-3xl mx-auto mb-2 text-blue-500" />
                    <h3 className="text-lg font-semibold">Total Posts</h3>
                    <p className="text-2xl font-bold mt-1">{stats.posts}</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`p-6 rounded-xl shadow-md text-center transition ${darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"}`}
                >
                    <FiMessageCircle className="text-3xl mx-auto mb-2 text-red-500" />
                    <h3 className="text-lg font-semibold">Total Comments</h3>
                    <p className="text-2xl font-bold mt-1">{stats.comments}</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`p-6 rounded-xl shadow-md text-center transition ${darkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"}`}
                >
                    <FiUsers className="text-3xl mx-auto mb-2 text-green-500" />
                    <h3 className="text-lg font-semibold">Total Users</h3>
                    <p className="text-2xl font-bold mt-1">{stats.users}</p>
                </motion.div>
            </motion.section>

            {/* Tag Form */}
            <motion.section variants={fadeIn}>
                <h2 className="text-2xl font-semibold mb-4">🏷️ Add New Tag</h2>
                <form
                    onSubmit={handleSubmit(onAddTag)}
                    className="flex flex-col sm:flex-row gap-4 max-w-md"
                >
                    <input
                        type="text"
                        {...register("tag", { required: true })}
                        placeholder="Enter tag name"
                        className={`flex-grow px-4 py-2 rounded-xl border shadow-sm focus:outline-none focus:ring-2 ${darkMode
                            ? "bg-gray-800 border-gray-600 text-gray-200 focus:ring-blue-500"
                            : "bg-gray-100 border-gray-300 focus:ring-blue-400"
                            }`}
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                    >
                        Add Tag
                    </button>
                </form>

                {/* Tags List */}
                {tags.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6"
                    >
                        <h3 className="font-semibold mb-2">🎯 Existing Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <motion.span
                                    key={tag}
                                    whileHover={{ scale: 1.05 }}
                                    className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm cursor-default shadow-sm"
                                >
                                    #{tag}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.section>
        </motion.div>
    );
};

export default AdminProfile;
