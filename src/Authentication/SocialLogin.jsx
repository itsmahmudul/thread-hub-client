import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../Hooks/useAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const SocialLogin = () => {
    const { googleSignIn } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;

            // Prepare user data to send to backend
            const userData = {
                email: user.email,
                name: user.displayName,
                image: user.photoURL,
                googleId: user.uid, // or user.providerData[0]?.uid
            };

            // Send user data to your backend
            const response = await fetch("http://localhost:5000/users/googleSignIn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Welcome, ${user.displayName || "User"}!`, {
                    position: "top-center",
                    autoClose: 2000,
                });

                // Optionally: save returned user info in context or local storage here

                navigate("/");
            } else {
                toast.error(data.message || "Failed to login", {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Google login error:", error);
            toast.error("Google sign-in failed. Please try again.", {
                position: "top-center",
            });
        }
    };
    return (
        <div className="mt-6 text-center">
            <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 w-full mx-auto py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:shadow-md hover:bg-gray-100 transition duration-300"
            >
                <FcGoogle size={22} />
                <span className="font-medium text-gray-700">Continue with Google</span>
            </button>
        </div>
    );
};

export default SocialLogin;
