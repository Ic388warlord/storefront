'use client'
import React from 'react'
import { FaShoppingCart, FaHeart, FaMoneyCheck} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import API from '../../utils/api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Product({params}) {
  const [product, setProduct] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter()

  // Check if running on the client side
  useEffect(() => {
    const checkIsFavorite = async () => {
      try {
        const favoritesData = await API.getFavorites();
        const favoriteIds = Array.isArray(favoritesData.body) ? favoritesData.body : [];
        const isItemFavorite = favoriteIds.includes(params.itemId);
        setIsFavorite(isItemFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    checkIsFavorite();
  }, [params.itemId]);

  const addToCart = async () => {
    try {
      const data = await API.postShoppingCart(params.itemId)
      console.log(data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
    // TODO In case you wanted to make a hook that displays the successful image
    alert('Added to cart')
  };
  
  const FavoriteButton = () => {
    const toggleFavorite = async () => {
      try {
        if (isFavorite) {
          const data = await API.postFavorites("remove", params.itemId);
        } else {
          const data = await API.postFavorites("add", params.itemId);
        }
  
        // Toggle isFavorite status after the API call
        setIsFavorite((prevIsFavorite) => !prevIsFavorite);
      } catch (error) {
        console.error("Error checking and toggling favorite:", error);
      }
    };
  
    return (
      <button
        id="favoriteButton"
        className={`${isFavorite ? "bg-gray-500" : "bg-red-600"} text-white border-2 px-6 py-2 rounded flex items-center justify-center hover:bg-gray-300 hover:text-black`}
        onClick={toggleFavorite}
      >
        <FaHeart className="mr-2" size={24} />
        <span id="favoriteButtonText">
          {isFavorite ? 'Remove from Favorites' : 'Save To Favorites'}
        </span>
      </button>
    );
  };

  const checkOut = () => {
    router.push('/shoppingCart/checkout');
  };

  const changeImage = (imagePath) => {
    document.getElementById('largeImage').src = imagePath;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await API.getProductById(params.itemId); 
        setProduct(product);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, []);

  return (
    <div className="bg-gray-100 p-5 h-screen">
      <p className="route uppercase mb-5 text-sm">
        <Link href="/">Storefront</Link> / {product?.product_category || 'Category'} / {product?.product_name || 'Product Name'}
      </p>
      <div className="max-w-screen-xl mx-auto">
        {/* Image Slider */}
        {product && (
          <div className="flex">
            {/* Thumbnails */}
            <div className='w-1/5'>
            <div className="flex flex-col w-full h-full space-y-4 pr-8 mt-20">
              {product.product_images.map((thumbnail, index) => (
                <Image
                  key={index}
                  src={thumbnail}
                  alt={`Thumbnail ${index + 1}`}
                  width={200}
                  height={400}
                  className="cursor-pointer w-45 h-50 object-cover"
                  onClick={() => changeImage(thumbnail)}
                />
              ))}
            </div>
            </div>
  
            {/* Large Image */}
            <div className="flex-grow h-full w-4/5 mt-20">
              <div className="w-90 h-96 overflow-hidden">
                <img
                  src={product.product_images[0]}
                  alt="Large Image"
                  id="largeImage"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
  
            {/* Product Details */}
            <div className="flex-grow-0 ml-10 w-4/5"> {/* Added margin to the left */}
              <div className="flex flex-col">
                <p className="text-sm text-gray-700">{product.product_category}</p>
                <h1 className="text-3xl font-bold">{product.product_name}</h1>
                <br/>
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
                  <FavoriteButton/>
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
