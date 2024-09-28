import React, { useContext, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';

const ProductDisplay = (props) => {
  const { product } = props;
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="flex flex-col md:flex-row items-start p-6 bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:w-1/2 space-y-4 md:space-y-0 md:space-x-4">
        <div className="w-full">
          <img src={product.image} alt="Main Product" className="w-full h-96 object-contain rounded-lg" />
        </div>
      </div>

      <div className="md:w-1/2 mt-6 md:mt-0">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{product.name}</h1>
        
        <div className="flex items-center mb-4">
          {/* Add star ratings here if needed */}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="text-gray-500 line-through text-lg">৳{product.old_price}</div>
          <div className="text-red-600 text-xl font-semibold">৳{product.new_price}</div>
        </div>

        <p className="text-gray-600 mb-6">
          Introducing our exquisite calico fabric, a lightweight cotton textile adorned with charming printed designs.
          Ideal for sheets and clothing, this versatile fabric combines comfort with style, adding a touch of elegance to any setting.
        </p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Select Size</h2>
          <div className="flex space-x-4">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <div
                key={size}
                className={`px-4 py-2 rounded-lg cursor-pointer border ${
                  selectedSize === size ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleSizeClick(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => addToCart(product.id)}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          ADD TO CART
        </button>

        <p className="text-gray-500 mt-6">
          <span className="font-semibold">Category:</span> {product.category}
        </p>
        <p className="text-gray-500">
          <span className="font-semibold">Tags:</span> Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
