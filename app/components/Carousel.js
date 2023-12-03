'use client'
import React from 'react'
import Image from 'next/image'
import { useState } from 'react';
import { Lato } from 'next/font/google'

const lato = Lato({ subsets: ['latin'], weight: ['700','900'] });

const Carousel = () => {
const [activeSlide, setActiveSlide] = useState(0);

  const carouselItems = [
    '/mainphoto.jpg',
    '/teamFour.jpeg',
  ];

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };
  return (
    <section className="w-full h-screen md:h-[710px] flex flex-col"
    >
        {/* <NavBar /> */}
        <div className="relative h-full">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full duration-700 ${
              index === activeSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url("${item}")`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <div
              className="absolute inset-0"
              // This is for the overlay gradient
              // style={{
              //   backgroundImage:
              //     'linear-gradient(180deg, rgba(16, 16, 140, 0.7) 0%, rgba(68, 68, 193, 0.502099) 16.82%, rgba(163, 117, 237, 0) 29.44%)',
              // }}
            ></div>
          </div>
        ))}
      </div>


    <div className={`absolute top-2/3 left-20  z-40 text-white ${lato.className}`}>
            <p className="text-5xl my-3 tracking-widest">One Size Fits all</p>
            <p className="text-lg tracking-widest">It's simple. You fit, or you don't.</p>
            <a href="/products" className="inline-block mt-3 px-6 py-3 border border-white border-opacity-50 text-white rounded-md text-lg hover:bg-white hover:text-black transition duration-300">
          View Products
    </a>
            
    </div>
    {/* Circles on the bottom */}
    <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
      {carouselItems.map((_, index) => (
        <button
          key={index}
          type="button"
          className={`w-3 h-3 rounded-full ${
            index === activeSlide ? 'bg-white' : 'bg-gray-300'
          }`}
          aria-current={index === activeSlide ? 'true' : 'false'}
          aria-label={`Slide ${index + 1}`}
          onClick={() => handleSlideChange(index)}
        ></button>
      ))}
    </div>


      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={() =>
          setActiveSlide((prevSlide) => (prevSlide === 0 ? carouselItems.length - 1 : prevSlide - 1))
        }
      >
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white dark:text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      <button
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={() =>
          setActiveSlide((prevSlide) => (prevSlide === carouselItems.length - 1 ? 0 : prevSlide + 1))
        }
      >
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-800/30 dark:bg-white/30 group-hover:bg-gray-800/50 dark:group-hover:bg-white/60 group-focus:ring-4 group-focus:ring-gray-800/70 group-focus:outline-none">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-white dark:text-gray-800 transform rotate-180"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
  <span className="sr-only">Next</span>
</span>


        </button>





    </section>

  )
}

export default Carousel