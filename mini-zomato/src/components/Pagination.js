
import React from 'react';

const Pagination = ({ postsPerPage, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={{textAlign:"center"}}>
        {pageNumbers.map(number => (
         <span style={{marginLeft:"10px"}}>
            <a onClick={() => paginate(number)} href='!#' className='page-link'>
              {number}
            </a>
         </span>
            
          
        ))}
    </div>
  );
};

export default Pagination;