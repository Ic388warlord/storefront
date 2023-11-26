import React from "react";
import { useEffect, useState } from "react";

const AddItemModal = ({ isOpen, onClose, itemID = null }) => {
    if (!isOpen) return null;
    const [product, setProduct] = useState({
      name: "",
      price: "",
      category: "",
      inventory: "",
      description: "",
    });

    const handleOnChange= (e) => {
        setProduct(prev => ({
          ...prev,
          [e.target.name]: e.target.value
        }))
        console.log(product);
    }


    useEffect(() => {
        if (itemID) {
            // const fetchProduct()
        }
    }, [])





    return (
      <div className="fixed inset-0 z-50 overflow-auto backdrop-blur-sm bg-white/50 flex">
        <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col  broder border-2 flex rounded-lg">
            {/* Close button */}
          <span className="absolute top-0 right-0 p-4">
            <button onClick={onClose}>&times;</button>
          </span>
          {/* Modal Content */}
          <div className="flex flex-col justify-center p-3 ">
            <h1 className="font-bold mb-3 text-xl">Add an Item</h1>
            <div className="flex space-between ">
                {/* Name and Preice */}
                <div className="flex flex-col mr-3 w-2/3">
                    <label className="text-sm">Item Name</label>
                    <input className="border-2 rounded-lg" type="text" name="name" onChange={handleOnChange}/>
                </div>
                <div className="flex flex-col w-1/3">
                    <label className="text-sm">Item Price</label>
                    <input className="border-2 rounded-lg" type="text"  name="price"onChange={handleOnChange}/>
                </div>
            </div>
            <div className="flex space-between ">
                {/* Name and Preice */}
                <div className="flex flex-col mr-3 w-2/3">
                    <label className="text-sm">Category</label>
                    <input className="border-2 rounded-lg" type="text" name="category" onChange={handleOnChange} />
                </div>
                <div className="flex flex-col w-1/3">
                    <label className="text-sm">Inventory</label>
                    <input className="border-2 rounded-lg" type="text" name="inventory"onChange={handleOnChange}/>
                </div>
            </div>

            <label>Description:</label>
            <textarea rows="4" className="border-2 rounded-lg" type="text" name="description" onChange={handleOnChange}>
            </textarea>

            <div className="flex justify-end">

            <button className="bg-slate-300 mr-3 justify-self-start hover:bg-slate-500 text-white rounded-lg p-2 my-2 w-1/3"
            onClick={onClose}>
                Cancel
            </button>
            <button className="bg-blue-300 justify-self-start hover:bg-blue-500 text-white rounded-lg p-2 my-2 w-1/3"
            onClick={onClose}>
                Submit
            </button>


            </div>



            

          </div>

          {/* <h1 className="text-lg font-bold">Modal Title</h1>
          <p className="py-4">This is a modal example using Tailwind CSS and Next.js.</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={onClose}
          >
            Close Modal
          </button> */}
        </div>
      </div>
    );
  };

export default AddItemModal;