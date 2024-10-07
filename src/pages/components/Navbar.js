import React, { useEffect, useState } from 'react';
import { IoMenu } from "react-icons/io5";

const Navbar = ({ toggleSidebar }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulasi fetch data user dari API
    setUser({
      name: 'John Doe',
      photo: '/path-to-user-photo.jpg', // Path foto user
    });
  }, []);

  return (
    <nav className="w-full bg-gradient-to-r from-[#00ceb7] to-[#30b7bb] text-white p-3 flex justify-between items-center shadow-md fixed top-0 left-0 z-50" >
      {/* Judul Kuesioner */}
      <button
        onClick={toggleSidebar}
        className="md:hidden bg-[#33A6A6] text-white montserrat text left px-4 py-2 rounded-md">
        <IoMenu />
      </button>
      <div className="text-2xl ml-6 text-[#f2f2f2] font-bold">
        Kuesioner
      </div>

      {/* Tombol untuk membuka sidebar di mobile */}

      {/* User Info */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-sm">{user.name}</span>
            <img
              src={user.photo}
              alt="User Profile"
              className="w-10 h-10 rounded-full border border-white"
            />
          </>
        ) : (
          <span className="text-sm">Loading...</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
