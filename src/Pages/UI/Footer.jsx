import React from "react";
import { Link } from "react-router";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import logo from "../../assets/logo.png";
import useAuth from "../../Hooks/useAuth";

const Footer = () => {
    const { darkMode } = useAuth();

    return (
        <footer className={`${darkMode ? 'bg-gray-900 text-gray-300 border-gray-700' : 'bg-white text-gray-700 border-gray-200'} border-t py-10 px-6 sm:px-12 transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* Logo & About */}
                <div>
                    <Link to="/" className="flex items-center gap-2 mb-4">
                        <img src={logo} alt="Logo" className="h-10 w-10" />
                        <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>ThreadHub</span>
                    </Link>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        A modern forum to share ideas, explore knowledge, and engage with a vibrant tech community.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className={`hover:text-sky-600 transition ${darkMode ? 'text-gray-400 hover:text-sky-400' : 'text-gray-600'}`}>Home</Link></li>
                        <li><Link to="/membership" className={`hover:text-orange-500 transition ${darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600'}`}>Membership</Link></li>
                        <li><Link to="/login" className={`hover:text-green-600 transition ${darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-600'}`}>Join Us</Link></li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Connect With Us</h4>
                    <div className={`flex gap-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className={`${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-600'}`}>
                            <FaFacebookF size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className={`${darkMode ? 'hover:text-sky-300' : 'hover:text-sky-500'}`}>
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={`${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-700'}`}>
                            <FaLinkedinIn size={20} />
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className={`${darkMode ? 'hover:text-white' : 'hover:text-gray-800'}`}>
                            <FaGithub size={20} />
                        </a>
                    </div>

                    <div className={`mt-4 text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p>Email: support@threadhub.com</p>
                        <p>Phone: +1 (234) 567-8901</p>
                    </div>
                </div>
            </div>

            {/* Horizontal line */}
            <hr className={`mt-10 ${darkMode ? 'border-gray-700' : 'border-gray-300'}`} />

            {/* Copyright */}
            <div className={`mt-6 text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                &copy; {new Date().getFullYear()} ThreadHub. Built with 💙
            </div>
        </footer>
    );
};

export default Footer;
