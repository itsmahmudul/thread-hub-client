import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const PostsList = () => {
    const axios = useAxiosPublic();

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

    return (
        <div className="space-y-4">
            {/* Header with Sort Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    All Posts
                </h2>
                <button
                    onClick={() =>
                        setSortBy(sortBy === "newest" ? "popularity" : "newest")
                    }
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    {sortBy === "newest" ? "Sort by Popularity" : "Sort by Newest"}
                </button>
            </div>

            {/* Loading & Error States */}
            {loading && <p className="text-center text-gray-500">Loading posts...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* Posts List */}
            <div className="space-y-4">
                {!loading &&
                    !error &&
                    posts.map((post) => (
                        <div
                            key={post._id}
                            className="p-4 rounded-lg border dark:border-gray-700 shadow-sm"
                        >
                            <div className="flex items-center space-x-3 mb-2">
                                <img
                                    src={post.authorImage || "/default-avatar.png"}
                                    alt={post.authorName}
                                    className="w-10 h-10 rounded-full"
                                />
                                <h3 className="font-semibold text-lg">{post.title}</h3>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-wrap gap-2 mb-2">
                                {post.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <div className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleString()}
                            </div>
                            <div className="mt-2 flex gap-4 text-sm">
                                <span>💬 {post.upVote ?? 0} comments</span>
                                <span>👍 {post.upVote ?? 0} | 👎 {post.downVote ?? 0}</span>
                                <span>⭐ Votes: {(post.upVote || 0) - (post.downVote || 0)}</span>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="px-3 py-1">
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PostsList;
