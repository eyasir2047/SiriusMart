import React, { useState } from 'react';
import ReviewForm from '../Review/ReviewForm';

const DescriptionBox = (props) => {
    const {product} = props;
    const [reviews, setReviews] = useState([]);
    const [comments,setComments] = useState([]); // [review1, review2, review3, ...
    
    const [showReviewButton, setShowReviewButton] = useState(false);
      


    const handleReviewSubmit = async (reviewData) => {
        try {
            const response = await fetch(`http://localhost:4000/addreview/${product.id}`, { // Make sure to replace `productId` with the actual product ID
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData)
            });
    
            const data = await response.json();
            if (data.success) {
                console.log("Review added successfully");
                // Optionally, you can update the UI to reflect the new review
                setReviews([...reviews, reviewData]);
                setComments([...comments,reviewData.comment]);

                setShowReviewButton(false);
            } else {
                console.error("Failed to add review:", data.message);
            }
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };
    
    
    

    const handleShowReviewButtonClick = () => {
        setShowReviewButton(true);
    };

    return (
        <div className='descriptionbox'>
            
           
           
                <div className="descriptionbox-reviews">
                    <h2>Reviews</h2>
                    <ul>
                        {reviews.map((review, index) => (
                            <li key={index}>
                                <p>{review.comment}</p>
                                <p>Rating: {review.rating}</p>
                            </li>
                        ))}
                    </ul>
                </div>
          
            {showReviewButton && <ReviewForm onSubmit={handleReviewSubmit} />}
            {!showReviewButton && (
                <button onClick={handleShowReviewButtonClick}>Write a Review</button>
            )}
        </div>
    );
}

export default DescriptionBox;
