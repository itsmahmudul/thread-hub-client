import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useAuth from "../../../Hooks/useAuth";

const ReportedActivities = () => {
    const axiosSecure = useAxiosPublic();
    const { darkMode } = useAuth();

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all reports
    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const res = await axiosSecure.get("/reports");
                setReports(res.data);
            } catch (error) {
                console.error("Failed to fetch reports:", error);
                toast.error("Failed to load reports");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [axiosSecure]);

    // Dismiss report (mark resolved)
    const handleDismiss = async (reportId) => {
        const result = await Swal.fire({
            title: "Dismiss this report?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, dismiss",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#aaa",
            background: darkMode ? "#1f2937" : "#fff",
            color: darkMode ? "#f3f4f6" : "#111",
        });
        if (!result.isConfirmed) return;

        try {
            await axiosSecure.delete(`/reports/${reportId}`);
            setReports((prev) => prev.filter((r) => r._id !== reportId));
            toast.success("Report dismissed");
        } catch (error) {
            console.error(error);
            toast.error("Failed to dismiss report");
        }
    };

    // Delete the reported comment
    const handleDeleteComment = async (commentId, reportId) => {
        const result = await Swal.fire({
            title: "Delete this comment?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#aaa",
            background: darkMode ? "#1f2937" : "#fff",
            color: darkMode ? "#f3f4f6" : "#111",
        });
        if (!result.isConfirmed) return;

        try {
            await axiosSecure.delete(`/comments/${commentId}`);
            await axiosSecure.delete(`/reports/${reportId}`);
            setReports((prev) => prev.filter((r) => r._id !== reportId));
            toast.success("Comment deleted and report removed");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete comment");
        }
    };

    // Ban the user who posted the comment
    const handleBanUser = async (userEmail) => {
        const result = await Swal.fire({
            title: `Ban user ${userEmail}?`,
            text: "User will be banned from commenting.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ban User",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#e02424",
            cancelButtonColor: "#aaa",
            background: darkMode ? "#1f2937" : "#fff",
            color: darkMode ? "#f3f4f6" : "#111",
        });
        if (!result.isConfirmed) return;

        try {
            await axiosSecure.post(`/users/ban`, { email: userEmail });
            toast.success(`User ${userEmail} has been banned`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to ban user");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
            </div>
        );
    }

    return (
        <div className={`p-6 max-w-7xl mx-auto ${darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"} rounded-lg shadow-lg`}>
            <h1 className="text-3xl font-bold mb-6">Reported Activities</h1>

            {reports.length === 0 ? (
                <p>No reported activities at the moment.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className={`min-w-full border-collapse ${darkMode ? "border-gray-700" : "border-gray-300"} border`}>
                        <thead className={`${darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-700"}`}>
                            <tr>
                                <th className="p-3 border border-gray-300">Comment Text</th>
                                <th className="p-3 border border-gray-300">Reported By</th>
                                <th className="p-3 border border-gray-300">Reason</th>
                                <th className="p-3 border border-gray-300">Commenter Email</th>
                                <th className="p-3 border border-gray-300">Reported At</th>
                                <th className="p-3 border border-gray-300 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report._id} className={`${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-50"} border-t`}>
                                    <td className="p-3 border border-gray-300 max-w-xs truncate" title={report.commentText}>
                                        {report.commentText}
                                    </td>
                                    <td className="p-3 border border-gray-300">{report.reporterEmail}</td>
                                    <td className="p-3 border border-gray-300">{report.feedback}</td>
                                    <td className="p-3 border border-gray-300">{report.commenterEmail}</td>
                                    <td className="p-3 border border-gray-300">{new Date(report.reportedAt).toLocaleString()}</td>
                                    <td className="p-3 border border-gray-300 text-center space-x-2">
                                        <button
                                            onClick={() => handleDismiss(report._id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                                        >
                                            Dismiss
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(report.commentId, report._id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                        >
                                            Delete Comment
                                        </button>
                                        <button
                                            onClick={() => handleBanUser(report.commenterEmail)}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                                        >
                                            Ban User
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReportedActivities;
