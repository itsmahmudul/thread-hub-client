import React, { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import { FaComments, FaTrash, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const MyPosts = () => {
    const { user, darkMode } = useAuth();
    const axiosSecure = useAxiosPublic();
    const [myPosts, setMyPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true); 
                const res = await axiosSecure.get(`/posts/user?email=${user.email}`);
                setMyPosts(res.data);
            } catch (error) {
                console.log(error);
                toast.error('Failed to fetch your posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user, axiosSecure]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this post!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: darkMode ? '#1f2937' : '#fff',
            color: darkMode ? '#f3f4f6' : '#111',
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/posts/${id}`);
                setMyPosts(prev => prev.filter(post => post._id !== id));
                toast.success('Post deleted successfully');
            } catch (err) {
                console.log(err);
                toast.error('Error deleting the post');
            }
        }
    };

    
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                <FaSpinner className="animate-spin text-5xl text-white" />
            </div>
        );
    }

    return (
        <div className={`p-4 overflow-x-auto ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800'}`}>
            <h2 className="text-2xl font-bold mb-4">My Posts</h2>
            <table className={`min-w-full border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <thead>
                    <tr className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-left'}`}>
                        <th className="p-3">Title</th>
                        <th className="p-3">Votes</th>
                        <th className="p-3">Comment</th>
                        <th className="p-3">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {myPosts.map(post => (
                        <tr
                            key={post._id}
                            className={`border-t ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                        >
                            <td className="p-3">{post.title}</td>
                            <td className="p-3">{post.votes || 0}</td>
                            <td className="p-3">
                                <button
                                    className="text-blue-500 hover:underline flex items-center gap-1"
                                    onClick={() => (window.location.href = `/post/${post._id}`)}
                                >
                                    <FaComments /> Comment
                                </button>
                            </td>
                            <td className="p-3">
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="text-red-500 hover:underline flex items-center gap-1"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {myPosts.length === 0 && (
                        <tr>
                            <td colSpan="4" className="p-4 text-center text-gray-500">
                                You haven't posted anything yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyPosts;
