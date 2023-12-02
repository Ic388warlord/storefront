"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import API from "../utils/api";
import Image from "next/image";
import Link from "next/link";
import { ClipLoader } from "react-spinners";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  height: 100vh;
`;

const LeftMenu = styled.div`
  grid-column: span 1;
  grid-row: span 12;
  background-color: #f0f0f0;
  margin-right: 200px;
`;

const ProductDetail = styled.div`
  grid-column: span 3; /* Span the entire width of the container */
  grid-row: span auto; /* Let it span as many rows as needed */
  background-color: #ffffff;
  display: grid;
  gap: 10px;
  padding: 10px;
  margin-right: 200px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;

const Product = () => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [loading, isLoading] = useState(false);
  const [products, setProduct] = useState(null);

  const categories = [
    { name: "Men", subcategories: ["Shirts", "Trousers", "Accessories"] },
    { name: "Women", subcategories: ["Tops", "Bottoms", "Accessories"] },
    { name: "Rugby", subcategories: ["Running", "Training", "Basketball"] },
    { name: "Running", subcategories: ["Shirts", "Trousers", "Accessories"] },
    { name: "Golf", subcategories: ["Tops", "Bottoms", "Accessories"] },
    { name: "Baseball", subcategories: ["Running", "Training", "Basketball"] },
    { name: "Enoki", subcategories: ["Tops", "Bottoms", "Accessories"] },
    { name: "Fred The Best", subcategories: ["Running", "Training", "Basketball"] },
    { name: "Gaming", subcategories: ["Running", "Training", "Basketball"] },
    { name: "Life", subcategories: ["Tops", "Bottoms", "Accessories"] },
    { name: "Software", subcategories: ["Running", "Training", "Basketball"] },
    { name: "Jumbo", subcategories: ["Running", "Training", "Basketball"] },
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
        isLoading(true);
        const productsData = await API.getProducts();
        setProduct(productsData);
        isLoading(false);
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
          className="justify-center m-2 flex uppercase tracking-wide"

          style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Categories
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 5 }}>
          {categories.map((category, index) => (
            <li
              key={index}
              className="m-2 flex uppercase"
              onClick={() => handleCategoryClick(index)}
              style={{ cursor: "pointer", marginBottom: "10px" }}
            >
              {category.name} {" >"}
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
        <p className="absolute bottom-1/3 right-1/3 ">
          <ClipLoader size={100}/>
          </p>
      ) : products && products.length > 0 ? (
        <ProductDetail className="grid grid-cols-3 m-5 col-span-2">
          {products.map((product, index) => (
            <Link key={index} href={`/product/${product.product_id}`}>
              <div className="flex flex-col m-2 w-[250px] hover:shadow-md p-5">
                    <div className="w-full h-[200px] relative"> {/* Set a relative position on the container and to encapuslate the image */}
                    <Image
                      src={product.product_images[0]}
                      fill={true}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      alt={product.product_name}
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-end">One Size</p>               
                  <div className="min-h-[3rem]"> {/* Set a minimum height to ensure consistency. This container makes the hieght consistent */}
                  <h1 className="text-sm tracking-wide uppercase whitespace-normal overflow-hidden">{product.product_name}</h1>
                  </div>
                  <p className="text-sm text-gray-500">{product.product_category}</p>
                <p>CAD $ {product.product_price}</p>
                {/* Additional product details */}
              </div>
            </Link>
          ))}
        </ProductDetail>
      ) : (
        <p>No products found.</p>
      )}
    </GridContainer>
  );
};

export default Product;
