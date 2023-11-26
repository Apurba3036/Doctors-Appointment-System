import React, { useEffect, useState } from 'react';
import Blogcards from './Blogcards';

const BlogPage = () => {
    const[blogs,setBlogs]=useState([]);
    const [currentPgae,setCurrentpage]=useState(1);
    const pagesize=12;    //blogs per page
    const[category,setCatgory]=useState(null);

    useEffect(()=>{
        fetch('FakeData.json')
        .then(res=>res.json())
        .then(data=>setBlogs(data))
    },[])

    // console.log(blogs);
    return (
        <div>
            {/* category section */}
            {/* <div>Page Category</div> */}


            {/* blogcard section */}
            <div>
                <Blogcards blogs={blogs}></Blogcards>
            </div>


            {/* Pagination */}
            {/* <div> Pagination</div> */}
        </div>
    );
};

export default BlogPage;