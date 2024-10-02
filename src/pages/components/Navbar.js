import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaQuestion } from "react-icons/fa";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State untuk dropdown
  const [userProfile, setUserProfile] = useState(null); // State untuk menyimpan profil user
  const router = useRouter();

  const handleLogout = () => {
    // Hapus token dari localStorage
    localStorage.removeItem('user_id'); // Jika ada user_id di localStorage, juga hapus
    localStorage.removeItem('token');

    // Hapus token dari cookies
    Cookies.remove('token');

    // Muat ulang halaman untuk reset status login
    window.location.reload();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const fakeSuggestions = [
      'Photography',
      'Design',
      'Coding',
      'Art',
      'Travel',
    ].filter((suggestion) => suggestion.toLowerCase().includes(value.toLowerCase()));
    setSuggestions(fakeSuggestions);
  };

  // Fetch user profile dari API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('token'); // Ambil token dari cookies
        const userId = localStorage.getItem('user_id');

        if (!token || !userId) {
          console.error("Token or user_id not available.");
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/user/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData); // Simpan data profil user
        } else {
          const errorData = await response.json();
          console.error('Error fetching user profile:', errorData.message);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <nav className="navbar fixed top-0 left-0 w-full flex justify-between items-center px-6 py-5 bg-white shadow text-black z-50 lg:flex-row md:flex-row">
      <div className='fixed bottom-6 right-6 group rounded-full border p-4 shadow-xl bg-white cursor-pointer z-50'>
        <FaQuestion className='text-black w-6 h-6' />
        <span className='absolute left-1/2 transform -translate-x-1/2 -mt-20 text-xs hidden group-hover:block bg-black border rounded-lg text-gray-100 py-2 px-2.5'>
          Lainnya
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Link href="/">
            <Image
              src="/pinterest.jpeg"
              alt="Pinterest Logo"
              width={40}
              height={40}
              className="cursor-pointer rounded-full hover:bg-gray-200 p-2"
            />
          </Link>
        </div>
        <ul className="flex gap-6">
          <li>
            <Link
              href="/"
              className={`p-3 rounded-full ${router.pathname === '/' ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              Beranda
            </Link>
          </li>
          <li>
            <Link
              href="/jelajahi"
              className={`p-3 rounded-full ${router.pathname === '/jelajahi' ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              Jelajahi
            </Link>
          </li>
          <li>
            <Link
              href="/buat"
              className={`p-3 rounded-full ${router.pathname === '/buat' ? 'bg-black text-white' : 'bg-white text-black'}`}
            >
              Buat
            </Link>
          </li>
        </ul>
      </div>

      {/* Search Box */}
      <div className="relative flex justify-start items-center gap-2 flex-grow mx-4">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Image src="/search.svg" alt="Search Icon" width={24} height={24} />
        </span>
        <input
          type="text"
          placeholder="Cari"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="border rounded-full pl-12 pr-4 py-2 w-full text-black hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
        {isFocused && suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border mt-2 rounded-lg shadow-lg z-50">
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="cursor-pointer relative group hover:bg-gray-200 p-2 rounded-full z-50">
          <Image src="/bel.svg" width={28} height={28} />
          <span className="cursor-pointer absolute left-1/2 transform -translate-x-1/2 mt-2 text-xs hidden group-hover:block bg-black border rounded-lg text-gray-200 py-1 px-2.5">
            Notifikasi
          </span>
        </div>
        <div className="cursor-pointer relative group hover:bg-gray-200 p-2 rounded-full z-50">
          <Image src="/pesan.svg" width={28} height={28} />
          <span className="cursor-pointer absolute left-1/2 transform -translate-x-1/2 mt-2 text-xs hidden group-hover:block bg-black border rounded-lg text-gray-200 py-1 px-2.5">
            Pesan
          </span>
        </div>

        {/* Ubah menjadi photo profile */}
<div className="cursor-pointer relative group hover:bg-gray-200 p-2 rounded-full z-50">
  <button onClick={toggleDropdown} className=" border rounded-full">
    {userProfile && userProfile.photo ? (
      <Image
        src={userProfile.photo}
        alt="Profile"
        width={40}
        height={40}
        className="rounded-full object-cover w-10 h-10" // tambahkan object-cover dan ukuran sama untuk lebar dan tinggi
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gray-300" />
    )}
  </button>
  {isDropdownOpen && (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
      <ul className="py-2">
        <li>
          <button
            onClick={() => router.push('/editprofile')}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
          >
            Edit Profile
          </button>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )}
</div>


        <div className="cursor-pointer relative group hover:bg-gray-200 p-2 rounded-full z-50">
          <Image src="/arrow.svg" width={28} height={28} />
          <span className="cursor-pointer absolute left-1/2 transform -translate-x-1/2 mt-2 text-xs hidden group-hover:block bg-black border rounded-lg text-gray-200 py-1 px-2.5">
            Menu
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
