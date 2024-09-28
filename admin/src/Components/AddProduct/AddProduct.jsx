import React, { useState } from 'react'; // Correctly import useState
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [image, setImage] = useState(null);

    const [productDetails, setProductDetails] = useState({
      name: '',
      image: '',
      category: 'womens',
      new_price: '',
      old_price: '',
    });

    const imageHandler = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const changeHandler = (e) => {  
      setProductDetails({
        ...productDetails,
        [e.target.name]: e.target.value,
      });
    }

    const Add_Product =async () => {
      console.log(productDetails);

      let responseData;

      let product= productDetails;

      let formData = new FormData();
      formData.append('product', image);

      await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      }).then((resp) => resp.json()).then((data) => {responseData=data});

        if(responseData.success){
          product.image = responseData.image_url;
          console.log(product);

          await fetch('http://localhost:4000/addproduct', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
          }).then((resp) => resp.json()).then((data) => {
          if(data.success){
            alert('Product added successfully');
          }else{
            alert('Product not added');
          }

        });

        }else{
          console.log('Image not uploaded');
        
        }
    }
  

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name="name" placeholder="Enter product title" />
               
            </div>

            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name="old_price" placeholder="Enter price" />
                </div>

                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name="new_price" placeholder="Enter offer price" />
                </div>
            </div>

            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler}  name="category" className='addproduct-selector'>
                    <option value="womens">Women</option>
                    <option value="mens">Men</option>
                    <option value="kids">Kids</option>
                </select>
            </div>

            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} alt="" className="addproduct-thumbnail-img" />
                </label>
                <input id="file-input" type="file" onChange={imageHandler} hidden />
            </div>

            <button onClick={()=>{Add_Product()}} className="addproduct-btn">Add Product</button>
        </div>
    );
}

export default AddProduct;
