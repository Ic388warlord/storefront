'use client'
import React, { useEffect } from 'react'
import { useState } from 'react';
import API from '@/app/utils/api';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';

const SeachPage = ({params}) => {
    const result = decodeURIComponent(params.itemId);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState(null);


    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await API.getSearchProducts(result);
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
            setLoading(false);

            
        }
        fetchProducts();
    }, []);


    // Define a fetch thing here
    
  return (
    <div className='mx-20'>
        <p className="text-gray-500 uppercase my-4">StoreFront / Search</p>
        <p className="text-lg font-bold uppercase mt-10 mb-3">Search Results For</p>
        <h1 className="text-4xl my-2 uppercase">{result}</h1>
        <div className='border w-full'></div>

        <div className='mt-2'>
            {loading ? (
                <div className='flex justify-center'>
                    <ClipLoader />

                </div>
            ) : (
                <div className='grid gap-5  grid-cols-3 m-3'>
                    {products && products.map((product, index) => (
                        <Link href={`/product/${product.product_id}`} key={index} className='flex m-auto w-full h-[300px] flex-col justify-between items-center shadow-sm py-4'>
                            <div className='flex items-center relative w-1/2 '>
                                <img className='flex-col object-cover' src={product.product_images[0]} alt="Product Image" />
                            </div>

                            <div className='flex flex-col items-center'>  

                                    <p className='text-lg font-bold'>{product.product_name}</p>
                                <p className='text-lg font-bold'>$ CAD {product.product_price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
           


        </div>
        {/* Seperation */}
        

    </div>
  )
}

export default SeachPage