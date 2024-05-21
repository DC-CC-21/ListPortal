// import { useState } from 'react';
import React from "react";
import LOGO from "./LOGO.webp";
import Cookies from "./cookies";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const user = Cookies.getCookie('user')
    return (
      <header>
        <div className="imgDiv noSelect">
          <img src={LOGO} alt="logo" width="65" height="65" />
        </div>
        <h1 className='noSelect'>List Portal</h1>
        <nav>
          <a href="/">Home</a>
          <a href= {`./accountPage?type=${user?"account":"create"}`} className="account">
            {user ? `Welcome ${user}` : "Create Account | Login"}
            
          </a>
        </nav>
      </header>
    );
  }
}

export default Header;
