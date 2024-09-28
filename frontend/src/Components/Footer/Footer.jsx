import React from 'react'
import './Footer.css'
import foot_logo from '../Assets/logo_b.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pintester_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className='footer'>

      <div className="footer-logo">
        <img src={foot_logo} alt="" />
        <p>SiriusMart</p>
      </div>

     <ul className='footer-links'>
        <li>Company</li>
        <li>Products</li>
        <li>Officies</li>
        <li>Abouts</li>
        <li>Contact</li>
     </ul>
      
     <div className="footer-social-icon">
  <img src={instagram_icon} alt="Instagram" />
  <img src={pintester_icon} alt="Pinterest" />
  <img src={whatsapp_icon} alt="WhatsApp" />
    </div>
      

        <div className="footer-copyright">
            <hr/>
            <p>© 2024 SiriusMart. All Rights Reserved</p>

        </div>

      </div>

  )
}

export default Footer
