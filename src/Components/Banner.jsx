import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Banner = () => {
    return (
        <div className="relative w-full h-screen bg-cover bg-center" 
            style={{ backgroundImage: 'url("https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?cs=srgb&dl=pexels-pixabay-40568.jpg&fm=jpg")' }}>
            
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            <div className="relative flex flex-col items-center justify-center h-full text-center px-6">
                <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 drop-shadow-lg">
                    Medical AI Assistant <br /> for Doctors
                </h1>
                <p className="text-lg lg:text-xl text-gray-800 mt-4 max-w-2xl mx-auto font-medium">
                    Revolutionizing healthcare with AI-powered assistance for medical professionals.
                </p>
                
                <div className="mt-6">
                    <Link to="/" className="px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-lg hover:bg-orange-600 transition-all flex items-center">
                        Learn More <FaArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;
