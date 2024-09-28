import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function PaymentSuccess() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tranId = queryParams.get('tranId');  // Note the correct key here

  const clearCart = async () => {
    const authToken = localStorage.getItem('auth-token');
    
    try {
        const response = await fetch('http://localhost:4000/api/cart/clear', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authToken,  // Pass the token for authentication
            },
        });

        if (!response.ok) {
            throw new Error('Failed to clear cart');
        }

        console.log('Cart cleared successfully');
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    clearCart();  // Call clearCart when the component mounts
  }, []);  // Empty dependency array means this effect runs once when the component mounts

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Payment Successful!</h1>
        {tranId ? (
          <p className="text-lg text-center">
            Your transaction ID is: <span className="font-mono text-blue-600">{tranId}</span>
          </p>
        ) : (
          <p className="text-lg text-center text-red-500">No transaction ID found.</p>
        )}
        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full">
          <Link to="/">Return to Dashboard</Link>
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
