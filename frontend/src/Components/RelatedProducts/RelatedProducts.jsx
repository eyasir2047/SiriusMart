import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RelatedProducts.css';
import { Link } from 'react-router-dom';

const RelatedProducts = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { productId } = useParams(); // Use productId to match the route parameter
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      
      const allProducts = await response.json();
      //console.log(allProducts);
      //console.log("productId",productId);

      // Find the current product based on the ID from the URL parameters
      const currentProduct = allProducts.find(
        (product) => product.id === Number(productId) // Ensure type match
      );
      
      //console.log("current product:", currentProduct);

      if (currentProduct) {
        // Filter the products to only those with the same category as the current product
        const relatedProducts = allProducts.filter(
          (product) => product.category === currentProduct.category && product.id !== Number(productId)
        );

        

        setRelatedProducts(relatedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [productId]); 

  return (
    <div className="page-container mt-5">
      <div className="content-wrap">
        <div className='relatedproducts'>
          <h1>Related Products</h1>
          <hr />

          <div className="relatedproducts-item">
            <div className="flex overflow-x-auto no-scrollbar space-x-4 py-4">
              {relatedProducts.map((product) => (
                <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="product-item min-w-[437px] max-w-[437px] bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2 hover:scale-105"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                  <div className="flex flex-col items-center">
                    <div className="w-full p-4">
                      <img
                        src={product.image}
                        alt="Main Product"
                        className="w-full h-72 object-contain rounded-lg"
                      />
                    </div>
                    <div className="p-4 w-full text-center">
                      <h2 className="text-xl font-semibold mb-2 text-gray-900">{product.name}</h2>
                      <p className="text-lg font-bold text-green-600">Price: ${product.new_price}</p>
                    </div>
                  </div>
                  </Link>
                
                
              ))}
            </div>
          </div>
          

        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;








