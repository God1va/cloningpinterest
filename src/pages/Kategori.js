import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from './components/navbar';

export default function Kategori() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://10.10.10.75:8000/api/quizz');
        const result = await response.json();
        console.log('API response:', result);

        // Extract categories from the 'data' key
        if (Array.isArray(result.data)) {
          setCategories(result.data);
        } else {
          console.error('Unexpected data format:', result);
          setCategories([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Pilih Kategori Soal</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link key={category.id} href={`/kuesioner/${category.id}`}>
                  <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition duration-300">
                    {category.title_quiz}
                  </button>
                </Link>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
