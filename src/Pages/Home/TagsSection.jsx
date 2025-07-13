import React, { useState, useEffect } from "react";
import useAxiosPublic from "../../Hooks/useAxiosSecure";

const TagsSection = ({ onTagSelect = () => { } }) => {
    const [tags, setTags] = useState([]);
    const [activeTag, setActiveTag] = useState(null);
    const axiosPublic = useAxiosPublic();

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

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-gray-700 dark:text-white">Browse by Tags</h2>
            <div className="flex flex-wrap gap-2">
                {tags.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-300">No tags found.</p>
                ) : (
                    tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`px-3 py-1 rounded-full text-sm border 
                                ${activeTag === tag ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white border-gray-300"}
                                hover:bg-blue-500 hover:text-white transition`}
                        >
                            #{tag}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default TagsSection;
