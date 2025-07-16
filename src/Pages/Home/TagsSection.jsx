import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";

const TagsSection = ({ onTagSelect = () => { } }) => {
    const [tags, setTags] = useState([]);
    const [activeTag, setActiveTag] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const axiosPublic = useAxiosPublic();
    const { darkMode } = useAuth();

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await axiosPublic.get("/tags");
                const data = res.data;
                if (Array.isArray(data)) {
                    setTags(data);
                } else {
                    console.error("Expected array of tags but got:", data);
                    setTags([]);
                }
            } catch (error) {
                console.error("Failed to load tags", error);
                setTags([]);
            }
        };
        fetchTags();
    }, [axiosPublic]);

    const handleTagClick = (tag) => {
        setActiveTag(tag);
        onTagSelect(tag);
    };

    const displayedTags = showAll ? tags : tags.slice(0, 12);

    return (
        <div
            className={`p-5 rounded-2xl shadow-lg border transition-colors duration-300 ${darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
        >
            <h2
                className={`text-xl font-semibold mb-4 ${darkMode ? "text-gray-100" : "text-gray-800"
                    }`}
            >
                Browse by Tags
            </h2>

            <motion.div
                layout
                className="flex flex-wrap gap-3"
                transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
            >
                <AnimatePresence>
                    {displayedTags.map((tag) => {
                        const isActive = activeTag === tag;
                        return (
                            <motion.button
                                layout
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => handleTagClick(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${isActive
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                        : darkMode
                                            ? "bg-gray-800 text-gray-200 border-gray-600 hover:bg-blue-700 hover:text-white hover:border-blue-500"
                                            : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                #{tag}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>

                {tags.length > 12 && (
                    <motion.button
                        layout
                        onClick={() => setShowAll(!showAll)}
                        className={`px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all
              bg-gradient-to-r from-indigo-500 to-blue-500 text-white
              hover:from-indigo-600 hover:to-blue-600
              ${darkMode ? "border border-gray-600" : ""}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {showAll ? "See Less ▲" : "See More ▼"}
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
};

export default TagsSection;
