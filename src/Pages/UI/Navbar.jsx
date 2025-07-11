import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router";
import { FaBell, FaBars, FaChevronDown, FaTimes, FaUserCircle } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import logo from "../../assets/logo.png";

const Navbar = () => {
    const { user, logOutUser } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            setMobileMenuOpen(false);
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

            {/* Desktop Navigation + User Controls */}
            <div className="hidden lg:flex items-center gap-6 relative">
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

            {/* Mobile Menu Button */}
            <button
                className="lg:hidden text-gray-700 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-md py-4 flex flex-col z-50 animate-dropdownFade lg:hidden">
                    {/* Notifications item */}
                    <button
                        className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 transition font-medium"
                        onClick={() => {
                            // You can handle notification click here
                            setMobileMenuOpen(false);
                        }}
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
                        className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition font-medium"
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/membership"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition font-medium"
                    >
                        Membership
                    </NavLink>

                    {!user ? (
                        <>
                            <NavLink
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition font-medium"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition font-medium"
                            >
                                Sign Up
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <div className="px-6 py-3 text-gray-700 font-semibold border-b border-gray-200">
                                {user.displayName || "User"}
                            </div>
                            <NavLink
                                to="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-6 py-3 text-gray-700 hover:bg-gray-100 transition font-medium"
                            >
                                Dashboard
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="text-left px-6 py-3 text-red-600 hover:bg-red-50 transition font-medium"
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
