// Importing necessary modules
'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import API from '../utils/api';
import Cookies from 'js-cookie';


const Profile = () => {
    const router = useRouter();
    const [logOut, setLogOut] = useState(false);
    const [email, setEmail] = useState(null);


    useEffect(() => {
        const jwt = API.getToken();
        if (!jwt) {
            router.replace('profile/login');
        } else {
            setEmail(Cookies.get('email'));
        }
    }, []);

    // Logout function
    const handleLogout = async () => {
        // Handle response
        setLogOut(true);
        const data = await API.logOut();
        if (data.statusCode === 200) {
            API.clearCookies();
            setLogOut(false);
            router.replace('/profile/login');
        }
    }

    // JSX for the profile component
    return (
        <div className="flex tracking-wide justify-center items-center h-screen">
            <div className="border border-gray-300 shadow-lg rounded-lg p-6 max-w-sm w-full text-center">
                <div className="mb-4">
                    <h1 className="text-5xl mb-5 uppercase">Profile</h1>
                        <div>
                            <div className="font-bold text-xl mb-2">{email}</div>
                            <button className="bg-transparent hover:bg-red-500 font-bold py-2 px-4 rounded-full border uppercase">
                                View Your Purchase History
                            </button>
                        </div>
                    {logOut && <p className="text-red-500">Logging out...</p>}
                </div>
                <button className="bg-transparent hover:bg-red-500 font-bold py-2 px-4 rounded-full border uppercase"
                    onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </div>
    );
}

export default Profile;
