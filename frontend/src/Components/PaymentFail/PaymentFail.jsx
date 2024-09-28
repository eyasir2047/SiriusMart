import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFail = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-400 to-pink-500 text-white">
      <div className="bg-white text-red-600 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-lg mb-6">Unfortunately, your payment was not successful. Please try again.</p>
        <Link to="http://localhost:3000/cart">
        <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500">
         Try Again
        </button>
        </Link>
      </div>
    </div>
  );
}

export default PaymentFail;
