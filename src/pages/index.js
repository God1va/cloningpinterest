import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'; // Import js-cookie
import Navbar from './components/Navbar';
import NavbarBottom from './components/NavbarBottom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = Cookies.get('token'); // Mengambil token dari Cookies
      if (token) {
        setIsLoggedIn(true);
      } else {
        router.push('/login'); // Redirect ke login.js jika tidak ada token
      }
    };

    checkLoginStatus();
  }, [router]);

  return (
    <div className="bg-white">
      {isLoggedIn && ( // Render navbar hanya jika user sudah login
        <>
          <Navbar />
          <div className="pt-24 bg-white">
            <NavbarBottom />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
