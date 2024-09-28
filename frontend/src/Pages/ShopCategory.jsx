import React, { useContext, useState } from 'react';
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import dropdown_icon from "../Components/Assets/dropdown_icon.png";
import Item from "../Components/Item/Item";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(''); // State to manage price range selection

  // Filter products based on search term
// Filter products based on search term
  const filteredProducts = all_product.filter(product => {
  return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.new_price && product.new_price.toString().toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
// Filter products based on selected price range
const filteredByPriceRange = all_product.filter(product => {
  if (!priceRange) return true; // Return true for all products if price range is not selected
  const [minPrice, maxPrice] = priceRange.split('-').map(Number);
  if (product.new_price >= minPrice && product.new_price <= maxPrice) {
    return true;
  }
  return false;
});

  // Use either filteredProducts or filteredByPriceRange based on price range selection
  const productsToDisplay = priceRange ? filteredByPriceRange : filteredProducts;
 
  return (

    <div className='shop-categry'>

     
      <input
        type="text"
        placeholder="Search for products"
        className="shopcategory-search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="shopcategory-indexSort">
        
      {productsToDisplay.length === 0 ? (
          <p><span>Empty Product</span></p>
) : (
  <p>
    <span>Showing 1-{productsToDisplay.length} </span>from all products
  </p>
)}

          
       


        <div className="price-range-dropdown">
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="">Select Price Range</option>
            <option value="200-500">200 - 500</option>
            <option value="500-1000">500 - 1000</option>
            <option value="1000-2000">1000-2000</option>
            <option value="2000-5000">2000 - 5000</option>
            <option value="5000-10000">5000-10000</option>
            <option value="10000-20000">10000 - 20000</option>
            {/* Add more options as needed */}
          </select>
        </div>

      </div>

      <div className="shopcategory-products">
        {productsToDisplay.map((item, i) => {
          if (props.category === item.category) {
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
          } else {
            return null;
          }
        })}


       
        
      </div>

      <img className="shopcategory-banner" src={props.banner}></img>

      
    </div>
  )
}

export default ShopCategory;
