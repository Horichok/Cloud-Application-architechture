import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavLink to='/'>
          <img src={require('../images/logo.svg')} alt='logo' />
        </NavLink>
        <Bars />
        <NavMenu>
        <NavLink to='/users' activeStyle={{ color: 'red' }}>
  Users
</NavLink>
<NavLink to='/carts/' activeStyle={{ color: 'blue' }}>
  Carts
</NavLink>
<NavLink to='/products' activeStyle={{ color: 'green' }}>
  Products
</NavLink>
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='/login'>Login</NavBtnLink>
          <NavBtnLink to='/register'>Register</NavBtnLink>
        </NavBtn>
      </Nav>
    </>
  );
};

export default Navbar;
