import Sidebar from '../components/sidebar';
import SoalPage from '../components/soal';
import Navbar from '../components/navbar';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Kuesioner() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0); 
  const router = useRouter();
  const { id, page } = router.query; // 'id' is quizz_id, 'page' is the current page number
  
  const currentPage = page ? parseInt(page) : 1; // Default to page 1 if 'page' is not in the URL

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchTotalQuestions = async () => {
      if (id) {
        try {
          const response = await fetch(`http://10.10.10.75:8000/api/quizz/${id}/allquestions`);
          const data = await response.json();
          setTotalQuestions(data.data.length); // Set total questions
        } catch (error) {
          console.error('Error fetching total questions:', error);
        }
      }
    };

    fetchTotalQuestions();
  }, [id]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Sidebar: Show/hide based on screen size and toggle */}
        <div className={`col-span-1 ${isSidebarOpen ? '' : 'hidden md:block'}`}>
          <Sidebar 
            isOpen={isSidebarOpen} 
            currentPage={currentPage}  // Pass currentPage from query
            totalQuestions={totalQuestions} 
            quizz_id={id} 
          />
        </div>

        {/* Main Content */}
        <div className="col-span-4 p-6">
          <SoalPage 
            quizz_id={id} 
            currentPage={currentPage}  // Pass currentPage from query
          />
        </div>
      </div>
    </div>
  );
}
