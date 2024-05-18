import React from 'react'
import './CartItems.css'
import { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png'
import { useState } from 'react';
import { Link } from 'react-router-dom';


const CartItems = () => {
  const {getTotalCartAmount,all_product,cartItems,removeFromCart} = useContext(ShopContext);

  const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

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

          <Link to="/shippingInfo">
            <button>PROCEED TO CHECKOUT</button>
          </Link>
        </div>

        <div className="cartitems-promocode">
                    <p>If you have a promo code, enter it here</p>
                    <div className="cartitems-promobox">
                        <input
                            type="text"
                            placeholder="Enter your code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button onClick={handleApplyPromo}>Apply</button>
                    </div>
                    {discount > 0 && <p>{discount}% discount applied!</p>}
                </div>
      </div>
    </div>
  )
}

export default CartItems
