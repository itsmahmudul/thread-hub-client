import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/UI/Navbar';
import Footer from '../Pages/UI/Footer';
import useAuth from '../Hooks/useAuth';

const MainLayout = () => {
    const { darkMode } = useAuth();

    return (
        <div>
            <Navbar />
            <div className={darkMode ? 'dark min-h-[calc(100vh-116px)] bg-gray-800 text-white' : 'min-h-[calc(100vh-116px)] bg-white text-gray-900'}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;
