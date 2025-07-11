import { Link } from "react-router";
import Lottie from "lottie-react";
import notFoundAnimation from "../../assets/lotties/404.json";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen px-4 bg-gradient-to-br from-white to-blue-100 text-center animate-fadeIn">
            <div className="w-72 sm:w-96 mb-4">
                <Lottie animationData={notFoundAnimation} loop={true} />
            </div>
            <h1 className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 drop-shadow-lg animate-pulse">
                404
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-gray-700 mb-6 transition duration-500 hover:scale-105">
                Lost in the Threads? This page doesn’t exist!
            </p>
            <Link
                to="/"
                className="inline-block mt-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
                🔙 Back to Home
            </Link>
        </div>
    );
}
