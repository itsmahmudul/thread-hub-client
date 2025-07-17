import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { FaBullhorn } from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";

const MakeAnnouncement = () => {
    const axiosPublic = useAxiosPublic();
    const { darkMode } = useAuth();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await axiosPublic.post("/announcements", data);
            if (res.status === 201) {
                toast.success("🎉 Announcement posted!");
                reset();
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("❌ Failed to post announcement");
        }
    };

    return (
        <div className={`max-w-2xl mx-auto mt-12 px-6 sm:px-10 py-8 rounded-2xl shadow-2xl transition-colors duration-300
            ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
            
            <div className="flex items-center gap-3 mb-6">
                <FaBullhorn className={`text-3xl ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                <h2 className="text-3xl font-bold">
                    Make an Announcement
                </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Author Image */}
                <div>
                    <input
                        type="text"
                        {...register("authorImage", { required: "Author image is required" })}
                        placeholder="Author Image URL"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                        ${darkMode
                                ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-400"
                                : "bg-white text-gray-900 border-gray-300 focus:ring-blue-600"
                            }`}
                    />
                    {errors.authorImage && (
                        <p className="text-red-500 text-sm mt-1">{errors.authorImage.message}</p>
                    )}
                </div>

                {/* Author Name */}
                <div>
                    <input
                        type="text"
                        {...register("authorName", { required: "Author name is required" })}
                        placeholder="Author Name"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                        ${darkMode
                                ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-400"
                                : "bg-white text-gray-900 border-gray-300 focus:ring-blue-600"
                            }`}
                    />
                    {errors.authorName && (
                        <p className="text-red-500 text-sm mt-1">{errors.authorName.message}</p>
                    )}
                </div>

                {/* Title */}
                <div>
                    <input
                        type="text"
                        {...register("title", { required: "Title is required" })}
                        placeholder="Announcement Title"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                        ${darkMode
                                ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-400"
                                : "bg-white text-gray-900 border-gray-300 focus:ring-blue-600"
                            }`}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <textarea
                        {...register("description", { required: "Description is required" })}
                        placeholder="Write the announcement details here..."
                        rows="5"
                        className={`w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2
                        ${darkMode
                                ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-400"
                                : "bg-white text-gray-900 border-gray-300 focus:ring-blue-600"
                            }`}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold py-3 rounded-lg shadow-md"
                >
                    📢 Post Announcement
                </button>
            </form>
        </div>
    );
};

export default MakeAnnouncement;
