import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosPublic from '../../Hooks/useAxiosPublic';

const BannerSearch = () => {
    const axiosPublic = useAxiosPublic();
    const [searchTag, setSearchTag] = useState('');
    const [queryTag, setQueryTag] = useState('');

    const { data: searchResults = [], isLoading } = useQuery({
        queryKey: ['search-tag', queryTag],
        enabled: !!queryTag,
        queryFn: async () => {
            const res = await axiosPublic.get(`/posts/search?tag=${queryTag}`);
            return res.data;
        },
    });

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTag.trim()) {
            setQueryTag(searchTag.trim().toLowerCase());
        }
    };

    const handleQuickTag = (tag) => {
        setSearchTag(tag);
        setQueryTag(tag);
    };

    return (
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 py-12 px-4 text-white">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to ThreadHub</h1>
                <p className="mb-6 text-lg">Search for posts by tag</p>

                <form onSubmit={handleSearch} className="flex justify-center gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Enter tag (e.g. react, mongodb)"
                        value={searchTag}
                        onChange={(e) => setSearchTag(e.target.value)}
                        className="px-4 py-2 w-1/2 text-black rounded-l-md"
                    />
                    <button
                        type="submit"
                        className="bg-white text-blue-800 px-4 py-2 rounded-r-md font-semibold"
                    >
                        Search
                    </button>
                </form>

                {/* Optional Quick Tags */}
                <div className="flex justify-center gap-4 mt-2">
                    {['react', 'javascript', 'mongodb'].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleQuickTag(tag)}
                            className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-full text-sm"
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search Result Section */}
            {queryTag && (
                <div className="mt-10 max-w-5xl mx-auto bg-white text-black p-6 rounded-md shadow">
                    <h2 className="text-xl font-bold mb-4">
                        Showing results for <span className="text-blue-700">#{queryTag}</span>
                    </h2>

                    {isLoading ? (
                        <p>Loading...</p>
                    ) : searchResults.length > 0 ? (
                        <div className="grid gap-4">
                            {searchResults.map((post) => (
                                <Link
                                    to={`/post/${post._id}`}
                                    key={post._id}
                                    className="block p-4 border rounded hover:bg-gray-100 transition"
                                >
                                    <h3 className="font-semibold text-lg">{post.title}</h3>
                                    <p className="text-sm text-gray-600">Tags: {post.tags.join(', ')}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p>No posts found with this tag.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BannerSearch;
