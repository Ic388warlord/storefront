'use client'
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';
import API from '@/app/utils/api';
import { useAuth } from '@/app/utils/auth';
import { React, useContext, useState } from 'react';

const Profile = () => {
    const router = useRouter()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const { auth, email, login, logout } = useAuth();


    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(username, password)
        // Token gets admitted in here
        const data = await API.login(username, password)
        if (data.statusCode === 200) {
            /// Putting it in the useAuth Hook but doesn't persist State. FML
            // login(data.token, data.email);
            router.push('/profile')
        } else {
            setMessage(data.message)
        }
    };


    return (
        <div className="flex justify-center items-center h-screen">
            <div className="border border-gray-300 shadow-lg rounded-lg p-6 max-w-sm w-full text-center">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-5xl mb-5 uppercase">Login</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full px-3 py-2 mb-3  text-gray-700 border rounded"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-3 py-2 mb-3 text-gray-700 border rounded"
                        />
                    </div>
                    <button type="submit" className="bg-transparent hover:bg-red-500 text-red-700 hover:text-white font-bold py-2 px-4 rounded-full border border-red-500 uppercase">
                        Login
                    </button>
                    {message && <p className="text-slate-500">{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default Profile;
