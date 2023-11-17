import React from 'react';

const Profile = () => {
    return (
        <div className="flex tracking-wide justify-center items-center h-screen">

            <div className="border border-gray-300 shadow-lg rounded-lg p-6 max-w-sm w-full text-center">
                <div className="mb-4">
                <h1 className="text-5xl mb-5 uppercase">Profile</h1>
                    <div className="font-bold text-xl mb-2">username</div>
                    <p className="text-gray-700 text-base">Password: ********</p>
                </div>
                <button className="bg-transparent hover:bg-red-500  font-bold py-2 px-4 rounded-full border uppercase">
                    Log out
                </button>
            </div>
        </div>
    );
}

export default Profile;
