'use client';
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';


function ShoppingCart() {

    const [items, setItems] = useState()
    console.log(items)


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
             {/* Items */}
            <section className="w-2/3">
                {/* Per Item Picture + Product details*/}
                <article className='shadow-lg h-[250px] flex '>
                    {/* Picture */}
                    <div className='w-1/2'>
                        {/* Responsive scales */}
                        <Image 
                            src="/teamFour.jpeg" 
                            alt="Descriptive text for the image" 
                            width={300} 
                            height={500}
                            layout='responsive'

                        />
                    </div>
                    {/* Proudct Details */}
                    <div className='px-3 flex-1 flex flex-col justify-between tracking-wide'>
                        <div>
                        {/* title and close button*/}
                        <div className='flex justify-between items-end'>
                            <p className="bold text-lg uppercase">Memories</p> 
                            <button>
                                <FaTimes/>

                            </button> 
                        </div>

                        <div>
                            <p className='text-gray-500'>Product ID: </p>
                            <p className="">Color: </p>
                            <p className="">Size: </p>

                        </div>

                        </div>



                        <p className='text-red-500'>CAD 19.90 </p>
                        {/* <p>Quantity</p> */}

                    </div>




                </article>



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