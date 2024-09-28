import React, { useState, useEffect } from 'react';  // Import useState along with useEffect
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllProducts] = useState([]);  // Ensure useState is imported to use state

  // Simplify the fetchInfo function using async/await properly
  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);  // Empty dependency array to mimic componentDidMount


  const remove_product=async(id)=>{
    await fetch('http://localhost:4000/removeproduct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id:id}),
    })
    await fetchInfo();
  }

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">
        <hr/>
        {allproducts.map((product, index) => {
         return <> <div key={index} className="listproduct-format-main listproduct-format">
            <img src={product.image} alt={product.name} className="listproduct-product-icon" />
            <p>{product.name}</p>
            <p>৳{product.old_price}</p>
            <p>৳{product.new_price}</p>
            <p>{product.category}</p>
            <img onClick={()=>{remove_product(product.id)}}className='listproduct-remove-icon' src={cross_icon} alt='Remove' />
            
          </div>
          <hr/>
          </>
          
    })}
      </div>
    </div>
  );
}

export default ListProduct;
