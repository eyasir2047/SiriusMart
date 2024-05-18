import React, { useState } from 'react';
import './CSS/ShippingInfo.css'; // Import the CSS file

const ShippingInfo = () => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        address: '',
        deliveryInfo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const sendConfirmationEmail = async () => {
        try {
            // Send a POST request to the backend endpoint to trigger the email sending
            await fetch('http://localhost:4000/send-confirmation-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData.email })
            });
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            // Handle errors, e.g., display an error message to the user
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send a POST request to the backend endpoint
            const response = await fetch('http://localhost:4000/shipping-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit shipping info');
            }

            // Send confirmation email to the customer
            await sendConfirmationEmail();

            const responseData = await response.json();
            console.log(responseData); // Log the response from the server
            // Optionally, you can handle success response and redirect the user
        } catch (error) {
            console.error('Error submitting shipping info:', error);
            // Handle errors, e.g., display an error message to the user
        }
    };

    return (
        <div>
            <h2 className="shipping-heading">Shipping Information</h2>
            <form className="shipping-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label><br />
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /><br />

                <label htmlFor="phoneNumber">Phone Number:</label><br />
                <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required /><br />

                <label htmlFor="email">Email:</label><br />
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br />

                <label htmlFor="address">Address:</label><br />
                <textarea id="address" name="address" value={formData.address} onChange={handleChange} required></textarea><br />

                <label htmlFor="deliveryInfo">Other Information for Delivery:</label><br />
                <textarea id="deliveryInfo" name="deliveryInfo" value={formData.deliveryInfo} onChange={handleChange}></textarea><br />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ShippingInfo;
