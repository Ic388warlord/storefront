'use client'
import React from 'react'
import { FaHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import API from '../utils/api';

function Favourites() {
  const [items, setItems] = useState(null) 
  const [loading, isLoading] = useState(false)
  const productModel = new Product();

  return (
    <div></div>
  );  
}  

export default Favourites
