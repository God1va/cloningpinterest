import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';


const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState(null); // Use userId instead of user object
  const [errorMessages, setErrorMessages] = useState(null); // For validation errors
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Fetch user_id from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id"); // Directly get user_id
    if (storedUserId) {
      setUserId(storedUserId); // Store user_id in state
    }const checkLoginStatus = () => {
      const token = Cookies.get('token'); // Mengambil token dari Cookies
      if (token) {
        setIsLoggedIn(true);
      } else {
        router.push('/login'); // Redirect ke login.js jika tidak ada token
      }
    };

    checkLoginStatus();
  }, [router]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  

  // Submit the form
  const addPost = async (e) => {
    e.preventDefault();

    // Validate user_id before proceeding
    if (!userId) {
      setErrorMessages({ user_id: "User ID is required" });
      return;
    }

    // Create a new FormData instance to handle the file and other form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("user_id", userId); // Append user_id
    if (file) {
      formData.append("image", file);
    }

    try {
      const token = Cookies.get('token');
      const response = await fetch("http://127.0.0.1:8000/api/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // No need to set Content-Type when using FormData
        },
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Post created:", result.data);
        // Reset form or redirect user after successful post creation
        setTitle("");
        setFile(null);
        setErrorMessages(null); // Clear error messages
      } else if (response.status === 422) {
        const errorData = await response.json();
        setErrorMessages(errorData.message); // Handle validation errors
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:pt-28 pb-20">
      <form
        className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
        onSubmit={addPost}
        encType="multipart/form-data" // Set encoding type for file uploads
      >
        <div className="flex flex-wrap md:flex-nowrap">
          <div className="md:w-2/3 border-r border-gray-200 p-4 w-full">
            <label className="h-96 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer">
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Uploaded Preview"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="mx-auto text-gray-400 mb-4"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v1.125A2.625 2.625 0 005.625 20.25h12.75A2.625 2.625 0 0021 17.625V16.5M7.5 10.5L12 6m0 0l4.5 4.5M12 6v10.5"
                    />
                  </svg>
                  <p className="text-gray-600">Click to upload</p>
                  <p className="text-sm text-gray-400">
                    Recommendation: Use high-quality .jpg files less than 5MB
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="md:w-1/2 p-6 w-full">
            <div className="mb-6">
              <label htmlFor="title" className="font-light mb-1">
                Title Post
              </label>
              <input
                type="text"
                placeholder="Add your title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2 py-3 focus:ring-4 rounded-2xl border border-gray-500 outline-none text-black"
                required // Marking as required for form validation
              />
            </div>
          </div>
        </div>

        {errorMessages && (
          <div className="p-4 text-red-600">
            <ul>
              {Object.values(errorMessages).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white border-t border-gray-200 p-4 flex justify-end items-center">
          <div>
            <a
              href="/"
              className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-full mr-2 hover:bg-gray-300"
            >
              Cancel
            </a>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600"
              type="submit"
              
              >
              <a href="/">Publish</a>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
