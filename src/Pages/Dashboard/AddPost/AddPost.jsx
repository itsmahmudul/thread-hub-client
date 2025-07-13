// src/Pages/Dashboard/AddPost.jsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const AddPost = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAllowed, setIsAllowed] = useState(false);
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();
    const { register, handleSubmit, control, reset } = useForm();

    useEffect(() => {
        // Check post limit and fetch tags
        const checkPermissions = async () => {
            const res = await axiosSecure.get(`/posts/count?email=${user?.email}`);
            if (res.data.count < 5 || res.data.isMember) setIsAllowed(true);
            else setIsAllowed(false);

            const tagsRes = await axiosSecure.get('/tags');
            const tagOptions = tagsRes.data.map(tag => ({
                value: tag,
                label: `#${tag}`
            }));
            setTags(tagOptions);
        };

        checkPermissions();
    }, [user, axiosSecure]);

    const onSubmit = async (data) => {
        const postData = {
            title: data.title,
            description: data.description,
            tags: data.tags.map(tag => tag.value),
            authorName: user.displayName,
            authorImage: user.photoURL,
            authorEmail: user.email,
            upVote: 0,
            downVote: 0,
            createdAt: new Date()
        };

        try {
            const res = await axiosSecure.post('/posts', postData);
            if (res.data.insertedId) {
                toast.success('🚀 Post added successfully!');
                reset();
            }
        } catch (error) {
            console.log(error);
            toast.error('❌ Failed to add post!');
        }
    };

    if (!isAllowed) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-20"
            >
                <p className="text-xl font-semibold mb-6 text-red-600">
                    You’ve reached your 5-post limit.
                </p>
                <button
                    onClick={() => navigate('/membership')}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow hover:scale-105 transition"
                >
                    Become a Member
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto p-10 mt-12 bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl"
        >
            <h2 className="text-3xl font-extrabold text-center mb-12 text-blue-800">📝 Add a New Post</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                {/* Author Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Author Name</label>
                        <input
                            type="text"
                            value={user?.displayName}
                            readOnly
                            className="w-full input input-bordered bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Author Email</label>
                        <input
                            type="email"
                            value={user?.email}
                            readOnly
                            className="w-full input input-bordered bg-gray-100"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Author Image URL</label>
                    <input
                        type="text"
                        value={user?.photoURL}
                        readOnly
                        className="w-full input input-bordered bg-gray-100"
                    />
                </div>

                {/* Post Title */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Post Title</label>
                    <input
                        {...register('title', { required: true })}
                        placeholder="Enter your post title"
                        className="w-full input input-bordered py-3"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Post Description</label>
                    <textarea
                        {...register('description', { required: true })}
                        rows={5}
                        placeholder="Write your post content..."
                        className="w-full textarea textarea-bordered py-3"
                    />
                </div>

                {/* Tags */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Tags</label>
                    <Controller
                        control={control}
                        name="tags"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                {...field}
                                isMulti
                                options={tags}
                                className="react-select-container"
                                classNamePrefix="react-select"
                                placeholder="Select tags..."
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        minHeight: '44px',
                                        padding: '2px',
                                    }),
                                    multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: '#e0e7ff',
                                    }),
                                }}
                            />
                        )}
                    />
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 w-full cursor-pointer text-white px-10 py-4 rounded-xl shadow-lg font-semibold transition"
                    >
                        🚀 Submit Post
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export default AddPost;
