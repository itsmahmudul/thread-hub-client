import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";

const BannerSearch = () => {
    const axiosPublic = useAxiosPublic();
    const { darkMode } = useAuth();
    const [searchTag, setSearchTag] = useState("");
    const [queryTag, setQueryTag] = useState("");

    const { data: searchResults = [], isLoading } = useQuery({
        queryKey: ["search-tag", queryTag],
        enabled: !!queryTag,
        queryFn: async () => {
            const res = await axiosPublic.get(`/posts/search?tag=${queryTag}`);
            return res.data;
        },
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTag.trim()) {
            setQueryTag(searchTag.trim().toLowerCase());
        }
    };

    const handleQuickTag = (tag) => {
        setSearchTag(tag);
        setQueryTag(tag);
    };

    return (
        <div className={`relative overflow-hidden ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <div className="relative z-10 max-w-6xl mx-auto py-16 px-4 text-center">
                {/* Heading */}
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    Welcome to <span className="text-blue-500">ThreadHub</span>
                </h1>
                <p className={`text-lg md:text-xl ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Discover and explore posts by searching tags
                </p>

                {/* Search Box */}
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col md:flex-row justify-center items-center gap-2 mt-8"
                >
                    <div className="relative w-full md:w-1/2">
                        <FiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-400"}`} />
                        <input
                            type="text"
                            placeholder="Search by tag (e.g. react, mongodb)"
                            value={searchTag}
                            onChange={(e) => setSearchTag(e.target.value)}
                            className={`pl-10 pr-4 py-3 rounded-full w-full border transition focus:outline-none focus:ring-4
                ${darkMode
                                    ? "bg-gray-800 border-gray-700 text-white focus:ring-blue-700 placeholder-gray-400"
                                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-300"}`}
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-500 transition shadow-md"
                    >
                        Search
                    </button>
                </form>

                {/* Quick Tags */}
                <div className="flex justify-center flex-wrap gap-3 mt-6">
                    {["react", "javascript", "mongodb"].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleQuickTag(tag)}
                            className={`px-4 py-2 rounded-full border text-sm transition
                ${darkMode
                                    ? "bg-gray-800 border-gray-600 text-gray-200 hover:bg-blue-800 hover:border-blue-600"
                                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-blue-100 hover:border-blue-300"
                                }`}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Results */}
            {queryTag && (
                <div
                    className={`relative z-20 mt-10 py-12 px-4 rounded-t-3xl shadow-inner 
          ${darkMode ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-800"}`}
                >
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">
                            Results for{" "}
                            <span className="text-blue-500 font-semibold">#{queryTag}</span>
                        </h2>

                        {isLoading ? (
                            <p className="text-gray-400">Loading...</p>
                        ) : searchResults.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <AnimatePresence>
                                    {searchResults.map((post) => (
                                        <motion.div
                                            key={post._id}
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Link
                                                to={`/post/${post._id}`}
                                                className={`block p-5 rounded-xl border transition hover:shadow-lg
                          ${darkMode
                                                        ? "bg-gray-900 border-gray-700 hover:border-blue-600"
                                                        : "bg-white border-gray-200 hover:border-blue-400"}`}
                                            >
                                                <h3
                                                    className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"
                                                        }`}
                                                >
                                                    {post.title}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    Tags:{" "}
                                                    <span className="text-blue-400 font-medium">
                                                        {post.tags.join(", ")}
                                                    </span>
                                                </p>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <p className="text-gray-400">No posts found with this tag.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerSearch;
