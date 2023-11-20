// FavoriteCard.js
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

const FavoriteCard = ({ product, onRemove }) => {
    
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
              <button onClick={() => onRemove(product.product_id)}>
                <FaTimes />
              </button>
            </div>

            <div>
              <p className="">{product.product_category} </p>
              <p className="text-gray-500">Product Id: {product.product_id} </p>
            </div>
        </div>
            <br/>
            <p className="text-green-700">CAD {product.product_price}</p>
        </div>
      </article>
    </section>
  );
};

export default FavoriteCard;
