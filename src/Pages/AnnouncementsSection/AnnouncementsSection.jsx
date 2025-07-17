import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { FaBullhorn } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const axiosPublic = useAxiosPublic();
  const { darkMode } = useAuth();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axiosPublic.get("/announcements");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAnnouncements(res.data);
        } else {
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Failed to load announcements", error);
        setAnnouncements([]);
      }
    };

    fetchAnnouncements();
  }, [axiosPublic]);

  if (announcements.length === 0) return null;

  return (
    <section
      className={`p-6 mb-10 rounded-xl shadow-md border ${darkMode
        ? "bg-gray-900 border-gray-700 text-white"
        : "bg-white border-gray-200 text-gray-800"
        }`}
    >
      <div className="flex items-center gap-2 mb-6">
        <FaBullhorn className="text-3xl text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-bold tracking-tight">Latest Announcements</h2>
      </div>

      <ul className="space-y-5">
        {announcements.map(({ _id, title, description, authorName, authorImage, createdAt }) => (
          <li
            key={_id}
            className={`p-5 rounded-lg shadow-sm transition-colors duration-300 border ${darkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-gray-50 hover:bg-gray-100 border-gray-300"
              }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={authorImage}
                alt={authorName}
                className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Posted by <span className="font-medium">{authorName}</span> on{" "}
                  <span className="italic">{new Date(createdAt).toLocaleString()}</span>
                </p>
              </div>
            </div>
            <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {description}
            </p>

          </li>
        ))}
      </ul>
    </section>
  );
};

export default AnnouncementsSection;
