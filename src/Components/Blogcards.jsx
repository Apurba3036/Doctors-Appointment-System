import React from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaUser } from 'react-icons/fa';

const Blogcards = ({blogs}) => {
    const filtered= blogs;
    // console.log(filtered)
    return (
        <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8'>
            {
                 filtered.map((blog)=><Link key={blog.id}  className='p-5 shadow-lg rounded cursor-pointer'>
                    <div>
                        <img src={blog.image} alt="" className='w-full' />
                    </div>
                    <h3 className='mt-4 mb-2 font-bold hover:text-blue-700 cursor-pointer' id='name'>{blog.title}</h3>
                    <p className='mb-2 text-sm text-gray-500'><FaUser className='inline-flex items-center mr-2'></FaUser>{blog.author}</p>
                    <p className='text-sm text-gray-500'>Published: {blog.published_date}</p>
                    <p className='text-sm text-gray-500'><FaClock className='inline-flex items-center mr-2'></FaClock>{blog.reading_time}</p>
                 </Link>)
            }
        </div>
    );
};

export default Blogcards;