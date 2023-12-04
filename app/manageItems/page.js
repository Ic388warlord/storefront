'use client'
import React, { useEffect } from 'react'
import API from '../utils/api';
import { useState } from 'react'
import Image from 'next/image';
import { FaTimes, FaCheckCircle, FaEdit, FaPlus, FaSync } from 'react-icons/fa'
import ClipLoader from "react-spinners/ClipLoader";
import AddItemModal from '../components/addItemModal';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { FadeLoader } from 'react-spinners';
;

const ManageItems = () => {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const router = useRouter();

    //  We can also try and see if they're admin to begin with
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        await API.deleteItem(id);
        alert(`item ${id} deleted`);
    }

    const fetchProducts = async () => {
        setLoading(true);
        const data = await API.getProducts();
        setProducts(data);
        setLoading(false);
    }


  return (
    <div className='flex-col m-10'>
        <div className=''>


            <p className="flex text-lg uppercase justify-center">
            Welcome Overlord
            </p>
            {/* Line break */}
            <div className='border w-full m-2'></div>

            <div className="flex justify-between">
            <p>Items:</p>
            <div className='flex space-x-5'>
            <button className='flex'
                    onClick={() => setModal(true)}
                    >
                Add Item {"    "} <FaPlus size={24} />  
            </button>
            <AddItemModal isOpen={modal} onClose={() => setModal(false)} />

            <button onClick={fetchProducts}>
                <FaSync size={24} />
            </button>

            </div>



            </div>

{/* Content */}

{!loading ? (
                <div className='w-full my-10'>

                {products && products.map((product, index) => (
                <section key={index} className="border-b border-t p-1 text-center items-center flex justify-between">
                <div className='h-[50px] w-[50px] relative'>
                    <Image fill
                    sizes='100px'
                      src={product.product_images[0]} alt="Hello" >
                    </Image>
                </div>

                <p className="uppercase text-xs">
                    {product.product_name} - CAD {product.product_price}
                </p>

                <div>
                    <button className="p-2" onClick={() => handleDelete(product.product_id)}>
                        <FaTimes size={24} color='red' />
                        
                    </button>

                </div>
            </section>
                ))

                }
            


            </div>
) : (<div className='text-center flex justify-center'>
    <ClipLoader color='lightBlue' size={20} />

    </div>)}


        </div>

    </div>
  )
}

export default ManageItems