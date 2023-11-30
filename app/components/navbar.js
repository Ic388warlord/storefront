'use client';

import Link from 'next/link';
import { FaShoppingCart, FaUser, FaHeart, FaProductHunt, FaStop, FaTimes, FaSearch, FaTorah, FaBook } from 'react-icons/fa';
import { useAuth } from '../utils/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = (props) => {
  const [search, setSearch] = useState(false);
  const [item, setItem] = useState();
  const router = useRouter();




  return (
    <nav className="flex justify-between bg-white p-5 text-black px-16 border-b-2 border-black">
      {search ? (
        <div className='flex flex-grow justify-end'>
          <div className="flex flex-grow space-x-5 items-center">
            <input className="flex-grow p-3 border" type="text" placeholder="Search By Keyword" onChange={(e) => setItem(e.target.value)}/>
            <button className="p-2" onClick={() => setSearch(false)}>
              <FaTimes className="mr-2" size={24} />
            </button>
            <Link className="p-2" href={`/search/${item}`}>
              <FaSearch className="mr-2" size={24} />
            </Link>
          </div>
        </div>

      ) : (
        <>
        <div className="flex space-x-5 items-center">
      <h1 className={` text-4xl`}>
        <Link href={'/'}>
        StoreFront
        </Link>
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
        <button className="p-2" onClick={() => setSearch(true)}>
            <FaSearch className="mr-2" size={24} />
        </button>
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
        <Link href="/contacts">
          {/* <a className="flex items-center"> */}
            <FaBook className="mr-2"size={24} /> 
          {/* </a> */}
        </Link>
      </div>
      </>
      )}
      
    </nav>
  );
};

export default Navbar;
