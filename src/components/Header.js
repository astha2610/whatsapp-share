import React from 'react';

import '../App.css';
import Logo from '../assets/whatsapp-logo.svg';

function Header({userInfo, updateUserInfo}) {

  const logout = async() => {
    const resp = await fetch('//localhost:3001/logout/');
    const respJson = await resp.json();
    if (respJson.success) {
      updateUserInfo(null);
    }
  }

  return (
    <header className="app-header">
      <div className="header-title-container">
        <h3>Web - WhatsApp Share</h3>
      </div>
      <div className="header-logo-container">
        {(userInfo && <div className="user-info-container">
          <p className="header-text">Hey, Astha</p>
          <a href="javascript:void(0);" onClick={logout} className="logout-text">Logout</a>
        </div>) || null}
        <img src={Logo} className="app-logo" alt="logo" />
      </div>
    </header>
  );
}

export default Header;
