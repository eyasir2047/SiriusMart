
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter, Routes,Route} from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import ShippingInfo from './Pages/ShippingInfo';
import Footer from './Components/Footer/Footer';
import men_banner from "./Components/Assets/sale_m.png";
import women_banner from "./Components/Assets/sale_w.png";
import kid_banner from "./Components/Assets/sale_k.png";


  /* <Route path='/signup' element={<LoginSignup />} /> */

/**
 * Renders the main application component.
 * @returns {JSX.Element} The rendered application component.
 */
function App() {
  return (
    <div >
      <BrowserRouter>

      <Navbar />
      
      <Routes>
        <Route path='/' element={<Shop />} />
        <Route path='/mens' element={<ShopCategory banner={men_banner}  category="mens"/>} />
        <Route path='/womens' element={<ShopCategory banner={women_banner} category="womens"  />} />
        <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kids"/>} />

        <Route path="/product" element={<Product />} >
        <Route path=":productId" element={<Product />} />
        </Route>

        <Route path='/cart' element={<Cart />} /> 
        <Route path='/login' element={<LoginSignup />} /> 
        <Route path='/shippingInfo' element={<ShippingInfo/>} />

    

      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;
