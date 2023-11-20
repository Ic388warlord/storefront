import React from 'react';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import API from '../utils/api';

const FavoriteCard = ({ product, onRemove }) => {
    const email = localStorage.getItem("username")

    const addToCart = async () => {
        await API.postShoppingCart(email, product.product_id)
      };
    
    return (
        <section className="grid"> {/* Updated width classes */}
        {/* Per Item Picture + Product details */}
        <article className="shadow-lg flex"> {/* Removed height class */}
            {/* Picture */}
            <div className="w-1/4"> {/* Adjust the width here */}
            {/* Responsive scales */}
            <div className="relative w-full h-full">
                <Link href={'/product/' + product.product_id}>
                <Image
                    src={product.product_images[0]}
                    alt="Product Image"
                    fill
                    objectFit="contain"
                />
                </Link>
            </div>
            </div>

            {/* Proudct Details */}
            <div className="p-3 flex-1 flex flex-col justify-between tracking-wide">
                <div>
                    {/* title and close button*/}
                    <div className="flex justify-between items-end">
                    <p className="bold text-lg uppercase">{product.product_name}</p>
                    <button className= "text-red-600" onClick={() => onRemove(product.product_id)}>
                    <FaHeart className="mr-2" size={24} />
                    </button>
                    </div>
                    {/* product details*/}
                    <div>
                    <p className="">{product.product_category} </p>
                    <p className="text-gray-500">Product Id: {product.product_id} </p>
                    </div>
                </div>
                <br/>
                {/* product price and add to cart button*/}
                <div className="flex justify-between items-end">
                    <p className="text-green-700 text-lg">CAD {product.product_price}</p>
                    <button className="bg-black text-white px-6 py-2 rounded flex items-center justify-center hover:bg-gray-300 hover:text-black"
                    onClick={addToCart}>
                        <FaShoppingCart className="mr-2" size={24} />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </article>
        </section>
    );
};

export default FavoriteCard;
