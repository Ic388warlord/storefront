// Importing necessary modules
'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import React from 'react';
import API from '../utils/api';
import Cookies from 'js-cookie';
import Link from 'next/link';


const Profile = () => {
    const router = useRouter();
    const [logOut, setLogOut] = useState(false);
    const [email, setEmail] = useState(null);
    const [admin, isAdmin] = useState(true); // Chagne for later


    useEffect(() => {

        const whoAmI = async () => {
          // const jwt = API.getToken();
          // if (!jwt) {
          //   router.replace('profile/login');
          // } else {
          //   setEmail(Cookies.get('email'));
          //   // isAdmin(Cookies.get('admin'));
          // }

          try {
            const data = await API.getMe();
            isAdmin(data.role === "ADMIN");
            setEmail(data.email);
          } catch (error) {
            console.error(error);
            router.replace('profile/login');
          }
        }

        whoAmI();

    }, []);

    // Logout function
    const handleLogout = async () => {
        // Handle response
        setLogOut(true);
        try {
            setLogOut(false);
            const data = await API.logOut();
            router.replace('/profile/login');
        } catch (error) {
            console.error(error);
            router.replace('/profile/login');
        }
        API.clearCookies();

    }

    // JSX for the profile component
    return (
        <div className="flex tracking-wide justify-center items-center h-screen">
            <div className="border border-gray-300 shadow-lg rounded-lg p-6 max-w-sm w-full text-center">
                <div className="mb-4">
                    <h1 className="text-5xl mb-5 uppercase">Profile</h1>
                        <div>
                            <div className="font-bold text-xl mb-2">{email}</div>
                            {
                        admin && (
                            <div className='m-4'>
                                <Link href={'/manageItems'}className="bg-transparent hover:bg-blue-500 font-bold m-3 py-2 px-4 rounded-full border uppercase">
                                    Manage Items
                                </Link>
                            </div>
                        )
                    }
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
