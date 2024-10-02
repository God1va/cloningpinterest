import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaHeart, FaUpload, FaEllipsisH, FaRegPaperPlane, FaSmile, FaArrowLeft } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { MdArrowOutward, MdImageSearch } from 'react-icons/md';
import Navbar from '../components/Navbar';
import NavbarBottom from '../components/NavbarBottom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 
import StatusModal from '../components/StatusModal'; // Import modal component

const DetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [comment, setComment] = useState('');
  const [hovered, setHovered] = useState(false);
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState('Unknown');
  const [imageUrl, setImageUrl] = useState('/default-image.jpg');
  const [comments, setComments] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null); // For showing status message
  const [showStatusModal, setShowStatusModal] = useState(false); // Modal visibility
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchCardData();
      fetchComments();
      fetchInitialData();
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          setUserId(parsedUser.id);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, [id]);

  const fetchInitialData = async () => {
    try {
      const token = Cookies.get('token');
      const userId = localStorage.getItem('user_id');

      if (!token || !userId) {
        console.error("Token or user_id not available.");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/post/${id}/like?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const likeData = await response.json();
        setLiked(likeData.liked || false);
        setLikeCount(likeData.like_count || 0);
      } else {
        const errorData = await response.json();
        console.error('Error fetching like data:', errorData.message);
      }
    } catch (error) {
      console.error('Error fetching initial like data:', error);
    }
  };

  const fetchCardData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/post/${id}`);
      const result = await response.json();
      setImageUrl(result.data.image_url || '/default-image.jpg');
      setTitle(result.data.title || 'No Title');
      setUser(result.data.user?.name || 'Unknown');
      setLikeCount(result.data.like_count || 0);
    } catch (error) {
      console.error("Error fetching card data:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://127.0.0.1:8000/api/comment/post/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setComments(result.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSendComment = async () => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://127.0.0.1:8000/api/comment/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: id,
          comment: comment,
        }),
        credentials: "include",
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        if (result.success) {
          setComment('');
          fetchComments();
          setStatusMessage('Comment submitted for approval.');
          setShowStatusModal(true); // Show pop-up
        } else {
          setStatusMessage('Komen sudah ditambahkan menunggu persetujuan');
          setShowStatusModal(true); // Show pop-up
        }
      } else {
        setStatusMessage('Received an unexpected response.');
        setShowStatusModal(true); // Show pop-up
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setStatusMessage('An error occurred.');
      setShowStatusModal(true); // Show pop-up
    }

    setTimeout(() => {
      setShowStatusModal(false); // Hide pop-up after 3 seconds
    }, 10000);
  };

  const handleLikeToggle = async () => {
    try {
      const token = Cookies.get('token');
      const userId = localStorage.getItem('user_id');
      
      if (!token || !userId) {
        console.error("Token atau user_id tidak tersedia.");
        setStatusMessage("Token atau user_id tidak tersedia.");
        setShowStatusModal(true); // Show pop-up
        return;
      }
  
      const response = await fetch(`http://127.0.0.1:8000/api/post/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
        }),
      });
  
      if (response.ok) {
        const likeData = await response.json();
  
        setLiked(!liked);
        setStatusMessage(liked ? 'Post unliked' : 'Post liked');
        setShowStatusModal(true); // Show pop-up
        
        setLikeCount(likeData.like_count);
  
      } else {
        const errorData = await response.json();
        setStatusMessage(errorData.message);
        setShowStatusModal(true); // Show pop-up
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setStatusMessage('An error occurred while toggling like.');
      setShowStatusModal(true); // Show pop-up
    }
  
    setTimeout(() => {
      setShowStatusModal(false); // Hide pop-up after 3 seconds
    }, 10000);
  };

  const handleViewImage = () => {
    window.open(imageUrl, '_blank');
  };

  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <button onClick={() => router.push('/')} className="fixed top-32 left-6 p-4 hover:bg-gray-200 rounded-full shadow-">
        <FaArrowLeft className="text-gray-800 h-5 w-5" />
      </button>

      <div className="flex flex-col flex-grow pt-16 bg-white text-black mt-12 px-4">
        <div className="relative max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl flex flex-col lg:flex-row overflow-hidden">
          {imageUrl && (
            <div className="relative w-full lg:w-1/2" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
              <Image src={imageUrl} alt={`Detail Image ${id}`} layout="responsive" width={600} height={400} objectFit="cover" className="h-full w-full" />
              <div className='absolute right-4 bottom-4 bg-white p-3 rounded-full'>
                <MdImageSearch className='text-gray-900 h-6 w-6' />
              </div>
              {hovered && (
                <div className="absolute bottom-4 left-4 bg-white p-2 rounded-full shadow-full flex items-center space-x-2">
                  <MdArrowOutward className="text-gray-800 h-5 w-5" />
                  <button onClick={handleViewImage} className="bg-white text-gray-800">Lihat Gambar</button>
                </div>
              )}
            </div>
          )}
          <div className="relative w-full lg:w-1/2 p-6 flex flex-col justify-between">
            <div className="flex flex-col space-y-4 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <button className="p-2 bg-gray-200 rounded-full flex items-center space-x-2" onClick={handleLikeToggle}>
                    <FaHeart color={liked ? 'red' : 'black'} />
                    <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
                  </button>
                  <button className="p-2 bg-gray-200 rounded-full"><FaUpload /></button>
                  <button className="p-2 bg-gray-200 rounded-full"><FaEllipsisH /></button>
                </div>
                <div className="flex space-x-4 items-center">
                  <button className="p-3.5 bg-red-600 text-white rounded-full">Simpan</button>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="font-bold text-lg">{title}</p>
                <div className="flex items-center text-black font-medium">
                  <CgProfile className="w-6 h-6 mr-2" />
                  <span>{user}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-grow overflow-y-auto">
              <div className="p-4 flex flex-col flex-grow space-y-2">
                <p className="font-semibold">Comments:</p>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="my-2">
                      <p className="text-gray-800 font-bold">{comment.user?.name || 'Anonymous'}:</p>
                      <p className="text-gray-800">{comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No comments yet.</p>
                )}
              </div>
              <div className="flex items-center space-x-2 p-4 bg-gray-100 border-t border-gray-300">
                <input
                  type="text"
                  value={comment}
                  onChange={handleCommentChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendComment();
                    }
                  }}
                  placeholder="Add a comment..."
                  className="flex-grow p-2 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={handleSendComment}
                  className="p-2 bg-blue-600 text-white rounded-lg"
                  disabled={!comment}
                >
                  <FaRegPaperPlane />
                </button>
                <button className="p-2 bg-yellow-200 rounded-full">
                  <FaSmile />
                </button>
              </div>
            </div>
          </div>
        </div>

        {showStatusModal && (
          <StatusModal
            message={statusMessage}
            onClose={() => setShowStatusModal(false)} // Close the modal manually
          />
        )}

        <div className="py-4 text-center text-sm text-gray-600">
          Jelajahi lainnya
        </div>
      </div>
      <NavbarBottom />
    </div>
  );
};

export default DetailPage;
