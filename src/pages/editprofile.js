import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { FiEdit, FiArrowLeft } from 'react-icons/fi'; // Import icons

const EditProfilePage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user profile untuk mendapatkan data profil
    const fetchUserProfile = async () => {
      const token = Cookies.get('token');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setName(data.name);
          if (data.photo) {
            setPreviewPhoto(data.photo); // Gunakan URL foto dari API
          } else {
            setPreviewPhoto('/default-profile.png'); // Jika tidak ada foto, gunakan foto default
          }
        } else {
          setError(data.message || 'Failed to fetch user profile.');
        }
      } catch (err) {
        setError('An error occurred. Please try again later.');
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setPreviewPhoto(URL.createObjectURL(file));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    if (profilePhoto) {
      formData.append('photo', profilePhoto);
    }

    try {
      const token = Cookies.get('token');
      const response = await fetch('http://127.0.0.1:8000/api/user/edit-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('name', data.name);
        setLoading(false);
        router.push('/'); // Redirect ke halaman profile
      } else {
        setError(data.message || 'Failed to update profile.');
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Bagian header dengan logo Pinterest dan tombol back */}
      <div className="flex justify-between items-center w-full max-w-2xl px-6 py-4">
        <div className="flex items-center space-x-2">
          {/* Logo Pinterest */}
          <Image src="/pinterest.jpeg" alt="Pinterest Logo" width={40} height={40} />
          <h1 className="text-xl font-bold text-black"></h1>
        </div>
        {/* Tombol Back */}
        <button onClick={() => router.back()} className="text-black flex items-center space-x-2">
          <FiArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-96 relative">
        {/* Bagian gambar profile */}
        <div className="relative flex justify-center mb-6">
          <img
            src={previewPhoto || '/default-profile.png'}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover"
          />
          {/* Tombol Edit (ikon pensil) di kanan atas gambar profil */}
          <label htmlFor="profilePhoto" className="absolute top-0 right-0 bg-gray-200 p-1 rounded-full cursor-pointer">
            <FiEdit size={20} />
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              onChange={handleProfilePhotoChange}
              className="hidden"
            />
          </label>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-black">Edit Profile</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSaveProfile}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Enter your name"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
