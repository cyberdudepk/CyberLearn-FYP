import React from 'react';

const Rating = ({ value }) => {
  // Create an array of stars to be displayed
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <i key={i} className={`icofont-star ${i <= value ? 'text-warning' : 'text-secondary'}`}></i>
    );
  }

  return <div className="rating">{stars}</div>;
};

export default Rating;
