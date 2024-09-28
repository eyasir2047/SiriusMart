
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ReviewForm = () => {
    const { productId } = useParams(); // Get the productId from the URL
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/reviews/${productId}`);
                const data = await response.json();

                if (response.ok) {
                    setReviews(data);
                } else {
                    console.error('Failed to fetch reviews:', data);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, [productId]); // Depend on productId, so it fetches new data when it changes

    const handleTextChange = (e) => {
        setReviewText(e.target.value);
    };

    const handleRatingChange = (e) => {
        setRating(parseInt(e.target.value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (reviewText.trim() === '') {
            alert('Please enter your review.');
            return;
        }

        const review = { comment: reviewText, rating, productId };

        await handleReviewSubmit(review);

        setReviewText('');
        setRating(0);
    };

    const handleReviewSubmit = async (review) => {
        try {
            const response = await fetch('http://localhost:4000/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(review),
            });

            console.log('response:', response);

            if (response.ok) {
                alert('Review submitted successfully!');

                // Update the reviews list by fetching the new list or adding the new review
                setReviews((prevReviews) => [...prevReviews, review]);
            } else {
                alert('Failed to submit review.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review.');
        }
    };

    return (
        <div className="review-section">
            <div className="reviews mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Customer Reviews</h2>
        {reviews.length > 0 ? (
            reviews.map((review, index) => (
                <div
                    key={index}
                    className="review-item mb-6 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
                >
                    <div className="flex items-center mb-2">
                        <span className="text-yellow-500 mr-2">
                            {Array(review.rating)
                                .fill('⭐')
                                .map((star, i) => (
                                    <span key={i}>{star}</span>
                                ))}
                        </span>
                        <span className="text-lg font-semibold text-gray-700">Rating: {review.rating} / 5</span>
                    </div>
                    <p className="text-md text-gray-600">
                        <strong>Comment:</strong> {review.comment}
                    </p>
                </div>
            ))
        ) : (
            <p className="text-center text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
        )}
    </div>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
                <div className="mb-6">
                    <label htmlFor="reviewText" className="block text-gray-700 text-lg font-bold mb-2">Review:</label>
                    <textarea 
                        id="reviewText" 
                        value={reviewText} 
                        onChange={handleTextChange}
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                        rows="4"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="rating" className="block text-gray-700 font-bold mb-2 text-lg">Rating:</label>
                    <select 
                        id="rating" 
                        value={rating} 
                        onChange={handleRatingChange}
                        className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        <option value="0">Select a rating</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <button 
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Review
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
