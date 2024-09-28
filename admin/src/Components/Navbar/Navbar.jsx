import React from 'react'
import './Navbar.css'
import navProfile from '../../assets/abrareyasir.jpeg'
import logo from '../../assets/logo_bs.png'


const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={logo} alt='logo' className="nav-logo" />
        <p>SiriusMart</p>
      <img src={navProfile} alt="" className="nav-profile" />
    </div>
  )
}

export default Navbar
