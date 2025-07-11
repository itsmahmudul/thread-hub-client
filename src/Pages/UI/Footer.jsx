import React from "react";
import { Link } from "react-router";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";
import logo from "../../assets/logo.png";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 px-6 sm:px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">

                {/* Logo & Description */}
                <div className="flex flex-col items-start space-y-3 md:w-1/3">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="ThreadHub Logo" className="h-10 w-10" />
                        <span className="text-2xl font-bold text-white">ThreadHub</span>
                    </Link>
                    <p className="text-gray-400 mt-2 leading-relaxed">
                        ThreadHub is your go-to forum for meaningful conversations, sharing knowledge, and connecting with community members.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col space-y-4 md:w-1/4">
                    <h3 className="text-white font-semibold text-lg mb-2">Quick Links</h3>
                    <nav className="flex flex-col space-y-1">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <Link to="/membership" className="hover:text-white transition">Membership</Link>
                        <Link to="/login" className="hover:text-white transition">Join Us</Link>
                    </nav>
                </div>

                {/* Social Media & Contact */}
                <div className="flex flex-col space-y-4 md:w-1/3">
                    <h3 className="text-white font-semibold text-lg mb-2">Connect with Us</h3>
                    <div className="flex space-x-4 text-gray-400">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-white transition">
                            <FaFacebookF size={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-white transition">
                            <FaTwitter size={20} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-white transition">
                            <FaLinkedinIn size={20} />
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-white transition">
                            <FaGithub size={20} />
                        </a>
                    </div>

                    <div className="text-gray-400 mt-2">
                        <p>Email: support@threadhub.com</p>
                        <p>Phone: +1 (234) 567-8901</p>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} ThreadHub. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
