'use client';
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import ShoppingCartCard from '../components/shoppingCartCard';
import Product from '../models/productModel'
import Cart from '../models/shoppingCart';


function ShoppingCart() {

    const [items, setItems] = useState(null)
    const shoppingCart = new Cart();
    const url = "https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/product"

    useEffect(() => {
        const getData = async() => {
            const query = await fetch('/dummyItems.json') // Change
            const data = await query.json()

            const products = data.map(item => new Product(
                item.product_id,
                item.product_category,
                item.product_description,
                item.product_images,
                item.product_name,
                item.product_price
            ));

            setItems(products);
        }
        getData()

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
        {items && items.map((product,index) => {
            shoppingCart.add(product);
            return <ShoppingCartCard product={product} onRemove={removeItem} key={index}/>
        })}

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