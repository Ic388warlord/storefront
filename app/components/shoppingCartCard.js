'use client'
import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import Image from 'next/image'


const ShoppingCartCard = ({product, onRemove}) => {
    return(
            <section className="w-full my-5">
                {/* Per Item Picture + Product details*/}
                <article className='shadow-lg h-[250px] flex '>
                    {/* Picture */}
                    <div className='w-1/2'>
                        {/* Responsive scales */}

                    <div className='relative w-full h-full'>
                    <Image 
                            src="/teamFour.jpeg" 
                            alt="Descriptive text for the image" 
                            // width={450}
                            // height={300}
                            fill
                            objectFit='contain'

                        />
                    </div>
                    </div>


                    {/* Proudct Details */}
                    <div className='p-3 flex-1 flex flex-col justify-between tracking-wide'>
                        <div>
                        {/* title and close button*/}
                        <div className='flex justify-between items-end'>
                            <p className="bold text-lg uppercase">{product.product_name}</p> 
                            <button onClick={() => onRemove(product.product_id)}>
                                <FaTimes/>

                            </button> 
                        </div>

                        <div>
                            <p className='text-gray-500'>Product ID: {product.product_id} </p>
                            <p className="">Category: {product.product_category} </p>
                            <p className="">Color: Gray </p>
                            <p className=""></p>

                        </div>

                        </div>



                        <p className='text-red-500'>CAD {product.product_price}</p>
                        {/* <p>Quantity</p> */}

                    </div>
                </article>



            </section>




    )



}

export default ShoppingCartCard