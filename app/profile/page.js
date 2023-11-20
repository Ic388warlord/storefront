// Importing necessary modules
'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import { useAuth } from '../utils/auth';
import Cookies from 'universal-cookie';

const Profile = () => {
    // Initialize router, auth context, and cookies
    const router = useRouter();
    const { auth, setAuth } = useAuth();
    const cookies = new Cookies();
    const email = localStorage.getItem('username');

    // Check if running on the client side
    if (typeof window !== 'undefined') {
        // Use localStorage and cookies here
        if (cookies.get('token') === 'undefined' || localStorage.getItem('username') === null) {
            console.log(cookies.get('token'));
            router.push('/profile/login');
        }
    }


    // Logout function
    const logout = async () => {
        // Check cookies and remove items from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('username');

            if (cookies.get('token') === 'undefined') {
                localStorage.removeItem('username');
                return;
            }
        }

        // Send request to sign out
        const payload = {
            "Authorization": `Bearer ${auth}`
        };
        const response = await fetch("https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/auth/signout", {
            headers: payload
        });

        // Handle response
        const data = await response;
        if (response.ok) {
            cookies.remove('token');
            localStorage.removeItem('username');
            router.push('/profile/login');
        } else {
            alert("Log out failed?");
        }
    }

    // JSX for the profile component
    return (
        <div className="flex tracking-wide justify-center items-center h-screen">
            <div className="border border-gray-300 shadow-lg rounded-lg p-6 max-w-sm w-full text-center">
                <div className="mb-4">
                    <h1 className="text-5xl mb-5 uppercase">Profile</h1>
                    {email ? (
                        <div>
                            <div className="font-bold text-xl mb-2">{localStorage.getItem("username")}</div>
                            <button className="bg-transparent hover:bg-red-500 font-bold py-2 px-4 rounded-full border uppercase">
                                View Your Purchase History
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p>You are now logged in!</p>
                        </div>
                    )}
                </div>
                <button className="bg-transparent hover:bg-red-500 font-bold py-2 px-4 rounded-full border uppercase"
                    onClick={logout}>
                    Log out
                </button>
            </div>
        </div>
    );
}

export default Profile;
