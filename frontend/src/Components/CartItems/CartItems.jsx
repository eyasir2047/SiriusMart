import React from 'react'
import './CartItems.css'
import { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const CartItems = () => {
  const {getTotalCartAmount,all_product,cartItems,removeFromCart} = useContext(ShopContext);

  const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const navigate = useNavigate();

    const handleApplyPromo = () => {
      // Check if the promo code is valid
      if (promoCode === 'csedu27' || promoCode === '27') {
          // Apply 10% discount
          setDiscount(10);
          // You can add further logic here, like applying the discount to the cart total
          // For example: applyDiscountToCartTotal(10);
      } else {
          // Reset discount if promo code is not valid
          setDiscount(0);
          alert('Invalid promo code');
      }
  };

  const handleCheckout = async () => {
    // Collect all product IDs in the cart
    const products = all_product
      .filter(e => cartItems[e.id] > 0)
      .map(e => ({
        productId: e.id,
        quantity: cartItems[e.id],
        price: e.new_price,
        totalPrice: (e.new_price * cartItems[e.id])-((e.new_price * cartItems[e.id] * discount) / 100)
      }));

    try {
      // Send the product IDs to the backend
      await axios.post('http://localhost:4000/api/checkout', { products  });

      // Redirect to the shipping info page
      navigate('/shippingInfo');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was an error processing your request.');
    }
  };

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr/>
      
      {all_product.map((e)=>{
        if(cartItems[e.id]>0){
          return <div>
          <div className="cartitems-format cartitems-format-main">
            <img src={e.image} alt="" className='carticon-product-icon'/>
            <p>{e.name}</p>
            <p>৳{e.new_price}</p>
            <button className='cartitems-quantity'>{cartItems[e.id]}</button>
            <p>৳{e.new_price*cartItems[e.id]}</p>
            <img className='cartitems-remove-icon'src={remove_icon} onClick={()=>{removeFromCart(e.id)}}alt=""></img>
          </div>
          <hr/>
        </div>
        }
        return null;
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>

            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>৳{getTotalCartAmount()}</p>
            </div>

            <hr/>

            <div className="cartitems-total-item">

              <p>Shipping Fee</p>
              <p>Free</p>
            </div>

            <hr/>

            <div className="cartitems-total-item">
                      <h3>Total</h3>
                     <h3>৳{getTotalCartAmount() - (getTotalCartAmount() * discount) / 100}</h3>
             </div>

          </div>

          <button onClick={handleCheckout}>Proceed to Checkout</button>
        </div>

        
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
  <p className="text-gray-700 mb-4 text-center font-medium">If you have a promo code, enter it here</p>
  <div className="flex items-center space-x-4">
    <input
      type="text"
      placeholder="Enter your code"
      value={promoCode}
      onChange={(e) => setPromoCode(e.target.value)}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      onClick={handleApplyPromo}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Apply
    </button>
  </div>
  {discount > 0 && (
    <p className="mt-4 text-green-600 text-center font-semibold">
      {discount}% discount applied!
    </p>
  )}
</div>

      </div>
    </div>
  )
}

export default CartItems
