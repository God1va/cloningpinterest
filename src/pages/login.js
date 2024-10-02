import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Cookies from 'js-cookie'; // Import js-cookie

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State untuk loading

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);   // Set loading true sebelum mulai request
    setError('');       // Reset error sebelum login

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, // Send email
          password: password, // Send password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful, token:', data.access_token); // Log token untuk memastikan
        Cookies.set('token', data.access_token, { expires: 1 });
        localStorage.setItem('user_id', data.user_id); 
        localStorage.setItem('name', data.name);
        setLoading(false);
        router.push('/'); // Redirect ke halaman utama
      } else {
        setError(data.message || 'Login failed, please check your credentials.');
        setLoading(false);
      }
      
    } catch (err) {
      setLoading(false); // Stop loading
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          <Image
            src="/pinterest.jpeg"
            alt="Pinterest Logo"
            width={100}
            height={100}
            className="cursor-pointer rounded-full hover:bg-gray-200 p-2"
          />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading} // Disable button saat loading
            aria-busy={loading} // For accessibility
          >
            {loading ? 'Logging in...' : 'Login'} {/* Tampilkan status loading */}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <a
              href="/user/register"
              className="text-blue-600 hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
