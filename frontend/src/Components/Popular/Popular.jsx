import React, { useEffect } from 'react'
import './Popular.css'
import { useState } from 'react'
import Item from '../Item/Item'

const Popular = () => {

  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/popularinwomen")
    .then((res) => res.json())
    .then((data) => setPopularProducts(data));
  },[])

  const handleItemClick = () => {
    window.scrollTo(0, 0);  // Scroll to the top of the page
  };

  return (
    <div className='popular'>
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      
      <div className="popular-item">
        {popularProducts.map((item,i) => {
          return <Item key={i} id={item.id} name={item.name} image={item.image}  new_price={item.new_price} 
          old_price={item.old_price} onClick={handleItemClick}
          />
        })}
      </div>
    </div>
  )
}

export default Popular
