"use client"
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import API from '../utils/api';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  gap: 10px;
  height: 100vh;
`;

const LeftMenu = styled.div`
  grid-column: span 3;
  grid-row: span 12;
  background-color: #f0f0f0;
`;

const ProductDetail = styled.div`
  grid-column: span 9;
  grid-row: span 8;
  background-color: #ffffff;
`;

const Product = () => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [product, setProduct] = useState(null);

  const categories = [
    { name: 'Men', subcategories: ['Shirts', 'Trousers', 'Accessories'] },
    { name: 'Women', subcategories: ['Tops', 'Bottoms', 'Accessories'] },
    { name: 'Sports', subcategories: ['Running', 'Training', 'Basketball'] },
  ];

  const handleCategoryClick = (index) => {
    setExpandedCategories((prevExpanded) => {
      return prevExpanded.includes(index) ? prevExpanded.filter((item) => item !== index) : [...prevExpanded, index];
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Use the actual API function when ready
        const product = await API.getDummyProduct();
        setProduct(product);
        console.log(product)
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, []);

  return (
    <GridContainer>
      {/* Sidebar */}
      <LeftMenu>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px' }}>Categories</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {categories.map((category, index) => (
            <li key={index} onClick={() => handleCategoryClick(index)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
              {category.name}
              {expandedCategories.includes(index) && (
                <ul style={{ marginLeft: '20px', padding: 0 }}>
                  {category.subcategories.map((subCategory, subIndex) => (
                    <li key={subIndex} style={{ cursor: 'pointer', marginBottom: '5px' }}>
                      {subCategory}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </LeftMenu>

      <ProductDetail>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Product List</h1>
        {Array.isArray(product) && product.length > 0 ? (
          product.map((item, index) => (
            <div key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
              <img src={item.product_images} alt={item.product_name} style={{ width: '100px', height: '100px', marginRight: '20px' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 10px', fontWeight: 'bold' }}>{item.product_name}</h3>
                <p style={{ fontSize: '16px', margin: 0 }}>{item.product_description}</p>
              </div>
            </div>
            
          ))
        ) : (
          <p>Loading...</p>
        )}
      </ProductDetail>
    </GridContainer>
  );
};

export default Product;
