'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaCheck, FaCheckCircle } from 'react-icons/fa'
import Link from 'next/link'

const CheckOut = () => {
    const router = useRouter()
    const handleContinueShopping = () => {
        router.push('/products')
    }

  return (
    <div className='flex h-screen w-full flex-col justify-center items-center'>
        <div className='border flex flex-col items-center justify-evenly w-1/3 h-1/3 shadow-md p-3'>
            <p className="text-5xl tracking-wider font-bold">Check Out</p>
            <FaCheckCircle size={100} color='green' />
            <p>You will receive your order in 3-4 business days! Enjoy!</p>
            <Link className='text-sm underline text-blue-300' href={'/products'}>Continue Shopping</Link>


        </div>


    </div>
  )
}

export default CheckOut