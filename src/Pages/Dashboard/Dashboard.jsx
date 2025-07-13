// src/Pages/Dashboard/Dashboard.jsx
import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import useAuth from '../../Hooks/useAuth';
import { FaHome, FaUserCircle, FaPlusCircle, FaThList, FaMoon, FaSun } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Dashboard = () => {
    const { darkMode, toggleDarkMode } = useAuth();

    const linkStyle = `flex items-center gap-2 px-3 py-2 rounded transition duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-700'
        }`;

    return (
        <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            {/* Sidebar */}
            <aside className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-blue-800'} text-white p-4`}>
                <Link to="/">
                    <div className="flex items-center gap-2 mb-6">
                        <img src={logo} alt="Logo" className="w-8 h-8 rounded" />
                        <h2 className="text-2xl font-bold">Dashboard</h2>
                    </div>
                </Link>

                <nav className="flex flex-col space-y-2">
                    <NavLink to="/" className={linkStyle}>
                        <FaHome /> Home
                    </NavLink>
                    <NavLink to="profile" className={linkStyle}>
                        <FaUserCircle /> My Profile
                    </NavLink>
                    <NavLink to="add-post" className={linkStyle}>
                        <FaPlusCircle /> Add Post
                    </NavLink>
                    <NavLink to="my-posts" className={linkStyle}>
                        <FaThList /> My Posts
                    </NavLink>
                </nav>

                <div className="mt-8">
                    <button
                        onClick={toggleDarkMode}
                        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded font-semibold transition duration-200 ${darkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-white text-blue-800 hover:bg-gray-100'
                            }`}
                    >
                        {darkMode ? <FaSun /> : <FaMoon />}
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Dashboard;
