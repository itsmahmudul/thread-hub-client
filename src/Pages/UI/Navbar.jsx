import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router";
import { FaBell, FaChevronDown, FaUserCircle } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import logo from "../../assets/logo.png";

const Navbar = () => {
    const { user, logOutUser } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    // Close dropdown on outside click
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
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <nav className="sticky top-0 bg-white bg-opacity-90 backdrop-blur shadow-md px-6 py-4 flex items-center justify-between z-50 animate-fadeIn">
            {/* Logo + Name */}
            <Link to="/">
                <div className="flex items-center gap-2 animate-slideInLeft">
                    <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
                    <span className="text-2xl font-bold text-gray-800">ThreadHub</span>
                </div>
            </Link>

            {/* Navigation + User Controls */}
            <div className="flex items-center gap-6 relative">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `font-medium transition duration-300 ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-500"
                        }`
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/membership"
                    className={({ isActive }) =>
                        `font-medium transition duration-300 ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-500"
                        }`
                    }
                >
                    Membership
                </NavLink>

                {/* Notification Icon */}
                <button className="relative text-gray-700 hover:text-blue-600 transition duration-300">
                    <FaBell size={20} />
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1 animate-pingOnce">
                        3
                    </span>
                </button>

                {/* Join Us or User Dropdown */}
                {!user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-transform duration-300 transform hover:scale-105"
                        >
                            Join Us <FaChevronDown className="text-sm" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-dropdownFade">
                                <NavLink
                                    to="/login"
                                    onClick={() => setDropdownOpen(false)}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/signup"
                                    onClick={() => setDropdownOpen(false)}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
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
                        >
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || "User"}
                                    className="h-8 w-8 rounded-full object-cover border border-gray-300"
                                />
                            ) : (
                                <FaUserCircle className="h-8 w-8 text-gray-500" />
                            )}
                            <FaChevronDown className="text-sm text-gray-600" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-dropdownFade">
                                <div className="px-4 py-2 border-b border-gray-200 text-gray-700 font-semibold">
                                    {user.displayName || "User"}
                                </div>
                                <NavLink
                                    to="/dashboard"
                                    onClick={() => setDropdownOpen(false)}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                >
                                    Dashboard
                                </NavLink>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
