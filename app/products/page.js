"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import API from "../utils/api";
import Link from "next/link";

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
  grid-column: span 2; /* Span the entire width of the container */
  grid-row: span auto; /* Let it span as many rows as needed */
  background-color: #ffffff;
  display: grid;
  gap: 10px;
  padding: 10px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

const Product = () => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [loading, isLoading] = useState(false);
  const [products, setProduct] = useState(null);

  const categories = [
    { name: "Men", subcategories: ["Shirts", "Trousers", "Accessories"] },
    { name: "Women", subcategories: ["Tops", "Bottoms", "Accessories"] },
    { name: "Sports", subcategories: ["Running", "Training", "Basketball"] },
  ];

  const handleCategoryClick = (index) => {
    setExpandedCategories((prevExpanded) => {
      return prevExpanded.includes(index)
        ? prevExpanded.filter((item) => item !== index)
        : [...prevExpanded, index];
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      // isLoading(true);
      try {
        const productsData = await API.getProducts();
        setProduct(productsData);
        // isLoading(false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        // isLoading(false);
      }
    };

    fetchProduct();
  }, []);

  return (
    <GridContainer>
      {/* Sidebar */}
      <LeftMenu>
        <h2
          style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Categories
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {categories.map((category, index) => (
            <li
              key={index}
              onClick={() => handleCategoryClick(index)}
              style={{ cursor: "pointer", marginBottom: "10px" }}
            >
              {category.name}
              {expandedCategories.includes(index) && (
                <ul style={{ marginLeft: "20px", padding: 0 }}>
                  {category.subcategories.map((subCategory, subIndex) => (
                    <li
                      key={subIndex}
                      style={{ cursor: "pointer", marginBottom: "5px" }}
                    >
                      {subCategory}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </LeftMenu>

      {/* ProductDetail */}
      {loading ? (
        <p>Loading...</p>
      ) : products && products.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {products.map((product, index) => (
            <Link key={index} href={`/product/${product.product_id}`}>
              <ProductDetail>
                <img src={product.product_images[0]} alt={product.product_name} />
                <h1>{product.product_name}</h1>
                <p>{product.product_price}</p>
                {/* Additional product details */}
              </ProductDetail>
            </Link>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </GridContainer>
  );
};

export default Product;
