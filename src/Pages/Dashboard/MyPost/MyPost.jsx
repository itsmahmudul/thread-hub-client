import React, { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import { FaComments, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const MyPosts = () => {
    const { user, darkMode } = useAuth();
    const axiosSecure = useAxiosPublic();
    const [myPosts, setMyPosts] = useState([]);

    useEffect(() => {
        if (user?.email) {
            axiosSecure.get(`/posts/user?email=${user.email}`)
                .then(res => {
                    setMyPosts(res.data);
                })
                .catch(() => toast.error('Failed to fetch your posts'));
        }
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

    return (
        <div className={`p-4 overflow-x-auto ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}`}>
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
                        <tr key={post._id} className={`border-t ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                            <td className="p-3">{post.title}</td>
                            <td className="p-3">{post.votes || 0}</td>
                            <td className="p-3">
                                <button
                                    className="text-blue-500 hover:underline flex items-center gap-1"
                                    onClick={() => window.location.href = `/post/${post._id}`}
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
