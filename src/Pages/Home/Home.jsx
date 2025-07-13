import React from 'react';
import BannerSearch from './Banner';
import TagsSection from './TagsSection';

const Home = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
            {/* Hero/Banner Section */}
            <section>
                <BannerSearch />
            </section>

            {/* Tags Filter Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Explore by Tags</h2>
                <TagsSection />
            </section>
        </div>
    );
};

export default Home;
