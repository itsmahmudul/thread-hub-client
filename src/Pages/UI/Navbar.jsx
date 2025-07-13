import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router";
import {
    FaBell,
    FaBars,
    FaChevronDown,
    FaTimes,
    FaUserCircle,
    FaMoon,
    FaSun,
} from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAnnouncements from "../../Hooks/useAnnouncements";
import logo from "../../assets/logo.png";

const Navbar = () => {
    const { user, logOutUser, darkMode, toggleDarkMode } = useAuth();
    const announcements = useAnnouncements(); // array of announcements

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [annDropdownOpen, setAnnDropdownOpen] = useState(false);

    const dropdownRef = useRef();
    const annDropdownRef = useRef();

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (annDropdownRef.current && !annDropdownRef.current.contains(e.target)) {
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

    // NavLink styling helper
    const navLinkClass = ({ isActive }) =>
        `font-medium transition duration-300 ${isActive
            ? darkMode
                ? "text-blue-400"
                : "text-blue-600"
            : darkMode
                ? "text-gray-300 hover:text-blue-400"
                : "text-gray-700 hover:text-blue-500"
        }`;

    return (
        <nav
            className={`sticky top-0 px-6 py-4 flex items-center justify-between z-50 animate-fadeIn
        ${darkMode
                    ? "bg-gray-900 bg-opacity-90 border-b border-gray-700 text-gray-300"
                    : "bg-white bg-opacity-90 border-b border-gray-200 text-gray-700"
                }
      `}
        >
            {/* Logo and Brand */}
            <Link to="/">
                <div className="flex items-center gap-2 animate-slideInLeft">
                    <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
                    <span className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        ThreadHub
                    </span>
                </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 relative">
                <NavLink to="/" className={navLinkClass}>
                    Home
                </NavLink>
                <NavLink to="/membership" className={navLinkClass}>
                    Membership
                </NavLink>

                {/* Announcements Dropdown */}
                <div className="relative" ref={annDropdownRef}>
                    <button
                        className={`relative cursor-pointer hover:transition duration-300 ${darkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                            }`}
                        aria-label="Announcements"
                        onClick={() => setAnnDropdownOpen(!annDropdownOpen)}
                    >
                        <FaBell size={20} />
                        {announcements.length > 0 && (
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1 animate-pingOnce">
                                {announcements.length}
                            </span>
                        )}
                    </button>

                    {annDropdownOpen && announcements.length > 0 && (
                        <div
                            className={`absolute right-0 mt-2 w-80 max-h-72 overflow-y-auto rounded-lg shadow-lg z-50 p-4 ${darkMode
                                    ? "bg-gray-800 text-white border border-gray-700"
                                    : "bg-white text-gray-800 border border-gray-200"
                                }`}
                        >
                            <h3 className="text-lg font-semibold mb-2">Announcements</h3>
                            <ul className="space-y-2 text-sm">
                                {announcements.map(({ _id, title, message, createdAt }) => (
                                    <li key={_id} className="border-b pb-2 last:border-none">
                                        <p className="font-medium">{title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{message}</p>
                                        <small className="text-xs text-gray-400">
                                            {new Date(createdAt).toLocaleString()}
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Dark Mode Toggle Button */}
                <button
                    onClick={toggleDarkMode}
                    className={`ml-4 flex items-center transition duration-300 ${darkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                        }`}
                    aria-label="Toggle dark mode"
                    title="Toggle dark mode"
                >
                    {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                </button>

                {/* User Section */}
                {!user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-transform duration-300 transform hover:scale-105 ${darkMode ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen}
                        >
                            Join Us <FaChevronDown className="text-sm" />
                        </button>

                        {dropdownOpen && (
                            <div
                                className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg z-50 animate-dropdownFade
                  ${darkMode
                                        ? "bg-gray-800 border border-gray-700 text-gray-300"
                                        : "bg-white border border-gray-200 text-gray-700"
                                    }
                `}
                            >
                                <NavLink
                                    to="/login"
                                    onClick={() => setDropdownOpen(false)}
                                    className={`block px-4 py-2 hover:transition hover:bg-blue-700 ${darkMode ? "hover:text-white" : "hover:bg-gray-100"
                                        }`}
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    onClick={() => setDropdownOpen(false)}
                                    className={`block px-4 py-2 hover:transition hover:bg-blue-700 ${darkMode ? "hover:text-white" : "hover:bg-gray-100"
                                        }`}
                                >
                                    Sign Up
                                </NavLink>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen}
                        >
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || "User"}
                                    className={`h-8 w-8 rounded-full object-cover border ${darkMode ? "border-gray-600" : "border-gray-300"
                                        }`}
                                />
                            ) : (
                                <FaUserCircle
                                    className={`h-8 w-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                />
                            )}
                            <FaChevronDown className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`} />
                        </button>

                        {dropdownOpen && (
                            <div
                                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 animate-dropdownFade
                  ${darkMode
                                        ? "bg-gray-800 border border-gray-700 text-gray-300"
                                        : "bg-white border border-gray-200 text-gray-700"
                                    }
                `}
                            >
                                <div
                                    className={`px-4 py-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"} font-semibold`}
                                >
                                    {user.displayName || "User"}
                                </div>
                                <NavLink
                                    to="/dashboard"
                                    onClick={() => setDropdownOpen(false)}
                                    className={`block px-4 py-2 hover:transition ${darkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-100"
                                        }`}
                                >
                                    Dashboard
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className={`w-full text-left px-4 py-2 transition ${darkMode ? "text-red-500 hover:bg-red-700" : "text-red-600 hover:bg-red-50"
                                        }`}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 lg:hidden">
                <button
                    className={`focus:outline-none ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                    title="Toggle menu"
                >
                    {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div
                    className={`absolute top-full left-0 w-full rounded-b-md py-4 flex flex-col z-50 animate-dropdownFade shadow-lg
            ${darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-700"}`}
                >
                    {/* Dark Mode Toggle INSIDE mobile menu */}
                    <button
                        onClick={toggleDarkMode}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition ${darkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                            }`}
                        aria-label="Toggle dark mode"
                        title="Toggle dark mode"
                    >
                        {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                        <span>Dark Mode</span>
                    </button>

                    {/* Announcements in mobile menu */}
                    <button
                        onClick={() => setAnnDropdownOpen(!annDropdownOpen)}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition cursor-pointer ${darkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-100 hover:text-gray-700"
                            }`}
                    >
                        <FaBell size={20} />
                        <span>Announcements</span>
                        {announcements.length > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2">
                                {announcements.length}
                            </span>
                        )}
                    </button>

                    {annDropdownOpen && announcements.length > 0 && (
                        <ul className="px-8 py-2 space-y-2 max-h-48 overflow-y-auto text-sm border-t border-gray-300 dark:border-gray-700">
                            {announcements.map(({ _id, title, message, createdAt }) => (
                                <li key={_id} className="border-b pb-1 last:border-none">
                                    <p className="font-medium">{title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{message}</p>
                                    <small className="text-xs text-gray-400">
                                        {new Date(createdAt).toLocaleString()}
                                    </small>
                                </li>
                            ))}
                        </ul>
                    )}

                    <NavLink
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-6 py-3 font-medium transition ${darkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-100 hover:text-gray-700"
                            }`}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/membership"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-6 py-3 font-medium transition ${darkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-100 hover:text-gray-700"
                            }`}
                    >
                        Membership
                    </NavLink>

                    {!user ? (
                        <>
                            <NavLink
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-6 py-3 font-medium transition ${darkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-100 hover:text-gray-700"
                                    }`}
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-6 py-3 font-medium transition ${darkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-100 hover:text-gray-700"
                                    }`}
                            >
                                Sign Up
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <div
                                className={`px-6 py-3 font-semibold border-b ${darkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-700"
                                    }`}
                            >
                                {user.displayName || "User"}
                            </div>
                            <NavLink
                                to="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-6 py-3 font-medium transition ${darkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-100 hover:text-gray-700"
                                    }`}
                            >
                                Dashboard
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className={`px-6 py-3 font-medium text-red-600 transition hover:bg-red-700 hover:text-red-200 ${darkMode ? "hover:bg-red-700" : "hover:bg-red-50"
                                    }`}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
