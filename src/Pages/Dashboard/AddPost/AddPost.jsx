import React, { useEffect, useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../../Hooks/useAxiosPublic';
import useAuth from '../../../Hooks/useAuth';

const AddPost = () => {
    const { user, darkMode } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [isAllowed, setIsAllowed] = useState(false);
    const [tags, setTags] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const res = await axiosSecure.get(`/posts/count?email=${user?.email}`);
                if (res.data.count < 5 || res.data.isMember) setIsAllowed(true);
                else setIsAllowed(false);

                const tagsRes = await axiosSecure.get('/tags');
                const tagOptions = tagsRes.data.map((tag) => ({
                    value: tag,
                    label: `#${tag}`,
                }));
                setTags(tagOptions);
            } catch (error) {
                console.error('Failed to fetch permissions or tags:', error);
            }
        };

        checkPermissions();
    }, [user, axiosSecure]);

    const onSubmit = async (data) => {
        setSubmitting(true);
        const selectedTags = data.tags ? data.tags.map((tag) => tag.value) : [];

        const postData = {
            title: data.title,
            description: data.description,
            tags: selectedTags,
            authorName: user.displayName,
            authorImage: user.photoURL,
            authorEmail: user.email,
            upVote: 0,
            downVote: 0,
            createdAt: new Date(),
        };

        try {
            const res = await axiosSecure.post('/posts', postData);
            if (res.data.insertedId) {
                toast.success('🚀 Post added successfully!');
                reset({
                    title: '',
                    description: '',
                    tags: [],
                });
            } else {
                toast.error('❌ Failed to add post!');
            }
        } catch (error) {
            console.error(error);
            toast.error('❌ Failed to add post!');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isAllowed) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center mt-20 ${darkMode ? 'text-red-400' : 'text-red-600'}`}
            >
                <p className="text-xl font-semibold mb-6">You’ve reached your 5-post limit.</p>
                <button
                    onClick={() => navigate('/membership')}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md shadow hover:scale-105 transition"
                    aria-label="Become a member to add more posts"
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
            className={`max-w-3xl mx-auto p-10 mt-12 backdrop-blur-lg shadow-2xl rounded-2xl 
                ${darkMode ? 'bg-gray-900/90 text-gray-200' : 'bg-white/90 text-gray-800'}`}
        >
            {user?.photoURL && (
                <div className="flex justify-center mb-6">
                    <img
                        src={user.photoURL}
                        alt={`${user.displayName || 'Author'}'s avatar`}
                        className={`w-24 h-24 rounded-full object-cover shadow-lg border-4 
                            ${darkMode ? 'border-blue-600' : 'border-blue-400'}`}
                    />
                </div>
            )}

            <h2 className={`text-3xl font-extrabold text-center mb-12 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                📝 Add a New Post
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
                {/* Author info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label htmlFor="authorName" className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Author Name
                        </label>
                        <input
                            id="authorName"
                            type="text"
                            value={user?.displayName}
                            readOnly
                            className={`w-full input input-bordered ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-gray-100'}`}
                        />
                    </div>
                    <div>
                        <label htmlFor="authorEmail" className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Author Email
                        </label>
                        <input
                            id="authorEmail"
                            type="email"
                            value={user?.email}
                            readOnly
                            className={`w-full input input-bordered ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-gray-100'}`}
                        />
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title" className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Post Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        {...register('title', { required: 'Title is required' })}
                        placeholder="Enter your post title"
                        className={`w-full px-4 input input-bordered py-3 rounded-lg focus:outline-none focus:ring-2 
                            ${darkMode ? 'border-2 border-blue-600 bg-gray-800 text-gray-200 focus:ring-blue-400' : 'border-2 border-blue-400 focus:ring-blue-500'}`}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Post Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        {...register('description', { required: 'Description is required' })}
                        rows={5}
                        placeholder="Write your post content..."
                        className={`w-full textarea textarea-bordered px-4 py-3 rounded-lg focus:outline-none focus:ring-2 
                            ${darkMode ? 'border-2 border-blue-600 bg-gray-800 text-gray-200 focus:ring-blue-400' : 'border-2 border-blue-400 focus:ring-blue-500'}`}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                {/* Tags */}
                <div>
                    <label htmlFor="tags" className={`block mb-2 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Tags <span className="text-red-500">*</span>
                    </label>
                    <Controller
                        control={control}
                        name="tags"
                        rules={{
                            required: 'Please select at least one tag',
                            validate: value => (value && value.length > 0) || 'Please select at least one tag',
                        }}
                        render={({ field }) => {
                            const handleCreate = (inputValue) => {
                                const newTag = { value: inputValue, label: `#${inputValue}` };
                                setTags((prev) => [...prev, newTag]);
                                field.onChange([...(field.value || []), newTag]);
                            };

                            return (
                                <CreatableSelect
                                    {...field}
                                    inputId="tags"
                                    isMulti
                                    options={tags}
                                    onCreateOption={handleCreate}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    placeholder="Select or create tags..."
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            minHeight: '44px',
                                            padding: '2px',
                                            backgroundColor: darkMode ? '#1e293b' : undefined,
                                            color: darkMode ? 'white' : undefined,
                                            borderColor: darkMode ? '#2563eb' : '#60a5fa',
                                            boxShadow: darkMode ? '0 0 0 1px #2563eb' : undefined,
                                        }),
                                        input: (base) => ({ ...base, color: darkMode ? 'white' : undefined }),
                                        multiValue: (base) => ({
                                            ...base,
                                            backgroundColor: darkMode ? '#2563eb' : '#e0e7ff',
                                            color: 'white',
                                        }),
                                        multiValueLabel: (base) => ({ ...base, color: 'white' }),
                                        placeholder: (base) => ({ ...base, color: darkMode ? '#cbd5e1' : undefined }),
                                        singleValue: (base) => ({ ...base, color: darkMode ? 'white' : undefined }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: darkMode ? '#1e293b' : undefined,
                                            color: darkMode ? 'white' : undefined,
                                        }),
                                        option: (base, { isFocused, isSelected }) => ({
                                            ...base,
                                            backgroundColor: isSelected
                                                ? '#2563eb'
                                                : isFocused
                                                    ? '#374151'
                                                    : darkMode
                                                        ? '#1e293b'
                                                        : undefined,
                                            color: 'white',
                                            cursor: 'pointer',
                                        }),
                                    }}
                                />
                            );
                        }}
                    />
                    {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>}
                </div>

                {/* Submit button */}
                <div className="text-center pt-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={submitting}
                        className={`w-full cursor-pointer text-white px-10 py-4 rounded-xl shadow-lg font-semibold transition 
                            ${darkMode ? 'bg-gradient-to-r from-blue-700 to-indigo-800 disabled:opacity-60' : 'bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-60'}`}
                    >
                        {submitting ? 'Submitting...' : '🚀 Submit Post'}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export default AddPost;
