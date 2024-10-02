import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaUpload, FaEllipsisH } from "react-icons/fa";

const NavbarBottom = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [cardsData, setCardsData] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});
  const router = useRouter();

  const generateRandomNumber = () => Math.floor(Math.random() * 1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data post
        const postResponse = await fetch('http://127.0.0.1:8000/api/post');
        if (!postResponse.ok) {
          throw new Error(`Error fetching posts: ${postResponse.status} ${postResponse.statusText}`);
        }
        const postData = await postResponse.json();

        const updatedCardsData = postData.data.map((card) => ({
          id: card.id,
          title: card.title,
          user: card.user,
          imageSrc: card.image_url || `https://picsum.photos/200/300?random=${generateRandomNumber()}`,
        }));

        setCardsData(updatedCardsData);

        // Fetch user profiles based on user IDs in posts
        const profilesResponse = await fetch('http://127.0.0.1:8000/api/users/profiles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!profilesResponse.ok) {
          throw new Error(`Error fetching profiles: ${profilesResponse.status} ${profilesResponse.statusText}`);
        }

        const profilesData = await profilesResponse.json();

        // Map profiles data with user_id as the key
        const profilesMap = {};
        profilesData.data.forEach((profile) => {
          const photoUrl = profile.photo && profile.photo.startsWith('http')
            ? profile.photo
            : `http://127.0.0.1:8000/storage/${profile.photo}` || `https://picsum.photos/200/300?random=${generateRandomNumber()}`;

          profilesMap[profile.user_id] = photoUrl;
        });

        setUserProfiles(profilesMap); // Save profiles data to state
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = (index) => {
    setTimeout(() => {
      if (hoveredIndex === index) {
        setHoveredIndex(null);
      }
    }, 200);
  };

  const handleClick = (id) => {
    router.push(`/details/${id}`);
  };

  return (
    <div className="container mx-auto px-4 bg-white">
      <div className="masonry">
        {cardsData.map((card, index) => (
          <div
            key={card.id}
            className="masonry-item relative w-full cursor-pointer mb-4"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            onClick={() => handleClick(card.id)}
          >
            <div className="relative overflow-hidden">  
              <Image
                src={card.imageSrc}
                alt={card.title}
                layout="responsive"
                width={230}
                height={300 + index * 20}
                objectFit="cover"
                className={`rounded-lg transition duration-200 ease-in-out ${
                  hoveredIndex === index ? "brightness-50" : ""
                }`}
              />
              {hoveredIndex === index && (
                <>
                  <div className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10">
                    Simpan
                  </div>
                  <div className="absolute bottom-3 right-3 flex space-x-2 z-10">
                    <div className="p-2 bg-gray-800 text-white rounded-full cursor-pointer">
                      <FaUpload />
                    </div>
                    <div className="p-2 bg-gray-800 text-white rounded-full cursor-pointer">
                      <FaEllipsisH />
                    </div>
                  </div>
                </>
              )}
            </div>
            <p className="text-xl text-black font-semibold mb-1">{card.title}</p> {/* Title berada di atas */}
            <div className="mt-2 flex items-center"> {/* Flexbox untuk menjaga profil dan nama sejajar */}
              {/* Show photo profile */}
              {userProfiles[card.user.id] ? (
                <Image
                  src={userProfiles[card.user.id]} // Use the profile photo from state
                  alt="Profile Photo"
                  width={30} // Ubah lebar menjadi 40 atau lebih jika perlu
                  height={30} // Ubah tinggi menjadi 40 atau lebih jika perlu
                  className="rounded-full object-cover mr-2" // Pastikan object-cover untuk menjaga proporsi
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
              )}
              <p className="text-sm text-black font-medium">{card.user.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavbarBottom;
