import { useState } from "react";
import { Link } from "react-router";
import { Bell, LayoutDashboard, LogOut } from "lucide-react";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Toggle this to simulate login state
    const isLoggedIn = true;

    const fakeUser = {
        name: "Mahmudul Alam",
        photoURL: "/default-avatar.png", // use actual user image path or default
    };

    return (
        <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
            {/* Left: Logo + Name */}
            <Link to="/" className="flex items-center space-x-2">
                <img src="../../assets/logo.png" alt="Logo" className="w-8 h-8" />
                <span className="text-xl font-bold text-gray-800">ThreadHub</span>
            </Link>

            {/* Right: Links */}
            <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-600 hover:text-blue-600">
                    Home
                </Link>
                <Link to="/membership" className="text-gray-600 hover:text-blue-600">
                    Membership
                </Link>
                <Bell className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer" />

                {!isLoggedIn ? (
                    <Link
                        to="/login"
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                        Join Us
                    </Link>
                ) : (
                    <div className="relative">
                        <img
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            src={fakeUser.photoURL}
                            alt="Profile"
                            className="w-9 h-9 rounded-full border cursor-pointer"
                        />
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-20">
                                <div className="px-4 py-2 text-gray-800 font-semibold">
                                    {fakeUser.name}
                                </div>
                                <Link
                                    to="/dashboard"
                                    className="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700"
                                >
                                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                                </Link>
                                <button
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Logout
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
