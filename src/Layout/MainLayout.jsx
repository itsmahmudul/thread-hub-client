import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/UI/Navbar';
import Footer from '../Pages/UI/Footer';

const MainLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='min-h-[calc(100vh-116px)]'>
                <div className=''>
                    <Outlet />
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;