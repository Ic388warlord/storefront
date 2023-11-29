'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../utils/api.js'; 

const Contacts = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    senderEmail: '',
    subject: '',
    message: '',
  });
  const router = useRouter()

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const sendInformation = async () => {

    const data = await API.contactForm(formData);
    if (data.statusCode === 200) {
      document.getElementById('senderEmail').value = "";
      document.getElementById('subject').value = "";
      document.getElementById('message').value = "";
        /// Putting it in the useAuth Hook but doesn't persist State. FML
        // login(data.token, data.email);
      
      document.getElementById('feedback').innerHTML = data.message
    } else {
      document.getElementById('feedback').innerHTML = data.message
    }

  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your logic for handling form submission here
    // console.log('Form submitted:', formData);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white text-black p-8 max-w-xl w-full rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6">Contact Page</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-large text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="senderEmail"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-lg font-large text-gray-600">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-lg font-large text-gray-600">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="8"  
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
            onClick={sendInformation}
          >
            Submit
          </button>
          <div id="feedback"></div>
        </form>
      </div>
    </div>
  );
};

export default Contacts;
