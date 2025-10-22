import React from 'react';
import { useAppContext } from '../context/AppContext'; 
import { assets } from '../assets/assets';

const Profile = () => {
  const { user } = useAppContext();

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-xl">No user logged in</p>
      </div>
    );
  }

  return (
    <div className="text-black m-4 md:m-16">
     <p className='text-3xl font-semibold flex justify-center '>
           Profile Page
     </p>
        
      <div className="mt-8 max-w-md mx-auto p-6">

        {/* Avatar (optional) */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
           <img src={assets.profile_icon} alt="" />
          </div>
        </div>

        <div className="border border-gray-300 p-4 rounded-md space-y-8">
          <div>
            <p className="text-gray-600 font-semibold text-xl">Name</p>
            <p className="text-black text-xl">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-600 font-semibold text-xl">Email</p>
            <p className="text-black text-xl">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
