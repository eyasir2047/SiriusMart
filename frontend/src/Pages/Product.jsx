import React,{useContext} from 'react'
import { useParams } from 'react-router-dom';
import {ShopContext} from "../Context/ShopContext";
import Breadcrum from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import ReviewForm from '../Components/Review/ReviewForm';
const Product = () => {
  const {all_product} = useContext(ShopContext);
  const {productId} = useParams();
  const product = all_product.find((e)=>e.id === Number (productId));
  return (
    <div>
      <Breadcrum product={product}/>
      <ProductDisplay product={product}/>
      <ReviewForm product={product}/>
      <RelatedProducts/>
    </div>
  )
}

export default Product
