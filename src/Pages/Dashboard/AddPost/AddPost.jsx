import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import useAuth from '../../../Hooks/useAuth';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import { FaStar, FaSpinner } from 'react-icons/fa';

const AddPost = () => {
  const { user, darkMode } = useAuth();
  const axiosSecure = useAxiosPublic();
  const [isAllowed, setIsAllowed] = useState(false);
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ page loader state
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch subscription
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?.email) {
        setSubscription(null);
        return;
      }
      try {
        const res = await axiosSecure.get('/users', { params: { email: user.email } });
        setSubscription(res.data.subscription || null);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
        setSubscription(null);
      }
    };
    fetchSubscription();
  }, [user?.email, axiosSecure]);

  // Check permissions and tags
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        setLoading(true); // ✅ start page loader
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
      } finally {
        setLoading(false); // ✅ stop page loader
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
      authorName: user.displayName || user.authorName,
      authorImage: user.photoURL || user.authorImage,
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

  // ✅ PAGE LOADER
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
        <FaSpinner className="animate-spin text-5xl text-white" />
      </div>
    );
  }

  // After loading:
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
        >
          Become a Member
        </button>
      </motion.div>
    );
  }

  return (
    <>
      {/* ✅ Optional submitting overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <FaSpinner className="animate-spin text-5xl text-white" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-3xl mx-auto border border-pink-100 p-10 mt-12 backdrop-blur-lg shadow-2xl rounded-2xl 
          ${darkMode ? 'bg-gray-900/90 text-gray-200' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800'}`}
      >
        {(user.photoURL) && (
          <div className="relative w-24 h-24 mx-auto mb-6 flex justify-center items-center">
            <img
              src={user.photoURL}
              alt={`${user.displayName || 'Author'}'s avatar`}
              className={`w-24 h-24 rounded-full object-cover shadow-lg border-4 
                ${darkMode ? 'border-blue-600' : 'border-blue-400'}`}
            />
            {subscription === 'gold' && (
              <FaStar
                size={28}
                color="#facc15"
                title="Gold Subscriber"
                className="absolute top-1 right-1 rounded-full p-[2px] animate-pulse drop-shadow-md"
              />
            )}
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
                value={user.displayName || user.authorName || ''}
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
                value={user.email || ''}
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
              render={({ field }) => (
                <Select
                  {...field}
                  inputId="tags"
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
                      backgroundColor: darkMode ? '#1e293b' : 'white',
                      color: darkMode ? 'white' : 'black',
                      borderColor: darkMode ? '#2563eb' : '#60a5fa',
                      boxShadow: darkMode ? '0 0 0 1px #2563eb' : undefined,
                    }),
                    input: (base) => ({
                      ...base,
                      color: darkMode ? 'white' : 'black',
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: darkMode ? '#2563eb' : '#e0e7ff',
                      color: darkMode ? 'white' : 'black',
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: darkMode ? 'white' : 'black',
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: darkMode ? '#cbd5e1' : '#6b7280', // gray-500 for light mode placeholder
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: darkMode ? 'white' : 'black',
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: darkMode ? '#1e293b' : 'white',
                      color: darkMode ? 'white' : 'black',
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                      ...base,
                      backgroundColor: isSelected
                        ? (darkMode ? '#2563eb' : '#3b82f6') // blue-500 for light mode selected
                        : isFocused
                          ? (darkMode ? '#374151' : '#e0e7ff') // gray-700 or blue-200
                          : darkMode
                            ? '#1e293b'
                            : 'white',
                      color: isSelected || isFocused ? 'white' : 'black',
                      cursor: 'pointer',
                    }),
                  }}

                />
              )}
            />
            {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>}
          </div>

          {/* Submit */}
          <div className="text-center pt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={submitting}
              className={`w-full cursor-pointer text-white px-10 py-4 rounded-xl shadow-lg font-semibold transition 
                ${darkMode ? 'bg-gradient-to-r from-blue-700 to-indigo-800 disabled:opacity-60' : 'bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-60'}`}
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin text-xl" />
                  Submitting...
                </div>
              ) : (
                '🚀 Submit Post'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default AddPost;
