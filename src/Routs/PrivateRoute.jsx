import React from 'react';
import { Navigate, useLocation } from 'react-router';
import useAuth from '../Hooks/useAuth';
import Lottie from "lottie-react";
import loadingAnimation from '../assets/lottie/loading.json';

const PrivetRouts = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Lottie
                    animationData={loadingAnimation}
                    loop={true}
                    style={{ width: 150, height: 150 }}
                />
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
};

export default PrivetRouts;
