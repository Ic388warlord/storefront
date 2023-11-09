'use client';
// components/Navbar.js

import Link from 'next/link';
import { FaShoppingCart, FaUser, FaHeart, FaProductHunt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="flex justify-between bg-gray-800 p-4 text-white">
      <div className="flex items-center">
        <Link href="/products">
          {/* <a className="flex items-center"> */}
          Products

          {/* </a>/ */}
        </Link>
      </div>
      <div className="flex items-center space-x-5">
        <Link href="/cart">
          {/* <a className="flex items-center mr-4"> */}
            <FaShoppingCart className="mr-2" /> 
          {/* </a> */}
        </Link>
        <Link href="/account">
          {/* <a className="flex items-center mr-4"> */}
            <FaUser className="mr-2" /> 
          {/* </a> */}
        </Link>
        <Link href="/favorites">
          {/* <a className="flex items-center"> */}
            <FaHeart className="mr-2" /> 
          {/* </a> */}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
