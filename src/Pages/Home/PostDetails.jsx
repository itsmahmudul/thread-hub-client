import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";

const PostDetails = () => {
    const { id } = useParams();
    const axios = useAxiosPublic();
    const { user, darkMode } = useAuth();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(false);

    const [upVoteCount, setUpVoteCount] = useState(0);
    const [downVoteCount, setDownVoteCount] = useState(0);

    const [showAllComments, setShowAllComments] = useState(false);

    const shareUrl = `${window.location.origin}/post/${id}`;

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/posts/${id}/details`);
            const postData = res.data.post;
            const commentData = res.data.comments || [];
            setPost(postData);
            setComments(commentData.reverse()); // newest comments first
            setUpVoteCount(postData.upVote || 0);
            setDownVoteCount(postData.downVote || 0);
            setShowAllComments(false); // reset show all on new post load
        } catch (err) {
            console.error("Failed to load post", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!user) {
            alert("Please login to comment.");
            return;
        }
        if (!newComment.trim()) return;
        try {
            const res = await axios.post(`/posts/${id}/comments`, {
                userEmail: user.email,
                userName: user.displayName,
                userImage: user.photoURL,
                text: newComment,
            });
            setComments(res.data.comments.reverse()); // newest comments first
            setNewComment("");
            setShowAllComments(true); // show all comments after adding one
        } catch (err) {
            console.error("Failed to add comment", err);
        }
    };

    const handleUpvote = async () => {
        if (!user) {
            alert("Please login to vote.");
            return;
        }
        if (post.upVoteUsers?.includes(user.uid)) {
            alert("You have already upvoted.");
            return;
        }
        if (post.downVoteUsers?.includes(user.uid)) {
            alert("You have already downvoted. You cannot vote both ways.");
            return;
        }
        try {
            await axios.patch(`/posts/${id}/upvote`);
            setUpVoteCount((prev) => prev + 1);
            setPost((prev) => ({
                ...prev,
                upVote: (prev.upVote || 0) + 1,
                upVoteUsers: [...(prev.upVoteUsers || []), user.uid],
            }));
        } catch (err) {
            console.error("Failed to upvote", err);
        }
    };

    const handleDownvote = async () => {
        if (!user) {
            alert("Please login to vote.");
            return;
        }
        if (post.downVoteUsers?.includes(user.uid)) {
            alert("You have already downvoted.");
            return;
        }
        if (post.upVoteUsers?.includes(user.uid)) {
            alert("You have already upvoted. You cannot vote both ways.");
            return;
        }
        try {
            await axios.patch(`/posts/${id}/downvote`);
            setDownVoteCount((prev) => prev + 1);
            setPost((prev) => ({
                ...prev,
                downVote: (prev.downVote || 0) + 1,
                downVoteUsers: [...(prev.downVoteUsers || []), user.uid],
            }));
        } catch (err) {
            console.error("Failed to downvote", err);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: post.title,
                    text: post.description,
                    url: shareUrl,
                })
                .catch((error) => console.error("Error sharing:", error));
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert("Link copied to clipboard!");
        }
    };

    if (loading || !post) {
        return (
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} text-center py-10 font-semibold text-lg`}>
                Loading post...
            </p>
        );
    }

    return (
        <motion.div
            className={`max-w-4xl mx-auto p-8 my-7 rounded-2xl shadow-lg
                ${darkMode
                    ? "bg-gray-900 shadow-black"
                    : "bg-white shadow-lg"
                }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Post header */}
            <div className="flex items-center gap-6 mb-8">
                <img
                    src={post.authorImage || "/default-avatar.png"}
                    alt={post.authorName}
                    className="w-16 h-16 rounded-full border-4 border-indigo-500 object-cover shadow-md"
                />
                <div>
                    <h1 className={`${darkMode ? "text-gray-100" : "text-gray-900"} text-4xl font-extrabold tracking-tight`}>
                        {post.title}
                    </h1>
                    <p className={`text-md font-semibold mt-1 ${darkMode ? "text-indigo-400" : "text-indigo-700"}`}>
                        By {post.authorName}
                    </p>
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-400"} text-sm mt-1`}>
                        {new Date(post.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Post description */}
            <motion.p
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-lg leading-relaxed mb-8`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {post.description}
            </motion.p>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-10">
                {post.tags?.map((tag) => (
                    <motion.span
                        key={tag}
                        className={`inline-block px-4 py-1 rounded-full font-semibold cursor-default select-none shadow-sm ${darkMode
                                ? "bg-indigo-800 text-indigo-300"
                                : "bg-indigo-100 text-indigo-800"
                            }`}
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: darkMode ? "#4338ca" : "#4338ca",
                            color: "white",
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        #{tag}
                    </motion.span>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 mb-12">
                <button
                    onClick={handleUpvote}
                    disabled={
                        post.upVoteUsers?.includes(user?.uid) ||
                        post.downVoteUsers?.includes(user?.uid)
                    }
                    className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-md transition-transform transform focus:outline-none ${post.upVoteUsers?.includes(user?.uid)
                            ? "bg-green-300 text-green-900 cursor-not-allowed"
                            : "bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105"
                        }`}
                >
                    👍 <span className="text-lg">{upVoteCount}</span>
                </button>
                <button
                    onClick={handleDownvote}
                    disabled={
                        post.downVoteUsers?.includes(user?.uid) ||
                        post.upVoteUsers?.includes(user?.uid)
                    }
                    className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-md transition-transform transform focus:outline-none ${post.downVoteUsers?.includes(user?.uid)
                            ? "bg-red-300 text-red-900 cursor-not-allowed"
                            : "bg-red-100 text-red-700 hover:bg-red-200 hover:scale-105"
                        }`}
                >
                    👎 <span className="text-lg">{downVoteCount}</span>
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold shadow-md hover:bg-blue-200 hover:scale-105 transition-transform focus:outline-none"
                    aria-label="Share post"
                >
                    🔗 Share
                </button>
            </div>

            {/* Comments Section */}
            <section className={`${darkMode ? "border-gray-700" : "border-gray-300"} border-t pt-8`}>
                <h2 className={`${darkMode ? "text-gray-100" : "text-gray-900"} text-3xl font-bold mb-6`}>Comments</h2>

                {/* Add Comment */}
                {user ? (
                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className={`flex-1 border rounded-xl px-5 py-3 focus:outline-none focus:ring-4 placeholder-gray-400 shadow-sm ${darkMode
                                    ? "bg-gray-800 border-gray-600 focus:ring-indigo-500 text-gray-200"
                                    : "bg-white border-gray-300 focus:ring-indigo-400 text-gray-700"
                                }`}
                            placeholder="Write a comment..."
                        />
                        <button
                            onClick={handleAddComment}
                            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg transition-colors focus:outline-none"
                        >
                            Comment
                        </button>
                    </motion.div>
                ) : (
                    <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} italic mb-10`}>
                        Please log in to add a comment.
                    </p>
                )}

                {/* Comment List */}
                <div className="space-y-6">
                    {(showAllComments ? comments : comments.slice(0, 3)).map((c, index) => (
                        <motion.div
                            key={index}
                            className={`flex items-start gap-4 p-5 rounded-2xl shadow-sm border ${darkMode
                                    ? "bg-gray-800 border-gray-700"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <img
                                src={c.userImage || "/default-avatar.png"}
                                alt={c.userName}
                                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-300"
                            />
                            <div>
                                <p className={`${darkMode ? "text-indigo-400" : "text-indigo-800"} font-semibold`}>
                                    {c.userName}
                                </p>
                                <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} mt-1`}>
                                    {c.text}
                                </p>
                                <p className={`${darkMode ? "text-gray-500" : "text-gray-400"} text-xs mt-2`}>
                                    {new Date(c.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {/* See More Comments Button */}
                    {!showAllComments && comments.length > 3 && (
                        <button
                            onClick={() => setShowAllComments(true)}
                            className="mt-4 px-5 py-2 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 shadow-md transition-colors focus:outline-none"
                        >
                            See more comments
                        </button>
                    )}
                </div>
            </section>
        </motion.div>
    );
};

export default PostDetails;
