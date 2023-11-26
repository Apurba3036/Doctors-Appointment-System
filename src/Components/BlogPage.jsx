import React, { useEffect, useState } from 'react';
import Blogcards from './Blogcards';

const BlogPage = () => {
    const[blogs,setBlogs]=useState([]);
   
    
    useEffect(()=>{
        fetch('generated.json'
       
        )
          .then(function(response){
            
            return response.json();
          })
          .then(function(myJson) {
           
            setBlogs(myJson)
          }),[]})
        
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