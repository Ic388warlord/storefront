'use client'
import { useAuth } from '@/app/utils/auth';
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';


import { React, useState } from 'react';

const Profile = () => {
    const router = useRouter()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        console.log(username, password)
        event.preventDefault();
        login(username, password)

    };



    const login = async (username, password) => {
        const payload = {
            "email": username,
            "password": password
        }
        const response = await fetch('https://cwkc8gb6n1.execute-api.us-west-2.amazonaws.com/stage/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        const data = await response.json();
        
        if (response.ok) {
            document.cookie = 'token=' + data.token
            localStorage.setItem('username', username)
            router.push('/profile')

        } else {
            alert("login Failed!")
        }
    }

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
                            className="w-full px-3 py-2 mb-3 text-gray-700 border rounded"
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
                </form>
            </div>
        </div>
    );
}

export default Profile;
