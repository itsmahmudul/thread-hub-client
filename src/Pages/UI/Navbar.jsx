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
import logo from "../../assets/logo.png";

const Navbar = () => {
    const { user, logOutUser, darkMode, toggleDarkMode } = useAuth();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
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

    // Helper for link styling depending on darkMode & active
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

                {/* Notification Button */}
                <button
                    className={`relative hover:transition duration-300 ${darkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                        }`}
                    aria-label="Notifications"
                >
                    <FaBell size={20} />
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1 animate-pingOnce">
                        3
                    </span>
                </button>

                {/* Dark Mode Toggle Button - DESKTOP only */}
                <button
                    onClick={toggleDarkMode}
                    className={`ml-4 flex items-center transition duration-300 ${darkMode ? "text-gray-300 hover:text-blue-400" : "text-gray-700 hover:text-blue-600"
                        }`}
                    aria-label="Toggle dark mode"
                    title="Toggle dark mode"
                >
                    {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
                </button>

                {/* User Section: Join Us or Dropdown */}
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
                                    className={`px-4 py-2 border-b ${darkMode ? "border-gray-700" : "border-gray-200"
                                        } font-semibold`}
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

                    {/* Notifications */}
                    <button
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition ${darkMode ? "hover:bg-gray-700 hover:text-white" : "hover:bg-gray-100 hover:text-gray-700"
                            }`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaBell size={20} />
                        <span>Notifications</span>
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2">
                            3
                        </span>
                    </button>

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
