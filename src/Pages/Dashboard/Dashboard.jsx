import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import {
    FaHome,
    FaUserCircle,
    FaPlusCircle,
    FaThList,
    FaMoon,
    FaSun,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import logo from "../../assets/logo.png";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const Dashboard = () => {
    const { darkMode, toggleDarkMode, user } = useAuth();
    const axiosPublic = useAxiosPublic();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axiosPublic.get("/users", {
                    params: { email: user?.email },
                });
                setUserRole(response.data.role);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setUserRole(null);
            }
        };

        if (user?.email) {
            fetchUserRole();
        }
    }, [user?.email, axiosPublic]);

    const navLinks = (
        <>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                        ? "bg-indigo-500 text-white shadow-md"
                        : darkMode
                            ? "hover:bg-gray-700 hover:text-white"
                            : "hover:bg-indigo-100 hover:text-indigo-800"
                    }`
                }
            >
                <FaHome /> Home
            </NavLink>
            <NavLink
                to="profile"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                        ? "bg-indigo-500 text-white shadow-md"
                        : darkMode
                            ? "hover:bg-gray-700 hover:text-white"
                            : "hover:bg-indigo-100 hover:text-indigo-800"
                    }`
                }
            >
                <FaUserCircle /> My Profile
            </NavLink>
            <NavLink
                to="add-post"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                        ? "bg-indigo-500 text-white shadow-md"
                        : darkMode
                            ? "hover:bg-gray-700 hover:text-white"
                            : "hover:bg-indigo-100 hover:text-indigo-800"
                    }`
                }
            >
                <FaPlusCircle /> Add Post
            </NavLink>
            <NavLink
                to="my-posts"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                        ? "bg-indigo-500 text-white shadow-md"
                        : darkMode
                            ? "hover:bg-gray-700 hover:text-white"
                            : "hover:bg-indigo-100 hover:text-indigo-800"
                    }`
                }
            >
                <FaThList /> My Posts
            </NavLink>

            {userRole === "admin" && (
                <NavLink
                    to="/dashboard/admin/admin-profile"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                            ? "bg-indigo-500 text-white shadow-md"
                            : darkMode
                                ? "hover:bg-gray-700 hover:text-white"
                                : "hover:bg-indigo-100 hover:text-indigo-800"
                        }`
                    }
                >
                    <MdSpaceDashboard /> Admin
                </NavLink>
            )}
        </>
    );

    return (
        <div
            className={`min-h-screen ${darkMode
                    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
                    : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-black"
                }`}
        >
            {/* ✅ Desktop Version */}
            <div className="hidden lg:flex">
                {/* Sidebar */}
                <aside
                    className={`w-64 h-screen flex flex-col justify-between backdrop-blur-md shadow-2xl rounded-r-3xl overflow-hidden ${darkMode ? "bg-gray-800/90 text-white" : "bg-white/80 text-indigo-900"
                        }`}
                >
                    <div>
                        <div className="flex items-center gap-2 p-4 border-b border-indigo-200 dark:border-gray-700">
                            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg shadow-md" />
                            <h2
                                className={`text-xl font-bold ${darkMode ? "text-white" : "text-indigo-800"
                                    }`}
                            >
                                Dashboard
                            </h2>
                        </div>
                        <nav className="flex flex-col space-y-2 p-4">{navLinks}</nav>
                    </div>
                    <div className="p-4 border-t border-indigo-200 dark:border-gray-700">
                        <button
                            onClick={toggleDarkMode}
                            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold shadow-md transition duration-200 ${darkMode
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                }`}
                        >
                            {darkMode ? <FaSun /> : <FaMoon />}
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>

            {/* ✅ Mobile Version */}
            <div className="lg:hidden flex flex-col min-h-screen">
                {/* Topbar */}
                <header
                    className={`flex items-center justify-between p-4 shadow-md ${darkMode
                            ? "bg-gray-800 text-white"
                            : "bg-white/80 backdrop-blur-md text-indigo-900"
                        }`}
                >
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-2xl"
                        aria-label="Open menu"
                    >
                        <FaBars />
                    </button>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>

                {/* Slide-in Sidebar */}
                <aside
                    className={`fixed top-0 left-0 h-screen w-64 z-50 flex flex-col justify-between
            backdrop-blur-md shadow-2xl overflow-hidden transition-transform duration-300
            ${darkMode ? "bg-gray-800/90 text-white" : "bg-white/90 text-indigo-900"
                        }
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
                >
                    <div>
                        <div className="flex items-center justify-between p-4 border-b border-indigo-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    className="w-10 h-10 rounded-lg shadow-md"
                                />
                                <h2
                                    className={`text-xl font-bold ${darkMode ? "text-white" : "text-indigo-800"
                                        }`}
                                >
                                    Dashboard
                                </h2>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-2xl"
                                aria-label="Close menu"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <nav
                            className="flex flex-col space-y-2 p-4"
                            onClick={() => setSidebarOpen(false)}
                        >
                            {navLinks}
                        </nav>
                    </div>
                    <div className="p-4 border-t border-indigo-200 dark:border-gray-700">
                        <button
                            onClick={toggleDarkMode}
                            className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold shadow-md transition duration-200 ${darkMode
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                }`}
                        >
                            {darkMode ? <FaSun /> : <FaMoon />}
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Dashboard;
