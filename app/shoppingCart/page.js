'use client';
import React from 'react'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ShoppingCartCard from '../components/shoppingCartCard';
import Cart from '../models/cart';
import API from '../utils/api';
import { useRouter } from 'next/navigation';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from '../components/checkoutForm';

const stripePromise = loadStripe("pk_test_51OE1VTIg25eUFBOpK8GQLXEfLNpeFcHPfWrSmujmn8pgykBBNLFcxAlTPyFZFT6xOPM0Z8mdSpArHerTituKeMnB00wKB7e6Tl");

function ShoppingCart() {
    const router = useRouter()
    const [clientSecret, setClientSecret] = React.useState("");
    const [items, setItems] = useState(null)
    const [loading, isLoading] = useState(false)
    const [checkoutInProgress, setCheckoutInProgress] = useState(false);
    const shoppingCart = new Cart();
    const [subTotal, setSubTotal] = useState(null);
    const [tax, setTax] = useState(null);
    const [total, setTotal] = useState(null);
    
    useEffect(() => {
        const fetchProducts = async () => {
            isLoading(true)
            try {
                const products = await API.getShoppingCart();
                setItems(products);
                isLoading(false)
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
            isLoading(false)
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        // This effect runs when items change
        if (items) {
          // Calculate and update subtotal, tax, and total
          const newSubTotal = shoppingCart.subTotal();
          const newTax = shoppingCart.tax();
          const newTotal = shoppingCart.total();
    
          // Update the state with new values
          setSubTotal(newSubTotal);
          setTax(newTax);
          setTotal(newTotal);
        }
      }, [items]);

    const updateItemCount = async (productId, newCount, newPrice) => {
        try {
          // Update the state in ShoppingCart
          setItems((currentItems) =>
            currentItems.map((item) =>
              item.product_id === productId ? { ...item, count: newCount } : item
            )
          );
    
          // Update the shoppingCart
          shoppingCart.update(productId, newCount);
    
          // Recalculate and update subtotal, tax, and total
          // You might need to adjust the calculation based on your business logic
          const newSubTotal = shoppingCart.subTotal();
          const newTax = shoppingCart.tax();
          const newTotal = shoppingCart.total();
    
          // Update the state with new values
          setSubTotal(newSubTotal);
          setTax(newTax);
          setTotal(newTotal);
        } catch (error) {
          console.error('Error updating item count:', error);
        }
      };
      
    const removeItem = async productId => {
        setItems(currentItems => currentItems.filter(item => item.product_id !== productId));
        await API.removeFromShoppingcart(productId);
        shoppingCart.remove(productId);
    };

    const handleCheckout = async () => {
        if (checkoutInProgress) {
            return;
        }
        try {
            setCheckoutInProgress(true);
            const total = shoppingCart.total();
            if (total == null || total === 0) {
                alert("No item in the shopping cart");
                setCheckoutInProgress(false);
                return;
            }
            const res = await API.stripeCheckout(total, "cad");
            setClientSecret(res.body.clientSecret);
        } catch (error) {
            console.error("Error during checkout:", error);
        } finally {
            setCheckoutInProgress(false);
        }
    }

    const appearance = {
        theme: 'flat',
      };
      const options = {
        clientSecret,
        appearance,
      };
    
    const handleContinueShopping = () => {
        router.push('/products')
    }

  return (
    <div className='p-10'>
        {/* Route */}
        <p className="route uppercase text-sm">
            <Link href="/">Storefront</Link> / Shopping Cart
        </p>
        {/* Title */}
        <p className="text-5xl uppercase my-5">Shopping Cart</p>

        {/* 2 Columns */}
        <section className='flex justify-between'>


        <section className='w-full'>
            {loading ? (
                // Render loading state if loading is true
                <p>Loading...</p>
            ) : items ? (
                // Render items if loading is false and items is truthy
                items.map((product, index) => {
                    shoppingCart.add(product);
                    return <ShoppingCartCard product={product} onRemove={removeItem} updateItemCount={updateItemCount} key={index} />
                })
            ) : (
                // Render a message (or nothing) if loading is false and items is falsy
                <p>No products found.</p>
            )}
        </section>

            {/* Total Box */}
            <section className="w-1/3 m-3">
                
                    {/* Price Box */}
                    <div className="flex flex-col gap-3 justify-evenly border shadow-md w-full h-[300px] p-5">
                        {/* Todo Add logic here */}
                        <div className="text-lg font-bold uppercase">Order summary| {shoppingCart.length()} items</div>
                        {/* Item Subtotal */}
                        <div className="flex justify-between">
                            <p>Item Subtotal</p>
                            <p>CAD ${(subTotal !== null ? subTotal.toFixed(2) : 0 )}</p>
                        </div>
                        {/* Subtotal */}
                        <div className="flex font-bold my-2 text-lg uppercase justify-between">
                            <p>Subtotal</p>
                            <p>CAD ${(subTotal !== null ? subTotal.toFixed(2) : 0 )}</p>
                        </div>
                        {/* Tax */}
                        <div className="flex justify-between">
                            <p>Estimated Tax</p>
                            <p>CAD ${(tax !== null ? tax.toFixed(2) : 0 )}</p>
                        </div>
                        {/* Order Total */}
                        <div className="flex font-bold my-2 uppercase justify-between">
                            <p>Order Total</p>
                            <p>CAD ${(total !== null ? total.toFixed(2) : 0 )}</p>
                        </div>
                    </div>

                    {clientSecret && (
                        <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm items={items} />
                        </Elements>
                    )}

                    {/* Checkout Continue Shopping */}
                    <p className='p-3 mt-3'>
                        Your items will only be available for the next 60 seconds! Get them fast before they go to the next person!
                    </p>
                    <button
                        className='w-full p-3 my-5 uppercase text-lg text-center bg-red-600 hover:bg-red-800 text-white'
                        onClick={handleCheckout}
                        disabled={checkoutInProgress}
                    >
                        {checkoutInProgress ? 'Processing...' : 'Check out'}
                    </button>
                    <button className='w-full p-3 uppercase text-lg text-center border-2 hover:bg-black hover:text-white' onClick={handleContinueShopping}>
                        Continue Shopping
                    </button>
            </section>
        </section>
    </div>
  )
}

export default ShoppingCart