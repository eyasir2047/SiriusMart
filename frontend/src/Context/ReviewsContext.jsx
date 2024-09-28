// ReviewsContext.js
import React, { createContext, useState } from 'react';

export const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);

    const addReview = (review) => {
        setReviews([...reviews, review]);
    };

    return (
        <ReviewsContext.Provider value={{ reviews, addReview }}>
            {children}
        </ReviewsContext.Provider>
    );
};
