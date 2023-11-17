'use client';
// components/Navbar.js

import Link from 'next/link';
import { FaShoppingCart, FaUser, FaHeart, FaProductHunt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="flex justify-between bg-white p-5 text-black px-16 border-b-2 border-black">
      <div className="flex space-x-5 items-center">
      <h1 className={` text-4xl`}>
        StoreFront
        </h1>

        <Link href="/products">
          {/* <a className="flex items-center"> */}
          MEN
          {/* </a>/ */}
        </Link>
        <Link href="/products">
          {/* <a className="flex items-center"> */}
          WOMEN
          {/* </a>/ */}
        </Link>
      </div>
      {/* Icons */}
      <div className="flex items-center space-x-12 ">
        <Link href="/shoppingCart">
          {/* <a className="flex items-center mr-4"> */}
            <FaShoppingCart className="mr-2" size={24} /> 
          {/* </a> */}
        </Link>
        <Link href="/profile">
          {/* <a className="flex items-center mr-4"> */}
            <FaUser className="mr-2" size={24} /> 
          {/* </a> */}
        </Link>
        <Link href="/favorites">
          {/* <a className="flex items-center"> */}
            <FaHeart className="mr-2"size={24} /> 
          {/* </a> */}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
