import React from 'react';
import Rating from './rating'; // Ensure this import is correct

const CommentComponent = ({ comments }) => {
  // Debugging: Log the comments to see if they are being passed correctly
  console.log('Comments received: ', comments);

  return (
    <div className="comments">
      <h4 className="title-border">Comments</h4>
      <ul className="comment-list">
        {comments.map((comment, i) => {
          // Debugging: Log individual comment details
          console.log(`Comment ${i}: `, comment);

          return (
            <li className="comment" key={i}>
              <div className="com-thumb">
                {/* Debugging: Confirm image URL or fallback */}
                <img src={comment.imgUrl || '../assets/images/author/01.jpg'} alt={comment.username} />
              </div>
              <div className="com-content">
                <div className="com-title">
                  <div className="com-title-meta">
                    <h6>{comment.username}</h6>
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  {/* Rating component should handle the display of stars based on the rating value */}
                  <Rating value={comment.rating} />
                </div>
                <p>{comment.comment}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CommentComponent;
