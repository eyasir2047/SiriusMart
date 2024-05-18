import React from 'react'
import './Navbar.css'
import logo from '../Assets/logo_b.png'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
const Navbar = () => {

    const [menu, setMenu]=React.useState("shop");
    const {getTotalCartItems}=React.useContext(ShopContext);
  return (
    <div className='navbar'>

      <div className='navbar-logo'>
        <img src={logo} alt='logo' />
        <p>SiriusMart</p>
    </div>

    <ul className='navbar-menu'>
    <li onClick={() => { setMenu("shop") }}>
  <Link style={{ textDecoration: 'none', color: 'black' }} to='/'>Shop</Link>
  {menu === "shop" ? <hr/> : null}
</li>

        <li onClick={()=>{setMenu("mens")}}>  <Link style={{ textDecoration: 'none', color: 'black' , fontFamily:"sans-serif" }} to='/mens'> Men </Link> {menu==="mens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("womens")}}> <Link  style={{textDecoration: 'none',color: 'black' , fontFamily:"sans-serif"}} to='/womens'> Women </Link>  {menu==="womens"?<hr/>:<></>}</li>
        <li onClick={()=>{setMenu("kids")}}> <Link  style={{textDecoration: 'none',color: 'black' , fontFamily:"sans-serif"}} to='/kids'> Kids </Link>  {menu==="kids"? <hr/> : <></>}</li>
    </ul>

    <div className='nav-login-cart'>

    {localStorage.getItem('auth-token') ? (
  <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/'); }}>Logout</button>
) : (
  <Link to='/login'><button>Login</button></Link>
)}
      <Link to='/cart'> <img src={cart_icon} alt='cart' /></Link> 

        <div className="nav-cart-count">
            {getTotalCartItems()}
        </div>
    </div>  

    </div>
  )
}

export default Navbar
