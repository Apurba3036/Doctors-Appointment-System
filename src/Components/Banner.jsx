import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Banner = () => {
    return (
        <div className='px-4 py-32 mx-auto mb-9' style={{ backgroundSize: 'cover',backgroundImage: 'url("https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?cs=srgb&dl=pexels-pixabay-40568.jpg&fm=jpg")' }}>
            <div className='text-white text-center'>
                <h1 className='text-5xl lg:text-6xl leading-snug font-bold mt-6'>Welcome to Our Doctor`s Appointment System</h1>
                <p className='text-gray-700 lg:3/5 mx-auto mt-5 font-primary'>This website is made for the patients so that they can get treatment easily at any time<span className='text-amber-600'>.........</span> </p>
                <div className='mt-5'>
                    <Link to="/" className='font-medium hover:text-orange-500 inline-flex items-center py-1'>Learn More  <FaArrowRight className='ml-1'></FaArrowRight></Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;