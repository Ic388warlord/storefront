'use client';
import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { FaArrowRight, FaCommentDots, FaSpeakap } from 'react-icons/fa';
import API from '../utils/api';

const ChatBot = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);

    const chatRef = useRef();

    const handleSendButton = async () => {
        setText('');
        setMessages(messages => [...messages, { text: text, from: 'user' }]);
        const data = await API.chatBox(text);
        setMessages(messages => [...messages, { text: data, from: 'bot' }]);
    }

    useEffect(() => {
        console.log(open);
        if (!chatRef) return;
        if (open && chatRef.current) {
            const lastMessage = chatRef.current.lastChild;
            if (lastMessage) {
                lastMessage.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [open, messages]);

  return (
    <div className="fixed bottom-0 left-0 w-80 z-50">
        {/* When open */}
        { open ? (
            <div className='flex flex-col h-96'>

            <button
            onClick={() => setOpen(false)}
            className="bg-slate-300 text-white w-full p-2"
            >
            Chat
            </button>
            {/* Chat Box */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 bg-white" style={{ height: 'calc(100vh - [height_of_input_section])' }}>
    {       messages.map((message, index) => (
                    <div key={index} className={`flex  items-center ${message.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`bg-gray-300 p-3 m-2 rounded-lg ${message.from === 'bot' ? 'ml-0' : 'ml-auto bg-blue-300'}`}>
                            <p className="text-black">{message.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Box */}
            <section className='flex bg-white border-t-2'>            
            <input
                  type="text"
                  value={text}
                  placeholder="Type your message..."
                  className="w-full p-2 rounded"
                  onChange={(e) => setText(e.target.value)}
                    onKeyDown={
                        (e) => {


                            if (e.key === 'Enter') {
                                setText('');
                                handleSendButton();
                            }

                        }
                    
                    }
            />
            <button onClick={handleSendButton}>
                <FaArrowRight size={24} color='gray' />
            </button>

            </section>

            </div>

        ) : 
        // When Closed
        (
        
            <div className='relative bottom-2 left-5'>
                        <button
        onClick={() => setOpen(true)}
        className=""
        >
            <FaCommentDots size={30} color='black' />
          </button>
            </div>

        )

        }


    </div>
  )
}

export default ChatBot