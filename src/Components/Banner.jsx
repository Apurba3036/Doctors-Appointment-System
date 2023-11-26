import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Banner = () => {
    return (
        <div className='px-4 py-32 bg-slate-900 mx-auto mb-9'>
            <div className='text-white text-center'>
                <h1 className='text-5xl lg:text-6xl leading-snug font-bold mt-6'>Welcome to Our Blogs</h1>
                <p className='text-gray-300 lg:3/5 mx-auto mt-5 font-primary'>This website is for the writers of the future who are passionate about blogging and sharing their thoughts with others<span className='text-amber-600'>.........</span> </p>
                <div className='mt-5'>
                    <Link to="/" className='font-medium hover:text-orange-500 inline-flex items-center py-1'>Learn More  <FaArrowRight className='ml-1'></FaArrowRight></Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;