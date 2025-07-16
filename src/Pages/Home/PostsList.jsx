import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ import Framer Motion
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // delay between children animations
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    hover: { scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.1)" },
};

const PostsList = () => {
    const axios = useAxiosPublic();
    const { darkMode } = useAuth();

    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, [sortBy, page]);

    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get("/posts", {
                params: { sort: sortBy, page },
            });
            setPosts(res.data.posts);
            setTotalPages(Math.ceil(res.data.totalCount / 5));
        } catch (err) {
            console.error("Failed to fetch posts:", err);
            setError("Failed to fetch posts");
        } finally {
            setLoading(false);
        }
    };

    // Helper function for conditional classes
    const textColor = darkMode ? "text-gray-200" : "text-gray-900";
    const subTextColor = darkMode ? "text-gray-400" : "text-gray-500";
    const bgColor = darkMode ? "bg-gray-800" : "bg-white";
    const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
    const btnBgGradient = darkMode
        ? "from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900"
        : "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700";
    const btnTextColor = "text-white";
    const btnShadow = "shadow-md";

    return (
        <div className={`space-y-6 max-w-7xl mx-auto px-4 py-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-3xl font-extrabold ${textColor}`}>
                    All Posts
                </h2>
                <button
                    onClick={() =>
                        setSortBy(sortBy === "newest" ? "popularity" : "newest")
                    }
                    className={`inline-flex items-center px-5 py-2 bg-gradient-to-r ${btnBgGradient} ${btnTextColor} font-semibold rounded-lg ${btnShadow} transition`}
                    aria-label="Sort posts"
                >
                    {sortBy === "newest" ? "Sort by Popularity" : "Sort by Newest"}
                </button>
            </div>

            {/* Loading & Error */}
            {loading && (
                <p className={`text-center ${subTextColor}`}>Loading posts...</p>
            )}
            {error && (
                <p className="text-center text-red-600 font-medium">{error}</p>
            )}

            {/* Posts List with animation */}
            <motion.div
                className="space-y-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {!loading &&
                    !error &&
                    posts.map((post) => (
                        <motion.div
                            key={post._id}
                            variants={cardVariants}
                            whileHover="hover"
                        >
                            <Link
                                to={`/post/${post._id}`}
                                className={`${bgColor} rounded-xl border ${borderColor} shadow-md p-5 block transition`}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={post.authorImage || "/default-avatar.png"}
                                        alt={post.authorName}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
                                    />
                                    <div>
                                        <h3 className={`text-xl font-semibold ${textColor}`}>
                                            {post.title}
                                        </h3>
                                        <p className={`${subTextColor} text-sm`}>
                                            {post.authorName}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {post.tags?.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold select-none dark:bg-indigo-900 dark:text-indigo-300"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <p className={`${subTextColor} text-sm mb-4`}>
                                    Posted on {new Date(post.createdAt).toLocaleString()}
                                </p>

                                <div className={`flex justify-between items-center text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                    <span className="flex items-center gap-1">
                                        💬 {post.upVote ?? 0} comments
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 text-green-500">
                                            👍 {post.upVote ?? 0}
                                        </span>
                                        <span className="flex items-center gap-1 text-red-500">
                                            👎 {post.downVote ?? 0}
                                        </span>
                                    </span>

                                    <span className="flex items-center gap-1 text-yellow-400">
                                        ⭐ {(post.upVote || 0) - (post.downVote || 0)}
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
            </motion.div>

            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-8">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className={`px-4 py-2 rounded-md border ${borderColor} ${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100"} disabled:opacity-50 transition`}
                    aria-label="Previous page"
                >
                    Prev
                </button>
                <span className={`self-center font-medium ${textColor}`}>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className={`px-4 py-2 rounded-md border ${borderColor} ${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100"} disabled:opacity-50 transition`}
                    aria-label="Next page"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PostsList;
