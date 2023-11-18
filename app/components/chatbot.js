'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import { FaArrowRight, FaCommentDots, FaSpeakap } from 'react-icons/fa';

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);


  return (
    <div className="fixed bottom-0 left-0 w-80 z-50">
        { open ? (
            <div className='flex flex-col'>

            <button
            onClick={() => setOpen(false)}
            className="bg-slate-300 text-white w-full p-2"
            >
            Chat
            </button>
            {/* Chat Box */}
            <div className="flex-1 overflow-y-scroll p-10 bg-white">
                {messages.map((message, index) => (
                    <div key={index} className="flex items-center">
                        <div className="bg-gray-300 p-3 rounded-lg ml-auto max-w-xs">
                            <p className="text-black">{message}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Input Box */}
            <section className='flex bg-white border-t-2'>            
            <input
                  type="text"
                  placeholder="Type your message..."
                  className="w-full p-2 rounded"
                  onChange={(e) => setText(e.target.value)}
            />
            <button>
                <FaArrowRight size={24} color='gray' />
            </button>

            </section>

            </div>

        ) : 
        (
        
            <div className='relative bottom-2 left-5'>
                        <button
        onClick={() => setOpen(true)}
        className=""
        >
            <FaCommentDots size={30} color='white' />
          </button>
            </div>

        )

        }


    </div>
  )
}

export default ChatBot