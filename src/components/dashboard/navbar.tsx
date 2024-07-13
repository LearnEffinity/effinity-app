// @/components/Navbar.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { useUser } from '@/utils/getUser';

const Navbar: React.FC = () => {
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex items-center justify-between p-4 ">
     <div className="flex items-center w-4/5 bg-gray-100 rounded-md px-4 py-4">
        <Image
          src="/icons/search.svg"
          alt="Search Icon"
          width={24}
          height={24}
          className="mr-2"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for financial topics that interest you"
          className="flex-grow bg-transparent outline-none ml-2"
        />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 mr-10">
          <Image
            src="/icons/heart.svg"
            alt="Likes"
            width={24}
            height={24}
          />
          {/* TODO: Change w data */} 
          {/* <span>{user ? user.user_metadata.likes : 'Loading...'}</span> */}
          <span>{user? 2 : ''}</span>
        </div>
        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-2 px-4">
          <div className="rounded-full bg-gray-300 w-10 h-10 flex items-center justify-center">
            <Image
              src="/gaming/COD.png" // TODO: add user profile picture
              alt="Profile Picture"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold">
              {user ? user.user_metadata.name || user.user_metadata.first_name : 'Loading...'}
            </span>
            <span className="text-sm text-gray-500">
              {/*TODO:  Level {user ? user.user_metadata.level : 'Loading...'} */}
              Level 0     
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
