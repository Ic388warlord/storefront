'use client'
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';
import API from '@/app/utils/api';
import { useAuth } from '@/app/utils/auth';
import { React, useContext, useState } from 'react';
import Link from 'next/link';

const SignUp = () => {
    const router = useRouter()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passcode, setPasscode] = useState('');
    const [confirm, setConfirm] = useState(false);
    const [message, setMessage] = useState(null);



    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(username, password)
        // Token gets admitted in here
        const data = await API.signUp(username, password)
        if (data.statusCode === 200) {
            setConfirm(true)
            setMessage(data.message)
            console.log(confirm)
        } else {
            setMessage(data.message)
        }
    };


    const handleConfirm = async () => {
        const data = await API.confirmSignUp(username, passcode)
        if (data.statusCode === 200) {
            setMessage(data.message)
            router.push('/profile')
        } else {
            setMessage(data.message)
        }

    }


    return (
        <div className="flex justify-center items-center h-screen">
            <div className="border border-gray-300 shadow-lg rounded-lg p-6 max-w-sm w-full text-center">
                 <form onSubmit={handleSubmit}>
                 <h1 className="text-5xl mb-5 uppercase">Sign Up</h1>
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

                 <div className="flex flex-col">
                     <button type="submit" className="bg-transparent hover:bg-red-500 text-red-700 hover:text-white font-bold py-2 px-4 rounded-full border border-red-500 uppercase">
                         Sign Up
                     </button>
                     <Link href="/profile/login" className="bg-transparent text-sm hover:text-blue-500 text-blue-300 font-bold py-2 px-4 rounded-full uppercase">
                         Have an account? Login
                     </Link>

                 </div>
                 {message && <p className="text-slate-500">{message}</p>}
                 <div>
                    {confirm && 
                    <>
                    <label className="text-md mt-2">Passcode</label>
                    <input
                        type="text"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="w-full px-3 py-2 mb-3 text-gray-700 border rounded">
                    </input>
                    <button className="border rounded-lg bg-blue-400 p-3"onClick={handleConfirm}> Confirm </button>
                    </>
                    }
                
            </div>
             </form>
            


               
            </div>
        </div>
    );
}

export default SignUp;
