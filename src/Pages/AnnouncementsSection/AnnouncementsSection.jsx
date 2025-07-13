import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const AnnouncementsSection = () => {
  const [announcements, setAnnouncements] = useState([]);
  const axiosPublic = useAxiosPublic();

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

  if (announcements.length === 0) return null; // Hide section if no announcements

  return (
    <section className="p-4 bg-yellow-50 rounded-md shadow-md mb-6">
      <h2 className="text-xl font-bold mb-3">Announcements</h2>
      <ul className="space-y-2">
        {announcements.map(({ _id, title, message, createdAt }) => (
          <li key={_id} className="border-b border-yellow-300 pb-2">
            <h3 className="font-semibold">{title}</h3>
            <p>{message}</p>
            <small className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AnnouncementsSection;
