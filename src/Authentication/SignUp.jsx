import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import useAuth from "../Hooks/useAuth";
import SocialLogin from "./SocialLogin";

const SignUp = () => {
    const { cerateUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        photo: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            setError("");
            setSuccess("");
            await cerateUser(email, password);

            setSuccess("Signup successful!");
            navigate("/"); // redirect to home or dashboard
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:py-20">
            <div className="flex flex-col sm:flex-row bg-white rounded-3xl shadow-xl max-w-5xl w-full overflow-hidden animate-fadeIn">

                {/* Left: Signup Form */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full sm:w-1/2 p-10 sm:p-16"
                >
                    <h2 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">Create Account</h2>

                    {error && (
                        <p className="mb-6 text-center text-red-600 font-medium animate-fadeInDown">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="mb-6 text-center text-green-600 font-medium animate-fadeInDown">
                            {success}
                        </p>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Photo URL (optional)</label>
                            <input
                                type="text"
                                name="photo"
                                placeholder="Enter photo URL"
                                value={formData.photo}
                                onChange={handleChange}
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition"
                        >
                            Sign Up
                        </button>

                        <p className="mt-6 text-center text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 font-semibold hover:text-blue-700 focus:outline-none focus:underline transition"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Right: Social Login */}
                <div className="w-full sm:w-1/2 bg-gradient-to-tr from-blue-600 to-indigo-600 flex flex-col justify-center p-10 sm:p-16 text-white rounded-tr-3xl rounded-br-3xl">
                    <h3 className="text-2xl font-bold mb-6 text-center">Or sign up with</h3>
                    <SocialLogin />
                </div>
            </div>
        </div>
    );
};

export default SignUp;
