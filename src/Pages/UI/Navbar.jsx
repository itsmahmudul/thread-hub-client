import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { FaBell, FaChevronDown, FaUserCircle } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import logo from "../../assets/logo.png";

const Navbar = () => {
    const { user, logOutUser } = useAuth();
    console.log(user);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    // Close dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle logout
    const handleLogout = async () => {
        try {
            await logOutUser();
            setDropdownOpen(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="bg-white shadow-md p-4 px-6 flex items-center justify-between">
            {/* Left: Logo + Name */}
            <div className="flex items-center space-x-2">
                <img src={logo} alt="Logo" className="h-8 w-8" />
                <span className="text-xl font-bold text-gray-800">ThreadHub</span>
            </div>

            {/* Right: Nav Links + User / Join Us */}
            <div className="flex items-center space-x-6 relative">
                <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
                    Home
                </Link>
                <Link to="/membership" className="text-gray-700 hover:text-blue-600 font-medium">
                    Membership
                </Link>
                <button className="text-gray-700 hover:text-blue-600 relative">
                    <FaBell size={20} />
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                        3
                    </span>
                </button>

                {!user ? (
                    // If no user, show Join Us dropdown
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition"
                        >
                            Join Us <FaChevronDown className="text-sm" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <Link
                                    to="/login"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    // If user is logged in, show profile picture and dropdown
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 focus:outline-none"
                        >
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || "User"}
                                    className="h-8 w-8 rounded-full object-cover border border-gray-300"
                                />
                            ) : (
                                <FaUserCircle className="h-8 w-8 text-gray-400" />
                            )}
                            <FaChevronDown className="text-sm text-gray-600" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-2">
                                <div className="px-4 py-2 border-b border-gray-200 text-gray-700 font-semibold select-none">
                                    {user.displayName || "User"}
                                </div>
                                <Link
                                    to="/dashboard"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
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
