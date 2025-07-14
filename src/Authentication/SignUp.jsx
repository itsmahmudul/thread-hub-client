import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import axios from "axios";
import useAuth from "../Hooks/useAuth";
import SocialLogin from "./SocialLogin";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const SignUp = () => {
    const { createUser, updateUserProfile, darkMode } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const [profilePic, setProfilePic] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        if (!image) return;

        const formData = new FormData();
        formData.append("image", image);

        try {
            setUploading(true);
            setUploadError("");

            const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_UPLOAD_KEY}`;
            const res = await axios.post(imagUploadUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            const imgURL = res.data.data.url;
            setProfilePic(imgURL);
        } catch (err) {
            console.error(err);
            setUploadError("Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        const { name, email, password } = data;

        try {
            if (!profilePic) {
                setUploadError("Please upload a profile picture.");
                return;
            }

            // 1.Firebase signUp
            await createUser(email, password);

            // 2.Update Profile
            await updateUserProfile(name, profilePic);

            // 3.Save users to mongodb
            await axiosPublic.post("/users/signUp", {
                name,
                email,
                image: profilePic,
            });

            // 4.done
            reset();
            navigate("/");
        } catch (error) {
            console.error("Signup failed:", error);
        }
    };

    // Helper to conditionally apply dark mode classes
    const inputClasses = `w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-600"
        }`;

    const labelClasses = `block mb-2 text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"
        }`;

    const errorClasses = "text-sm text-red-500 mt-1";

    return (
        <div
            className={`min-h-screen flex items-center justify-center px-4 py-12 sm:py-20 ${darkMode
                ? "bg-gray-900 bg-gradient-to-br from-gray-800 to-gray-900"
                : "bg-gradient-to-br from-blue-50 to-indigo-100"
                }`}
        >
            <div
                className={`flex flex-col sm:flex-row rounded-3xl max-w-5xl w-full overflow-hidden animate-fadeInUp duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.1)] ${darkMode ? "bg-gray-800 shadow-lg shadow-black/40" : "bg-white"
                    }`}
            >
                {/* Form Section */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={`w-full sm:w-1/2 p-10 sm:p-16 animate-fadeInLeft ${darkMode ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    <h2
                        className={`text-3xl font-extrabold mb-8 text-center ${darkMode ? "text-gray-100" : "text-gray-800"
                            }`}
                    >
                        Create Your Account
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className={labelClasses}>Full Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                placeholder="Enter Your Name"
                                className={inputClasses}
                            />
                            {errors.name && <p className={errorClasses}>{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>Email</label>
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                placeholder="Enter Your Email"
                                className={inputClasses}
                            />
                            {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>Password</label>
                            <input
                                type="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" }
                                })}
                                placeholder="Enter Your Password"
                                className={inputClasses}
                            />
                            {errors.password && <p className={errorClasses}>{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className={`w-full cursor-pointer text-sm border rounded-lg px-4 py-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                                    }`}
                            />
                            {uploading && (
                                <p className="text-blue-500 mt-1 text-sm">Uploading...</p>
                            )}
                            {uploadError && (
                                <p className="text-red-500 mt-1 text-sm">{uploadError}</p>
                            )}
                            {profilePic && (
                                <div className="mt-3">
                                    <img
                                        src={profilePic}
                                        alt="Preview"
                                        className="h-16 w-16 rounded-full object-cover border-2 border-blue-500 shadow-lg transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition-all duration-300 ${darkMode
                                ? "bg-blue-700 text-white hover:bg-blue-800"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            Sign Up
                        </button>

                        <p
                            className={`text-sm text-center mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                        >
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className={`font-medium hover:underline ${darkMode ? "text-blue-400" : "text-blue-600"
                                    }`}
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Right Side */}
                <div
                    className={`w-full sm:w-1/2 p-10 sm:p-16 flex flex-col justify-center items-center animate-fadeInRight ${darkMode
                        ? "bg-gradient-to-tr from-gray-900 to-gray-800 text-white"
                        : "bg-gradient-to-tr from-blue-600 to-indigo-700 text-white"
                        }`}
                >
                    <h3 className="text-2xl font-bold mb-4">Or sign up with</h3>
                    <SocialLogin />
                    <div className="mt-10 text-center text-sm opacity-70">
                        Empower your learning journey with us.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
