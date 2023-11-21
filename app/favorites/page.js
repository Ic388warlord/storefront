'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import API from '../utils/api';
import FavoriteCard from '../components/favoriteCard';


function Favourites() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
      // Check if running on the client side

    const fetchFavorites = async () => {
      try {
        setLoading(true);

        // Fetch favorite item IDs
        const favoritesData = await API.getFavorites();
        const favoriteIds = Array.isArray(favoritesData.body) ? favoritesData.body : [];
        // Fetch product details for each favorite item
        const favoriteProducts = await Promise.all(
          favoriteIds.map(async (itemId) => {
            const product = await API.getProductById(itemId);
            return product;
          })
        );

        setItems(favoriteProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError(error);
        setLoading(false);
      }
    };
    fetchFavorites();
    }, []); 

  const removeFavorite = async (productId) => {
    try {
      setItems((prevItems) => prevItems.filter((item) => item.product_id !== productId));
      await API.postFavorites("remove", productId);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };
  return (
    <div className="p-10">
      {/* Route */}
      <p className="route uppercase text-sm">
        <Link href="/">Storefront</Link> / Favorites
      </p>
      {/* Title */}
      <p className="text-5xl uppercase my-5">My Favorites</p>

      <section className='flex justify-between'>
        <div className="w-full">
          {loading && <p className="text-center mt-40">Loading...</p>}
          {error && <p className="text-center mt-40">Error: {error.message}</p>}
          {!loading && !error && (!items || items.length === 0) && <p className="text-center mt-40">No Favorites</p>}
          {!loading && !error && items && items.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {items.map((item) => (
                <FavoriteCard key={item.product_id} product={item} onRemove={removeFavorite}/>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Favourites;
