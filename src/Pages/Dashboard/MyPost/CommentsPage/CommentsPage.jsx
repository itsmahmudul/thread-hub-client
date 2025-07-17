import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useAuth from "../../../../Hooks/useAuth";

const FEEDBACK_OPTIONS = [
    "Spam or misleading content",
    "Harassment or hate speech",
    "Other inappropriate behavior",
];

const CommentsPage = () => {
    const { postId } = useParams();
    const axiosSecure = useAxiosPublic();
    const { darkMode } = useAuth();

    const [comments, setComments] = useState([]);
    const [selectedFeedbacks, setSelectedFeedbacks] = useState({});
    const [reportedComments, setReportedComments] = useState({});

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axiosSecure.get(`/comments/${postId}`);
                setComments(res.data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
                toast.error("Failed to load comments");
            }
        };
        fetchComments();
    }, [postId, axiosSecure]);

    const handleFeedbackChange = (commentId, value) => {
        setSelectedFeedbacks((prev) => ({
            ...prev,
            [commentId]: value,
        }));
    };

    const handleReport = async (commentId) => {
        const feedback = selectedFeedbacks[commentId];
        if (!feedback) return;

        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: `Report this comment for "${feedback}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, report it!",
        });

        if (confirm.isConfirmed) {
            try {
                await axiosSecure.post("/reports", {
                    commentId,
                    feedback,
                });
                setReportedComments((prev) => ({ ...prev, [commentId]: true }));
                toast.success("Report submitted successfully");
            } catch (error) {
                console.error("Failed to submit report:", error);
                toast.error("Failed to submit report");
            }
        }
    };

    const textColor = darkMode ? "text-gray-300" : "text-gray-700";
    const bgColor = darkMode ? "bg-gray-900" : "bg-white";
    const borderColor = darkMode ? "border-gray-600" : "border-gray-200";
    const headerBg = darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700";
    const hoverRow = darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50";

    return (
        <div className={`p-6 max-w-6xl mx-auto ${textColor}`}>
            <h1 className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
                Comments for This Post
            </h1>

            {comments.length === 0 ? (
                <p className={`${textColor}`}>No comments found.</p>
            ) : (
                <div className={`overflow-x-auto rounded-xl shadow-lg border ${borderColor}`}>
                    <table className={`w-full text-left ${bgColor}`}>
                        <thead className={`${headerBg}`}>
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Comment</th>
                                <th className="p-4">Feedback</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map(({ _id, userEmail, text }) => {
                                const avatarUrl = `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
                                    userEmail
                                )}.svg`;

                                return (
                                    <tr key={_id} className={`${hoverRow} border-t ${borderColor}`}>
                                        <td className="p-4 flex items-center gap-3">
                                            <img
                                                src={avatarUrl}
                                                alt="avatar"
                                                className="w-10 h-10 rounded-full border shadow-sm"
                                            />
                                            <span className="break-all">{userEmail}</span>
                                        </td>
                                        <td className="p-4">{text}</td>
                                        <td className="p-4">
                                            <div className="relative">
                                                <select
                                                    value={selectedFeedbacks[_id] || ""}
                                                    onChange={(e) => handleFeedbackChange(_id, e.target.value)}
                                                    disabled={reportedComments[_id]}
                                                    className={`w-full px-3 py-2 border rounded-md ${darkMode
                                                        ? "bg-gray-700 border-gray-600 text-white"
                                                        : "bg-white border-gray-300 text-black"
                                                        }`}
                                                >
                                                    <option value="">Select reason</option>
                                                    {FEEDBACK_OPTIONS.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>

                                                {reportedComments[_id] && selectedFeedbacks[_id] && (
                                                    <span className="absolute top-1/2 right-3 -translate-y-1/2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded">
                                                        {selectedFeedbacks[_id]}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleReport(_id)}
                                                disabled={!selectedFeedbacks[_id] || reportedComments[_id]}
                                                className={`px-4 py-2 rounded font-semibold transition duration-200 ${reportedComments[_id]
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-red-600 hover:bg-red-700 text-white"
                                                    }`}
                                            >
                                                {reportedComments[_id] ? "Reported" : "Report"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CommentsPage;
