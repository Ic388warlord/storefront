'use client';
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import ShoppingCartCard from '../components/shoppingCartCard';
import Product from '../models/productModel'
import Cart from '../models/shoppingCart';
import API from '../utils/api';


function ShoppingCart() {

    const [items, setItems] = useState(null)
    const [loading, isLoading] = useState(false)
    const shoppingCart = new Cart();
    useEffect(() => {
        const fetchProducts = async () => {
            isLoading(true)
            try {
                const products = await API.getProducts();
                setItems(products);
                isLoading(false)
            } catch (error) {
                // Handle any errors here, such as setting an error state or logging
                console.error("Failed to fetch products:", error);
            }
            isLoading(false)
        };
        fetchProducts();
    }, []);
      
    const removeItem = productId => {
        // Update the items state
        setItems(currentItems => currentItems.filter(item => item.product_id !== productId));
        shoppingCart.remove(productId);
    };
      


    

    // TODO write a function that grabs the stuff
  return (
    <div className='p-10'>
        {/* Route */}
        <p className="route uppercase text-sm">
            <Link href="/">Storefront</Link> / Shopping Cart
        </p>
        {/* Title */}
        <p className="text-5xl uppercase my-5">Shopping Cart</p>

        {/* 2 Columns */}
        <section className='flex justify-between'>


        <section className='w-full'>
  {loading ? (
    // Render loading state if loading is true
    <p>Loading...</p>
  ) : items ? (
    // Render items if loading is false and items is truthy
    items.map((product, index) => {
      shoppingCart.add(product);
      return <ShoppingCartCard product={product} onRemove={removeItem} key={index}/>
    })
  ) : (
    // Render a message (or nothing) if loading is false and items is falsy
    <p>No products found.</p>
  )}
</section>





        
            {/* Total Box */}
            <section className="w-1/3 m-3">
                    {/* Price Box */}
                    <div className="flex flex-col gap-3 justify-evenly border shadow-md w-full h-[300px] p-5">
                        {/* Todo Add logic here */}
                        <div className="text-lg font-bold uppercase">Order summary| x items</div>
                        {/* Item Subtotal */}
                        <div className="flex justify-between">
                            <p>Item Subtotal</p>
                            <p>CAD $x</p>
                        </div>
                        {/* Subtotal */}
                        <div className="flex font-bold my-2 text-lg uppercase justify-between">
                            <p>Subtotal</p>
                            <p>CAD $x</p>
                        </div>
                        {/* Tax */}
                        <div className="flex justify-between">
                            <p>Estimated Tax</p>
                            <p>CAD $0.0</p>
                        </div>
                        {/* Order Total */}
                        <div className="flex font-bold my-2 uppercase justify-between">
                            <p>Order Total</p>
                            <p>CAD $x</p>
                        </div>
                    </div>

                    {/* Checkout Continue Shopping */}
                    <p className='p-3 mt-3'>
                        Your items will only be available for the next 60 seconds! Get them fast before they go to the next person!
                    </p>
                    <div className='w-full p-3 my-5 uppercase text-lg text-center bg-red-600 text-white'>
                        Check out
                    </div>
                    <div className='w-full p-3 my-5 uppercase text-lg text-center border-2'>
                        Continue Shopping
                    </div>
            </section>







        </section>



    </div>
  )
}

export default ShoppingCart