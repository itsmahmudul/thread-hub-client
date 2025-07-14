import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import {
    FaBell,
    FaBars,
    FaChevronDown,
    FaTimes,
    FaUserCircle,
    FaMoon,
    FaSun,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../Hooks/useAuth";
import useAnnouncements from "../../Hooks/useAnnouncements";
import logo from "../../assets/logo.png";

const Navbar = () => {
    const { user, logOutUser, darkMode, toggleDarkMode } = useAuth();
    const announcements = useAnnouncements();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [annDropdownOpen, setAnnDropdownOpen] = useState(false);

    const dropdownRef = useRef();
    const annDropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (
                annDropdownRef.current &&
                !annDropdownRef.current.contains(e.target)
            ) {
                setAnnDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logOutUser();
            setDropdownOpen(false);
            setMobileMenuOpen(false);
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const navLinkClass = ({ isActive }) =>
        `block font-semibold transition duration-300 px-4 py-2 rounded-md ${isActive
            ? darkMode
                ? "text-blue-400 bg-gray-800"
                : "text-blue-600 bg-blue-100"
            : darkMode
                ? "text-gray-300 hover:text-blue-400 hover:bg-gray-700"
                : "text-gray-700 hover:text-blue-500 hover:bg-gray-200"
        }`;

    return (
        <nav
            className={`sticky top-0 z-50 backdrop-blur-lg border-b shadow-md transition-all duration-300 ${darkMode
                    ? "bg-gray-900/90 border-gray-700 text-gray-200"
                    : "bg-white/90 border-gray-200 text-gray-800"
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="ThreadHub Logo" className="h-9 w-9" />
                    <span className="text-2xl font-extrabold tracking-wide">
                        ThreadHub
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-4">
                    <NavLink to="/" className={navLinkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/membership" className={navLinkClass}>
                        Membership
                    </NavLink>

                    {/* Announcements */}
                    <div className="relative" ref={annDropdownRef}>
                        <button
                            className="relative p-2 rounded-md hover:bg-opacity-10 focus:outline-none"
                            onClick={() => setAnnDropdownOpen(!annDropdownOpen)}
                        >
                            <FaBell size={20} />
                            {announcements.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white text-xs font-bold flex items-center justify-center rounded-full animate-pingOnce">
                                    {announcements.length}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {annDropdownOpen && announcements.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute right-0 mt-2 w-80 max-h-72 overflow-y-auto rounded-lg shadow-lg p-4 z-50 ${darkMode
                                            ? "bg-gray-800 text-white border border-gray-700"
                                            : "bg-white text-gray-800 border border-gray-200"
                                        }`}
                                >
                                    <h3 className="text-lg font-semibold mb-2">Announcements</h3>
                                    <ul className="space-y-2 text-sm">
                                        {announcements.map(({ _id, title, message, createdAt }) => (
                                            <li key={_id} className="border-b pb-2 last:border-none">
                                                <p className="font-medium">{title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {message}
                                                </p>
                                                <small className="text-xs text-gray-400">
                                                    {new Date(createdAt).toLocaleString()}
                                                </small>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-md focus:outline-none"
                    >
                        {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                    </button>

                    {/* Auth */}
                    <div className="relative" ref={dropdownRef}>
                        {!user ? (
                            <>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-all"
                                >
                                    Join Us <FaChevronDown className="text-sm" />
                                </button>
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg z-50 ${darkMode
                                                    ? "bg-gray-800 border border-gray-700 text-gray-300"
                                                    : "bg-white border border-gray-200 text-gray-700"
                                                }`}
                                        >
                                            <NavLink
                                                to="/login"
                                                onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2 hover:bg-blue-500 hover:text-white rounded-t-md"
                                            >
                                                Login
                                            </NavLink>
                                            <NavLink
                                                to="/signup"
                                                onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2 hover:bg-blue-500 hover:text-white rounded-b-md"
                                            >
                                                Sign Up
                                            </NavLink>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2"
                                >
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="User"
                                            className="h-9 w-9 rounded-full object-cover border"
                                        />
                                    ) : (
                                        <FaUserCircle className="h-8 w-8" />
                                    )}
                                    <FaChevronDown className="text-sm" />
                                </button>
                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${darkMode
                                                    ? "bg-gray-800 border border-gray-700 text-gray-300"
                                                    : "bg-white border border-gray-200 text-gray-700"
                                                }`}
                                        >
                                            <div className="px-4 py-2 border-b font-semibold">
                                                {user.displayName || "User"}
                                            </div>
                                            <NavLink
                                                to="/dashboard"
                                                onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2 hover:bg-blue-500 hover:text-white"
                                            >
                                                Dashboard
                                            </NavLink>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-700 hover:text-white"
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex items-center lg:hidden">
                    <button
                        className="p-2 focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`lg:hidden border-t px-4 py-5 space-y-4 shadow-md ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
                            }`}
                    >
                        {/* Navigation */}
                        <div
                            className={`rounded-xl px-4 py-3 shadow-sm ${darkMode ? "bg-gray-800" : "bg-gray-100"
                                }`}
                        >
                            <NavLink
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={navLinkClass}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/membership"
                                onClick={() => setMobileMenuOpen(false)}
                                className={navLinkClass}
                            >
                                Membership
                            </NavLink>
                        </div>

                        {/* Theme */}
                        <div
                            className={`rounded-xl px-4 py-3 flex items-center justify-between shadow-sm ${darkMode ? "bg-gray-800" : "bg-gray-100"
                                }`}
                        >
                            <span className="font-semibold">Theme</span>
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full border hover:scale-105 transition-transform"
                            >
                                {darkMode ? <FaSun /> : <FaMoon />}
                            </button>
                        </div>

                        {/* Auth Section with Photo on Right */}
                        <div
                            className={`rounded-xl px-4 py-3 shadow-sm space-y-2 ${darkMode ? "bg-gray-800" : "bg-gray-100"
                                }`}
                        >
                            {user ? (
                                <>
                                    <div className="flex items-center justify-between px-2 pb-2 border-b border-gray-400 dark:border-gray-600">
                                        <div className="font-semibold">
                                            {user.displayName || "User"}
                                        </div>
                                        <img
                                            src={user.photoURL}
                                            alt="User"
                                            className="h-10 w-10 rounded-full object-cover border"
                                        />
                                    </div>

                                    <NavLink
                                        to="/dashboard"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={navLinkClass}
                                    >
                                        Dashboard
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-md"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={navLinkClass}
                                    >
                                        Login
                                    </NavLink>
                                    <NavLink
                                        to="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={navLinkClass}
                                    >
                                        Sign Up
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
