'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import API from '../../utils/api';
function Product({params}) {
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // const product = await API.getProductById(params.itemId); //Uncomment when finished
        const product = await API.getDummyProduct()
        setProduct(product);
      } catch (error) {
        // Handle any errors here, such as setting an error state or logging
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, []);



  return (
    // Populate this page with the product data
    <div>Hello, {product && product.product_name}</div>
  )
}

export default Product
