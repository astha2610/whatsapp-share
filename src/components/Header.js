import React from 'react';

import '../App.css';
import Logo from '../assets/whatsapp-logo.svg';

function Header() {
  return (
    <header className="app-header">
      <div className="header-title-container">
        <h3>Web - WhatsApp Share</h3>
      </div>
      <div className="header-logo-container">
        <img src={Logo} className="app-logo" alt="logo" />
      </div>
    </header>
  );
}

export default Header;
