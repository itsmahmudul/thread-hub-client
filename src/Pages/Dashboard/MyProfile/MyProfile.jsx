import React, { useEffect, useState } from "react";
import { FaStar, FaMedal, FaSpinner } from "react-icons/fa";
import { MdOutlinePostAdd } from "react-icons/md";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useAuth from "../../../Hooks/useAuth";

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.15, duration: 0.5 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.03, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
};

const badgePulse = {
    animate: {
        scale: [1, 1.05, 1],
        transition: { duration: 2.5, repeat: Infinity },
    },
};

const MyProfile = () => {
    const { user, darkMode } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [isGold, setIsGold] = useState(false);
    const [recentPosts, setRecentPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const userRes = await axiosPublic.get(`/users`, {
                    params: { email: user.email },
                });
                setProfile(userRes.data);

                const badgeRes = await axiosPublic.get(`/users/membership-status`, {
                    params: { email: user.email },
                });
                setIsGold(badgeRes.data.isMember);

                const postsRes = await axiosPublic.get(`/posts/user`, {
                    params: { email: user.email },
                });
                setRecentPosts(postsRes.data.slice(0, 3));
            } catch (err) {
                console.error("Error loading profile:", err);
            } finally {
                setLoading(false); // ✅ hide loader
            }
        };

        fetchData();
    }, [user, axiosPublic]);

    // ✅ loader UI
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <FaSpinner className="animate-spin text-5xl text-white" />
            </div>
        );
    }

    if (!profile) {
        return (
            <p
                className={`text-center mt-10 animate-pulse ${darkMode ? "text-gray-300" : "text-indigo-600"
                    }`}
            >
                Loading profile...
            </p>
        );
    }

    return (
        <motion.div
            className={`mx-auto px-6 py-16 font-sans select-none ${darkMode
                    ? "bg-gray-900"
                    : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
                }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <h1
                className={`text-5xl font-extrabold text-center mb-12 tracking-wide ${darkMode ? "text-white" : "text-indigo-900"
                    }`}
            >
                My Profile
            </h1>

            {/* Profile Card */}
            <motion.div
                className={`flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl shadow-2xl border ${darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-indigo-200"
                    }`}
                variants={itemVariants}
            >
                <img
                    src={profile.authorImage}
                    alt="Profile"
                    className={`w-32 h-32 rounded-full object-cover border-4 shadow-md ${darkMode ? "border-blue-500" : "border-indigo-400"
                        }`}
                />

                <div
                    className={`text-center md:text-left space-y-3 max-w-xl ${darkMode ? "text-white" : "text-indigo-900"
                        }`}
                >
                    <h2 className="text-3xl font-semibold">{profile.authorName}</h2>
                    <p
                        className={`text-base font-mono tracking-wide ${darkMode ? "text-gray-300" : "text-indigo-700"
                            }`}
                    >
                        {profile.authorEmail}
                    </p>

                    <motion.div
                        className="mt-4 inline-flex items-center gap-3 px-6 py-2 rounded-full font-semibold text-sm cursor-default select-text"
                        {...badgePulse}
                        animate="animate"
                        style={{
                            background: isGold
                                ? darkMode
                                    ? "linear-gradient(90deg, #facc15, #eab308)"
                                    : "linear-gradient(90deg, #f9d423, #ff4e50)"
                                : darkMode
                                    ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                                    : "linear-gradient(90deg, #8e9eab, #eef2f3)",
                            color: isGold
                                ? darkMode
                                    ? "#78350f"
                                    : "#5a2c06"
                                : darkMode
                                    ? "#92400e"
                                    : "#555",
                            boxShadow: isGold
                                ? darkMode
                                    ? "0 0 12px #fbbf24"
                                    : "0 0 15px #ff4e50"
                                : darkMode
                                    ? "0 0 10px #f59e0b"
                                    : "0 0 8px #ccd1d9",
                        }}
                    >
                        {isGold ? <FaStar size={18} /> : <FaMedal size={18} />}
                        {isGold ? "Gold Member" : "Bronze Member"}
                    </motion.div>
                </div>
            </motion.div>

            {/* Recent Posts */}
            <section className="mt-16">
                <motion.h3
                    className={`text-3xl font-semibold mb-8 flex items-center gap-3 ${darkMode ? "text-white" : "text-indigo-900"
                        }`}
                    variants={itemVariants}
                >
                    <MdOutlinePostAdd
                        className={`${darkMode ? "text-blue-400" : "text-indigo-600"
                            } text-4xl`}
                    />
                    Recent Posts
                </motion.h3>

                {recentPosts.length === 0 ? (
                    <motion.p
                        className={`italic text-center ${darkMode ? "text-gray-400" : "text-indigo-700"
                            }`}
                        variants={itemVariants}
                    >
                        You haven't posted anything yet.
                    </motion.p>
                ) : (
                    <>
                        <motion.ul
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {recentPosts.map((post) => (
                                <motion.li
                                    key={post._id}
                                    className={`rounded-2xl p-6 shadow-md cursor-pointer border ${darkMode
                                            ? "bg-gray-800 border-gray-700"
                                            : "bg-white border-indigo-200"
                                        }`}
                                    variants={itemVariants}
                                    whileHover="hover"
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <h4
                                        className={`text-xl font-bold ${darkMode ? "text-blue-400" : "text-indigo-700"
                                            }`}
                                    >
                                        {post.title}
                                    </h4>
                                    <p
                                        className={`text-sm mt-1 font-mono ${darkMode ? "text-gray-400" : "text-indigo-500"
                                            }`}
                                    >
                                        Posted on {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                    <p
                                        className={`mt-3 font-medium ${darkMode ? "text-gray-300" : "text-indigo-800"
                                            }`}
                                    >
                                        Votes: {post.votes}
                                    </p>
                                </motion.li>
                            ))}
                        </motion.ul>

                        {/* Show More Posts Button */}
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => navigate("/dashboard/my-posts")}
                                className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors duration-300 ${darkMode
                                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                    }`}
                                aria-label="Show more posts"
                            >
                                Show More Posts
                            </button>
                        </div>
                    </>
                )}
            </section>
        </motion.div>
    );
};

export default MyProfile;
