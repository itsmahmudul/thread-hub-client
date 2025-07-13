import { useEffect, useState } from "react";
import useAxiosPublic from "./useAxiosSecure";

const useAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await axiosPublic.get("/announcements");
                if (Array.isArray(res.data)) {
                    setAnnouncements(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            }
        };

        fetchAnnouncements();
    }, [axiosPublic]);

    return announcements;
};

export default useAnnouncements;
