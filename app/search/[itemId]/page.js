'use client'
import React from 'react'
import { useState } from 'react';

const SeachPage = ({params}) => {
    const result = decodeURIComponent(params.itemId);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState(null);


    // Define a fetch thing here
    
  return (
    <div className='mx-20'>
        <p className="text-gray-500 uppercase my-4">StoreFront / Search</p>
        <p className="text-lg font-bold uppercase mt-10 mb-3">Search Results For</p>
        <h1 className="text-4xl my-2 uppercase">{result}</h1>
        <div className='border w-full'></div>

        <div className='mt-2'>
            {products || products == null ? (
                <>
                <p className="text-lg font-bold uppercase mt-10 mb-3">No Results Found</p>
                </>
            ) : (
                <>
                <p className="">64 items listed</p>
                </>
            )}


        </div>
        {/* Seperation */}
        

    </div>
  )
}

export default SeachPage