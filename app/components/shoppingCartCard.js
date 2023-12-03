'use client'
import React from 'react'
import { FaTimes } from 'react-icons/fa'
import { useState, useEffect } from 'react';
import API from '../utils/api';
import Image from 'next/image'
import Link from 'next/link'

const ShoppingCartCard = ({ product, onRemove, updateItemCount }) => {
    const [localCount, setLocalCount] = useState(product.count);
    const [localPrice, setLocalPrice] = useState(product.product_price * product.count);

    useEffect(() => {
        // Reset local state when product count changes
        setLocalCount(product.count);
        setLocalPrice(product.product_price * product.count);
    }, [product.count, product.product_price]);

    const handleUpdateItemCount = async (product_id, product_price, operation) => {
        try {
            await API.updateItemCount(product_id, operation);
    
            // Use the updater function to ensure correct state updates
            setLocalCount(prevCount => {
                const newCount = operation === 'increment' ? prevCount + 1 : (prevCount > 1 ? prevCount - 1 : prevCount);
                setLocalPrice(newCount * product_price);
                updateItemCount(product_id, newCount, newCount * product_price);
                return newCount;
            });
    
        } catch (error) {
            console.error('Error updating item count:', error);
        }
    };

    return(
            <section className="w-full my-5">
                {/* Per Item Picture + Product details*/}
                <article className='shadow-lg h-[250px] flex '>
                    {/* Picture */}
                    <div className='w-1/4'>
                        {/* Responsive scales */}

                    <div className='relative w-full h-full'>
                        <Link className='' href={'/product/' + product.product_id}>
                            <Image 
                                fill
                                src={product.product_images[0]} 
                                alt="Descriptive text for the image" 
                            />
                        </Link>
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
                            <div className="ml-4 flex items-center">
                            <button
                            onClick={() => handleUpdateItemCount(product.product_id, product.product_price, 'decrement')}
                            className="px-2 py-1 border rounded border-gray-300"
                            >
                            -
                            </button>
                            <p className="mx-2">{localCount}</p>
                            <button
                            onClick={() => handleUpdateItemCount(product.product_id, product.product_price, 'increment')}
                            className="px-2 py-1 border rounded border-gray-300"
                            >
                            +
                            </button>
                        </div>
                        </div>
                        </div>
                        <p className='text-red-500'>CAD {localPrice}</p>
                        {/* <p>Quantity</p> */}
                    </div>
                </article>
            </section>
    )
}

export default ShoppingCartCard