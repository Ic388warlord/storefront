'use client'
import React from 'react'
import { FaShoppingCart, FaHeart, FaMoneyCheck} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import API from '../../utils/api';
import Image from 'next/image';
import Link from 'next/link';

function Product({params}) {
  const [product, setProduct] = useState(null)

  const addToCart = () => {
    // Add your API call logic for adding the item to the cart here

    console.log('Adding to cart...');
  };

  const saveToFavourites = () => {
    // Redirect the user to the purchase page
    router.push('/purchase');
  };

  const checkOut = () => {
    // Redirect the user to the purchase page
    router.push('/purchase');
  };

  const changeImage = (imagePath) => {
    document.getElementById('largeImage').src = imagePath;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await API.getProductById(params.itemId); //Uncomment when finished
        // const product = await API.getDummyProduct()
        setProduct(product);
      } catch (error) {
        // Handle any errors here, such as setting an error state or logging
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, []);

  return (
    <div className="bg-gray-100 p-8 h-screen">
          <p className="route uppercase mb-16 text-sm">
            <Link href="/">Storefront</Link> / {product.product_category } / {product.product_name}
        </p>
      <div className="max-w-screen-xl mx-auto w-4/5">
        {/* Image Slider */}
        {product && (
          <div className="flex ">
            {/* Thumbnails */}
            <div className='w-1/3'>
            <div className="flex flex-col w-full h-full space-y-4 pr-8 ">
              {product.product_images.map((thumbnail, index) => (
                <Image
                  key={index}
                  src={thumbnail}
                  alt={`Thumbnail ${index + 1}`}
                  width={200}
                  height={200}
                  className="cursor-pointer w-45 h-16 object-cover"
                  onClick={() => changeImage(thumbnail)}
                />
              ))}
            </div>

            </div>

  
            {/* Large Image */}
            <div className="flex-grow w-full">
              <div className="w-full h-96 overflow-hidden">
                <img
                  src={product.product_images[0]}
                  alt="Large Image"
                  id="largeImage"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
  
            {/* Product Details */}
            <div className="flex-grow-0 ml-10 w-2/3"> {/* Added margin to the left */}
              <div className="flex flex-col">
                <p className="text-sm text-gray-700">{product.product_category}</p>
                <h1 className="text-3xl font-bold">{product.product_name}</h1>
                <p className="text-md text-gray-700">{product.product_description}</p>
                <br />
                <p className="text-2xl font-bold text-green-700">${product.product_price}</p>
  
                {/* Buttons */}
                <div className="mt-10 space-y-2 flex flex-col">
                  <button
                    className="bg-black  text-white px-6 py-2 rounded flex items-center justify-center hover:bg-gray-300 hover:text-black"
                    onClick={addToCart}
                  >
                    <FaShoppingCart className="mr-2" size={24} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    className="bg-red-600  text-white border-2 px-6 py-2 rounded flex items-center justify-center hover:bg-gray-300 hover:text-red-600"
                    onClick={saveToFavourites}
                  >
                    <FaHeart className="mr-2" size={24} />
                    <span>Save To Favorites</span>
                  </button>
                  <button
                    className="bg-blue-600 text-white border-2 px-6 py-2 rounded flex items-center justify-center hover:bg-gray-300 hover:text-blue-600"
                    onClick={checkOut}
                  >
                    <FaMoneyCheck className="mr-2" size={24} />
                    <span>Check Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );  
}  

export default Product
