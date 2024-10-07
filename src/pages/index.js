import React from 'react';
import Navbar from './components/navbar';
import Link from 'next/link'; // Import Link for navigation

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Selamat Datang di Halaman Utama
        </h1>

        {/* Tombol menuju halaman Kategori */}
        <Link href="/Kategori">
          <button className="bg-blue-500 text-white font-montserrat px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition duration-300">
            Mulai Quiz
          </button>
        </Link>
      </div>
    </div>
  );
}