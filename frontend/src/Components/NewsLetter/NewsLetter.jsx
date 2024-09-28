import React, { useState } from 'react';
import './NewsLetter.css';
import thankyouImage from '../Assets/thank.jpeg';

const NewsLetter = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendConfirmationEmail2 = async () => {
    try {
      await fetch('http://localhost:4000/send-confirmation-email2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      alert('Email sent successfully. Check your inbox.');
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() === '') {
      alert('Please enter your email address.');
      return;
    }
    try {
      sendConfirmationEmail2();
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  };

  return (
    <div className="newsletter bg-gradient-to-r from-blue-500 to-teal-500 text-white py-12 px-6 rounded-lg shadow-lg flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-center">Get Exclusive Offers On Your Email</h1>
      <p className="text-lg mb-6 text-center">Subscribe to our newsletter and stay updated</p>
      <div className="flex flex-col md:flex-row items-center w-full max-w-md">
        <input
          type="email"
          placeholder="Your Email id"
          value={email}
          onChange={handleEmailChange}
          className="w-full p-3 rounded-l-lg text-gray-800 outline-none mb-4 md:mb-0 md:mr-2"
        />
        <button
          onClick={handleSubscribe}
          className="w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
